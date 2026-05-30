import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Download, Eye, Pencil, Trash2 } from 'lucide-react'
import { getDocument, deleteDocument, updateDocument } from '../api/documents'
import { listCategories } from '../api/categories'
import { ApiError } from '../api/client'
import { AuthenticatedImage } from '../components/AuthenticatedImage'
import { DocumentImageViewer } from '../components/DocumentImageViewer'
import { useToast } from '../components/Toast'
import { StatusBadge } from '../components/ui/StatusBadge'
import { downloadDocumentImage, getDocumentImagePaths, openDocumentImage } from '../lib/documentFiles'
import { formatDate, formatExpiryLabel, getExpiryStatus } from '../lib/expiryHelper'

export function DocumentDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [viewer, setViewer] = useState<{ src: string; label: string } | null>(null)
  const [busyImage, setBusyImage] = useState<string | null>(null)

  const { data: doc, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: () => getDocument(id),
    enabled: !!id,
  })

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: listCategories })

  const [name, setName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [categoryId, setCategoryId] = useState(2)
  const [purchaseDate, setPurchaseDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [notes, setNotes] = useState('')

  const startEdit = () => {
    if (!doc) return
    setName(doc.name)
    setBrandName(doc.brandName ?? '')
    setCategoryId(doc.categoryId)
    setPurchaseDate(doc.purchaseDate)
    setExpiryDate(doc.expiryDate)
    setNotes(doc.notes ?? '')
    setEditing(true)
  }

  const saveMutation = useMutation({
    mutationFn: () =>
      updateDocument(id, {
        name,
        brandName: brandName || null,
        categoryId,
        purchaseDate,
        expiryDate,
        notes: notes || null,
        imageUrl: doc?.imageUrl ?? null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['document', id] })
      qc.invalidateQueries({ queryKey: ['documents'] })
      setEditing(false)
      showToast('Updated', 'success')
    },
    onError: (e) => showToast(e instanceof ApiError ? e.message : 'Update failed', 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteDocument(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['documents'] })
      showToast('Deleted', 'success')
      navigate('/app/documents', { replace: true })
    },
    onError: (e) => showToast(e instanceof ApiError ? e.message : 'Delete failed', 'error'),
  })

  const handleView = async (path: string, index: number) => {
    setBusyImage(`view-${index}`)
    try {
      const src = await openDocumentImage(path)
      setViewer({ src, label: `${doc?.name ?? 'Document'} — Photo ${index + 1}` })
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Could not open image', 'error')
    } finally {
      setBusyImage(null)
    }
  }

  const handleDownload = async (path: string, index: number) => {
    if (!doc) return
    setBusyImage(`download-${index}`)
    try {
      await downloadDocumentImage(path, doc.name, index)
      showToast('Download started', 'success')
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Download failed', 'error')
    } finally {
      setBusyImage(null)
    }
  }

  const closeViewer = () => {
    if (viewer?.src.startsWith('blob:')) URL.revokeObjectURL(viewer.src)
    setViewer(null)
  }

  if (isLoading || !doc) {
    return <div className="app-page py-8 text-center text-sm icon-muted">Loading...</div>
  }

  const status = getExpiryStatus(doc.expiryDate)
  const imagePaths = getDocumentImagePaths(doc)

  return (
    <>
      <div className="app-page pb-10">
        <button type="button" onClick={() => navigate(-1)} className="btn-text mb-4 flex items-center gap-1">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="app-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="app-title truncate">{doc.name}</h1>
              <p className="app-subtitle mt-1">{doc.categoryName ?? 'Document'}</p>
            </div>
            <StatusBadge status={status} />
          </div>
        </div>

        <section className="mt-5">
          <h2 className="app-title mb-2 text-sm">Photos</h2>
          {imagePaths.length === 0 ? (
            <div className="empty-state text-sm">No photos attached to this document.</div>
          ) : (
            <div className="space-y-3">
              {imagePaths.map((path, index) => (
                <div key={`${path}-${index}`} className="app-card overflow-hidden">
                  <AuthenticatedImage
                    pathOrUrl={path}
                    alt={`${doc.name} photo ${index + 1}`}
                    className="h-48 w-full object-cover"
                  />
                  <div className="flex gap-2 p-3">
                    <button
                      type="button"
                      disabled={busyImage !== null}
                      onClick={() => void handleView(path, index)}
                      className="btn-outlined flex flex-1 items-center justify-center gap-2 py-2.5 text-sm"
                      style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary-35)' }}
                    >
                      <Eye size={16} />
                      {busyImage === `view-${index}` ? 'Opening...' : 'View'}
                    </button>
                    <button
                      type="button"
                      disabled={busyImage !== null}
                      onClick={() => void handleDownload(path, index)}
                      className="btn-outlined flex flex-1 items-center justify-center gap-2 py-2.5 text-sm"
                    >
                      <Download size={16} />
                      {busyImage === `download-${index}` ? 'Saving...' : 'Download'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {editing ? (
          <section className="app-card mt-5 space-y-3 p-4">
            <h2 className="app-title text-sm">Edit document</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} className="app-input" placeholder="Name" />
            <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="app-input" placeholder="Brand" />
            <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="app-input">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="app-input" />
            <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="app-input" />
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="app-input" placeholder="Notes" />
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => saveMutation.mutate()} className="btn-filled flex-1">
                Save
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-outlined flex-1">
                Cancel
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="mt-5">
              <h2 className="app-title mb-2 text-sm">Expiry & warranty</h2>
              <div className="app-card divide-y divide-[var(--color-border)] p-0 text-sm">
                <DetailRow label="Purchase date" value={formatDate(doc.purchaseDate)} />
                <DetailRow label="Expiry date" value={formatDate(doc.expiryDate)} />
                <DetailRow label="Status" value={formatExpiryLabel(doc.expiryDate)} />
                <DetailRow label="Warranty" value={`${doc.warrantyMonths} months`} />
              </div>
            </section>

            <section className="mt-5">
              <h2 className="app-title mb-2 text-sm">Details</h2>
              <div className="app-card divide-y divide-[var(--color-border)] p-0 text-sm">
                <DetailRow label="Brand" value={doc.brandName ?? '—'} />
                <DetailRow label="Category" value={doc.categoryName ?? '—'} />
                <DetailRow label="Notes" value={doc.notes?.trim() || '—'} multiline />
              </div>
            </section>

            <section className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={startEdit}
                className="btn-outlined flex flex-1 items-center justify-center gap-2"
                style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary-35)' }}
              >
                <Pencil size={16} /> Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this document?')) deleteMutation.mutate()
                }}
                className="btn-outlined flex flex-1 items-center justify-center gap-2"
                style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-35)' }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </section>
          </>
        )}
      </div>

      {viewer && <DocumentImageViewer src={viewer.src} alt={viewer.label} onClose={closeViewer} />}
    </>
  )
}

function DetailRow({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className="flex gap-4 px-4 py-3">
      <span className="w-28 shrink-0 icon-muted">{label}</span>
      <span
        className={`min-w-0 flex-1 font-semibold ${multiline ? 'whitespace-pre-wrap' : 'text-right'}`}
        style={{ color: 'var(--color-text-primary)' }}
      >
        {value}
      </span>
    </div>
  )
}
