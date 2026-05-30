import { apiFetch, ApiError } from './client'
import { listDocuments } from './documents'
import type { AuthSession } from '../types'
import { isTokenExpired } from '../lib/jwt'
import { useAuthStore } from '../store/authStore'

export async function sendOtp(mobileNumber: string) {
  return apiFetch<{ message: string; otp?: string }>('/api/auth/send-otp', {
    method: 'POST',
    json: { mobileNumber },
  })
}

export async function resendOtp(mobileNumber: string) {
  return apiFetch<{ message: string; otp?: string }>('/api/auth/resend-otp', {
    method: 'POST',
    json: { mobileNumber },
  })
}

export async function verifyOtp(mobileNumber: string, otp: string) {
  return apiFetch<AuthSession & { accessToken: string }>('/api/auth/verify-otp', {
    method: 'POST',
    json: { mobileNumber, otp },
  })
}

export async function updateProfile(userId: number, name: string, email: string) {
  return apiFetch<void>(`/api/auth/profile/${userId}`, {
    method: 'PUT',
    auth: true,
    json: { name, email },
  })
}

/** Returns true when the stored access token is still valid on client and server. */
export async function validateSession() {
  const session = useAuthStore.getState().session
  if (!session?.accessToken || isTokenExpired(session.accessToken)) {
    throw new ApiError(401, 'Session expired')
  }
  await listDocuments({ page: 0, size: 1 })
  return true
}
