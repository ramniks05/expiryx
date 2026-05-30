import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthSession } from '../types'

interface AuthState {
  session: AuthSession | null
  setSession: (session: AuthSession) => void
  updateProfile: (patch: Partial<Pick<AuthSession, 'name' | 'email'>>) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      updateProfile: (patch) =>
        set((state) =>
          state.session ? { session: { ...state.session, ...patch } } : state,
        ),
      clearSession: () => set({ session: null }),
    }),
    { name: 'expiryx-auth' },
  ),
)

export function getAccessToken(): string | null {
  return useAuthStore.getState().session?.accessToken ?? null
}
