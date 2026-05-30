export interface CountByKey {
  key: string
  count: number
}

export interface DailyCount {
  date: string
  count: number
}

export interface AdminSession {
  username: string
  accessToken: string
  role: 'ADMIN'
}

export interface AdminOverviewStats {
  totalUsers: number
  verifiedUsers: number
  unverifiedUsers: number
  usersWithName: number
  usersWithEmail: number
  usersWithProfileComplete: number
  newUsersToday: number
  newUsersLast7Days: number
  newUsersLast30Days: number
  totalDocuments: number
  activeDocuments: number
  expiredDocuments: number
  expiringSoonDocuments: number
  documentsWithImage: number
  documentsWithSecondImage: number
  documentsWithOcr: number
  documentsWithWarranty: number
  documentsExpiringNext7Days: number
  documentsExpiringNext30Days: number
  averageDocumentsPerUser: number
  totalCategories: number
  documentsByCategory: CountByKey[]
  totalOtpRequests: number
  otpRequestsLast24Hours: number
  otpRequestsLast7Days: number
  totalNotificationsSent: number
  notificationsByReminderType: CountByKey[]
  notificationsByChannel: CountByKey[]
}

export interface AdminDocumentStats {
  totalDocuments: number
  activeDocuments: number
  expiredDocuments: number
  expiringSoonDocuments: number
  withPurchaseDate: number
  withExpiryDate: number
  withBrandName: number
  withNotes: number
  withImage: number
  withSecondImage: number
  withOcr: number
  withWarrantyMonths: number
  expiringNext7Days: number
  expiringNext30Days: number
  expiredLast30Days: number
  createdLast24Hours: number
  createdLast7Days: number
  createdLast30Days: number
  byCategory: CountByKey[]
  byStatus: CountByKey[]
  createdPerDayLast30Days: DailyCount[]
}

export interface AdminGrowthStats {
  userSignupsPerDay: DailyCount[]
  documentsCreatedPerDay: DailyCount[]
  otpRequestsPerDay: DailyCount[]
  notificationsSentPerDay: DailyCount[]
}

export interface AdminUserSummary {
  id: number
  mobileNumber: string
  name: string | null
  email: string | null
  verified: boolean
  createdAt: string
  updatedAt: string
  documentCount: number
  activeDocuments: number
  expiredDocuments: number
  expiringSoonDocuments: number
}

export interface AdminUsersPage {
  content: AdminUserSummary[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export interface AdminRecentDocument {
  id: number
  name: string
  categoryName: string
  status: 'ACTIVE' | 'EXPIRED' | 'EXPIRING_SOON'
  expiryDate: string | null
  createdAt: string
}

export interface AdminUserDetail {
  id: number
  mobileNumber: string
  name: string | null
  email: string | null
  verified: boolean
  createdAt: string
  updatedAt: string
  totalDocuments: number
  activeDocuments: number
  expiredDocuments: number
  expiringSoonDocuments: number
  documentsWithImage: number
  documentsWithOcr: number
  documentsByCategory: CountByKey[]
  recentDocuments: AdminRecentDocument[]
}

export interface AdminUsersQuery {
  q?: string
  page?: number
  size?: number
  sort?: string
}
