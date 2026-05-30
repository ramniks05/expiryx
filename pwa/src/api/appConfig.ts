import { apiFetch } from './client'
import type { AppConfig } from '../types'

export async function getAppConfig() {
  const platform = import.meta.env.VITE_APP_PLATFORM ?? 'web'
  const version = import.meta.env.VITE_APP_VERSION ?? '1.0.0'
  const build = import.meta.env.VITE_APP_BUILD ?? '1'
  return apiFetch<AppConfig>(
    `/api/app/config?platform=${platform}&version=${version}&build=${build}`,
  )
}
