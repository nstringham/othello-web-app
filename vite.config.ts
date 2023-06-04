import { Plugin, defineConfig } from "vite";

import { createHtmlPlugin } from "vite-plugin-html";
import generateFile from "vite-plugin-generate-file";

import * as mdi from "@mdi/js";
import { manifest } from "./manifest";

import { themes } from "./src/theme-data";

export default defineConfig(({ mode, command }) => ({
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          ...mdi,
          DEVELOPMENT: mode == "development",
          COMMAND: command,
          TITLE: manifest.name,
        },
      },
    }),
    generateFile([
      {
        output: "manifest.webmanifest",
        data: manifest,
      },
    ]),
    modulepreloadPlugin({ regex: /worker-[0-9a-f]+\.js$/ }),
  ],
  build: {
    target: "firefox84",
    modulePreload: false,
    rollupOptions,
  },
  worker: {
    rollupOptions,
  },
  define: {
    __THEME_DATA__: JSON.stringify(JSON.stringify(themes)),
  },
}));

const rollupOptions = {
  output: {
    entryFileNames: `assets/[name].js`,
    chunkFileNames: `assets/[name].js`,
    assetFileNames: `assets/[name].[ext]`,
  },
} as const;

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
