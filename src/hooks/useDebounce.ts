import { useEffect, useState } from 'react'

/**
 * Retourne `value` uniquement après `delay` ms sans nouvelle modification.
 *
 * Utilisation dans le catalogue : la saisie met à jour l'input immédiatement,
 * mais le filtrage ne s'exécute qu'après 300 ms d'inactivité. Cela évite de
 * recalculer / re-rendre la grille à chaque frappe.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedValue(value), delay)

    // Si la valeur change avant la fin du délai, on annule le timer précédent.
    return () => window.clearTimeout(timeoutId)
  }, [value, delay])

  return debouncedValue
}
