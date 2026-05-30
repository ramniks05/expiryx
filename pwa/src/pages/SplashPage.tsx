import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateSession } from '../api/auth'
import { getAppConfig } from '../api/appConfig'
import { ApiError } from '../api/client'
import { AppLogo } from '../components/AppLogo'
import { useAuthHydrated } from '../hooks/useAuthHydrated'
import { isAuthError } from '../lib/authSession'
import { useAuthStore } from '../store/authStore'

export function SplashPage() {
  const navigate = useNavigate()
  const hydrated = useAuthHydrated()
  const session = useAuthStore((s) => s.session)

  useEffect(() => {
    if (!hydrated) return

    let cancelled = false

    ;(async () => {
      try {
        const config = await getAppConfig()
        if (config.updateRequired && config.forceUpdate) {
          sessionStorage.setItem('expiryx-force-update', JSON.stringify(config))
          if (!cancelled) navigate('/force-update', { replace: true })
          return
        }
      } catch {
        /* offline or config unavailable — continue */
      }

      if (!session?.accessToken) {
        if (!cancelled) navigate('/login', { replace: true })
        return
      }

      try {
        await validateSession()
        if (!cancelled) navigate('/app', { replace: true })
      } catch (e) {
        if (e instanceof ApiError && isAuthError(e.status)) return
        if (!cancelled) navigate('/app', { replace: true })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [hydrated, navigate, session])

  return (
    <div className="app-screen flex flex-col items-center justify-center bg-background safe-top safe-bottom">
      <AppLogo size={96} />
      <p className="app-subtitle mt-4">Expiry Reminder</p>
      <div
        className="mt-8 h-1 w-24 animate-pulse rounded-full"
        style={{ background: 'var(--color-primary-35)' }}
      />
    </div>
  )
}
