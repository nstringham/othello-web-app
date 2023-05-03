import { defineConfig } from "vite";

import { createHtmlPlugin } from "vite-plugin-html";
import generateFile from "vite-plugin-generate-file";

import * as mdi from "@mdi/js";
import { manifest } from "./manifest";

import { themes } from "./src/theme-data";

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          ...mdi,
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
    target: "es2021",
    modulePreload: false,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name][extname]",
        chunkFileNames: "[name].js",
      },
    },
  },
  define: {
    __THEME_DATA__: JSON.stringify(JSON.stringify(themes)),
  },
});
