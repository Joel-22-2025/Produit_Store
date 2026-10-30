import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { EmptyState } from '@/components/feedback/EmptyState'
import { LazyImage } from '@/components/product/LazyImage'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/format'
import {
  MAX_CART_QUANTITY,
  selectCartCount,
  selectCartSubtotal,
  useCartStore,
  type CartItem,
} from '@/store/cartStore'
import { pushToast } from '@/store/toastStore'

/**
 * Une ligne du panier : image, titre, prix unitaire, quantité et total ligne.
 * Les actions viennent directement du store : aucun prop drilling.
 */
function CartLine({ item }: { item: CartItem }) {
  const incrementQuantity = useCartStore((state) => state.incrementQuantity)
  const decrementQuantity = useCartStore((state) => state.decrementQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  return (
    <li className="flex gap-4 p-4 sm:p-5">
      <Link
        to={`/product/${item.id}`}
        className="shrink-0 self-start rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`Voir ${item.title}`}
      >
        <LazyImage
          src={item.image}
          alt={item.title}
          className="h-20 w-20 rounded-xl bg-white p-2 ring-1 ring-black/5 sm:h-24 sm:w-24"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/product/${item.id}`}
            className="line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-primary"
          >
            {item.title}
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.id)}
            aria-label={`Retirer ${item.title} du panier`}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">{formatPrice(item.price)} / unité</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
          {/* Contrôle de quantité */}
          <div className="inline-flex items-center rounded-lg border bg-background">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => decrementQuantity(item.id)}
              disabled={item.quantity <= 1}
              aria-label={`Diminuer la quantité de ${item.title}`}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span
              className="w-9 text-center text-sm font-semibold"
              aria-live="polite"
              aria-label={`Quantité : ${item.quantity}`}
            >
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => incrementQuantity(item.id)}
              disabled={item.quantity >= MAX_CART_QUANTITY}
              aria-label={`Augmenter la quantité de ${item.title}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
        </div>
      </div>
    </li>
  )
}

/**
 * Page panier.
 * L'état est entièrement géré par Zustand (+ localStorage) : cette page
 * ne fait qu'afficher les lignes et appeler les actions du store.
 */
export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const itemCount = useCartStore(selectCartCount)
  const subtotal = useCartStore(selectCartSubtotal)
  const navigate = useNavigate()

  const handleClearCart = () => {
    clearCart()
    pushToast({ variant: 'info', title: 'Panier vidé' })
  }

  // --- Panier vide ---------------------------------------------------------
  if (items.length === 0) {
    return (
      <div className="container-page py-6 sm:py-10">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
          <Link to="/">
            <ArrowLeft />
            Continuer mes achats
          </Link>
        </Button>

        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Mon panier</h1>
        <div className="mt-6">
          <EmptyState
            icon={ShoppingBag}
            title="Votre panier est vide"
            description="Parcourez le catalogue et ajoutez vos produits préférés pour les retrouver ici."
            actionLabel="Découvrir le catalogue"
            onAction={() => navigate('/')}
          />
        </div>
      </div>
    )
  }

  // --- Panier rempli -------------------------------------------------------
  return (
    <div className="container-page py-6 sm:py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
        <Link to="/">
          <ArrowLeft />
          Continuer mes achats
        </Link>
      </Button>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Mon panier</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {itemCount} article{itemCount > 1 ? 's' : ''} · {items.length} produit
            {items.length > 1 ? 's' : ''} différent{items.length > 1 ? 's' : ''}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearCart}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 />
          Vider le panier
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* Liste des produits */}
        <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-sm">
          {items.map((item) => (
            <CartLine key={item.id} item={item} />
          ))}
        </ul>

        {/* Récapitulatif */}
        <aside className="rounded-2xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="text-base font-semibold">Récapitulatif</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">
                Sous-total ({itemCount} article{itemCount > 1 ? 's' : ''})
              </dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>

            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Livraison</dt>
              <dd className="font-medium text-emerald-600 dark:text-emerald-400">Offerte</dd>
            </div>

            <div className="flex items-center justify-between gap-3 border-t pt-3">
              <dt className="font-semibold">Total</dt>
              <dd className="text-lg font-extrabold">{formatPrice(subtotal)}</dd>
            </div>
          </dl>

          <Button asChild variant="outline" className="mt-5 w-full">
            <Link to="/">Continuer mes achats</Link>
          </Button>

          {/* <p className="mt-3 text-center text-xs text-muted-foreground">
            Le paiement sera ajouté à une prochaine étape.
          </p> */}
        </aside>
      </div>
    </div>
  )
}
