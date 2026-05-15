import { defineConfig } from "eslint/config";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

import { baseConfig } from "@repo/eslint-config/base";

/**
 * `@param tsconfigRootDir` — Absolute path to the folder that contains `tsconfig.json`
 * (usually `import.meta.dirname` from the package's `eslint.config.mjs`).
 */
export function nestJsLintConfig(tsconfigRootDir: string) {
  return defineConfig(
    {
      ignores: ["dist/**"],
    },
    baseConfig,
    {
      files: ["**/*.ts"],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
      plugins: {
        "simple-import-sort": eslintPluginSimpleImportSort,
      },
      rules: {
        "turbo/no-undeclared-env-vars": "off",
        "@typescript-eslint/await-thenable": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unnecessary-condition": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-enum-comparison": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/unbound-method": "off",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
      },
    },
    {
      files: ["**/*.spec.ts", "test/**/*.ts"],
      languageOptions: {
        globals: globals.jest,
      },
    },
  );
}
