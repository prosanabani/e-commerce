import path from "node:path";
import { fileURLToPath } from "node:url";

import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

import { paraglideConfig } from "./paraglide.config.js";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const nextCompat = (segment: string) =>
  path.resolve(rootDir, "src/lib/next-compat", segment);

export default defineConfig({
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      "next/link": nextCompat("link.tsx"),
      "next/image": nextCompat("image.tsx"),
      "next/navigation": nextCompat("navigation.ts"),
      "next/dynamic": nextCompat("dynamic.tsx"),
      "next/cache": nextCompat("cache.ts"),
      "next/headers": nextCompat("headers.ts"),
      "next/font/google": nextCompat("font.ts"),
      "next/server": nextCompat("server.ts"),
      "next/og": nextCompat("og.ts"),
      "next-auth/react": path.resolve(rootDir, "src/lib/auth/client.tsx"),
    },
  },
  plugins: [
    paraglideVitePlugin(paraglideConfig),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    nitro(),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
});
