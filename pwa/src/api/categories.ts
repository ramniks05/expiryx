import { apiFetch } from './client'
import type { Category } from '../types'

export async function listCategories() {
  return apiFetch<Category[]>('/api/categories', { auth: true })
}
