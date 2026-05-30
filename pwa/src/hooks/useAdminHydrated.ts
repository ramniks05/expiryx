import { useEffect, useState } from 'react'
import { useAdminAuthStore } from '../store/adminAuthStore'

export function useAdminHydrated() {
  const [hydrated, setHydrated] = useState(() => useAdminAuthStore.persist.hasHydrated())

  useEffect(() => {
    if (useAdminAuthStore.persist.hasHydrated()) {
      setHydrated(true)
      return
    }
    return useAdminAuthStore.persist.onFinishHydration(() => setHydrated(true))
  }, [])

  return hydrated
}
