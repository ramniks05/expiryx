import type { ExpiryStatus } from '../../types'
import { statusBadgeClass, statusLabel } from '../../lib/expiryHelper'

interface Props {
  status: ExpiryStatus
}

export function StatusBadge({ status }: Props) {
  return <span className={`status-badge ${statusBadgeClass(status)}`}>{statusLabel(status)}</span>
}
