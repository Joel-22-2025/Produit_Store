# NovaStore — Catalogue (test technique Front-End)

Application e-commerce React réalisée pour un test technique de stage.
Cette première étape couvre **la page catalogue** ; les pages panier et fiche
produit sont des placeholders prêts à être complétés.

## Stack

- **Vite + React 18 + TypeScript**
- **React Router v6** (pages en `React.lazy` + `Suspense`)
- **TanStack Query v5** (cache, loading, error, refetch)
- **Zustand + persist** (panier, favoris, thème clair/sombre)
- **Tailwind CSS + shadcn/ui** (composants accessibles basés sur Radix UI)
- **Vitest + React Testing Library** (configuration de base)
- **ESLint + Prettier**

## Démarrage

```bash
npm install
npm run dev
```

Autres scripts :

```bash
npm run build        # typecheck + build de production
npm run lint
npm run format
npm run test:run
```

## API

Les appels passent par [Fake Store API](https://fakestoreapi.com) :

- `GET /products` → 20 produits
- `GET /products/:id` → détail d'un produit
- `GET /products/categories` → catégories

Tout est centralisé dans `src/api/`. Pour utiliser une autre API, définir
`VITE_API_BASE_URL` dans un fichier `.env.local` :

```env
VITE_API_BASE_URL=https://mon-api.example.com
```

## Fonctionnalités du catalogue

- En-tête avec logo, navigation, compteurs panier/favoris, thème clair/sombre.
- Recherche par nom **debouncée à 300 ms**.
- Filtre par catégorie (pills issues de l'API, option « Toutes »).
- Tri par prix croissant/décroissant et par note.
- Grille responsive 1 / 2 / 3–4 colonnes.
- Images en `loading="lazy"` avec skeleton et fallback si l'image casse.
- Ajout au panier + favori avec toast de confirmation et persistance locale.
- Pagination côté client : 8 produits par page.
- États dédiés : skeleton, erreur + « Réessayer », résultat vide.
- Cache TanStack Query (5 min de fraîcheur) pour éviter les refetch inutiles.

## Structure

```
src/
├── api/          # client HTTP centralisé + endpoints
├── components/   # layout, ui (shadcn), product, feedback
├── hooks/        # useProducts, useCategories, useDebounce, useTheme
├── pages/        # catalogue + placeholders
├── routes/       # routeur lazy
├── store/        # cart, favorites, toast (Zustand)
├── types/        # types métier
└── lib/          # format, utils, queryClient
```

## Reste à faire

1. **Fiche produit** (`ProductDetailPage`) : exploiter `getProductById` via un
   hook `useProduct(id)` (loading/error), galerie, description, quantité,
   ajout au panier.
2. **Panier** (`CartPage`) : liste des lignes, +/−, suppression, sous-total,
   état vide, éventuellement validation de commande.
3. **Page favoris** (bonus) : croiser `ids` du store avec les produits en cache.
4. Tests : ajouter les tests d'intégration des composants (recherche, panier,
   favoris) une fois les pages terminées.
