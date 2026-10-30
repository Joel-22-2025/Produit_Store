import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  ids: number[]
  toggleFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
  clearFavorites: () => void
}

/**
 * Store favoris global (Zustand + persist).
 * On ne stocke que les identifiants produits : les données détaillées
 * restent dans le cache TanStack Query.
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],

      toggleFavorite: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((favoriteId) => favoriteId !== id)
            : [...state.ids, id],
        })),

      isFavorite: (id) => get().ids.includes(id),

      clearFavorites: () => set({ ids: [] }),
    }),
    { name: 'store-favorites', version: 1 }
  )
)

export const selectFavoritesCount = (state: FavoritesState) => state.ids.length
