import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Search } from 'lucide-react'
import { listAdminUsers } from '../../api/admin'

export function AdminUsersPage() {
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(q.trim())
      setPage(0)
    }, 350)
    return () => clearTimeout(id)
  }, [q])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'users', search, page],
    queryFn: () => listAdminUsers({ q: search, page, size: 20 }),
  })

  return (
    <div className="app-page pb-10">
      <div>
        <h1 className="app-title">Users</h1>
        <p className="app-subtitle">
          {data ? `${data.totalElements} total` : 'Search and manage users'}
        </p>
      </div>

      <div className="relative mt-4">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 icon-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search mobile, name, or email..."
          className="app-input pl-10"
        />
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-sm icon-muted">Loading users...</div>
      ) : isError || !data ? (
        <div className="py-8 text-center">
          <p className="text-sm icon-muted">Failed to load users.</p>
          <button type="button" onClick={() => void refetch()} className="btn-text mt-2">
            Retry
          </button>
        </div>
      ) : data.content.length === 0 ? (
        <div className="empty-state mt-4 text-sm">No users found.</div>
      ) : (
        <div className="mt-4 space-y-2">
          {data.content.map((user) => (
            <Link key={user.id} to={`/admin/users/${user.id}`} className="app-card flex items-center gap-3 p-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
              >
                {(user.name ?? user.mobileNumber).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {user.name ?? 'Unnamed user'}
                </div>
                <div className="truncate text-xs icon-muted">{user.mobileNumber}</div>
                {user.email && <div className="truncate text-xs icon-muted">{user.email}</div>}
              </div>
              <div className="shrink-0 text-right text-xs">
                <div className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {user.documentCount} docs
                </div>
                <div className="icon-muted">{user.verified ? 'Verified' : 'Unverified'}</div>
              </div>
              <ChevronRight size={18} className="shrink-0 icon-muted" />
            </Link>
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={data.first}
            onClick={() => setPage((p) => p - 1)}
            className="btn-outlined px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs icon-muted">
            Page {data.page + 1} of {data.totalPages}
          </span>
          <button
            type="button"
            disabled={data.last}
            onClick={() => setPage((p) => p + 1)}
            className="btn-outlined px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
