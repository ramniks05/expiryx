import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminSession } from '../types/admin'

export const ADMIN_STORAGE_KEY = 'expiryx-admin-auth'

interface AdminAuthState {
  session: AdminSession | null
  setSession: (session: AdminSession) => void
  clearSession: () => void
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      clearSession: () => {
        localStorage.removeItem(ADMIN_STORAGE_KEY)
        set({ session: null })
      },
    }),
    { name: ADMIN_STORAGE_KEY },
  ),
)

export function getAdminToken(): string | null {
  return useAdminAuthStore.getState().session?.accessToken ?? null
}
