import { fetchAuthenticatedBlob } from '../api/client'
import { resolveImageUrl } from './imageUrl'

export function getDocumentImagePaths(doc: {
  imageUrls?: string[]
  imageUrl?: string | null
  imageUrl1?: string | null
  imageUrl2?: string | null
}): string[] {
  const raw = doc.imageUrls?.length
    ? doc.imageUrls
    : [doc.imageUrl1, doc.imageUrl2, doc.imageUrl].filter(Boolean)
  return raw as string[]
}

export function getDocumentImageUrls(doc: Parameters<typeof getDocumentImagePaths>[0]): string[] {
  return getDocumentImagePaths(doc)
    .map((path) => resolveImageUrl(path))
    .filter(Boolean) as string[]
}

export async function loadDocumentImageBlob(pathOrUrl: string): Promise<Blob> {
  const url = resolveImageUrl(pathOrUrl) ?? pathOrUrl
  return fetchAuthenticatedBlob(url)
}

function fileExtension(pathOrUrl: string, blob: Blob): string {
  const fromPath = pathOrUrl.split('?')[0]?.split('.').pop()?.toLowerCase()
  if (fromPath && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(fromPath)) {
    return fromPath === 'jpeg' ? 'jpg' : fromPath
  }
  const type = blob.type.toLowerCase()
  if (type.includes('png')) return 'png'
  if (type.includes('webp')) return 'webp'
  return 'jpg'
}

export function downloadFilename(docName: string, index: number, pathOrUrl: string, blob: Blob): string {
  const safe = docName.replace(/[^\w\-]+/g, '_').replace(/_+/g, '_').slice(0, 40) || 'document'
  return `${safe}-photo-${index + 1}.${fileExtension(pathOrUrl, blob)}`
}

export async function downloadDocumentImage(
  pathOrUrl: string,
  docName: string,
  index: number,
): Promise<void> {
  const blob = await loadDocumentImageBlob(pathOrUrl)
  const filename = downloadFilename(docName, index, pathOrUrl, blob)
  const blobUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(blobUrl)
}

export async function openDocumentImage(pathOrUrl: string): Promise<string> {
  const blob = await loadDocumentImageBlob(pathOrUrl)
  return URL.createObjectURL(blob)
}
