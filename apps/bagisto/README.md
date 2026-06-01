# Bagisto Backend

[Laravel eCommerce backend](https://github.com/bagisto/bagisto) for the monorepo storefront (`apps/tanstack-start`).

**Full setup:** see [`setup.md`](../../setup.md) at the repo root.

## Quick start

```bash
# 1. Configure database credentials
copy scripts\env.postgres.example .env

# 2. From repo root — one command does everything
pnpm bagisto:init

# 3. Start the backend
pnpm --filter @repo/bagisto dev
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm bagisto:init` | Clone source, composer install, migrate, seed, API, storefront key |
| `pnpm bagisto:migrate` | Pending migrations |
| `pnpm bagisto:seed` | Run seeders |
| `pnpm bagisto:fresh` | `migrate:fresh` (destructive) |
| `pnpm --filter @repo/bagisto dev` | http://localhost:8000 |

PostgreSQL env template: `scripts/env.postgres.example`
