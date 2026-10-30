/**
 * Client HTTP centralisé.
 *
 * Règle du test technique : AUCUN appel fetch directement dans les composants.
 * Tous les endpoints passent par ce module, qui gère :
 * - l'URL de base et les en-têtes,
 * - un timeout via AbortController,
 * - des erreurs typées (ApiError) exploitables par l'UI,
 * - la sérialisation JSON.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'https://fakestoreapi.com'

const REQUEST_TIMEOUT_MS = 10_000

/** Erreur normalisée pour tous les échecs réseau / HTTP. */
export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new ApiError(`La requête a échoué (code ${response.status}).`, response.status)
    }

    return (await response.json()) as T
  } catch (error) {
    // On laisse remonter nos propres erreurs telles quelles.
    if (error instanceof ApiError) throw error

    // Requête interrompue par le timeout.
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Le serveur met trop de temps à répondre. Réessayez.')
    }

    // Erreur réseau (hors ligne, DNS, CORS…).
    throw new ApiError('Impossible de contacter le serveur. Vérifiez votre connexion.')
  } finally {
    window.clearTimeout(timeoutId)
  }
}
