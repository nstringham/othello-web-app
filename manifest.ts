import type { ImageResource, WebAppManifest } from "web-app-manifest";

export const manifest: WebAppManifest & { id: string } = {
  name: "Othello",
  description: "Play Othello against an AI with this beautiful modern web app.",
  id: "othello-web-app",
  background_color: "#121212",
  theme_color: "#121212",
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
};
