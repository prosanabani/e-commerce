import { hasBagistoSource, run } from "./lib.mjs";

if (!hasBagistoSource()) {
  console.error("Bagisto is not installed. Run: pnpm bagisto:init");
  process.exit(1);
}

console.warn("This will wipe all Bagisto tables and re-run migrations.\n");
run("php artisan migrate:fresh --no-interaction");
