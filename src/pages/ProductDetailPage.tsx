import { ArrowLeft, PackageOpen } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'

/**
 * Placeholder de la fiche produit.
 * Le routeur charge déjà l'ID : la prochaine étape consistera à utiliser
 * useProduct(id) + le cache TanStack Query pour afficher le détail.
 */
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="container-page py-8 sm:py-10">
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-6">
        <Link to="/">
          <ArrowLeft />
          Retour au catalogue
        </Link>
      </Button>

      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-card px-6 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <PackageOpen className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
          Détail produit à venir
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          La fiche du produit{' '}
          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
            #{id}
          </span>{' '}
          sera implémentée à la prochaine étape : galerie, description, quantité et ajout au panier.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Explorer le catalogue</Link>
        </Button>
      </div>
    </div>
  )
}
