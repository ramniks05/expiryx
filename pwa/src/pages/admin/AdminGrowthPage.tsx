import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAdminGrowthStats } from '../../api/admin'
import { AdminSection, DailyBarChart } from '../../components/admin/AdminUi'

const DAY_OPTIONS = [7, 14, 30, 90]

export function AdminGrowthPage() {
  const [days, setDays] = useState(30)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'growth', days],
    queryFn: () => getAdminGrowthStats(days),
  })

  if (isLoading) {
    return <div className="app-page py-8 text-center text-sm icon-muted">Loading growth data...</div>
  }

  if (isError || !data) {
    return (
      <div className="app-page py-8 text-center">
        <p className="text-sm icon-muted">Failed to load growth stats.</p>
        <button type="button" onClick={() => void refetch()} className="btn-text mt-2">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="app-page pb-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="app-title">Growth</h1>
          <p className="app-subtitle">Activity over time</p>
        </div>
        <div className="flex gap-1">
          {DAY_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`filter-chip ${days === d ? 'filter-chip-selected' : ''}`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      <AdminSection title="User signups">
        <DailyBarChart data={data.userSignupsPerDay} label="New users" />
      </AdminSection>

      <AdminSection title="Documents created">
        <DailyBarChart data={data.documentsCreatedPerDay} label="New documents" />
      </AdminSection>

      <AdminSection title="OTP requests">
        <DailyBarChart data={data.otpRequestsPerDay} label="OTP sends" />
      </AdminSection>

      <AdminSection title="Notifications sent">
        <DailyBarChart data={data.notificationsSentPerDay} label="Notifications" />
      </AdminSection>
    </div>
  )
}
