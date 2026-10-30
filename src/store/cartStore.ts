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

/** Quantité maximale par ligne (garde-fou simple, l'API ne fournit pas de stock). */
export const MAX_CART_QUANTITY = 99

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
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

      /**
       * Ajoute un produit. `quantity` permet à la fiche produit d'ajouter
       * plusieurs exemplaires d'un coup (par défaut : 1).
       */
      addItem: (product, quantity = 1) =>
        set((state) => {
          // On sécurise la valeur : entier entre 1 et MAX_CART_QUANTITY.
          const amount = Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(quantity)))
          const existing = state.items.find((item) => item.id === product.id)

          // Produit déjà présent : on incrémente simplement la quantité.
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: Math.min(MAX_CART_QUANTITY, item.quantity + amount),
                    }
                  : item
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
                quantity: amount,
              },
            ],
          }
        }),

      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      incrementQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, item.quantity + 1) }
              : item
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
