import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  appRoot,
  ensureEnvFile,
  hasBagistoSource,
  isBagistoInstalled,
  markBagistoInstalled,
  readEnv,
  run,
  runCapture,
  runSetup,
  validateEnv,
} from "./lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const setupScript = path.join(__dirname, "setup.mjs");
const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const skipApi = args.has("--skip-api");

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

function printNextSteps({ adminEmail, adminPassword, storefrontKey }) {
  console.log("\n--- Bagisto is ready ---");
  console.log("Storefront : http://localhost:8000");
  console.log("Admin      : http://localhost:8000/admin");
  console.log("GraphQL    : http://localhost:8000/graphql");
  console.log(`Admin email: ${adminEmail}`);
  console.log(`Admin pass : ${adminPassword}`);

  if (storefrontKey) {
    console.log(`\nStorefront API key (add to root .env as VITE_BAGISTO_STOREFRONT_KEY):`);
    console.log(storefrontKey);
  }

  console.log("\nStart the backend:");
  console.log("  pnpm --filter @repo/bagisto dev");
  console.log("\nLater commands:");
  console.log("  pnpm bagisto:migrate   # run pending migrations");
  console.log("  pnpm bagisto:seed      # re-run seeders");
  console.log("  pnpm bagisto:fresh     # wipe DB and migrate (destructive)");
}

console.log("Bagisto init — configure apps/bagisto/.env, then run this once.\n");

const createdEnv = ensureEnvFile();

if (createdEnv) {
  fail(
    "Edit apps/bagisto/.env (at least DB_* values), create the PostgreSQL database, then run:\n  pnpm bagisto:init",
  );
}

const env = readEnv();

if (!env) {
  fail("apps/bagisto/.env is missing.");
}

const missing = validateEnv(env);

if (missing.length > 0) {
  fail(
    `Set these in apps/bagisto/.env before continuing: ${missing.join(", ")}`,
  );
}

if (!hasBagistoSource()) {
  console.log("Bagisto source not found — cloning...\n");
  run(`node "${setupScript}"`, { cwd: appRoot });
}

console.log("\nInstalling PHP dependencies (deferring Laravel boot until after migrations)...");
run("composer install --no-interaction --prefer-dist --no-scripts");
run("node ./scripts/patch-bagisto-api.mjs");

if (isBagistoInstalled() && !force) {
  console.log("\nBagisto is already installed.");
  console.log("Running pending migrations and API setup only.");
  console.log("Use --force to run a full reinstall (wipes the database).\n");
  run("php artisan migrate --no-interaction");
} else {
  console.log("\nRunning Bagisto installer (migrations + seed + storage link)...");
  runSetup(
    "php artisan bagisto:install --skip-env-check --skip-admin-creation --skip-github-star --no-interaction",
  );
  markBagistoInstalled();
}

console.log("\nDiscovering Laravel packages...");
runSetup("php artisan package:discover --ansi");

if (!skipApi) {
  console.log("\nInstalling headless API...");
  run("php artisan bagisto-api-platform:install --no-interaction");
}

let storefrontKey = env.STOREFRONT_PLAYGROUND_KEY ?? "";

if (!skipApi && !storefrontKey) {
  console.log("\nGenerating storefront API key...");
  try {
    const output = runCapture(
      'php artisan bagisto-api:generate-key --name="TanStack Storefront" --rate-limit=',
    );
    const match = output.match(/pk_storefront_[A-Za-z0-9]+/);

    if (match) {
      storefrontKey = match[0];
    } else {
      console.log(output);
    }
  } catch {
    console.warn(
      "Could not generate storefront key automatically. Run:\n  pnpm --filter @repo/bagisto generate:storefront-key",
    );
  }
}

const adminEmail = env.BAGISTO_ADMIN_EMAIL || "admin@example.com";
const adminPassword = env.BAGISTO_ADMIN_PASSWORD || "admin123";

printNextSteps({ adminEmail, adminPassword, storefrontKey });
