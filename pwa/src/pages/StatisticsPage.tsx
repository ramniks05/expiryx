import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listDocuments } from '../api/documents'
import { getExpiryStatus } from '../lib/expiryHelper'
import type { Document } from '../types'

function stats(docs: Document[]) {
  const byCategory: Record<string, number> = {}
  let expired = 0
  let expiringSoon = 0
  let active = 0
  docs.forEach((d) => {
    const cat = d.categoryName ?? `Category ${d.categoryId}`
    byCategory[cat] = (byCategory[cat] ?? 0) + 1
    const s = getExpiryStatus(d.expiryDate)
    if (s === 'expired') expired++
    else if (s === 'expiringSoon') expiringSoon++
    else active++
  })
  return { total: docs.length, expired, expiringSoon, active, byCategory }
}

export function StatisticsPage() {
  const { data: page, isLoading } = useQuery({
    queryKey: ['documents', 'all'],
    queryFn: () => listDocuments({ page: 0, size: 500 }),
  })

  const s = useMemo(() => stats(page?.content ?? []), [page])

  const tiles = [
    { label: 'Total', value: s.total, color: 'var(--color-text-primary)' },
    { label: 'Active', value: s.active, color: 'var(--color-success)' },
    { label: 'Expiring soon', value: s.expiringSoon, color: 'var(--color-warning)' },
    { label: 'Expired', value: s.expired, color: 'var(--color-danger)' },
  ]

  return (
    <div className="app-page">
      <h1 className="app-title">Statistics</h1>
      <p className="app-subtitle">Overview of your documents</p>

      {isLoading ? (
        <div className="py-8 text-center text-sm icon-muted">Loading...</div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {tiles.map((item) => (
              <div key={item.label} className="app-stat-card p-4">
                <div className="text-xs icon-muted">{item.label}</div>
                <div className="text-3xl font-bold" style={{ color: item.color }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <h2 className="app-title mt-6 text-sm">By category</h2>
          <div className="mt-2 space-y-2">
            {Object.entries(s.byCategory).length === 0 ? (
              <div className="empty-state">No data yet</div>
            ) : (
              Object.entries(s.byCategory).map(([cat, count]) => (
                <div key={cat} className="app-card flex items-center justify-between px-4 py-3 text-sm">
                  <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {cat}
                  </span>
                  <span
                    className="rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-bold"
                    style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
                  >
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
