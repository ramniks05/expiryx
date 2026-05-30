import type { AppConfig } from '../types'

export function ForceUpdatePage() {
  let config: AppConfig | null = null
  try {
    const raw = sessionStorage.getItem('expiryx-force-update')
    if (raw) config = JSON.parse(raw) as AppConfig
  } catch {
    /* ignore */
  }

  return (
    <div className="app-screen flex flex-col items-center justify-center bg-background px-6 text-center safe-top safe-bottom">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl"
        style={{ background: 'var(--color-warning-12)', color: 'var(--color-warning)' }}
      >
        ⬆
      </div>
      <h1 className="app-title mt-4">{config?.title ?? 'Update required'}</h1>
      <p className="app-subtitle mt-2 max-w-sm">
        {config?.message ?? 'Please refresh the page or reinstall the app to continue.'}
      </p>
      {config?.releaseNotes && (
        <p className="app-card mt-4 max-w-sm p-4 text-left text-xs icon-muted">{config.releaseNotes}</p>
      )}
      <button type="button" onClick={() => window.location.reload()} className="btn-filled mt-6 w-auto px-8">
        Refresh app
      </button>
    </div>
  )
}
