import { execSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const port = process.env.BAGISTO_PORT ?? "8000";

if (!existsSync(path.join(appRoot, "artisan"))) {
  console.error("Bagisto is not installed. Run: pnpm bagisto:bootstrap");
  process.exit(1);
}

console.log(`Starting Bagisto at http://localhost:${port}`);

const child = spawn(
  "php",
  ["artisan", "serve", "--host=127.0.0.1", `--port=${port}`],
  {
    cwd: appRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

child.on("exit", (code) => process.exit(code ?? 0));

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
