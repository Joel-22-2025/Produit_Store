import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Product } from '@/types/product'

/** Ligne du panier : on ne garde que les champs utiles à l'affichage. */
export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: number) => void
  incrementQuantity: (id: number) => void
  decrementQuantity: (id: number) => void
  clearCart: () => void
}

/**
 * Store panier global (Zustand).
 *
 * `persist` synchronise automatiquement `items` dans localStorage
 * (clé "store-cart") : le panier survit à un rechargement de page.
 * Les actions ne sont pas persistées, seulement l'état.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id)

          // Produit déjà présent : on incrémente simplement la quantité.
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1,
              },
            ],
          }
        }),

      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      incrementQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        })),

      decrementQuantity: (id) =>
        set((state) => ({
          // Une quantité ne descend jamais sous 1 : on supprime via removeItem.
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
          ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'store-cart', version: 1 }
  )
)

// Sélecteurs dérivés : des valeurs primitives, donc pas de re-render inutile.
export const selectCartCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0)
