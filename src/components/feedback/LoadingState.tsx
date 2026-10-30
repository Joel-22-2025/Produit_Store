import { productGridClassName } from '@/components/product/ProductGrid'
import { Skeleton } from '@/components/ui/Skeleton'
import { Spinner } from '@/components/ui/Spinner'

interface LoadingStateProps {
  /** Nombre de cartes squelette à afficher. */
  count?: number
}

/** Grille de skeletons affichée pendant le chargement des produits. */
export function LoadingState({ count = 8 }: LoadingStateProps) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={productGridClassName}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-2xl border bg-card p-4 shadow-sm">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <Skeleton className="mt-4 h-3.5 w-28" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-14" />
          </div>
          <Skeleton className="mt-3 h-9 w-full rounded-lg" />
        </div>
      ))}
      <span className="sr-only">Chargement des produits…</span>
    </div>
  )
}

/** Fallback de Suspense pour le chargement d'une page lazy. */
export function PageLoader() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Spinner size={32} />
      <p className="text-sm text-muted-foreground">Chargement de la page…</p>
    </div>
  )
}
