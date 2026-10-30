/** Note et nombre d'avis renvoyés par l'API. */
export interface ProductRating {
  rate: number
  count: number
}

/** Produit tel que renvoyé par l'API (Fake Store API). */
export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: ProductRating
}

/** Les catégories sont de simples chaînes dans l'API. */
export type Category = string

/** Options de tri proposées dans le catalogue. */
export type ProductSort = 'default' | 'price-asc' | 'price-desc' | 'rating-desc'
