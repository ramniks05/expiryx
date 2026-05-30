import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { getAppConfig } from '../api/appConfig'
import { AppLogo } from '../components/AppLogo'

export function SplashPage() {
  const navigate = useNavigate()
  const session = useAuthStore((s) => s.session)

  useEffect(() => {
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
      if (!cancelled) navigate(session ? '/app' : '/login', { replace: true })
    })()
    return () => {
      cancelled = true
    }
  }, [navigate, session])

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-background safe-top safe-bottom">
      <AppLogo size={120} />
      <p className="app-subtitle mt-4">Expiry Reminder</p>
      <div
        className="mt-8 h-1 w-24 animate-pulse rounded-full"
        style={{ background: 'var(--color-primary-35)' }}
      />
    </div>
  )
}
