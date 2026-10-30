import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'

import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  /** Classes du conteneur (dimensions, coins, padding…). */
  className?: string
  /** Classes appliquées à la balise <img>. */
  imageClassName?: string
}

type ImageStatus = 'loading' | 'loaded' | 'error'

/**
 * Image produit avec :
 * - `loading="lazy"` natif (le navigateur charge à l'approche du viewport),
 * - un placeholder animé pendant le chargement,
 * - un fallback visuel si l'URL est cassée (onError).
 *
 * L'état est réinitialisé si `src` change, pour éviter d'afficher
 * brièvement l'ancienne image ou un faux état "loaded".
 */
export function LazyImage({ src, alt, className, imageClassName }: LazyImageProps) {
  const [status, setStatus] = useState<ImageStatus>('loading')

  useEffect(() => {
    setStatus('loading')
  }, [src])

  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {status === 'loading' && (
        <Skeleton className="absolute inset-0 rounded-none" aria-hidden="true" />
      )}

      {status === 'error' ? (
        // Fallback : couleur + icône, aucune requête supplémentaire.
        <div
          role="img"
          aria-label={`${alt} — image indisponible`}
          className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-secondary p-4 text-muted-foreground"
        >
          <ImageOff className="h-8 w-8" aria-hidden="true" />
          <span className="text-center text-xs font-medium">Image indisponible</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cn(
            'h-full w-full object-contain transition-opacity duration-500',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imageClassName
          )}
        />
      )}
    </div>
  )
}
