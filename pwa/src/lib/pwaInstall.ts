export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function isIos(): boolean {
  return (
    /iPad|iPhone|iPod/i.test(navigator.userAgent) &&
    !(window as Window & { MSStream?: unknown }).MSStream
  )
}

export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent)
}

export function isMobileDevice(): boolean {
  return isIos() || isAndroid()
}

const DISMISS_KEY = 'expiryx-install-dismissed'

export function dismissInstallPrompt() {
  sessionStorage.setItem(DISMISS_KEY, '1')
}

export function isInstallPromptDismissed(): boolean {
  return sessionStorage.getItem(DISMISS_KEY) === '1'
}

export function wantsInstallFromUrl(): boolean {
  return new URLSearchParams(window.location.search).get('install') === '1'
}

export function clearInstallUrlParam() {
  const url = new URL(window.location.href)
  if (!url.searchParams.has('install')) return
  url.searchParams.delete('install')
  window.history.replaceState({}, '', url.pathname + url.search + url.hash)
}
