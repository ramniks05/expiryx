import { useEffect, useState } from 'react'
import { Download, Share, Smartphone, X } from 'lucide-react'
import { AppLogo } from './AppLogo'
import {
  clearInstallUrlParam,
  dismissInstallPrompt,
  isAndroid,
  isInstallPromptDismissed,
  isIos,
  isMobileDevice,
  isStandalone,
  wantsInstallFromUrl,
} from '../lib/pwaInstall'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function AddToHomeScreenPrompt() {
  const [open, setOpen] = useState(false)
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    if (isStandalone() || isInstallPromptDismissed()) return

    const fromLanding = wantsInstallFromUrl()
    if (fromLanding) {
      clearInstallUrlParam()
      if (isMobileDevice()) setOpen(true)
    }
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      if (!isStandalone() && !isInstallPromptDismissed()) setOpen(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const close = () => {
    dismissInstallPrompt()
    setOpen(false)
  }

  const installAndroid = async () => {
    if (!deferred) return
    setInstalling(true)
    try {
      await deferred.prompt()
      const { outcome } = await deferred.userChoice
      if (outcome === 'accepted') {
        setDeferred(null)
        setOpen(false)
        return
      }
    } finally {
      setInstalling(false)
    }
  }

  if (!open || isStandalone()) return null

  const ios = isIos()
  const android = isAndroid()

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
      style={{ background: 'rgba(1, 26, 29, 0.55)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-title"
    >
      <div
        className="safe-bottom safe-x w-full max-w-md rounded-t-[var(--radius-card)] p-5 sm:rounded-[var(--radius-card)] sm:m-4"
        style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-card-lg)' }}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <AppLogo size={48} />
            <div>
              <h2 id="install-title" className="app-title text-base">
                Add ExpiryX to Home Screen
              </h2>
              <p className="app-subtitle mt-0.5">Open like an app — fast access anytime.</p>
            </div>
          </div>
          <button type="button" onClick={close} className="btn-text shrink-0 p-1" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {android && deferred ? (
          <button type="button" onClick={installAndroid} disabled={installing} className="btn-filled">
            <Download size={16} />
            {installing ? 'Installing...' : 'Install on Home Screen'}
          </button>
        ) : android ? (
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Waiting for install option… If no button appears, open browser menu and choose{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>Install app</strong>.
          </p>
        ) : ios ? (
          <ol className="space-y-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <li className="flex items-start gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
              >
                <Share size={16} />
              </span>
              <span>
                Tap <strong style={{ color: 'var(--color-text-primary)' }}>Share</strong> in Safari&apos;s bottom bar
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
              >
                +
              </span>
              <span>
                Scroll and tap <strong style={{ color: 'var(--color-text-primary)' }}>Add to Home Screen</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: 'var(--color-primary-12)', color: 'var(--color-primary)' }}
              >
                <Smartphone size={16} />
              </span>
              <span>
                Tap <strong style={{ color: 'var(--color-text-primary)' }}>Add</strong> — ExpiryX will appear on your
                home screen
              </span>
            </li>
          </ol>
        ) : (
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Use your browser menu to <strong style={{ color: 'var(--color-text-primary)' }}>Install app</strong> or{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>Add to Home Screen</strong> for the best experience.
          </p>
        )}

        <button type="button" onClick={close} className="btn-outlined mt-4">
          Continue in browser
        </button>
      </div>
    </div>
  )
}
