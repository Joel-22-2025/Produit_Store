import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpDown,
  PackageSearch,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from 'lucide-react'

import { ApiError } from '@/api/client'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { LoadingState } from '@/components/feedback/LoadingState'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Pagination } from '@/components/ui/Pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { Spinner } from '@/components/ui/Spinner'
import { useCategories } from '@/hooks/useCategories'
import { useDebounce } from '@/hooks/useDebounce'
import { useProducts } from '@/hooks/useProducts'
import { formatCategory, normalizeText } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ProductSort } from '@/types/product'

const PAGE_SIZE = 8
const ALL_CATEGORIES = 'all'

/**
 * Page catalogue.
 *
 * Architecture des données :
 * - useProducts / useCategories : cache + loading/error via TanStack Query,
 * - recherche debouncée 300 ms + filtre catégorie + tri : calcul client-side
 *   dans un seul useMemo (aucun re-render inutile de la grille),
 * - pagination client-side sur les 20 produits (8 par page).
 */
export default function CatalogPage() {
  // --- État des filtres -----------------------------------------------------
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(ALL_CATEGORIES)
  const [sort, setSort] = useState<ProductSort>('default')
  const [page, setPage] = useState(1)

  // La valeur debouncée est celle utilisée pour filtrer.
  const debouncedSearch = useDebounce(search, 300)

  // --- Données API ----------------------------------------------------------
  const { data: products = [], isLoading, isError, error, refetch, isFetching } = useProducts()

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
    isFetching: isCategoriesFetching,
  } = useCategories()

  // --- Filtrage + tri (un seul passage) ------------------------------------
  const filteredProducts = useMemo(() => {
    const searchTerm = normalizeText(debouncedSearch)

    const filtered = products.filter((product) => {
      const matchesCategory = category === ALL_CATEGORIES || product.category === category
      const matchesSearch =
        searchTerm.length === 0 || normalizeText(product.title).includes(searchTerm)

      return matchesCategory && matchesSearch
    })

    // "default" conserve l'ordre renvoyé par l'API.
    if (sort === 'default') return filtered

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating-desc':
          return b.rating.rate - a.rating.rate
        default:
          return 0
      }
    })
  }, [products, category, debouncedSearch, sort])

  // --- Pagination client-side ---------------------------------------------
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const resultsRef = useRef<HTMLDivElement>(null)

  // Toute modification de filtre ramène sur la première page.
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category, sort])

  const hasActiveFilters = search.trim().length > 0 || category !== ALL_CATEGORIES

  const resetFilters = () => {
    setSearch('')
    setCategory(ALL_CATEGORIES)
    setSort('default')
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
    // Remonte en douceur en haut des résultats (le header est sticky).
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : 'Une erreur inattendue est survenue pendant le chargement du catalogue.'

  return (
    <div className="container-page space-y-6 py-6 sm:space-y-8 sm:py-10">
      {/* --- En-tête de page ------------------------------------------------- */}
      {/* <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm sm:p-9">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl"
        />

        <div className="relative max-w-2xl">
          <Badge
            variant="outline"
            className="mb-4 gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Collection 2026
          </Badge>

          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Des essentiels choisis avec <span className="text-gradient">soin.</span>
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Explorez notre sélection de produits, filtrez par catégorie et trouvez la pièce qui vous
            ressemble. Livraison offerte dès 50&nbsp;$ d&apos;achat.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <PackageSearch className="h-4 w-4 text-primary" aria-hidden="true" />
              {isLoading ? '…' : `${products.length} produits`}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-primary" aria-hidden="true" />
              Livraison offerte
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Paiement sécurisé
            </span>
          </div>
        </div>
      </section> */}

      {/* --- Barre de recherche / tri / catégories --------------------------- */}
      <section
        aria-label="Recherche et filtres"
        className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Recherche (debounce 300 ms) */}
          <div className="relative flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              Rechercher un produit
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            {/* --------------------Recherche------------------------ */}
            <Input
              id="catalog-search"
              type="search"
              placeholder="Rechercher un produit par nom…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 pl-10 pr-10 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {/* {search.length > 0 && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Effacer la recherche"
                className="absolute right-2.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )} */}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tri */}
            <Select value={sort} onValueChange={(value) => setSort(value as ProductSort)}>
              <SelectTrigger className="h-11 w-full sm:w-[205px]" aria-label="Trier les produits">
                <span className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <SelectValue placeholder="Trier par" />
                </span>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="default">Pertinence</SelectItem>
                <SelectItem value="price-asc">Prix croissant</SelectItem>
                <SelectItem value="price-desc">Prix décroissant</SelectItem>
                <SelectItem value="rating-desc">Meilleures notes</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-11">
                <RotateCcw />
                Réinitialiser
              </Button>
            )}
          </div>
        </div>

        {/* Catégories : pills issues de l'API, avec loading/error dédiés. */}
        <div className="mt-4 flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Catégories
          </span>

          {isCategoriesLoading ? (
            <div className="flex flex-wrap gap-2" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} className="h-8 w-24 rounded-full" />
              ))}
            </div>
          ) : isCategoriesError ? (
            <div className="flex flex-wrap items-center gap-2 text-sm text-destructive">
              <span>Impossible de charger les catégories.</span>
              <Button
                variant="link"
                size="sm"
                onClick={() => refetchCategories()}
                disabled={isCategoriesFetching}
                className="h-auto p-0"
              >
                Réessayer
              </Button>
            </div>
          ) : (
            <div
              role="group"
              aria-label="Filtrer par catégorie"
              className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
            >
              <Button
                variant={category === ALL_CATEGORIES ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(ALL_CATEGORIES)}
                aria-pressed={category === ALL_CATEGORIES}
                className="shrink-0 rounded-full"
              >
                Toutes
              </Button>

              {categories.map((categoryName) => (
                <Button
                  key={categoryName}
                  variant={category === categoryName ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCategory(categoryName)}
                  aria-pressed={category === categoryName}
                  className="shrink-0 rounded-full"
                >
                  {formatCategory(categoryName)}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- Résultats ------------------------------------------------------- */}
      <section aria-label="Résultats du catalogue" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {isLoading ? (
              'Chargement des produits…'
            ) : (
              <>
                <span className="font-semibold text-foreground">{filteredProducts.length}</span>{' '}
                produit{filteredProducts.length > 1 ? 's' : ''}
                {hasActiveFilters ? ' correspondant à vos critères' : ' au total'}
              </>
            )}
            {isFetching && !isLoading && (
              <span className="ml-2 inline-flex items-center gap-1.5 text-xs">
                <Spinner size={12} /> Actualisation…
              </span>
            )}
          </p>

          {filteredProducts.length > 0 && (
            <p className="text-xs text-muted-foreground">{PAGE_SIZE} produits par page</p>
          )}
        </div>

        <div ref={resultsRef} className="scroll-mt-24">
          {isLoading ? (
            <LoadingState count={PAGE_SIZE} />
          ) : isError ? (
            <ErrorState
              title="Impossible de charger le catalogue"
              description={errorMessage}
              onRetry={() => refetch()}
              isRetrying={isFetching}
            />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="Aucun produit ne correspond"
              description={
                hasActiveFilters
                  ? 'Essayez un autre mot-clé ou sélectionnez une autre catégorie.'
                  : 'Le catalogue est momentanément vide. Revenez plus tard.'
              }
              actionLabel={hasActiveFilters ? 'Réinitialiser les filtres' : undefined}
              onAction={hasActiveFilters ? resetFilters : undefined}
            />
          ) : (
            <div className={cn('space-y-6')}>
              <ProductGrid products={paginatedProducts} />
              <Pagination
                page={currentPage}
                pageCount={pageCount}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
