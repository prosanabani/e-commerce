# Project setup

Minimal flow: configure **one** `.env` file for Bagisto, run **one** init command, then start the apps.

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ^22 | For TanStack / pnpm |
| pnpm | ^10 | `npm i -g pnpm` |
| PHP | 8.2+ | Extensions: `pdo_pgsql`, `pgsql`, `openssl`, `mbstring`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo` |
| Composer | 2.x | PHP dependency manager |
| PostgreSQL | 14+ | Database for Bagisto |

Verify PHP PostgreSQL support:

```bash
php -m | findstr pgsql
```

---

## 1. Monorepo dependencies

From the repo root:

```bash
pnpm install
```

---

## 2. Bagisto — configure `.env`

Create the database first (adjust credentials as needed):

```bash
psql -U postgres -c "CREATE DATABASE bagisto;"
```

Copy the PostgreSQL template and edit it:

```bash
copy apps\bagisto\scripts\env.postgres.example apps\bagisto\.env
```

Set at least these values in `apps/bagisto/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=bagisto
DB_USERNAME=postgres
DB_PASSWORD=your-password
```

Optional: `APP_NAME`, `APP_LOCALE`, `APP_CURRENCY`, `APP_URL`.

Default admin after init (unless you override in `.env`):

- Email: `admin@example.com`
- Password: `admin123`

---

## 3. Bagisto — one-command init

From the repo root:

```bash
pnpm bagisto:init
```

This single command:

1. Clones Bagisto source if missing
2. Runs `composer install`
3. Runs `bagisto:install` (migrations, seeders, storage link, admin user)
4. Installs the headless API (`bagisto-api-platform:install`)
5. Generates a storefront API key (if one is not already in `.env`)

Re-run safely after the first install — it only applies pending migrations and API setup.  
Use `pnpm bagisto:init -- --force` for a full reinstall (wipes the database).

---

## 4. TanStack — root `.env`

```bash
copy .env.example .env
```

Set the storefront key printed by `pnpm bagisto:init`:

```env
VITE_BAGISTO_ENDPOINT=http://localhost:8000
VITE_BAGISTO_STOREFRONT_KEY=pk_storefront_xxxxxxxx
```

---

## 5. Run the apps

**Bagisto (backend):**

```bash
pnpm --filter @repo/bagisto dev
```

- Storefront: http://localhost:8000  
- Admin: http://localhost:8000/admin  
- GraphQL: http://localhost:8000/graphql  

**TanStack Start (frontend)** — second terminal:

```bash
pnpm --filter @repo/tanstack-start dev
```

**Both together** (after Bagisto is installed):

```bash
pnpm dev
```

---

## Bagisto maintenance commands

| Command | What it does |
|---------|----------------|
| `pnpm bagisto:init` | First-time setup (or safe re-run) |
| `pnpm bagisto:migrate` | Run pending migrations |
| `pnpm bagisto:seed` | Run database seeders |
| `pnpm bagisto:fresh` | Wipe all tables and re-migrate (destructive) |
| `pnpm --filter @repo/bagisto generate:storefront-key` | Create another API key |
| `pnpm --filter @repo/bagisto dev` | Start Bagisto on :8000 |

Legacy aliases (still work, but prefer `bagisto:init`):

| Command | What it does |
|---------|----------------|
| `pnpm bagisto:bootstrap` | Clone Bagisto source only |
| `pnpm bagisto:postbootstrap` | Same as `bagisto:init` |

---

## Troubleshooting

**`could not connect to server` (PostgreSQL)**  
PostgreSQL is not running, or `DB_*` values in `apps/bagisto/.env` are wrong.

**`pdo_pgsql` / `pgsql` not found**  
Enable the PostgreSQL PHP extension (e.g. uncomment `extension=pdo_pgsql` in `php.ini`).

**Headless API / GraphQL returns 404**  
Re-run `pnpm bagisto:init` or `pnpm --filter @repo/bagisto install:api`.

**CORS errors from TanStack**  
Confirm `VITE_BAGISTO_ENDPOINT` matches Bagisto’s URL and the storefront key is set in root `.env`.

**Elasticsearch / Redis warnings**  
Bagisto may log warnings without them. For local dev, `php artisan serve` is usually enough. For full search features, use Docker Sail: `pnpm --filter @repo/bagisto dev:sail`.
