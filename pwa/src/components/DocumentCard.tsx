import { Link } from 'react-router-dom'
import { ChevronRight, Shield } from 'lucide-react'
import type { Document } from '../types'
import { formatExpiryLabel, getExpiryStatus, statusAccentBorder } from '../lib/expiryHelper'
import { StatusBadge } from './ui/StatusBadge'

interface Props {
  doc: Document
}

export function DocumentCard({ doc }: Props) {
  const status = getExpiryStatus(doc.expiryDate)

  return (
    <Link
      to={`/app/documents/${doc.id}`}
      className={`app-card flex min-w-0 items-center gap-2 border-l-4 p-3 sm:gap-3 sm:p-4 ${statusAccentBorder(status)}`}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
      >
        <Shield size={22} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          {doc.name}
        </div>
        <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {formatExpiryLabel(doc.expiryDate)}
        </div>
      </div>
      <StatusBadge status={status} />
      <ChevronRight size={18} className="shrink-0 icon-muted" />
    </Link>
  )
}
