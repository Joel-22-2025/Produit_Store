import { QueryClient } from '@tanstack/react-query'

/**
 * Client TanStack Query partagé par toute l'application.
 *
 * - staleTime : les données restent "fraîches" 5 minutes → aucun refetch inutile
 *   lors des navigations ou des re-renders.
 * - gcTime : le cache est conservé 10 minutes après le dernier composant abonné.
 * - retry : une seule nouvelle tentative automatique en cas d'erreur réseau.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
