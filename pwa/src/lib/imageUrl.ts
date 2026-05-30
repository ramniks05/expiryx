const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://doctracker-backend.onrender.com'

export function resolveImageUrl(path?: string | null): string | null {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const base = API_BASE.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

export function getDocumentImages(doc: {
  imageUrls?: string[]
  imageUrl?: string | null
  imageUrl1?: string | null
  imageUrl2?: string | null
}): string[] {
  const raw =
    doc.imageUrls?.length
      ? doc.imageUrls
      : [doc.imageUrl1, doc.imageUrl2, doc.imageUrl].filter(Boolean)
  return raw.map((u) => resolveImageUrl(u as string)).filter(Boolean) as string[]
}
