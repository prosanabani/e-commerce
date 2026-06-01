import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const appRoot = path.resolve(__dirname, "..");
export const mysqlEnvTemplate = path.join(__dirname, "env.mysql.example");
export const envPath = path.join(appRoot, ".env");
export const artisanPath = path.join(appRoot, "artisan");
export const installedMarker = path.join(appRoot, "storage", "installed");
export const phpMemoryLimit = process.env.BAGISTO_PHP_MEMORY_LIMIT ?? "512M";

export function phpEnv(extra = {}) {
  return {
    ...process.env,
    ...extra,
  };
}

export function withPhpMemory(command) {
  if (/^php(\.exe)?\s/.test(command)) {
    return command.replace(/^php(\.exe)?\s/, `php -d memory_limit=${phpMemoryLimit} `);
  }

  return command;
}

export function run(command, options = {}) {
  const preparedCommand = withPhpMemory(command);
  console.log(`> ${preparedCommand}`);
  execSync(preparedCommand, {
    stdio: "inherit",
    cwd: appRoot,
    ...options,
    env: phpEnv(options.env),
  });
}

export function runSetup(command, options = {}) {
  return run(command, {
    ...options,
    env: {
      BAGISTO_SETUP: "1",
      ...options.env,
    },
  });
}

export function runCapture(command) {
  return execSync(withPhpMemory(command), {
    cwd: appRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: phpEnv(),
  }).trim();
}

export function parseEnv(content) {
  const values = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");

    if (separator === -1) {
      continue;
    }

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

export function readEnv() {
  if (!existsSync(envPath)) {
    return null;
  }

  return parseEnv(readFileSync(envPath, "utf8"));
}

export function ensureEnvFile() {
  if (existsSync(envPath)) {
    return false;
  }

  copyFileSync(mysqlEnvTemplate, envPath);
  console.log("Created apps/bagisto/.env from scripts/env.mysql.example");
  return true;
}

export function validateEnv(env) {
  const missing = [];

  for (const key of [
    "DB_CONNECTION",
    "DB_HOST",
    "DB_PORT",
    "DB_DATABASE",
    "DB_USERNAME",
  ]) {
    if (!env[key]) {
      missing.push(key);
    }
  }

  if (env.DB_CONNECTION !== "mysql") {
    console.warn(
      "Warning: DB_CONNECTION is not mysql. This monorepo expects MySQL.",
    );
  }

  return missing;
}

export function isBagistoInstalled() {
  return existsSync(installedMarker);
}

export function markBagistoInstalled() {
  mkdirSync(path.join(appRoot, "storage"), { recursive: true });
  writeFileSync(installedMarker, "Bagisto is successfully installed.");
}

export function hasBagistoSource() {
  return existsSync(artisanPath);
}
