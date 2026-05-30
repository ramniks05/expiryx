import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Camera, Sparkles } from 'lucide-react'
import { listCategories } from '../api/categories'
import { createDocument, extractDocument } from '../api/documents'
import { ApiError } from '../api/client'
import { useToast } from '../components/Toast'

const ACCEPT = 'image/jpeg,image/png,image/webp'

export function AddDocumentPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: listCategories })

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [name, setName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [categoryId, setCategoryId] = useState<number>(2)
  const [purchaseDate, setPurchaseDate] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [warrantyMonths, setWarrantyMonths] = useState('12')
  const [notes, setNotes] = useState('')
  const [ocrRawText, setOcrRawText] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [saving, setSaving] = useState(false)

  const onFiles = (list: FileList | null) => {
    if (!list) return
    const picked = Array.from(list).slice(0, 2)
    if (picked.some((f) => !ACCEPT.split(',').includes(f.type))) {
      showToast('Only JPEG, PNG, WEBP allowed', 'error')
      return
    }
    previews.forEach((p) => URL.revokeObjectURL(p))
    setFiles(picked)
    setPreviews(picked.map((f) => URL.createObjectURL(f)))
  }

  const handleExtract = async () => {
    if (files.length === 0) {
      showToast('Add 1–2 images first', 'error')
      return
    }
    setExtracting(true)
    try {
      const res = await extractDocument(files)
      if (res.name) setName(res.name)
      if (res.brandName) setBrandName(res.brandName)
      if (res.categoryId) setCategoryId(res.categoryId)
      if (res.purchaseDate) setPurchaseDate(res.purchaseDate)
      if (res.expiryDate) setExpiryDate(res.expiryDate)
      if (res.warrantyMonths) setWarrantyMonths(String(res.warrantyMonths))
      if (res.notes) setNotes(res.notes)
      if (res.ocrRawText) setOcrRawText(res.ocrRawText)
      showToast('Fields extracted', 'success')
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Extract failed', 'error')
    } finally {
      setExtracting(false)
    }
  }

  const handleSave = async () => {
    if (!name || !purchaseDate || !categoryId) {
      showToast('Fill required fields', 'error')
      return
    }
    if (files.length === 0) {
      showToast('Add at least one image', 'error')
      return
    }
    setSaving(true)
    try {
      const doc = await createDocument({
        files,
        name,
        categoryId,
        purchaseDate,
        warrantyMonths: Number(warrantyMonths),
        brandName: brandName || undefined,
        expiryDate: expiryDate || undefined,
        notes: notes || undefined,
        ocrRawText: ocrRawText || undefined,
      })
      showToast('Document saved', 'success')
      navigate(`/app/documents/${doc.id}`, { replace: true })
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-page pb-28">
      <button type="button" onClick={() => navigate(-1)} className="btn-text mb-4 flex items-center gap-1">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="app-title">Add document</h1>
      <p className="app-subtitle">Upload 1–2 images, extract, then save.</p>

      <input ref={fileRef} type="file" accept={ACCEPT} multiple hidden onChange={(e) => onFiles(e.target.files)} />

      <div className="mt-4 grid grid-cols-2 gap-2">
        {previews.length === 0 ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="empty-state col-span-2 flex flex-col items-center gap-2 py-10"
          >
            <Camera size={28} />
            <span className="text-sm">Pick camera or gallery</span>
          </button>
        ) : (
          <>
            {previews.map((p, i) => (
              <img key={p} src={p} alt={`Preview ${i + 1}`} className="h-36 w-full rounded-xl object-cover" />
            ))}
            {previews.length < 2 && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-36 items-center justify-center rounded-xl border border-dashed border-brand/15 bg-white text-brand/40"
              >
                <Camera size={24} />
              </button>
            )}
          </>
        )}
      </div>

      <button
        type="button"
        disabled={extracting || files.length === 0}
        onClick={handleExtract}
        className="btn-outlined mt-3 w-full disabled:opacity-50"
        style={{ borderColor: 'var(--color-primary-35)', color: 'var(--color-primary)', background: 'var(--color-primary-12)' }}
      >
        <Sparkles size={16} />
        {extracting ? 'Extracting...' : 'Extract fields'}
      </button>

      <div className="app-card mt-4 space-y-3 p-4">
        <Field label="Name *" value={name} onChange={setName} />
        <Field label="Brand" value={brandName} onChange={setBrandName} />
        <div>
          <label className="app-label">Category *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="app-input mt-1"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Field label="Purchase date *" value={purchaseDate} onChange={setPurchaseDate} type="date" />
        <Field label="Expiry date" value={expiryDate} onChange={setExpiryDate} type="date" />
        <Field label="Warranty months *" value={warrantyMonths} onChange={setWarrantyMonths} type="number" />
        <div>
          <label className="app-label">Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="app-input mt-1" />
        </div>
      </div>

      <button type="button" disabled={saving} onClick={handleSave} className="btn-filled mt-4">
        {saving ? 'Saving...' : 'Save document'}
      </button>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div>
      <label className="app-label">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="app-input mt-1" />
    </div>
  )
}
