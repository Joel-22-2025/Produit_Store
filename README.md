# NovaStore — Documentation du projet

Application e-commerce React réalisée dans le cadre d'un test technique Front-End.
Le catalogue, la fiche produit et le panier sont fonctionnels. La page favoris
reste un placeholder.

## Stack

- **Vite + React 18 + TypeScript**
- **React Router v6** — routes lazy + Suspense
- **TanStack Query v5** — cache, loading, error, refetch
- **Zustand + persist** — panier, favoris, thème
- **Tailwind CSS + shadcn/ui** — composants accessibles (Radix UI)
- **Vitest + React Testing Library** — configuration de base
- **ESLint + Prettier**

## Démarrage

```bash
npm install
npm run dev
```

| Commande           | Rôle                            |
| ------------------ | ------------------------------- |
| `npm run dev`      | Serveur de développement        |
| `npm run build`    | Typecheck + build de production |
| `npm run lint`     | ESLint                          |
| `npm run format`   | Prettier                        |
| `npm run test:run` | Tests Vitest                    |
| `npm run preview`  | Prévisualisation du build       |

L'API utilisée est [Fake Store API](https://fakestoreapi.com). Pour la changer :

```env
# .env.local
VITE_API_BASE_URL=https://mon-api.example.com
```

---

## Arborescence commentée

```txt
src/
├── api/
│   ├── client.ts              # fetch centralisé : URL de base, timeout, ApiError, JSON
│   └── products.ts            # endpoints : getProducts, getProductById, getCategories
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # logo, navigation, compteurs panier/favoris, thème
│   │   ├── Footer.tsx         # pied de page + stack
│   │   └── Layout.tsx         # header + <Outlet> + footer + toaster + Suspense
│   │
│   ├── ui/                    # composants shadcn/ui (réutilisables)
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Pagination.tsx
│   │   ├── Select.tsx         # Radix Select accessible
│   │   ├── Skeleton.tsx
│   │   ├── Spinner.tsx
│   │   └── Toast.tsx          # rendu des notifications
│   │
│   ├── product/
│   │   ├── LazyImage.tsx      # loading="lazy" + skeleton + fallback image cassée
│   │   ├── ProductCard.tsx    # carte catalogue : favori, panier, lien fiche
│   │   ├── ProductGrid.tsx    # grille responsive (classes partagées)
│   │   └── StarRating.tsx     # note en étoiles + nombre d'avis
│   │
│   └── feedback/
│       ├── ErrorState.tsx     # message d'erreur + bouton Réessayer
│       ├── EmptyState.tsx     # liste vide (recherche, panier…)
│       └── LoadingState.tsx   # skeletons produits + PageLoader (Suspense)
│
├── hooks/
│   ├── useProducts.ts         # useQuery liste + clés de cache products
│   ├── useProduct.ts          # useQuery fiche produit (id)
│   ├── useCategories.ts       # useQuery catégories
│   ├── useDebounce.ts         # debounce 300 ms de la recherche
│   └── useTheme.ts            # thème clair/sombre + localStorage
│
├── lib/
│   ├── format.ts              # formatPrice, formatRating, catégories, normalizeText
│   ├── format.test.ts         # tests unitaires des formatters
│   ├── queryClient.ts         # config TanStack Query (staleTime, retry…)
│   └── utils.ts               # cn() : fusion de classes Tailwind
│
├── pages/
│   ├── CatalogPage.tsx        # recherche + catégories + tri + pagination
│   ├── ProductDetailPage.tsx  # fiche produit : galerie, description, quantité
│   ├── CartPage.tsx           # lignes du panier, quantités, suppression, total
│   └── FavoritesPage.tsx      # placeholder (compteur déjà branché)
│
├── routes/
│   └── AppRouter.tsx          # routes + React.lazy + page 404
│
├── store/
│   ├── cartStore.ts           # panier Zustand persisté (localStorage)
│   ├── favoritesStore.ts      # favoris Zustand persistés
│   └── toastStore.ts          # notifications éphémères
│
├── test/
│   └── setup.ts               # matchers jest-dom pour Vitest
│
├── types/
│   └── product.ts             # Product, ProductRating, Category, ProductSort
│
├── App.tsx                    # QueryClientProvider + AppRouter
├── index.css                  # Tailwind + variables de thème shadcn
└── main.tsx                   # point d'entrée React
```

---

## Où est implémentée chaque fonctionnalité ?

