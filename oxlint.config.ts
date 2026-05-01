import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "unicorn", "oxc"],
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },
  rules: {
    curly: "warn",
    "no-shadow": "off",
    "unicorn/require-post-message-target-origin": "off",
    "no-underscore-dangle": ["warn", { allow: ["__THEME_DATA__"] }],
  },
});
