import { defineConfig } from "vite";

import { createHtmlPlugin } from "vite-plugin-html";
import generateFile from "vite-plugin-generate-file";

import * as mdi from "@mdi/js";
import { manifest } from "./manifest";

import { themes } from "./src/theme-data";

export default defineConfig(({ mode }) => ({
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          ...mdi,
          DEVELOPMENT: mode == "development",
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
