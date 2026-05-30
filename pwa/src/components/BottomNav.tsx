import { NavLink } from 'react-router-dom'
import { BarChart3, Bell, FileText, Home, Settings } from 'lucide-react'

const tabs = [
  { to: '/app', end: true, label: 'Home', icon: Home },
  { to: '/app/documents', label: 'Docs', icon: FileText },
  { to: '/app/statistics', label: 'Stats', icon: BarChart3 },
  { to: '/app/alerts', label: 'Alerts', icon: Bell },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 max-w-[100vw] safe-bottom safe-x"
      style={{ background: 'var(--color-card)', borderTop: '1px solid var(--color-border)' }}
    >
      <div className="mx-auto flex h-[var(--nav-height)] max-w-lg items-stretch justify-around px-0.5">
        {tabs.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 px-1"
          >
            {({ isActive }) => (
              <>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                  style={{
                    background: isActive ? 'var(--color-primary-16)' : 'transparent',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  }}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.25 : 2} />
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
