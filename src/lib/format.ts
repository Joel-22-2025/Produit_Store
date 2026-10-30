const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

/** Formate un prix en dollars US : 109.95 => "$109.95". */
export function formatPrice(price: number): string {
  return priceFormatter.format(price)
}

/** Formate une note sur 5 avec une décimale : 4 => "4.0". */
export function formatRating(rate: number): string {
  return rate.toFixed(1)
}

const CATEGORY_LABELS: Record<string, string> = {
  "men's clothing": 'Mode homme',
  "women's clothing": 'Mode femme',
  jewelery: 'Bijoux',
  electronics: 'Électronique',
}

/**
 * Traduit/libelle les catégories de l'API pour l'interface.
 * Les catégories inconnues sont simplement capitalisées.
 */
export function formatCategory(category: string): string {
  if (CATEGORY_LABELS[category]) return CATEGORY_LABELS[category]
  return category.charAt(0).toUpperCase() + category.slice(1)
}

/** Normalise un texte pour la recherche (casse + accents ignorés). */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}
