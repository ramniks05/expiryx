import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarClock, Bell, Lock, MessageCircle, ShieldCheck } from 'lucide-react'
import { AppLogo } from '../components/AppLogo'
import { resendOtp, sendOtp, validateSession, verifyOtp } from '../api/auth'
import { ApiError } from '../api/client'
import { useToast } from '../components/Toast'
import { isAuthError } from '../lib/authSession'
import { useAuthStore } from '../store/authStore'
import { normalizeOtp, useWebOtpAutofill } from '../hooks/useWebOtpAutofill'

const RESEND_SECONDS = 60
const OTP_LENGTH = 4

const features = [
  { label: 'Track dates', icon: CalendarClock, tint: 'var(--color-primary)' },
  { label: 'Reminders', icon: Bell, tint: 'var(--color-warning)' },
  { label: 'Private', icon: Lock, tint: 'var(--color-success)' },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const setSession = useAuthStore((s) => s.setSession)
  const session = useAuthStore((s) => s.session)
  const otpInputRef = useRef<HTMLInputElement>(null)
  const lastAutoVerifyOtp = useRef('')
  const loadingRef = useRef(false)

  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [devOtp, setDevOtp] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)

  loadingRef.current = loading

  const applyOtp = useCallback((code: string) => {
    setOtp(normalizeOtp(code, OTP_LENGTH))
  }, [])

  const syncOtpFromDom = useCallback(() => {
    const el = otpInputRef.current
    if (!el) return
    const next = normalizeOtp(el.value, OTP_LENGTH)
    setOtp((prev) => (prev === next ? prev : next))
  }, [])

  useWebOtpAutofill(applyOtp, step === 'otp')

  useEffect(() => {
    if (!session?.accessToken) return

    let cancelled = false
    ;(async () => {
      try {
        await validateSession()
        if (!cancelled) navigate('/app', { replace: true })
      } catch (e) {
        if (e instanceof ApiError && isAuthError(e.status)) return
        if (!cancelled) navigate('/app', { replace: true })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [session, navigate])

  useEffect(() => {
    if (timer <= 0) return
    const id = setInterval(() => setTimer((t) => t - 1), 1000)
    return () => clearInterval(id)
  }, [timer])

  useEffect(() => {
    if (step === 'otp') otpInputRef.current?.focus()
  }, [step])

  // iOS SMS autofill often updates the DOM without firing React onChange.
  useEffect(() => {
    if (step !== 'otp') return
    const el = otpInputRef.current
    if (!el) return

    const onNativeInput = () => syncOtpFromDom()
    el.addEventListener('input', onNativeInput)
    el.addEventListener('change', onNativeInput)
    el.addEventListener('keyup', onNativeInput)

    const poll = window.setInterval(syncOtpFromDom, 200)

    return () => {
      el.removeEventListener('input', onNativeInput)
      el.removeEventListener('change', onNativeInput)
      el.removeEventListener('keyup', onNativeInput)
      window.clearInterval(poll)
    }
  }, [step, syncOtpFromDom])

  const submitVerify = useCallback(
    async (code: string) => {
      if (code.length !== OTP_LENGTH || loadingRef.current) return
      setLoading(true)
      try {
        const res = await verifyOtp(mobile, code)
        setSession({
          id: res.id,
          mobileNumber: res.mobileNumber,
          name: res.name,
          accessToken: res.accessToken,
        })
        navigate('/app', { replace: true })
      } catch (e) {
        lastAutoVerifyOtp.current = ''
        showToast(e instanceof ApiError ? e.message : 'Invalid OTP', 'error')
      } finally {
        setLoading(false)
      }
    },
    [mobile, navigate, setSession, showToast],
  )

  useEffect(() => {
    if (step !== 'otp' || otp.length !== OTP_LENGTH || loadingRef.current) return
    if (lastAutoVerifyOtp.current === otp) return
    lastAutoVerifyOtp.current = otp
    void submitVerify(otp)
  }, [otp, step, loading, submitVerify])

  const validMobile = /^\d{10}$/.test(mobile)

  const handleSendOtp = async () => {
    if (!validMobile) {
      showToast('Enter a valid 10-digit mobile number', 'error')
      return
    }
    setLoading(true)
    lastAutoVerifyOtp.current = ''
    try {
      const res = await sendOtp(mobile)
      setStep('otp')
      setOtp('')
      setTimer(RESEND_SECONDS)
      if (res.otp) {
        setDevOtp(res.otp)
        applyOtp(res.otp)
      }
      showToast('OTP sent successfully', 'success')
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Failed to send OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (timer > 0) return
    setLoading(true)
    lastAutoVerifyOtp.current = ''
    try {
      const res = await resendOtp(mobile)
      setTimer(RESEND_SECONDS)
      if (res.otp) {
        setDevOtp(res.otp)
        applyOtp(res.otp)
      }
      showToast('OTP resent', 'success')
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Failed to resend OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = () => {
    if (otp.length !== OTP_LENGTH) {
      showToast(`Enter ${OTP_LENGTH}-digit OTP`, 'error')
      return
    }
    lastAutoVerifyOtp.current = ''
    void submitVerify(otp)
  }

  return (
    <div className="app-screen bg-background safe-top safe-bottom">
      <div className="app-page">
        <div className="flex flex-col items-center pt-4">
          <AppLogo size={96} />
          <p className="app-subtitle mt-3">Expiry Reminder</p>
        </div>

        <div className="mt-6 grid min-w-0 grid-cols-3 gap-2">
          {features.map(({ label, icon: Icon, tint }) => (
            <div key={label} className="app-card p-3 text-center">
              <Icon size={22} className="mx-auto mb-1" style={{ color: tint }} />
              <div className="text-xs font-semibold" style={{ color: 'var(--color-text-secondary)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="app-card mt-6 p-5">
          <h2 className="app-title">Sign in</h2>
          <p className="app-subtitle mt-1">Enter your mobile number to continue.</p>

          {step === 'phone' ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="app-label">Mobile number</label>
                <div
                  className="mt-1 flex overflow-hidden"
                  style={{ borderRadius: 'var(--radius-input)', border: '1px solid var(--color-border)' }}
                >
                  <span
                    className="flex items-center px-3 text-sm font-semibold"
                    style={{ background: 'var(--color-background-elevated)', color: 'var(--color-text-primary)' }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter your mobile..."
                    className="min-w-0 flex-1 border-0 bg-card px-3 py-3.5 text-base outline-none"
                    style={{ color: 'var(--color-text-primary)' }}
                  />
                </div>
              </div>
              <button type="button" disabled={loading || !validMobile} onClick={handleSendOtp} className="btn-filled">
                <MessageCircle size={16} />
                Send OTP
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div
                className="rounded-[var(--radius-input)] px-3 py-2.5 text-sm"
                style={{ background: 'var(--color-background-elevated)', color: 'var(--color-text-secondary)' }}
              >
                +91 {mobile}
              </div>
              <div>
                <label className="app-label">OTP</label>
                <input
                  ref={otpInputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={OTP_LENGTH}
                  value={otp}
                  onInput={(e) => {
                    lastAutoVerifyOtp.current = ''
                    setOtp(normalizeOtp(e.currentTarget.value, OTP_LENGTH))
                  }}
                  onChange={(e) => {
                    lastAutoVerifyOtp.current = ''
                    setOtp(normalizeOtp(e.target.value, OTP_LENGTH))
                  }}
                  onBlur={syncOtpFromDom}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && otp.length === OTP_LENGTH && !loading) handleVerify()
                  }}
                  placeholder={`${OTP_LENGTH}-digit OTP`}
                  className="app-input mt-1 text-center text-lg tracking-[0.35em]"
                />
              </div>
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <button type="button" disabled={timer > 0 || loading} onClick={handleResend} className="btn-text disabled:opacity-40">
                  {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                </button>
                {devOtp && <span className="status-badge status-badge-expiring">OTP: {devOtp}</span>}
              </div>
              <button type="button" disabled={loading || otp.length !== OTP_LENGTH} onClick={handleVerify} className="btn-filled">
                <ShieldCheck size={16} />
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={() => {
                  lastAutoVerifyOtp.current = ''
                  setStep('phone')
                  setOtp('')
                  setDevOtp(null)
                }}
                className="btn-text mx-auto block w-full text-center"
              >
                Change number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
