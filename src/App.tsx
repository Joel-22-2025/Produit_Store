import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '@/lib/queryClient'
import AppRouter from '@/routes/AppRouter'

/**
 * Racine de l'application : fournit le cache TanStack Query au routeur.
 * Aucun composant classe : uniquement des composants fonction + hooks.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  )
}
