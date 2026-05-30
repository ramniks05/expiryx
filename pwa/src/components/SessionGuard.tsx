import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateSession } from '../api/auth'
import { ApiError } from '../api/client'
import { useAuthHydrated } from '../hooks/useAuthHydrated'
import { clearAuthSession, forceLogout, isAuthError } from '../lib/authSession'
import { isTokenExpired } from '../lib/jwt'
import { useAuthStore } from '../store/authStore'

/** Validates JWT + server session whenever the user enters the app shell. */
export function SessionGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const hydrated = useAuthHydrated()
  const session = useAuthStore((s) => s.session)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!hydrated) return

    let cancelled = false

    const failToLogin = () => {
      clearAuthSession()
      if (!cancelled) navigate('/login', { replace: true })
    }

    const verify = async () => {
      const token = useAuthStore.getState().session?.accessToken
      if (!token || isTokenExpired(token)) {
        failToLogin()
        return
      }

      try {
        await validateSession()
        if (!cancelled) setReady(true)
      } catch (e) {
        if (e instanceof ApiError && isAuthError(e.status)) return
        if (isTokenExpired(useAuthStore.getState().session?.accessToken)) {
          failToLogin()
          return
        }
        if (!cancelled) setReady(true)
      }
    }

    setReady(false)
    void verify()

    const onResume = () => {
      const token = useAuthStore.getState().session?.accessToken
      if (token && isTokenExpired(token)) forceLogout()
    }

    document.addEventListener('visibilitychange', onResume)
    window.addEventListener('focus', onResume)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onResume)
      window.removeEventListener('focus', onResume)
    }
  }, [hydrated, navigate, session?.accessToken])

  if (!hydrated || !ready) {
    return (
      <div className="app-screen flex items-center justify-center bg-background safe-top safe-bottom">
        <p className="app-subtitle">Loading...</p>
      </div>
    )
  }

  return children
}
