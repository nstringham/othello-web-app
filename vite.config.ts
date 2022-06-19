import { defineConfig } from "vite";

import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

import * as mdi from "@mdi/js";
import { manifest } from "./manifest";

export default defineConfig({
  plugins: [
    createHtmlPlugin({ inject: { data: { ...mdi } } }),
    VitePWA({
      manifest,
      includeManifestIcons: false,
      includeAssets: ["favicon.ico", "icons/any.svg"],
      registerType: "autoUpdate",
      workbox: {
        sourcemap: true,
        globPatterns: ["**/*.{html,js,css,wasm,woff2}"],
      },
    }),
  ],
  build: {
    target: "esnext",
    polyfillModulePreload: false,
    sourcemap: true,
  },
});
