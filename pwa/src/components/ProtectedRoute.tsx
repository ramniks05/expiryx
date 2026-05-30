import { Navigate, Outlet } from 'react-router-dom'
import { useAuthHydrated } from '../hooks/useAuthHydrated'
import { useAuthStore } from '../store/authStore'

export function ProtectedRoute() {
  const hydrated = useAuthHydrated()
  const session = useAuthStore((s) => s.session)

  if (!hydrated) {
    return (
      <div className="app-screen flex items-center justify-center bg-background safe-top safe-bottom">
        <p className="app-subtitle">Loading...</p>
      </div>
    )
  }

  if (!session?.accessToken) return <Navigate to="/login" replace />
  return <Outlet />
}
