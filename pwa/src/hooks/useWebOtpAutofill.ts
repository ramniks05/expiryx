import { useEffect, useRef } from 'react'

interface OTPCredential extends Credential {
  code: string
}

/** Listen for SMS OTP via Web OTP API (Chrome Android, HTTPS). */
export function useWebOtpAutofill(onCode: (code: string) => void, enabled: boolean) {
  const onCodeRef = useRef(onCode)
  onCodeRef.current = onCode

  useEffect(() => {
    if (!enabled || !('OTPCredential' in window)) return

    const ac = new AbortController()

    navigator.credentials
      .get({
        otp: { transport: ['sms'] },
        signal: ac.signal,
      } as CredentialRequestOptions)
      .then((cred) => {
        const code = (cred as OTPCredential | null)?.code
        if (code) onCodeRef.current(code.replace(/\D/g, '').slice(0, 6))
      })
      .catch(() => {
        /* user dismissed, unsupported SMS format, or timeout */
      })

    return () => ac.abort()
  }, [enabled])
}

export function normalizeOtp(value: string, length: number): string {
  return value.replace(/\D/g, '').slice(0, length)
}
