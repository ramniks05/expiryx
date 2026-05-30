import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Info, LogOut, User } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { InstallPrompt } from '../components/InstallPrompt'

export function SettingsPage() {
  const navigate = useNavigate()
  const session = useAuthStore((s) => s.session)
  const clearSession = useAuthStore((s) => s.clearSession)

  const logout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-page">
      <h1 className="app-title">Settings</h1>
      <p className="app-subtitle">Hello, {session?.name ?? 'User'}</p>

      <div className="app-card mt-5 p-4">
        <Link to="/app/profile/edit" className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
            style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
          >
            {(session?.name ?? 'U').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {session?.name ?? 'User'}
            </div>
            <div className="text-xs icon-muted">+91 {session?.mobileNumber}</div>
          </div>
          <ChevronRight size={18} className="icon-muted" />
        </Link>
      </div>

      <div className="mt-4 space-y-2">
        <SettingsRow icon={User} label="Edit profile" to="/app/profile/edit" />
        <SettingsRow icon={Info} label="About ExpiryX" subtitle={`Version ${import.meta.env.VITE_APP_VERSION}`} />
      </div>

      <div className="mt-4">
        <InstallPrompt />
      </div>

      <button type="button" onClick={logout} className="btn-outlined mt-6 w-full" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-35)' }}>
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  )
}

function SettingsRow({
  icon: Icon,
  label,
  subtitle,
  to,
}: {
  icon: typeof User
  label: string
  subtitle?: string
  to?: string
}) {
  const inner = (
    <div className="app-card flex items-center gap-3 p-4">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
      >
        <Icon size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {label}
        </div>
        {subtitle && <div className="text-xs icon-muted">{subtitle}</div>}
      </div>
      {to && <ChevronRight size={18} className="icon-muted" />}
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}
