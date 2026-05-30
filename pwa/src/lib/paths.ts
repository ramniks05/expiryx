export const APP_BASE = import.meta.env.BASE_URL.replace(/\/$/, '') || ''

export function appPath(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${APP_BASE}${normalized}`
}
