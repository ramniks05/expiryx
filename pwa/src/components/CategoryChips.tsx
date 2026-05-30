import type { Category } from '../types'

interface Props {
  categories: Category[]
  selectedId: number | null
  onSelect: (id: number | null) => void
}

export function CategoryChips({ categories, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`filter-chip ${selectedId === null ? 'filter-chip-selected' : ''}`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          className={`filter-chip ${selectedId === c.id ? 'filter-chip-selected' : ''}`}
        >
          {c.name}
        </button>
      ))}
    </div>
  )
}
