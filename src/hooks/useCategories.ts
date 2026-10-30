import { useQuery } from '@tanstack/react-query'

import { getCategories } from '@/api/products'

export const categoryKeys = {
  all: ['categories'] as const,
}

/** Charge les catégories. Le cache est partagé avec toutes les pages. */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: getCategories,
  })
}
