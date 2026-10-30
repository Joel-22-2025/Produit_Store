import * as React from 'react'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  /** Taille en pixels (par défaut 20). */
  size?: number
}

/** Indicateur de chargement réutilisable. */
export function Spinner({ className, size = 20, ...props }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      aria-hidden="true"
      className={cn('animate-spin text-primary', className)}
      {...props}
    />
  )
}
