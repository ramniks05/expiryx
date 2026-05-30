import { Bell } from 'lucide-react'

export function AlertsPage() {
  return (
    <div className="app-page">
      <h1 className="app-title">Alerts</h1>
      <p className="app-subtitle">Notification center</p>

      <div className="empty-state mt-8 flex flex-col items-center px-6 py-12">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
        >
          <Bell size={28} />
        </div>
        <h2 className="app-title mt-4 text-base">Coming soon</h2>
        <p className="mt-2 max-w-xs text-sm icon-muted">
          Web push notifications will appear here. For now, use the Android app for scheduled reminders.
        </p>
      </div>
    </div>
  )
}
