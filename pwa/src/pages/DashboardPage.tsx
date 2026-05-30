import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, Clock, Package } from 'lucide-react'
import { listCategories } from '../api/categories'
import { listDocuments } from '../api/documents'
import { CategoryChips } from '../components/CategoryChips'
import { DocumentCard } from '../components/DocumentCard'
import { Fab } from '../components/ui/Fab'
import { useAuthStore } from '../store/authStore'
import { getExpiryStatus } from '../lib/expiryHelper'
import type { Document } from '../types'

function countByStatus(docs: Document[]) {
  let expired = 0
  let expiringSoon = 0
  let active = 0
  docs.forEach((d) => {
    const s = getExpiryStatus(d.expiryDate)
    if (s === 'expired') expired++
    else if (s === 'expiringSoon') expiringSoon++
    else active++
  })
  return { total: docs.length, expired, expiringSoon, active }
}

export function DashboardPage() {
  const session = useAuthStore((s) => s.session)
  const [categoryId, setCategoryId] = useState<number | null>(null)

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: listCategories })
  const { data: page, isLoading } = useQuery({
    queryKey: ['documents', categoryId],
    queryFn: () => listDocuments({ page: 0, size: 100, categoryId: categoryId ?? undefined }),
  })

  const docs = page?.content ?? []
  const stats = useMemo(() => countByStatus(docs), [docs])
  const upcoming = useMemo(
    () =>
      [...docs]
        .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
        .slice(0, 5),
    [docs],
  )

  const statTiles = [
    { label: 'Total', value: stats.total, icon: Package, color: 'var(--color-primary)' },
    { label: 'Expiring', value: stats.expiringSoon, icon: Clock, color: 'var(--color-warning)' },
    { label: 'Expired', value: stats.expired, icon: AlertTriangle, color: 'var(--color-danger)' },
  ]

  return (
    <div className="app-page">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="app-subtitle">Hello,</p>
          <h1 className="app-title">{session?.name ?? 'User'}</h1>
        </div>
        <div
          className="flex items-center gap-2 rounded-[var(--radius-pill)] px-3 py-1.5 text-xs font-semibold"
          style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
        >
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            {(session?.name ?? 'U').charAt(0).toUpperCase()}
          </span>
          <span className="max-w-[100px] truncate">{session?.name ?? session?.mobileNumber}</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {statTiles.map((s) => (
          <div key={s.label} className="app-stat-card">
            <s.icon size={20} style={{ color: s.color }} />
            <div className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {s.label}
            </div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="app-title mb-2 text-sm">Categories</h2>
        <CategoryChips categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="app-title text-sm">Upcoming</h2>
        <Link to="/app/documents" className="btn-text text-xs">
          View all
        </Link>
      </div>

      <div className="mt-3 space-y-2">
        {isLoading ? (
          <div className="py-8 text-center text-sm icon-muted">Loading...</div>
        ) : upcoming.length === 0 ? (
          <div className="empty-state">No documents yet. Tap Add to create one.</div>
        ) : (
          upcoming.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
        )}
      </div>

      <Fab to="/app/documents/add" />
    </div>
  )
}
