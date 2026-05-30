export interface User {
  id: number
  mobileNumber: string
  name: string | null
  email?: string | null
}

export interface AuthSession extends User {
  accessToken: string
}

export interface Category {
  id: number
  name: string
}

export interface Document {
  id: string
  name: string
  categoryId: number
  categoryName?: string
  purchaseDate: string
  expiryDate: string
  warrantyMonths: number
  brandName?: string | null
  notes?: string | null
  ocrRawText?: string | null
  imageUrl?: string | null
  imageUrl1?: string | null
  imageUrl2?: string | null
  imageUrls?: string[]
}

export interface ExtractResult {
  message?: string
  name?: string
  brandName?: string
  categoryId?: number
  purchaseDate?: string
  warrantyMonths?: number
  expiryDate?: string
  notes?: string
  ocrRawText?: string
  extractedJson?: Record<string, unknown>
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

export interface AppConfig {
  platform: string
  latestVersion: string
  latestBuild: number
  minVersion: string
  minBuild: number
  forceUpdate: boolean
  softUpdate: boolean
  updateRequired: boolean
  title?: string
  message?: string
  storeUrl?: string
  releaseNotes?: string
}

export type ExpiryStatus = 'expired' | 'expiringSoon' | 'active'

export interface ApiErrorBody {
  message?: string
  error?: string
}
