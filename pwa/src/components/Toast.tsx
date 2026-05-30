import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  const bg = (type: ToastType) => {
    if (type === 'error') return 'var(--color-danger)'
    if (type === 'success') return 'var(--color-success)'
    return 'var(--color-brand)'
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-[90px] left-4 right-4 z-[100] flex flex-col gap-2 safe-bottom">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-[var(--radius-button)] px-4 py-3 text-sm font-semibold text-white"
            style={{ background: bg(t.type), boxShadow: 'var(--shadow-card-lg)' }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