| Fonctionnalité                       | Fichier(s) principal(aux)                                            |
| ------------------------------------ | -------------------------------------------------------------------- |
| Appels API centralisés               | `src/api/client.ts`, `src/api/products.ts`                           |
| Cache / loading / error / refetch    | `src/lib/queryClient.ts`, hooks TanStack Query                       |
| Recherche par nom + debounce 300 ms  | `src/pages/CatalogPage.tsx`, `src/hooks/useDebounce.ts`              |
| Filtre par catégorie                 | `src/pages/CatalogPage.tsx`, `src/hooks/useCategories.ts`            |
| Tri prix / note                      | `src/pages/CatalogPage.tsx`                                          |
| Grille responsive 1/2/3/4 colonnes   | `src/components/product/ProductGrid.tsx`                             |
| Carte produit (prix, badge, étoiles) | `src/components/product/ProductCard.tsx`, `StarRating.tsx`           |
| Image lazy + placeholder + fallback  | `src/components/product/LazyImage.tsx`                               |
| Pagination client-side (8/page)      | `src/pages/CatalogPage.tsx`, `src/components/ui/Pagination.tsx`      |
| États loading / error / empty        | `src/components/feedback/*`, `CatalogPage.tsx`                       |
| Fiche produit (`/product/:id`)       | `src/pages/ProductDetailPage.tsx`, `src/hooks/useProduct.ts`         |
| Sélecteur de quantité                | `ProductDetailPage.tsx` → `cartStore.addItem(product, quantity)`     |
| Panier (`/cart`)                     | `src/pages/CartPage.tsx`, `src/store/cartStore.ts`                   |
| +/- et suppression d'une ligne       | `CartLine` dans `CartPage.tsx` → actions Zustand                     |
| Vidage du panier                     | `CartPage.tsx` → `cartStore.clearCart`                               |
| Sous-total / total                   | `cartStore.selectCartSubtotal`, `CartPage.tsx`                       |
| Compteurs header                     | `Header.tsx` + sélecteurs `selectCartCount` / `selectFavoritesCount` |
| Favoris (ajout/retrait)              | `favoritesStore.ts`, `ProductCard.tsx`                               |
| Page favoris                         | `FavoritesPage.tsx` — **placeholder restant**                        |
| Thème clair/sombre persistant        | `hooks/useTheme.ts`, `index.html` (script anti-flash), `index.css`   |
| Toasts de confirmation               | `store/toastStore.ts`, `components/ui/Toast.tsx`                     |
| Routes lazy + Suspense               | `routes/AppRouter.tsx`, `components/layout/Layout.tsx`               |
| Panier/favoris persistants           | middleware `persist` de Zustand                                      |
| Config tests                         | `vite.config.ts`, `src/test/setup.ts`, `format.test.ts`              |

---

## Flux de données

### Produits (lecture)

```txt
API Fake Store
   ↓
api/products.ts (getProducts / getProductById / getCategories)
   ↓
hooks/useProducts.ts · useProduct.ts · useCategories.ts (TanStack Query)
   ↓
pages/CatalogPage.tsx · ProductDetailPage.tsx
   ↓
components/product/* (affichage, images, notes)
```

- Le cache est partagé : revenir sur une fiche déjà visitée ne refait pas l'appel.
- `staleTime` = 5 minutes, `retry` = 1, pas de refetch au focus.

### Panier / favoris (écriture locale)

```txt
ProductCard / ProductDetailPage
   ↓ addItem(product, quantity)
store/cartStore.ts  ←→ localStorage ("store-cart")
   ↓
Header (compteur) · CartPage (lignes, total)
```

### Thème

```txt
useTheme → classe "dark" sur <html> + localStorage ("store-theme")
index.html → script inline pour appliquer le thème avant le premier paint
```

---

## Détails utiles pour l'entretien

- **Aucun composant classe** : uniquement des fonctions + hooks.
- **Aucun `fetch` dans les composants** : tout passe par `api/`.
- **Pas de duplication** : `ProductGrid` exporte ses classes réutilisées par les
  skeletons ; `EmptyState` accepte une icône ; les sélecteurs Zustand évitent le
  prop drilling.
- **Recherche** : l'input se met à jour immédiatement, le filtrage n'est calculé
  qu'après 300 ms d'inactivité.
- **Pagination** : les 20 produits sont chargés une seule fois, puis découpés
  côté client (8 par page) — aucun appel réseau supplémentaire.
- **Images** : `loading="lazy"` natif + état visuel. En cas d'URL cassée,
  `onError` affiche un fallback (icône + couleur).
- **Accessibilité** : liens/boutons labellisés, `aria-pressed` sur les favoris,
  `aria-live` sur les compteurs/résultats, focus visible, page 404.

---

## Reste à faire

1. **Page favoris** : croiser `favoritesStore.ids` avec les produits du cache,
   afficher une grille, permettre le retrait et gérer l'état vide.
2. **Paiement / commande** : le récapitulatif du panier est prêt, il reste à
   ajouter le formulaire de commande.
3. **Tests d'intégration** : recherche, ajout au panier, quantités, page vide.
4. **Galerie multi-images** : l'API ne fournit qu'une image ; la structure de la
   fiche produit est prête à recevoir un tableau d'images.
