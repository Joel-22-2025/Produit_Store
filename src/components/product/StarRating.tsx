import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

interface StarRatingProps {
  rate: number
  count?: number
  className?: string
}

/**
 * Affichage de la note sous forme de 5 étoiles + valeur numérique.
 * Les étoiles sont décoratives ; la note complète est exposée via aria-label.
 */
export function StarRating({ rate, count, className }: StarRatingProps) {
  const filledStars = Math.round(rate)

  return (
    <div
      className={cn('flex items-center gap-1.5', className)}
      role="img"
      aria-label={`Note de ${rate.toFixed(1)} sur 5${count ? `, ${count} avis` : ''}`}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              'h-3.5 w-3.5',
              index < filledStars
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted-foreground/30'
            )}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{rate.toFixed(1)}</span>
      {count !== undefined && <span className="text-xs text-muted-foreground/70">({count})</span>}
    </div>
  )
}
