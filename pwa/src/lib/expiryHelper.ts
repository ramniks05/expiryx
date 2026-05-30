import type { ExpiryStatus } from '../types'

const MS_PER_DAY = 86_400_000

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  return Math.ceil((expiry.getTime() - today.getTime()) / MS_PER_DAY)
}

export function getExpiryStatus(expiryDate: string): ExpiryStatus {
  const days = getDaysUntilExpiry(expiryDate)
  if (days < 0) return 'expired'
  if (days <= 30) return 'expiringSoon'
  return 'active'
}

export function formatExpiryLabel(expiryDate: string): string {
  const days = getDaysUntilExpiry(expiryDate)
  if (days < 0) {
    return `Expired on ${formatDate(expiryDate)}`
  }
  if (days === 0) return 'Expires today'
  if (days === 1) return 'Expires in 1 day'
  return `Expires in ${days} days`
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function statusBadgeClass(status: ExpiryStatus): string {
  switch (status) {
    case 'expired':
      return 'status-badge-expired'
    case 'expiringSoon':
      return 'status-badge-expiring'
    default:
      return 'status-badge-active'
  }
}

/** @deprecated use statusBadgeClass + StatusBadge component */
export function statusColor(status: ExpiryStatus): string {
  return statusBadgeClass(status)
}

export function statusAccentBorder(status: ExpiryStatus): string {
  switch (status) {
    case 'expired':
      return 'border-l-[#E04F4F]'
    case 'expiringSoon':
      return 'border-l-[#F47C20]'
    default:
      return 'border-l-[#1A9B6E]'
  }
}

export function statusLabel(status: ExpiryStatus): string {
  switch (status) {
    case 'expired':
      return 'Expired'
    case 'expiringSoon':
      return 'Expiring soon'
    default:
      return 'Active'
  }
}
