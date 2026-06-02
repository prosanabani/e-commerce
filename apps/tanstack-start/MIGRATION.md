# Next.js (`apps/next-headless`) → TanStack Start (`apps/tanstack-start`)

## Route mapping

| Next.js (App Router) | TanStack Start |
| -------------------- | -------------- |
| `(public)/page.tsx` | `routes/_public/index.tsx` |
| `(public)/search/page.tsx` | `routes/_public/search/index.tsx` |
| `(public)/search/[collection]/page.tsx` | `routes/_public/search/$collection.tsx` |
| `(public)/product/[...urlProduct]/page.tsx` | `routes/_public/product/$.tsx` |
| `(public)/[page]/page.tsx` | `routes/_public/$page.tsx` |
| `(public)/customer/login` | `routes/_public/customer/login.tsx` |
| `(public)/customer/register` | `routes/_public/customer/register.tsx` |
| `(public)/customer/forget-password` | `routes/_public/customer/forget-password.tsx` |
| `(public)/success` | `routes/_public/success.tsx` |
| `(checkout)/checkout` | `routes/_checkout/checkout.tsx` |
| `api/graphql` | `routes/api/graphql.ts` (server route) |
| `api/auth/[...nextauth]` | `src/lib/auth/client.tsx` (JWT in localStorage) |
| `api/revalidate` | TODO: `routes/api/revalidate.ts` |

## Removed scaffold routes

- `routes/about.tsx`
- `routes/ui-showcase.tsx`
- Demo `routes/index.tsx`

## Copied from next-headless

- `src/components/**`
- `src/graphql/**`
- `src/store/**`
- `src/types/**`
- `src/utils/**`
- `src/providers/**`
- `src/lib/apollo-client.ts`, `graphql-fetch.ts`
- `public/image/**`
- `hero.ts`, `commerce.css` (from `globals.css`)

## Compatibility layer (`src/lib/next-compat/`)

Vite aliases map `next/link`, `next/image`, `next/navigation`, `next/dynamic`, `next/cache`, `next/headers`, `next/font/google`, `next/server` to shims.

`next-auth/react` → `src/lib/auth/client.tsx` (credentials login against Bagisto GraphQL).

## Environment

Root `.env` (via `pnpm with-env`):

- `VITE_BAGISTO_ENDPOINT`
- `VITE_BAGISTO_STOREFRONT_KEY`

## Remaining work (checklist)

### High priority

- [ ] Run `pnpm install` at repo root and fix TypeScript/build errors
- [ ] Verify `/api/graphql` proxy with cart/checkout mutations
- [ ] Cookie-based guest cart (replace stub `next/headers` cookies on server)
- [ ] SEO: port `generateMetadata` / `opengraph-image` to route `head` callbacks
- [ ] Error boundaries: `routes/_public/not-found`, checkout error UI
- [ ] `utils/bagisto` server fetch without Next `fetch` `next.revalidate` options

### Medium priority

- [ ] SSR loaders for search/product (currently client-fetched on some routes)
- [ ] `api/revalidate` webhook route
- [ ] `robots.txt` / sitemap
- [ ] Paraglide: translate commerce copy; extend `translated-pathnames.ts`
- [ ] Align theme: HeroUI (`commerce.css`) vs `@repo/ui` ThemeProvider

### Low priority / cleanup

- [ ] Remove or archive `apps/next-headless` after parity testing
- [ ] Delete unused `utils/auth.ts` NextAuth options if fully replaced
- [ ] `proxy.ts` middleware → TanStack route `beforeLoad` guards
- [ ] Consolidate duplicate `bagistoFetch` (`utils/bagisto` vs `lib/bagisto/client`)

## Auth migration notes

NextAuth JWT sessions are replaced with a client `SessionProvider` storing Bagisto tokens in `localStorage` (`bagisto-commerce-session`). Login uses the same `CUSTOMER_LOGIN` mutation. Update logout flows to call `signOut()` from `next-auth/react` shim.

## Dev

```bash
# Bagisto API (port 8000)
cd apps/bagisto && php artisan serve

# Storefront
cd apps/tanstack-start && pnpm dev
```

Storefront default: http://localhost:3001
