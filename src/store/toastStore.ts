import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastState {
  toasts: ToastMessage[]
  push: (toast: Omit<ToastMessage, 'id'>) => void
  dismiss: (id: number) => void
}

let nextToastId = 1

/**
 * Petit store de notifications éphémères (non persisté).
 * Chaque toast disparaît automatiquement après 3,5 s.
 * `pushToast` est utilisable depuis n'importe quel event handler.
 */
export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  push: (toast) => {
    const id = nextToastId++

    // On limite la pile à 3 toasts visibles pour ne pas masquer l'interface.
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }].slice(-3) }))

    window.setTimeout(() => get().dismiss(id), 3500)
  },

  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))

/** API d'appel simplifiée : pushToast({ title, description, variant }). */
export const pushToast = (toast: Omit<ToastMessage, 'id'>) => {
  useToastStore.getState().push(toast)
}
