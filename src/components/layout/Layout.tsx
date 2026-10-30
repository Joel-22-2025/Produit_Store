import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { PageLoader } from '@/components/feedback/LoadingState'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Toaster } from '@/components/ui/Toast'

/**
 * Layout racine : header + contenu de la route + footer + toasts.
 *
 * Le <Suspense> entoure uniquement l'Outlet : lors du chargement d'une page
 * lazy, le header et le footer restent visibles (meilleure expérience que
 * remplacer toute la page).
 */
export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Aller au contenu
      </a>

      <Header />

      <main id="contenu" className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}
