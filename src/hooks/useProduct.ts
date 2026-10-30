import { useQuery } from '@tanstack/react-query'

import { getProductById } from '@/api/products'
import { productKeys } from '@/hooks/useProducts'

/**
 * Charge un produit par son identifiant.
 *
 * - Même clé de cache que `productKeys.detail` : si la fiche est revisitée,
 *   TanStack Query réutilise les données (pas de nouvel appel réseau).
 * - `enabled` empêche l'appel si l'URL ne contient pas d'id.
 */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: productKeys.detail(id ?? ''),
    queryFn: () => {
      if (!id) throw new Error('Identifiant produit manquant.')
      return getProductById(id)
    },
    enabled: Boolean(id),
  })
}
