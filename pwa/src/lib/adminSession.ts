import { appPath } from './paths'
import { ADMIN_STORAGE_KEY } from '../store/adminAuthStore'
import { useAdminAuthStore } from '../store/adminAuthStore'

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_STORAGE_KEY)
  useAdminAuthStore.getState().clearSession()
}

export function forceAdminLogout() {
  clearAdminSession()
  window.location.replace(appPath('/admin/login'))
}
