import { useEffect, useState } from 'react'
import { ArrowLeft, Check, Minus, Plus, RotateCcw, ShoppingCart, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { ApiError } from '@/api/client'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LazyImage } from '@/components/product/LazyImage'
import { StarRating } from '@/components/product/StarRating'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useProduct } from '@/hooks/useProduct'
import { formatCategory, formatPrice } from '@/lib/format'
import { MAX_CART_QUANTITY, useCartStore } from '@/store/cartStore'
import { pushToast } from '@/store/toastStore'

/** Squelette affiché pendant le chargement de la fiche. */
function ProductDetailSkeleton() {
  return (
    <div className="container-page py-6 sm:py-10" role="status" aria-busy="true">
      <Skeleton className="h-9 w-40" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
      <span className="sr-only">Chargement du produit…</span>
    </div>
  )
}

/**
 * Fiche produit.
 *
 * - `useProduct(id)` gère l'appel API, le cache et les états loading/error.
 * - L'API ne renvoie qu'une seule image : la "galerie" se limite donc à
 *   l'image principale, affichée en grand avec fallback (LazyImage).
 * - Le sélecteur de quantité est local, puis transmis à `addItem` du panier.
 */
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: product, isLoading, isError, error, refetch, isFetching } = useProduct(id)

  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  // Si on navigue vers un autre produit, on repart de la quantité 1.
  useEffect(() => {
    setQuantity(1)
  }, [id])

  if (isLoading) return <ProductDetailSkeleton />

  // Produit absent (id inconnu) ou erreur réseau : même écran avec "Réessayer".
  if (isError || !product) {
    const message =
      error instanceof ApiError ? error.message : 'Ce produit est introuvable ou n’existe plus.'

    return (
      <div className="container-page py-6 sm:py-10">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
          <Link to="/">
            <ArrowLeft />
            Retour au catalogue
          </Link>
        </Button>
        <ErrorState
          title="Impossible de charger ce produit"
          description={message}
          onRetry={isError ? () => refetch() : undefined}
          isRetrying={isFetching}
        />
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
    pushToast({
      variant: 'success',
      title: 'Ajouté au panier',
      description: `${quantity} × ${product.title}`,
    })
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
        <Link to="/">
          <ArrowLeft />
          Retour au catalogue
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* --- Galerie (une seule image fournie par l'API) --- */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-3xl border bg-card p-6 shadow-sm sm:p-10">
            <LazyImage
              src={product.image}
              alt={product.title}
              className="mx-auto aspect-square w-full max-w-md rounded-2xl bg-white p-6 ring-1 ring-black/5"
              imageClassName="drop-shadow-sm"
            />
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Aperçu produit — visuel fourni par la boutique
          </p>
        </div>

        {/* --- Informations produit --- */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{formatCategory(product.category)}</Badge>
            <span className="text-xs text-muted-foreground">Réf. #{product.id}</span>
          </div>

          <h1 className="mt-4 text-balance text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StarRating rate={product.rating.rate} />
            <span className="text-sm text-muted-foreground">{product.rating.count} avis</span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              En stock
            </span>
          </div>

          <p className="mt-5 text-3xl font-extrabold tracking-tight">
            {formatPrice(product.price)}
          </p>

          <div className="mt-6 border-t pt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            {/* Sélecteur de quantité */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantité</span>
              <div className="inline-flex items-center rounded-lg border bg-background">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-r-none"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  aria-label="Diminuer la quantité"
                >
                  <Minus />
                </Button>
                <span
                  className="w-10 text-center text-sm font-semibold"
                  aria-live="polite"
                  aria-label={`Quantité : ${quantity}`}
                >
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-l-none"
                  onClick={() => setQuantity((current) => Math.min(MAX_CART_QUANTITY, current + 1))}
                  disabled={quantity >= MAX_CART_QUANTITY}
                  aria-label="Augmenter la quantité"
                >
                  <Plus />
                </Button>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={handleAddToCart}>
              <ShoppingCart />
              {quantity > 1 ? `Ajouter ${quantity} articles` : 'Ajouter au panier'}
              <span className="opacity-80">· {formatPrice(product.price * quantity)}</span>
            </Button>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Truck className="h-4 w-4 text-primary" aria-hidden="true" />
                Livraison offerte dès 50 $
              </span>
              <span className="inline-flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-primary" aria-hidden="true" />
                Retours sous 30 jours
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
