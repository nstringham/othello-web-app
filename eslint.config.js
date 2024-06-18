// @ts-check

import eslint from "@eslint/js";
import ts from "typescript-eslint";

export default ts.config(
  eslint.configs.recommended,
  ...ts.configs.recommended,
  { ignores: ["dist/", "rust-othello/"] },
  {
    rules: {
      "@typescript-eslint/no-empty-function": "off",
      "no-constant-condition": ["error", { checkLoops: false }],
    },
  },
);
