import type { Category, Product } from '@/types/product'

import { apiRequest } from './client'

/**
 * Endpoints produits.
 * Ces fonctions sont les seules à connaître les URL de l'API :
 * elles sont consommées exclusivement par les hooks TanStack Query.
 */

/** Récupère les 20 produits du catalogue. */
export function getProducts(): Promise<Product[]> {
  return apiRequest<Product[]>('/products')
}

/** Récupère un produit par son identifiant (utilisé par la future fiche produit). */
export function getProductById(id: string | number): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`)
}

/** Récupère la liste des catégories disponibles. */
export function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>('/products/categories')
}
