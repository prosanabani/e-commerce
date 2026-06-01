import { execSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const postgresEnvTemplate = path.join(__dirname, "env.postgres.example");

function run(command) {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit", cwd: appRoot });
}

if (!existsSync(path.join(appRoot, "artisan"))) {
  console.error("Run `pnpm bagisto:bootstrap` first.");
  process.exit(1);
}

const envPath = path.join(appRoot, ".env");

if (!existsSync(envPath)) {
  copyFileSync(postgresEnvTemplate, envPath);
  console.log("Created apps/bagisto/.env from scripts/env.postgres.example (PostgreSQL)");
} else if (readFileSync(envPath, "utf8").includes("DB_CONNECTION=mysql")) {
  const env = readFileSync(envPath, "utf8")
    .replace("DB_CONNECTION=mysql", "DB_CONNECTION=pgsql")
    .replace("DB_PORT=3306", "DB_PORT=5432")
    .replace("DB_DATABASE=", "DB_DATABASE=bagisto")
    .replace("DB_USERNAME=", "DB_USERNAME=postgres")
    .replace("DB_PASSWORD=", "DB_PASSWORD=postgres")
    .replace("APP_URL=http://localhost", "APP_URL=http://localhost:8000");
  writeFileSync(envPath, env);
  console.log("Updated apps/bagisto/.env to use PostgreSQL defaults");
}

console.log("\nInstalling PHP dependencies (this may take several minutes)...");
run("composer install --no-interaction");

console.log("\nBagisto post-setup complete.");
console.log("\nNext steps — see setup.md at the repo root.");
