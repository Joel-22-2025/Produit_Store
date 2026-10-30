import { useQuery } from '@tanstack/react-query'

import { getProducts } from '@/api/products'

/** Clés de cache centralisées : évite les fautes de frappe et les doublons. */
export const productKeys = {
  all: ['products'] as const,
  detail: (id: string | number) => ['products', String(id)] as const,
}

/**
 * Charge la liste complète des produits.
 * TanStack Query met le résultat en cache, gère isLoading / isError / refetch.
 */
export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: getProducts,
  })
}
