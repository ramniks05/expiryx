import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { getAdminUser } from '../../api/admin'
import { AdminSection, AdminStatCard, KeyCountList, formatAdminDate, statusClass } from '../../components/admin/AdminUi'

export function AdminUserDetailPage() {
  const { id = '' } = useParams()
  const userId = Number(id)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: () => getAdminUser(userId),
    enabled: Number.isFinite(userId) && userId > 0,
  })

  if (isLoading) {
    return <div className="app-page py-8 text-center text-sm icon-muted">Loading user...</div>
  }

  if (isError || !data) {
    return (
      <div className="app-page py-8 text-center">
        <p className="text-sm icon-muted">User not found or failed to load.</p>
        <Link to="/admin/users" className="btn-text mt-2 inline-block">
          Back to users
        </Link>
      </div>
    )
  }

  return (
    <div className="app-page pb-10">
      <Link to="/admin/users" className="btn-text mb-4 inline-flex items-center gap-1">
        <ArrowLeft size={16} /> Back to users
      </Link>

      <div className="app-card p-4">
        <h1 className="app-title">{data.name ?? 'Unnamed user'}</h1>
        <p className="app-subtitle mt-1">{data.mobileNumber}</p>
        {data.email && <p className="mt-1 text-sm icon-muted">{data.email}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className={`status-badge ${data.verified ? 'status-badge-active' : 'status-badge-expiring'}`}>
            {data.verified ? 'Verified' : 'Unverified'}
          </span>
          <span className="status-badge" style={{ background: 'var(--color-background-elevated)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
            ID {data.id}
          </span>
        </div>
        <div className="mt-3 text-xs icon-muted">
          <p>Joined {formatAdminDate(data.createdAt)}</p>
          <p>Updated {formatAdminDate(data.updatedAt)}</p>
        </div>
      </div>

      <AdminSection title="Documents">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <AdminStatCard label="Total" value={data.totalDocuments} color="var(--color-primary)" />
          <AdminStatCard label="Active" value={data.activeDocuments} color="var(--color-success)" />
          <AdminStatCard label="Expiring" value={data.expiringSoonDocuments} color="var(--color-warning)" />
          <AdminStatCard label="Expired" value={data.expiredDocuments} color="var(--color-danger)" />
          <AdminStatCard label="With image" value={data.documentsWithImage} />
          <AdminStatCard label="With OCR" value={data.documentsWithOcr} />
        </div>
      </AdminSection>

      <AdminSection title="By category">
        <KeyCountList items={data.documentsByCategory} empty="No documents" />
      </AdminSection>

      <AdminSection title="Recent documents">
        {data.recentDocuments.length === 0 ? (
          <div className="empty-state text-sm">No documents yet.</div>
        ) : (
          <div className="app-card divide-y divide-[var(--color-border)]">
            {data.recentDocuments.map((doc) => (
              <div key={doc.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {doc.name}
                  </div>
                  <div className="text-xs icon-muted">
                    {doc.categoryName}
                    {doc.expiryDate ? ` · Expires ${doc.expiryDate}` : ''}
                  </div>
                </div>
                <span className={`status-badge ${statusClass(doc.status)}`}>{doc.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        )}
      </AdminSection>
    </div>
  )
}
