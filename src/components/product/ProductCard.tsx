import { Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import { LazyImage } from '@/components/product/LazyImage'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCategory, formatPrice } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { pushToast } from '@/store/toastStore'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

/**
 * Carte produit du catalogue.
 *
 * Accessibilité / structure :
 * - un <Link> en overlay couvre toute la carte (clic n'importe où → fiche produit),
 * - les boutons (favori, panier) sont au-dessus via z-index et restent cliquables,
 * - le contenu non interactif laisse passer les clics vers l'overlay.
 */
export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const favoriteIds = useFavoritesStore((state) => state.ids)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)

  const isFavorite = favoriteIds.includes(product.id)

  const handleAddToCart = () => {
    addItem(product)
    pushToast({
      variant: 'success',
      title: 'Ajouté au panier',
      description: product.title,
    })
  }

  const handleToggleFavorite = () => {
    toggleFavorite(product.id)
    // pushToast({
    //   variant: 'info',
    //   title: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
    //   description: product.title,
    // })
  }

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gray-200 shadow-sm  hover:shadow-soft">
    {/* <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft"> */}
      {/* Overlay de navigation : rend toute la carte cliquable. */}
      <Link
        to={`/product/${product.id}`}
        aria-label={`Voir le produit : ${product.title}`}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />

      <div className="pointer-events-none relative flex flex-1 flex-col p-4">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-yellow-50 p-5 ring-1 ring-black/5">
          <LazyImage
            src={product.image}
            alt={product.title}
            className="h-full w-full bg-white"
            // imageClassName="transition-transform duration-500 group-hover:scale-105"
          />

          <Badge
            variant="secondary"
            className="absolute left-2 top-2 border-black/5 bg-white/95 text-slate-900 shadow-sm backdrop-blur"
          >
            {formatCategory(product.category)}
          </Badge>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite
                ? `Retirer ${product.title} des favoris`
                : `Ajouter ${product.title} aux favoris`
            }
            className={cn(
              'pointer-events-auto absolute right-2 top-2 z-10 h-9 w-9 rounded-full border border-black/5 bg-white/95 text-slate-600 shadow-sm backdrop-blur hover:bg-white hover:text-rose-500',
              isFavorite && 'text-rose-500 hover:text-rose-600'
            )}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
          </Button>
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-2">
          {/* <StarRating rate={product.rating.rate} count={product.rating.count} /> */}

          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground">
            {product.title}
          </h3>

          <div className="mt-auto flex items-baseline justify-between gap-2 pt-1">
            <span className="text-lg font-bold bg-re text-foreground ">
              Prix: {(product.price)}
            </span>
            {/* <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              En stock
            </span> */}
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={handleAddToCart}
          className="pointer-events-auto relative z-10 mt-3 w-full"
          
        >
          {/* <Plus className="h-4 w-4" /> */}
          Ajouter au panier
        </Button>
      </div>
    </article>
  )
}
