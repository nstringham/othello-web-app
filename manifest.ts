import { ManifestOptions } from "vite-plugin-pwa";

export const manifest: Partial<ManifestOptions> = {
  name: "Othello",
  short_name: undefined,
  description: "A game of Othello",
  id: "othello-web-app",
  background_color: "#008000",
  theme_color: "#008000",
  categories: ["game"],
  icons: getIcons(),
};

function getIcons() {
  const purposes = ["any", "maskable"];
  const sizes = ["192", "512"];
  const types = ["png", "webp"];

  const icons: { src: string; sizes: string; type: string; purpose: string }[] = [];
  for (const purpose of purposes) {
    for (const type of types) {
      for (const size of sizes) {
        icons.push({
          src: `icons/${purpose}-${size}.${type}`,
          sizes: `${size}x${size}`,
          type: `image/${type}`,
          purpose: purpose,
        });
      }
    }
    icons.push({
      src: `icons/${purpose}.svg`,
      sizes: "any",
      type: "image/svg+xml",
      purpose,
    });
  }

  return icons;
}
