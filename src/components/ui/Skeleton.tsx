import * as React from 'react'

import { cn } from '@/lib/utils'

/** Bloc de chargement animé (pulse), utilisé pour les images et les grilles. */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
}

export { Skeleton }
