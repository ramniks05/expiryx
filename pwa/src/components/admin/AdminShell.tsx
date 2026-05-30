import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BarChart3, FileText, LogOut, TrendingUp, Users } from 'lucide-react'
import { clearAdminSession } from '../../lib/adminSession'
import { useAdminAuthStore } from '../../store/adminAuthStore'

const tabs = [
  { to: '/admin', end: true, label: 'Overview', icon: BarChart3 },
  { to: '/admin/documents', label: 'Documents', icon: FileText },
  { to: '/admin/growth', label: 'Growth', icon: TrendingUp },
  { to: '/admin/users', label: 'Users', icon: Users },
]

export function AdminShell() {
  const navigate = useNavigate()
  const session = useAdminAuthStore((s) => s.session)

  const logout = () => {
    clearAdminSession()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-background safe-top pb-8">
      <header
        className="safe-x sticky top-0 z-40 border-b px-4 py-3"
        style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold" style={{ color: 'var(--color-brand)' }}>
              ExpiryX Admin
            </h1>
            <p className="text-xs icon-muted">{session?.username ?? 'Admin'}</p>
          </div>
          <button type="button" onClick={logout} className="btn-text flex items-center gap-1 text-xs">
            <LogOut size={14} /> Sign out
          </button>
        </div>
        <nav className="mx-auto mt-3 flex max-w-4xl gap-1 overflow-x-auto pb-0.5">
          {tabs.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `filter-chip flex shrink-0 items-center gap-1.5 ${isActive ? 'filter-chip-selected' : ''}`
              }
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-4xl">
        <Outlet />
      </main>
    </div>
  )
}
