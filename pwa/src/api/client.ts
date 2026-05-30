import type { ApiErrorBody, AppConfig } from '../types'
import { forceLogout, isAuthError } from '../lib/authSession'
import { appPath } from '../lib/paths'
import { getAccessToken } from '../store/authStore'

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://doctracker-backend.onrender.com'

export class ApiError extends Error {
  status: number
  body: ApiErrorBody | AppConfig | null

  constructor(status: number, message: string, body: ApiErrorBody | AppConfig | null = null) {
    super(message)
    this.status = status
    this.body = body
  }
}

function versionHeaders(): Record<string, string> {
  return {
    'X-App-Platform': import.meta.env.VITE_APP_PLATFORM ?? 'web',
    'X-App-Version': import.meta.env.VITE_APP_VERSION ?? '1.0.0',
    'X-App-Build': String(import.meta.env.VITE_APP_BUILD ?? '1'),
    Accept: 'application/json',
  }
}

async function parseJson<T>(res: Response): Promise<T | null> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

function errorMessage(body: ApiErrorBody | null, fallback: string): string {
  return body?.message ?? body?.error ?? fallback
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean; json?: unknown } = {},
): Promise<T> {
  const { auth = false, json, ...init } = options
  const headers = new Headers(init.headers)

  if (json !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (auth) {
    const token = getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
    Object.entries(versionHeaders()).forEach(([k, v]) => headers.set(k, v))
  }

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    body: json !== undefined ? JSON.stringify(json) : init.body,
  })

  if (isAuthError(res.status)) {
    forceLogout()
    throw new ApiError(res.status, 'Session expired')
  }

  if (res.status === 426) {
    const body = await parseJson<AppConfig>(res.clone())
    sessionStorage.setItem('expiryx-force-update', JSON.stringify(body))
    window.location.href = appPath('/force-update')
    throw new ApiError(426, 'Update required', body)
  }

  if (!res.ok) {
    const body = await parseJson<ApiErrorBody>(res)
    throw new ApiError(res.status, errorMessage(body, res.statusText), body)
  }

  if (res.status === 204) return undefined as T
  const data = await parseJson<T>(res)
  return data as T
}

export async function apiMultipart<T>(
  path: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST',
): Promise<T> {
  const token = getAccessToken()
  const headers = new Headers(versionHeaders())
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const res = await fetch(`${BASE}${path}`, { method, headers, body: formData })

  if (isAuthError(res.status)) {
    forceLogout()
    throw new ApiError(res.status, 'Session expired')
  }

  if (res.status === 426) {
    const body = await parseJson<AppConfig>(res.clone())
    sessionStorage.setItem('expiryx-force-update', JSON.stringify(body))
    window.location.href = appPath('/force-update')
    throw new ApiError(426, 'Update required', body)
  }

  if (!res.ok) {
    const body = await parseJson<ApiErrorBody>(res)
    throw new ApiError(res.status, errorMessage(body, res.statusText), body)
  }

  return (await parseJson<T>(res)) as T
}

export { BASE as API_BASE_URL }
