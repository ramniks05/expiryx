import { useEffect, useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { loadDocumentImageBlob } from '../lib/documentFiles'

interface Props {
  pathOrUrl: string
  alt?: string
  className?: string
}

export function AuthenticatedImage({ pathOrUrl, alt = '', className = '' }: Props) {
  const [src, setSrc] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let objectUrl: string | null = null
    let cancelled = false

    setFailed(false)
    setSrc(null)

    loadDocumentImageBlob(pathOrUrl)
      .then((blob) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(blob)
        setSrc(objectUrl)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [pathOrUrl])

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ background: 'var(--color-background-elevated)', color: 'var(--color-text-secondary)' }}
      >
        <ImageIcon size={22} />
      </div>
    )
  }

  if (!src) {
    return (
      <div
        className={`animate-pulse ${className}`}
        style={{ background: 'var(--color-background-elevated)' }}
      />
    )
  }

  return <img src={src} alt={alt} className={className} />
}

/** First path segment used for authenticated loading (raw API path). */