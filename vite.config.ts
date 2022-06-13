import { defineConfig } from "vite";

import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

import { manifest } from "./manifest";

export default defineConfig({
  plugins: [
    createHtmlPlugin(),
    VitePWA({
      includeAssets: ["favicon.ico"],
      manifest,
    }),
  ],
  build: {
    target: "esnext",
    polyfillModulePreload: false,
  },
});
