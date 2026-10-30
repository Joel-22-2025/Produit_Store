

/** Pied de page commun, volontairement sobre. */
export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container-page flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-fuchsia-500 text-primary-foreground">
            {/* <ShoppingBag className="h-4 w-4" aria-hidden="true" /> */}
            <p>JS</p>
          </span>
          <div>
            <p className="text-sm font-semibold">
              Joel<span className="text-primary">Store</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Ceci est mon footer
            </p>
          </div>
        </div>

        {/* <div className="flex flex-wrap items-center gap-1.5">
          {STACK.map((item) => (
            <Badge key={item} variant="outline" className="bg-background/60 text-muted-foreground">
              {item}
            </Badge>
          ))}
        </div> */}
      </div>
    </footer>
  )
}
