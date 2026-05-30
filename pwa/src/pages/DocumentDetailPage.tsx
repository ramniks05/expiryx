import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { getDocument, deleteDocument, updateDocument } from '../api/documents'
import { listCategories } from '../api/categories'
import { ApiError } from '../api/client'
import { useToast } from '../components/Toast'
import { formatDate, formatExpiryLabel, getExpiryStatus } from '../lib/expiryHelper'
import { StatusBadge } from '../components/ui/StatusBadge'
import { getDocumentImages } from '../lib/imageUrl'

export function DocumentDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const qc = useQueryClient()
  const [editing, setEditing] = useState(false)

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

  if (isLoading || !doc) {
    return <div className="p-8 text-center text-sm icon-muted">Loading...</div>
  }

  const status = getExpiryStatus(doc.expiryDate)
  const images = getDocumentImages(doc)

  return (
    <div className="app-page pb-10">
      <button type="button" onClick={() => navigate(-1)} className="btn-text mb-4 flex items-center gap-1">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="app-title">{doc.name}</h1>
          <p className="app-subtitle">{doc.categoryName ?? 'Document'}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {images.length > 0 && (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {images.map((src) => (
            <img key={src} src={src} alt="" className="h-44 shrink-0 rounded-xl object-cover" />
          ))}
        </div>
      )}

      {editing ? (
        <div className="app-card mt-4 space-y-3 p-4">
          <input value={name} onChange={(e) => setName(e.target.value)} className="app-input" placeholder="Name" />
          <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="app-input" placeholder="Brand" />
          <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="app-input">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="app-input" />
          <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="app-input" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="app-input" placeholder="Notes" />
          <div className="flex gap-2">
            <button type="button" onClick={() => saveMutation.mutate()} className="btn-filled flex-1">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="btn-outlined flex-1">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="app-card mt-4 space-y-0 p-4 text-sm">
          <Row label="Brand" value={doc.brandName ?? '—'} />
          <Row label="Purchase" value={formatDate(doc.purchaseDate)} />
          <Row label="Expiry" value={formatDate(doc.expiryDate)} />
          <Row label="Status" value={formatExpiryLabel(doc.expiryDate)} />
          <Row label="Warranty" value={`${doc.warrantyMonths} months`} />
          <Row label="Notes" value={doc.notes ?? '—'} />
          <div className="flex gap-2 pt-3">
            <button type="button" onClick={startEdit} className="btn-outlined flex-1" style={{ color: 'var(--color-primary)', borderColor: 'var(--color-primary-35)' }}>Edit</button>
            <button
              type="button"
              onClick={() => {
                if (confirm('Delete this document?')) deleteMutation.mutate()
              }}
              className="btn-outlined flex items-center justify-center gap-1 px-4"
              style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-35)' }}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5" style={{ borderBottom: '1px solid var(--color-border)' }}>
      <span className="icon-muted">{label}</span>
      <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
    </div>
  )
}
