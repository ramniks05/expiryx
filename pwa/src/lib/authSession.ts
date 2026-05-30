import { appPath } from './paths'
import { AUTH_STORAGE_KEY } from './authStorage'
import { queryClient } from './queryClient'
import { isTokenExpired } from './jwt'
import { useAuthStore } from '../store/authStore'

/** Remove persisted auth and in-memory session. */
export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  useAuthStore.getState().clearSession()
  queryClient.clear()
}

/** Full logout — clear session and send user to login. */
export function forceLogout() {
  clearAuthSession()
  window.location.replace(appPath('/login'))
}

export function isAuthError(status: number) {
  return status === 401 || status === 403
}

/** Returns false and clears session when token is missing or expired. */
export function hasValidSession(): boolean {
  const token = useAuthStore.getState().session?.accessToken
  if (!token || isTokenExpired(token)) {
    clearAuthSession()
    return false
  }
  return true
}
