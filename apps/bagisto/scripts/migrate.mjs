import { hasBagistoSource, run } from "./lib.mjs";

if (!hasBagistoSource()) {
  console.error("Bagisto is not installed. Run: pnpm bagisto:init");
  process.exit(1);
}

run("php artisan migrate --no-interaction");
