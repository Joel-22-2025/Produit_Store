import { CheckCircle2, Info, X, XCircle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useToastStore, type ToastVariant } from '@/store/toastStore'

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'text-emerald-600 dark:text-emerald-400',
  error: 'text-destructive',
  info: 'text-primary',
}

const VARIANT_ICONS: Record<ToastVariant, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

/**
 * Conteneur de notifications (monté une seule fois dans le Layout).
 * Les toasts sont empilés en bas à droite sur desktop, centrés sur mobile.
 */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end"
    >
      {toasts.map((toast) => {
        const Icon = VARIANT_ICONS[toast.variant]

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-in items-start gap-3 rounded-xl border bg-card p-4 shadow-lg slide-in-from-bottom-2 fade-in-0"
          >
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', VARIANT_STYLES[toast.variant])} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">{toast.title}</p>
              {toast.description && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Fermer la notification"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
