import { Heart, LayoutGrid, Moon, ShoppingBag, ShoppingCart, Sun } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { selectCartCount, useCartStore } from '@/store/cartStore'
import { selectFavoritesCount, useFavoritesStore } from '@/store/favoritesStore'

/** Compteur rond réutilisé pour le panier et les favoris. */
function CountBadge({ count, className }: { count: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold leading-none',
        count > 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

const navLinkBase =
  'inline-flex h-10 items-center gap-2 rounded-lg px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-3'

/**
 * Header commun : navigation, compteurs panier/favoris, thème clair-sombre.
 * Les compteurs viennent directement des stores Zustand : ils se mettent à
 * jour automatiquement sans props drilling.
 */
export function Header() {
  const cartCount = useCartStore(selectCartCount)
  const favoritesCount = useFavoritesStore(selectFavoritesCount)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        {/* Logo / nom de l'application */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="NovaStore — retour au catalogue"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground shadow-lg shadow-primary/25">
            {/* <ShoppingBag className="h-5 w-5" aria-hidden="true" /> */}
            JS
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Joel<span className="text-primary">Store</span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                navLinkBase,
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
              )
            }
          >
            {/* <LayoutGrid className="h-4 w-4" aria-hidden="true" /> */}
            <span className="hidden sm:inline">Catalogue</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              cn(
                navLinkBase,
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
              )
            }
            aria-label={`Panier, ${cartCount} article${cartCount > 1 ? 's' : ''}`}
          >
            {/* <ShoppingCart className="h-4 w-4" aria-hidden="true" /> */}
            <span className="hidden sm:inline">Panier</span>
            <CountBadge count={cartCount} />
          </NavLink>

          {/* Favoris : icône + compteur, navigue vers la page dédiée. */}
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link
              to="/favorites"
              aria-label={`Favoris, ${favoritesCount} article${favoritesCount > 1 ? 's' : ''}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {/* <Heart className="h-5 w-5" aria-hidden="true" /> */}
              <p>Favoris</p>
              <CountBadge
                count={favoritesCount}
                className="absolute -right-0.5 -top-0.5 h-4 min-w-4 px-0.5 text-[9px]"
              />
            </Link>
          </Button>

          {/* Mode sombre / clair (persisté dans localStorage). */}
           <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
            title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </Button> 
        </nav>
      </div>
    </header>
  )
}
