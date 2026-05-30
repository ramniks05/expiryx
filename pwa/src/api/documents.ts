import { apiFetch, apiMultipart } from './client'
import type { Document, ExtractResult, PageResponse } from '../types'

export interface DocumentQuery {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  categoryId?: number
  status?: string
}

export async function listDocuments(params: DocumentQuery = {}) {
  const q = new URLSearchParams({
    page: String(params.page ?? 0),
    size: String(params.size ?? 20),
    sortBy: params.sortBy ?? 'expiryDate',
    sortDir: params.sortDir ?? 'asc',
  })
  if (params.categoryId) q.set('categoryId', String(params.categoryId))
  if (params.status) q.set('status', params.status)
  return apiFetch<PageResponse<Document>>(`/api/documents?${q}`, { auth: true })
}

export async function getDocument(id: string) {
  return apiFetch<Document>(`/api/documents/${id}`, { auth: true })
}

export async function extractDocument(files: File[]) {
  const fd = new FormData()
  files.forEach((f) => fd.append('files', f))
  return apiMultipart<ExtractResult>('/api/documents/extract', fd)
}

export interface CreateDocumentPayload {
  files: File[]
  name: string
  categoryId: number
  purchaseDate: string
  warrantyMonths: number
  brandName?: string
  expiryDate?: string
  notes?: string
  ocrRawText?: string
}

export async function createDocument(payload: CreateDocumentPayload) {
  const fd = new FormData()
  payload.files.forEach((f) => fd.append('files', f))
  fd.append('name', payload.name)
  fd.append('categoryId', String(payload.categoryId))
  fd.append('purchaseDate', payload.purchaseDate)
  fd.append('warrantyMonths', String(payload.warrantyMonths))
  if (payload.brandName) fd.append('brandName', payload.brandName)
  if (payload.expiryDate) fd.append('expiryDate', payload.expiryDate)
  if (payload.notes) fd.append('notes', payload.notes)
  if (payload.ocrRawText) fd.append('ocrRawText', payload.ocrRawText)
  return apiMultipart<Document>('/api/documents', fd)
}

export interface UpdateDocumentPayload {
  name: string
  brandName?: string | null
  categoryId: number
  purchaseDate: string
  expiryDate: string
  notes?: string | null
  imageUrl?: string | null
}

export async function updateDocument(id: string, payload: UpdateDocumentPayload) {
  return apiFetch<Document>(`/api/documents/${id}`, {
    method: 'PUT',
    auth: true,
    json: payload,
  })
}

export async function deleteDocument(id: string) {
  return apiFetch<void>(`/api/documents/${id}`, { method: 'DELETE', auth: true })
}
