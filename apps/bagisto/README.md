# Bagisto Backend

[Laravel eCommerce backend](https://github.com/bagisto/bagisto) for the monorepo storefront (`apps/tanstack-start`).

**Full setup instructions:** see [`setup.md`](../../setup.md) at the repo root.

This project uses **PostgreSQL** and the [Bagisto Headless API](https://headless-doc.bagisto.com/) (`bagisto/bagisto-api`).

## Quick commands

```bash
pnpm bagisto:bootstrap       # clone Bagisto (first time only)
pnpm bagisto:postbootstrap   # PostgreSQL .env + composer install
pnpm --filter @repo/bagisto install:api
pnpm --filter @repo/bagisto generate:storefront-key
pnpm --filter @repo/bagisto dev   # http://localhost:8000
```

PostgreSQL env template: `scripts/env.postgres.example`
