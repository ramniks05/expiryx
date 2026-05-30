import { Navigate, Outlet } from 'react-router-dom'
import { useAdminHydrated } from '../../hooks/useAdminHydrated'
import { useAdminAuthStore } from '../../store/adminAuthStore'

export function AdminProtectedRoute() {
  const hydrated = useAdminHydrated()
  const session = useAdminAuthStore((s) => s.session)

  if (!hydrated) {
    return (
      <div className="app-screen flex items-center justify-center bg-background safe-top safe-bottom">
        <p className="app-subtitle">Loading...</p>
      </div>
    )
  }

  if (!session?.accessToken) return <Navigate to="/admin/login" replace />
  return <Outlet />
}
