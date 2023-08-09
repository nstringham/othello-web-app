import type { WebAppManifest } from "web-app-manifest";

export const manifest: WebAppManifest & { b2g_features: object } = {
  name: "Othello",
  short_name: "Othello",
  description:
    "Use the D-pad to select a box to place a disk. Place a disk so that you surround your opponent's disks. " +
    "End the game with the most disks to win. Adjust the difficulty and color theme in the settings.",
  lang: "en-US",
  id: "othello-rust",
  start_url: "/index.html",
  background_color: "#121212",
  theme_color: "#121212",
  display: "standalone",
  orientation: "natural",
  categories: ["games"],
  icons: [
    {
      src: `icons/kaios-56.png`,
      sizes: `56x56`,
      type: `image/png`,
    },
    {
      src: `icons/kaios-112.png`,
      sizes: `112x112`,
      type: `image/png`,
    },
    {
      src: `icons/kaios.svg`,
      sizes: "any",
      type: "image/svg+xml",
    },
  ],
  b2g_features: {
    version: "3.1.2",
    type: "web",
    subtitle: "Play Othello against an AI opponent",
    permissions: {},
    cursor: false,
    origin: "othello-rust",
    developer: {
      name: "Nate Stringham",
      url: "https://github.com/nstringham",
    },
    chrome: {
      statusbar: "overlap",
    },
    focus_color: "#008000",
    dependencies: {
      "ads-sdk": "1.5.8",
    },
  },
};
