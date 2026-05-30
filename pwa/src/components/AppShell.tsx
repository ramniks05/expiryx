import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { SessionGuard } from './SessionGuard'

export function AppShell() {
  return (
    <SessionGuard>
      <div className="app-shell bg-background safe-top">
        <Outlet />
        <BottomNav />
      </div>
    </SessionGuard>
  )
}
