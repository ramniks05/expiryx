import type { ReactNode } from 'react'
import type { CountByKey, DailyCount } from '../../types/admin'

export function AdminStatCard({
  label,
  value,
  color = 'var(--color-text-primary)',
}: {
  label: string
  value: string | number
  color?: string
}) {
  return (
    <div className="app-stat-card">
      <div className="text-xs icon-muted">{label}</div>
      <div className="mt-1 text-2xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  )
}

export function AdminSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="app-title mb-3 text-sm">{title}</h2>
      {children}
    </section>
  )
}

export function KeyCountList({ items, empty = 'No data' }: { items: CountByKey[]; empty?: string }) {
  if (!items.length) {
    return <div className="empty-state text-sm">{empty}</div>
  }
  return (
    <div className="app-card divide-y divide-[var(--color-border)]">
      {items.map((item) => (
        <div key={item.key} className="flex items-center justify-between px-4 py-3 text-sm">
          <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {item.key}
          </span>
          <span
            className="rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-bold"
            style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
          >
            {item.count}
          </span>
        </div>
      ))}
    </div>
  )
}

export function DailyBarChart({ data, label }: { data: DailyCount[]; label: string }) {
  if (!data.length) {
    return <div className="empty-state text-sm">No activity in this period.</div>
  }

  const max = Math.max(...data.map((d) => d.count), 1)
  const recent = [...data].slice(-14)

  return (
    <div className="app-card p-4">
      <p className="mb-3 text-xs icon-muted">{label} (last {recent.length} days with data)</p>
      <div className="flex items-end gap-1.5" style={{ minHeight: 120 }}>
        {recent.map((d) => (
          <div key={d.date} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md"
              style={{
                height: `${Math.max(8, (d.count / max) * 100)}px`,
                background: 'var(--color-primary)',
                opacity: 0.85,
              }}
              title={`${d.date}: ${d.count}`}
            />
            <span className="truncate text-[9px] icon-muted">{d.date.slice(5)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function formatAdminDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function statusClass(status: string) {
  if (status === 'EXPIRED') return 'status-badge-expired'
  if (status === 'EXPIRING_SOON') return 'status-badge-expiring'
  return 'status-badge-active'
}
