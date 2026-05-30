import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function ProtectedRoute() {
  const session = useAuthStore((s) => s.session)
  if (!session?.accessToken) return <Navigate to="/login" replace />
  return <Outlet />
}
