interface JwtPayload {
  exp?: number
  sub?: string
}

function decodePayload(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

/** True when token is missing, malformed, or past expiry (30s skew buffer). */
export function isTokenExpired(token?: string | null): boolean {
  if (!token) return true
  const payload = decodePayload(token)
  if (!payload?.exp) return false
  return payload.exp * 1000 <= Date.now() + 30_000
}

export function getTokenExpiryMs(token: string): number | null {
  const payload = decodePayload(token)
  return payload?.exp ? payload.exp * 1000 : null
}
