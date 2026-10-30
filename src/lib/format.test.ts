import { describe, expect, it } from 'vitest'

import { formatCategory, formatPrice, formatRating, normalizeText } from './format'

// Test de fumée : vérifie que la configuration Vitest fonctionne.
describe('formatPrice', () => {
  it('formate un prix en dollars US', () => {
    expect(formatPrice(109.95)).toBe('$109.95')
    expect(formatPrice(0)).toBe('$0.00')
  })
})

describe('formatRating', () => {
  it('affiche toujours une décimale', () => {
    expect(formatRating(4)).toBe('4.0')
    expect(formatRating(4.56)).toBe('4.6')
  })
})

describe('formatCategory', () => {
  it('traduit les catégories connues de l’API', () => {
    expect(formatCategory("men's clothing")).toBe('Mode homme')
    expect(formatCategory('jewelery')).toBe('Bijoux')
  })

  it('capitalise une catégorie inconnue', () => {
    expect(formatCategory('sports')).toBe('Sports')
  })
})

describe('normalizeText', () => {
  it('ignore la casse, les accents et les espaces superflus', () => {
    expect(normalizeText('  Électronique  ')).toBe('electronique')
  })
})
