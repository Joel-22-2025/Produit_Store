import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Fusionne des classes Tailwind conditionnelles.
 * twMerge résout les conflits (ex: "p-2 p-4" => "p-4").
 * Utilisé par tous les composants UI façon shadcn/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
