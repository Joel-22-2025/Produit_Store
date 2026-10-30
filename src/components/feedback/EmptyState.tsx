import { SearchX, type LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  /** Icône affichée (par défaut : loupe barrée). */
  icon?: LucideIcon
}

/** Affiché quand une liste est vide (recherche, panier, favoris…). */
export function EmptyState({
  title = 'Aucun produit trouvé',
  description = 'Essayez de modifier votre recherche ou de choisir une autre catégorie.',
  actionLabel,
  onAction,
  icon: Icon = SearchX,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>

      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
