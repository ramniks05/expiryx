import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { listCategories } from '../api/categories'
import { listDocuments } from '../api/documents'
import { CategoryChips } from '../components/CategoryChips'
import { DocumentCard } from '../components/DocumentCard'
import { Fab } from '../components/ui/Fab'
import { useAuthStore } from '../store/authStore'

export function DocumentsPage() {
  const session = useAuthStore((s) => s.session)
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: listCategories })
  const { data: page, isLoading } = useQuery({
    queryKey: ['documents', categoryId],
    queryFn: () => listDocuments({ page: 0, size: 100, categoryId: categoryId ?? undefined }),
  })

  const filtered = useMemo(() => {
    const docs = page?.content ?? []
    const q = search.trim().toLowerCase()
    if (!q) return docs
    return docs.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.brandName?.toLowerCase().includes(q) ||
        d.categoryName?.toLowerCase().includes(q) ||
        d.notes?.toLowerCase().includes(q),
    )
  }, [page, search])

  return (
    <div className="app-page">
      <div>
        <h1 className="app-title">Documents</h1>
        <p className="app-subtitle">Signed in as {session?.name ?? session?.mobileNumber}</p>
      </div>

      <div className="relative mt-4">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 icon-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, notes, or category..."
          className="app-input pl-10"
        />
      </div>

      <div className="mt-4">
        <h2 className="app-title mb-2 text-sm">Categories</h2>
        <CategoryChips categories={categories} selectedId={categoryId} onSelect={setCategoryId} />
      </div>

      <p className="mt-4 text-xs icon-muted">
        {filtered.length} document{filtered.length !== 1 ? 's' : ''}
      </p>

      <div className="mt-2 space-y-2">
        {isLoading ? (
          <div className="py-8 text-center text-sm icon-muted">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">No documents found.</div>
        ) : (
          filtered.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
        )}
      </div>

      <Fab to="/app/documents/add" />
    </div>
  )
}
