import { ProductCard } from '@/components/product/ProductCard'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

/**
 * Classes de grille partagées avec les skeletons de chargement :
 * 1 colonne mobile, 2 tablette, 3 desktop, 4 grand écran.
 */
export const productGridClassName =
  'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

interface ProductGridProps {
  products: Product[]
  className?: string
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <div className={cn(productGridClassName, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
