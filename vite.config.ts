import { Plugin, defineConfig } from "vite";

import { createHtmlPlugin } from "vite-plugin-html";
import { VitePWA } from "vite-plugin-pwa";

import * as mdi from "@mdi/js";
import { manifest } from "./manifest";

import { themes } from "./src/theme-data";

export default defineConfig(({ command }) => ({
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          ...mdi,
          COMMAND: command,
          DESCRIPTION: manifest.description,
          TITLE: manifest.name,
          BASE_URL: "https://othello-rust.web.app",
        },
      },
      minify: { keepClosingSlash: false },
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
    modulepreloadPlugin({ regex: /worker-[0-9a-f]+\.js$/ }),
  ],
  build: {
    target: "esnext",
    modulePreload: { polyfill: false },
    sourcemap: true,
  },
  define: {
    __THEME_DATA__: JSON.stringify(themes, undefined, 2),
  },
}));

function modulepreloadPlugin({ regex }: { regex: RegExp }): Plugin {
  let baseUrl: string;

  return {
    name: "modulepreload",

    configResolved({ base }) {
      baseUrl = base;
    },

    transformIndexHtml(html, { bundle }) {
      return Object.values(bundle ?? {})
        .filter((chunk) => regex.test(chunk.fileName))
        .map((chunk) => ({
          tag: "link",
          attrs: { rel: "modulepreload", href: baseUrl + chunk.fileName },
          injectTo: "head",
        }));
    },
  };
}
