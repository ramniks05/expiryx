import { apiFetch } from './client'
import type { AuthSession } from '../types'

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
