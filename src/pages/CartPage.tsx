import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/format'
import { selectCartCount, selectCartSubtotal, useCartStore } from '@/store/cartStore'

/**
 * Placeholder du panier.
 * On affiche déjà le nombre d'articles et le sous-total du store Zustand afin
 * de vérifier que la persistance localStorage et les compteurs du header
 * fonctionnent. La page complète arrivera à l'étape suivante.
 */
export default function CartPage() {
  const itemCount = useCartStore(selectCartCount)
  const subtotal = useCartStore(selectCartSubtotal)

  return (
    <div className="container-page py-8 sm:py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
        <Link to="/">
          <ArrowLeft />
          Continuer mes achats
        </Link>
      </Button>

      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-card px-6 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ShoppingCart className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">Panier à venir</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          La gestion complète du panier (quantités, suppression, total) sera implémentée à la
          prochaine étape.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 rounded-xl border bg-muted/30 px-4 py-3 text-sm">
          <span>
            <span className="font-semibold text-foreground">{itemCount}</span> article
            {itemCount > 1 ? 's' : ''}
          </span>
          <span className="h-4 w-px bg-border" aria-hidden="true" />
          <span>
            Sous-total :{' '}
            <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
          </span>
        </div>

        <Button asChild className="mt-6">
          <Link to="/">Explorer le catalogue</Link>
        </Button>
      </div>
    </div>
  )
}
