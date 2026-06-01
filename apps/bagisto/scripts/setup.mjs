import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const marker = path.join(appRoot, "artisan");
const BAGISTO_REPO = "https://github.com/bagisto/bagisto.git";
const BAGISTO_BRANCH = "2.4";

const preserved = new Set([
  "package.json",
  "turbo.json",
  "scripts",
  "README.md",
  ".gitignore",
]);

function run(command, options = {}) {
  console.log(`> ${command}`);
  execSync(command, { stdio: "inherit", cwd: appRoot, ...options });
}

if (existsSync(marker)) {
  console.log("Bagisto is already installed in apps/bagisto.");
  process.exit(0);
}

const tmpDir = path.join(appRoot, ".bagisto-tmp");

console.log(`Cloning Bagisto ${BAGISTO_BRANCH} into apps/bagisto...`);
rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

run(`git clone --depth 1 --branch ${BAGISTO_BRANCH} ${BAGISTO_REPO} .`, {
  cwd: tmpDir,
});

// Drop embedded git metadata so the monorepo owns this tree.
rmSync(path.join(tmpDir, ".git"), { recursive: true, force: true });

for (const entry of readdirSync(tmpDir)) {
  if (preserved.has(entry)) continue;

  const source = path.join(tmpDir, entry);
  const target = path.join(appRoot, entry);

  rmSync(target, { recursive: true, force: true });
  cpSync(source, target, { recursive: true });
}

rmSync(tmpDir, { recursive: true, force: true });

console.log("\nBagisto source installed.");
console.log("Next: pnpm bagisto:postbootstrap");
