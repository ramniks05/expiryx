import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

interface Props {
  to: string
  label?: string
}

export function Fab({ to, label = 'Add' }: Props) {
  return (
    <Link to={to} className="app-fab">
      <Plus size={18} strokeWidth={2.5} />
      {label}
    </Link>
  )
}
