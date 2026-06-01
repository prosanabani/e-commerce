import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { appRoot, phpMemoryLimit } from "./lib.mjs";

const insertPatches = [
  {
    file: "vendor/bagisto/bagisto-api/src/Database/Migrations/2026_05_13_130000_align_admin_personal_access_tokens_fks.php",
    marker: "if (DB::getDriverName() === 'pgsql') {",
    insertAfter: "public function up(): void\n    {\n",
    snippet: `        if (DB::getDriverName() === 'pgsql') {
            return;
        }

`,
  },
];

const replacePatches = [
  {
    file: "vendor/bagisto/bagisto-api/src/Console/Commands/InstallApiPlatformCommand.php",
    marker: "-d', 'memory_limit=",
    from: `new Process([
                'php',
                'artisan',`,
    to: `new Process([
                'php',
                '-d', 'memory_limit=${phpMemoryLimit}',
                'artisan',`,
  },
];

let patched = 0;

for (const patch of insertPatches) {
  const target = path.join(appRoot, patch.file);

  if (!existsSync(target)) {
    continue;
  }

  const source = readFileSync(target, "utf8");

  if (source.includes(patch.marker)) {
    continue;
  }

  const index = source.indexOf(patch.insertAfter);

  if (index === -1) {
    console.warn(`Could not patch ${patch.file}`);
    continue;
  }

  const updated =
    source.slice(0, index + patch.insertAfter.length) +
    patch.snippet +
    source.slice(index + patch.insertAfter.length);

  writeFileSync(target, updated);
  patched += 1;
  console.log(`Patched ${patch.file} for PostgreSQL`);
}

for (const patch of replacePatches) {
  const target = path.join(appRoot, patch.file);

  if (!existsSync(target)) {
    continue;
  }

  let source = readFileSync(target, "utf8");

  if (source.includes(patch.marker)) {
    continue;
  }

  if (!source.includes(patch.from)) {
    console.warn(`Could not patch ${patch.file} for PHP memory`);
    continue;
  }

  source = source.replaceAll(patch.from, patch.to);
  writeFileSync(target, source);
  patched += 1;
  console.log(`Patched ${patch.file} for PHP memory`);
}

if (patched === 0) {
  console.log("Bagisto API patches already applied.");
}
