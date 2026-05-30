import { useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  src: string
  alt: string
  onClose: () => void
}

export function DocumentImageViewer({ src, alt, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col safe-top safe-bottom"
      style={{ background: 'rgba(1, 26, 29, 0.92)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Document image viewer"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="truncate text-sm font-semibold text-white">{alt}</p>
        <button type="button" onClick={onClose} className="rounded-full p-2 text-white" aria-label="Close viewer">
          <X size={22} />
        </button>
      </div>
      <button
        type="button"
        className="flex flex-1 items-center justify-center overflow-auto p-4"
        onClick={onClose}
        aria-label="Close image"
      >
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </button>
    </div>
  )
}
