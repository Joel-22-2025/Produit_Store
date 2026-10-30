import { ArrowLeft, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { selectFavoritesCount, useFavoritesStore } from '@/store/favoritesStore'

/**
 * Placeholder de la page favoris (bonus : le header pointe vers cette route).
 * Les identifiants sont déjà persistés ; il reste à afficher les produits
 * correspondants en croisant le cache TanStack Query.
 */
export default function FavoritesPage() {
  const favoritesCount = useFavoritesStore(selectFavoritesCount)

  return (
    <div className="container-page py-8 sm:py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
        <Link to="/">
          <ArrowLeft />
          Retour au catalogue
        </Link>
      </Button>

      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-card px-6 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-rose-500/10 text-rose-500">
          <Heart className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">Favoris à venir</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Vous avez déjà <span className="font-semibold text-foreground">{favoritesCount}</span>{' '}
          produit{favoritesCount > 1 ? 's' : ''} en favori. La page dédiée sera ajoutée après le
          panier.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Explorer le catalogue</Link>
        </Button>
      </div>
    </div>
  )
}
