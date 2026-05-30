import { useQuery } from '@tanstack/react-query'
import { getAdminDocumentStats } from '../../api/admin'
import { AdminSection, AdminStatCard, DailyBarChart, KeyCountList } from '../../components/admin/AdminUi'

export function AdminDocumentsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'documents'],
    queryFn: getAdminDocumentStats,
  })

  if (isLoading) {
    return <div className="app-page py-8 text-center text-sm icon-muted">Loading document stats...</div>
  }

  if (isError || !data) {
    return (
      <div className="app-page py-8 text-center">
        <p className="text-sm icon-muted">Failed to load document stats.</p>
        <button type="button" onClick={() => void refetch()} className="btn-text mt-2">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="app-page pb-10">
      <div>
        <h1 className="app-title">Documents</h1>
        <p className="app-subtitle">Document analytics</p>
      </div>

      <AdminSection title="Status">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <AdminStatCard label="Total" value={data.totalDocuments} color="var(--color-primary)" />
          <AdminStatCard label="Active" value={data.activeDocuments} color="var(--color-success)" />
          <AdminStatCard label="Expiring soon" value={data.expiringSoonDocuments} color="var(--color-warning)" />
          <AdminStatCard label="Expired" value={data.expiredDocuments} color="var(--color-danger)" />
        </div>
      </AdminSection>

      <AdminSection title="Completeness">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <AdminStatCard label="With purchase date" value={data.withPurchaseDate} />
          <AdminStatCard label="With expiry date" value={data.withExpiryDate} />
          <AdminStatCard label="With brand" value={data.withBrandName} />
          <AdminStatCard label="With notes" value={data.withNotes} />
          <AdminStatCard label="With image" value={data.withImage} />
          <AdminStatCard label="With 2nd image" value={data.withSecondImage} />
          <AdminStatCard label="With OCR" value={data.withOcr} />
          <AdminStatCard label="With warranty" value={data.withWarrantyMonths} />
        </div>
      </AdminSection>

      <AdminSection title="Expiry window">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <AdminStatCard label="Expiring (7d)" value={data.expiringNext7Days} color="var(--color-warning)" />
          <AdminStatCard label="Expiring (30d)" value={data.expiringNext30Days} color="var(--color-warning)" />
          <AdminStatCard label="Expired (30d)" value={data.expiredLast30Days} color="var(--color-danger)" />
        </div>
      </AdminSection>

      <AdminSection title="Created recently">
        <div className="grid grid-cols-3 gap-2">
          <AdminStatCard label="Last 24h" value={data.createdLast24Hours} />
          <AdminStatCard label="Last 7d" value={data.createdLast7Days} />
          <AdminStatCard label="Last 30d" value={data.createdLast30Days} />
        </div>
      </AdminSection>

      <AdminSection title="Created per day">
        <DailyBarChart data={data.createdPerDayLast30Days} label="Documents created" />
      </AdminSection>

      <AdminSection title="By category">
        <KeyCountList items={data.byCategory} />
      </AdminSection>

      <AdminSection title="By status">
        <KeyCountList items={data.byStatus} />
      </AdminSection>
    </div>
  )
}
