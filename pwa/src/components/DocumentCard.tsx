import { Link } from 'react-router-dom'
import { ChevronRight, Shield } from 'lucide-react'
import type { Document } from '../types'
import { AuthenticatedImage } from './AuthenticatedImage'
import { formatExpiryLabel, getExpiryStatus, statusAccentBorder } from '../lib/expiryHelper'
import { getDocumentImagePaths } from '../lib/documentFiles'
import { StatusBadge } from './ui/StatusBadge'

interface Props {
  doc: Document
}

export function DocumentCard({ doc }: Props) {
  const status = getExpiryStatus(doc.expiryDate)
  const thumbnailPath = getDocumentImagePaths(doc)[0] ?? null

  return (
    <Link
      to={`/app/documents/${doc.id}`}
      className={`app-card flex min-w-0 items-center gap-2 border-l-4 p-3 sm:gap-3 sm:p-4 ${statusAccentBorder(status)}`}
    >
      {thumbnailPath ? (
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl" style={{ border: '1px solid var(--color-border)' }}>
          <AuthenticatedImage pathOrUrl={thumbnailPath} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
        >
          <Shield size={22} />
        </div>
      )}
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
