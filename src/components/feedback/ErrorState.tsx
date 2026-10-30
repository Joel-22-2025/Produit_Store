import { AlertTriangle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  isRetrying?: boolean
}

/** État d'erreur réutilisable avec action "Réessayer". */
export function ErrorState({
  title = 'Une erreur est survenue',
  description = 'Impossible de charger les données pour le moment.',
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-16 text-center"
    >
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>

      {onRetry && (
        <Button onClick={onRetry} disabled={isRetrying} className="mt-6">
          <RefreshCw className={isRetrying ? 'animate-spin' : undefined} />
          {isRetrying ? 'Nouvelle tentative…' : 'Réessayer'}
        </Button>
      )}
    </div>
  )
}
