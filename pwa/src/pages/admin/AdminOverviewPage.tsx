import { useQuery } from '@tanstack/react-query'
import { getAdminOverview } from '../../api/admin'
import { AdminSection, AdminStatCard, KeyCountList } from '../../components/admin/AdminUi'

export function AdminOverviewPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: getAdminOverview,
  })

  if (isLoading) {
    return <div className="app-page py-8 text-center text-sm icon-muted">Loading overview...</div>
  }

  if (isError || !data) {
    return (
      <div className="app-page py-8 text-center">
        <p className="text-sm icon-muted">Failed to load overview.</p>
        <button type="button" onClick={() => void refetch()} className="btn-text mt-2">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="app-page pb-10">
      <div>
        <h1 className="app-title">Overview</h1>
        <p className="app-subtitle">Platform snapshot</p>
      </div>

      <AdminSection title="Users">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <AdminStatCard label="Total users" value={data.totalUsers} color="var(--color-primary)" />
          <AdminStatCard label="Verified" value={data.verifiedUsers} color="var(--color-success)" />
          <AdminStatCard label="Unverified" value={data.unverifiedUsers} color="var(--color-warning)" />
          <AdminStatCard label="With name" value={data.usersWithName} />
          <AdminStatCard label="With email" value={data.usersWithEmail} />
          <AdminStatCard label="Profile complete" value={data.usersWithProfileComplete} />
          <AdminStatCard label="New today" value={data.newUsersToday} />
          <AdminStatCard label="New (7d)" value={data.newUsersLast7Days} />
          <AdminStatCard label="New (30d)" value={data.newUsersLast30Days} />
        </div>
      </AdminSection>

      <AdminSection title="Documents">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <AdminStatCard label="Total" value={data.totalDocuments} color="var(--color-primary)" />
          <AdminStatCard label="Active" value={data.activeDocuments} color="var(--color-success)" />
          <AdminStatCard label="Expiring soon" value={data.expiringSoonDocuments} color="var(--color-warning)" />
          <AdminStatCard label="Expired" value={data.expiredDocuments} color="var(--color-danger)" />
          <AdminStatCard label="With image" value={data.documentsWithImage} />
          <AdminStatCard label="With OCR" value={data.documentsWithOcr} />
          <AdminStatCard label="Expiring (7d)" value={data.documentsExpiringNext7Days} />
          <AdminStatCard label="Expiring (30d)" value={data.documentsExpiringNext30Days} />
          <AdminStatCard label="Avg / user" value={data.averageDocumentsPerUser.toFixed(2)} />
        </div>
      </AdminSection>

      <AdminSection title="Documents by category">
        <KeyCountList items={data.documentsByCategory} />
      </AdminSection>

      <AdminSection title="OTP & notifications">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <AdminStatCard label="OTP total" value={data.totalOtpRequests} />
          <AdminStatCard label="OTP (24h)" value={data.otpRequestsLast24Hours} />
          <AdminStatCard label="OTP (7d)" value={data.otpRequestsLast7Days} />
          <AdminStatCard label="Notifications sent" value={data.totalNotificationsSent} />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold icon-muted">By reminder type</p>
            <KeyCountList items={data.notificationsByReminderType} empty="No notifications" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold icon-muted">By channel</p>
            <KeyCountList items={data.notificationsByChannel} empty="No notifications" />
          </div>
        </div>
      </AdminSection>
    </div>
  )
}
