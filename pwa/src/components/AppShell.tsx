import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="min-h-full bg-background pb-[86px] safe-top">
      <Outlet />
      <BottomNav />
    </div>
  )
}
