# Project setup

Bagisto runs independently under `apps/bagisto` (Composer + PHP). This monorepo only manages the TanStack Start frontend and shared packages.

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ^22 | For TanStack / pnpm |
| pnpm | ^10 | `npm i -g pnpm` |
| PHP | 8.2+ | For Bagisto (run separately) |
| Composer | 2.x | For Bagisto (run separately) |
| MySQL | 8.0+ | Database for Bagisto |

---

## 1. Monorepo dependencies

From the repo root:

```bash
pnpm install
```

---

## 2. Bagisto (manual, outside the monorepo)

Run all Bagisto commands from `apps/bagisto`:

```bash
cd apps/bagisto
copy .env.example .env
composer install
php artisan bagisto:install
php artisan serve
```

- Storefront: http://localhost:8000
- Admin: http://localhost:8000/admin

Configure `DB_*` in `apps/bagisto/.env` before installing. See [Bagisto docs](https://devdocs.bagisto.com/) for full setup.

---

## 3. TanStack Start — root `.env`

```bash
copy .env.example .env
```

Point the frontend at your running Bagisto instance:

```env
VITE_BAGISTO_ENDPOINT=http://localhost:8000
VITE_BAGISTO_STOREFRONT_KEY=pk_storefront_xxxxxxxx
```

Generate a storefront API key from the Bagisto admin or API setup if needed.

---

## 4. Run the frontend

From the repo root:

```bash
pnpm --filter @repo/tanstack-start dev
```

Or start all monorepo apps:

```bash
pnpm dev
```

---

## Troubleshooting

**`attribute_translations` doesn't exist / artisan fails on empty database**

Bagisto’s API Platform package inspects models at boot and can query the database before migrations run. If `DB_DATABASE` points at an empty database, set this in `apps/bagisto/.env` before install:

```env
BAGISTO_SKIP_API_PLATFORM=true
```

Then run `php artisan bagisto:install` (or `migrate` + `db:seed`). Set it back to `false` when finished.

**CORS errors from TanStack**  
Confirm `VITE_BAGISTO_ENDPOINT` matches Bagisto’s URL and the storefront key is set in root `.env`.

**Bagisto issues**  
Use standard Laravel/Bagisto commands inside `apps/bagisto`. The monorepo does not manage Bagisto installs or migrations.
