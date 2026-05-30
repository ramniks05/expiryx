import type { ApiErrorBody } from '../types'
import type {
  AdminDocumentStats,
  AdminGrowthStats,
  AdminOverviewStats,
  AdminUserDetail,
  AdminUsersPage,
  AdminUsersQuery,
} from '../types/admin'
import { forceAdminLogout } from '../lib/adminSession'
import { getAdminToken } from '../store/adminAuthStore'
import { ApiError } from './client'

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://doctracker-backend.onrender.com'

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

export async function adminFetch<T>(
  path: string,
  options: RequestInit & { json?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { json, auth = true, ...init } = options
  const headers = new Headers(init.headers)
  headers.set('Accept', 'application/json')

  if (json !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (auth) {
    const token = getAdminToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    body: json !== undefined ? JSON.stringify(json) : init.body,
  })

  if (res.status === 401 || res.status === 403) {
    if (auth) forceAdminLogout()
    const body = await parseJson<ApiErrorBody>(res)
    throw new ApiError(res.status, errorMessage(body, 'Admin authentication failed'), body)
  }

  if (!res.ok) {
    const body = await parseJson<ApiErrorBody>(res)
    throw new ApiError(res.status, errorMessage(body, res.statusText), body)
  }

  if (res.status === 204) return undefined as T
  return (await parseJson<T>(res)) as T
}

export async function adminLogin(username: string, password: string) {
  return adminFetch<{ username: string; accessToken: string; role: 'ADMIN' }>('/api/admin/auth/login', {
    method: 'POST',
    auth: false,
    json: { username, password },
  })
}

export async function getAdminOverview() {
  return adminFetch<AdminOverviewStats>('/api/admin/stats/overview')
}

export async function getAdminDocumentStats() {
  return adminFetch<AdminDocumentStats>('/api/admin/stats/documents')
}

export async function getAdminGrowthStats(days = 30) {
  const q = new URLSearchParams({ days: String(days) })
  return adminFetch<AdminGrowthStats>(`/api/admin/stats/growth?${q}`)
}

export async function listAdminUsers(params: AdminUsersQuery = {}) {
  const q = new URLSearchParams({
    page: String(params.page ?? 0),
    size: String(params.size ?? 20),
    sort: params.sort ?? 'createdAt,desc',
  })
  if (params.q?.trim()) q.set('q', params.q.trim())
  return adminFetch<AdminUsersPage>(`/api/admin/users?${q}`)
}

export async function getAdminUser(id: number) {
  return adminFetch<AdminUserDetail>(`/api/admin/users/${id}`)
}
