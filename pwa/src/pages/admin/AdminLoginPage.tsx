import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ShieldCheck, User } from 'lucide-react'
import { adminLogin } from '../../api/admin'
import { ApiError } from '../../api/client'
import { AppLogo } from '../../components/AppLogo'
import { useToast } from '../../components/Toast'
import { useAdminHydrated } from '../../hooks/useAdminHydrated'
import { useAdminAuthStore } from '../../store/adminAuthStore'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const hydrated = useAdminHydrated()
  const session = useAdminAuthStore((s) => s.session)
  const setSession = useAdminAuthStore((s) => s.setSession)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (hydrated && session?.accessToken) {
      navigate('/admin', { replace: true })
    }
  }, [hydrated, session, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      showToast('Enter username and password', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await adminLogin(username.trim(), password)
      setSession({
        username: res.username,
        accessToken: res.accessToken,
        role: res.role,
      })
      navigate('/admin', { replace: true })
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-screen bg-background safe-top safe-bottom">
      <div className="app-page">
        <div className="flex flex-col items-center pt-6">
          <AppLogo size={72} />
          <h1 className="app-title mt-4">Admin login</h1>
          <p className="app-subtitle mt-1 text-center">ExpiryX dashboard access</p>
        </div>

        <form onSubmit={handleSubmit} className="app-card mt-6 space-y-4 p-5">
          <div>
            <label className="app-label">Username</label>
            <div className="relative mt-1">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 icon-muted" />
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="app-input pl-10"
                placeholder="admin"
              />
            </div>
          </div>
          <div>
            <label className="app-label">Password</label>
            <div className="relative mt-1">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 icon-muted" />
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="app-input pl-10"
                placeholder="Enter password"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-filled">
            <ShieldCheck size={16} />
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
