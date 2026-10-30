import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  className?: string
}

/**
 * Pagination client-side du catalogue.
 * Affichée uniquement s'il y a plus d'une page.
 */
export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  if (pageCount <= 1) return null

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Pagination du catalogue"
      className={cn(
        'flex flex-col items-center justify-between gap-3 border-t pt-5 sm:flex-row',
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Page <span className="font-semibold text-foreground">{page}</span> sur {pageCount}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Page précédente"
        >
          <ChevronLeft />
        </Button>

        {pages.map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pageNumber === page ? 'default' : 'ghost'}
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(pageNumber)}
            aria-label={`Page ${pageNumber}`}
            aria-current={pageNumber === page ? 'page' : undefined}
          >
            {pageNumber}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Page suivante"
        >
          <ChevronRight />
        </Button>
      </div>
    </nav>
  )
}
