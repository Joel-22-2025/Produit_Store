import { lazy } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

import { Layout } from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'

// Toutes les pages sont chargées à la demande (code splitting).
// Le <Suspense> se trouve dans le Layout pour conserver header/footer visibles.
const CatalogPage = lazy(() => import('@/pages/CatalogPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const FavoritesPage = lazy(() => import('@/pages/FavoritesPage'))

/** Page 404 minimale (route inconnue). */
// function NotFoundPage() {
//   return (
//     <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
//       <p className="text-sm font-semibold uppercase tracking-widest text-primary">Erreur 404</p>
//       <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Page introuvable</h1>
//       <p className="mt-2 max-w-md text-sm text-muted-foreground">
//         La page que vous cherchez n&apos;existe pas ou a été déplacée.
//       </p>
//       <Button asChild className="mt-6">
//         <Link to="/">Retour au catalogue</Link>
//       </Button>
//     </div>
//   )
// }

/**
 * Routes de l'application (React Router v6).
 * - "/"           → catalogue
 * - "/product/:id"→ fiche produit (placeholder)
 * - "/cart"       → panier (placeholder)
 * - "/favorites"  → favoris (placeholder bonus)
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<CatalogPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
