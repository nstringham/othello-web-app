import { defineConfig } from "vite";

import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

import * as mdi from "@mdi/js";
import { manifest } from "./manifest";

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          ...mdi,
          DESCRIPTION: manifest.description,
          TITLE: manifest.name,
          BASE_URL: "https://othello-rust.web.app",
        },
      },
    }),
    VitePWA({
      manifest,
      includeManifestIcons: false,
      includeAssets: ["favicon.ico", "icons/any.svg"],
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
