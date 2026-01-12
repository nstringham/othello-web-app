// @ts-check

import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import ts from "typescript-eslint";

export default defineConfig(
  js.configs.recommended,
  ...ts.configs.strict,
  ...ts.configs.stylistic,
  { ignores: ["dist/", "rust-othello/"] },
  {
    rules: {
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/consistent-indexed-object-style": ["error", "index-signature"],
      "no-constant-condition": ["error", { checkLoops: false }],
    },
  },
);
