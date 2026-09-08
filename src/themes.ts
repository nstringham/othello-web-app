import type { Theme } from "./theme-data";

export const themes = __THEME_DATA__;

const themeDisplay = document.querySelector("#theme-output") as HTMLOutputElement;

export function applyTheme({
  name,
  boardBackground,
  boardCells,
  player,
  ai,
  hint,
  accentDark,
  accentLight,
  useLightAccent,
}: Theme) {
  const variables = {
    "board-background": boardBackground,
    "board-cell": boardCells,
    player,
    ai,
    hint,
    "accent-dark": accentDark,
    "accent-light": accentLight,
    "fab-background": useLightAccent ? accentLight : accentDark,
    "fab-foreground": useLightAccent ? "#000000" : "#ffffff",
  } as const;

  const styles = Object.entries(variables)
    .map(([key, value]) => `--${key}: ${value}`)
    .join(";\n");

  themeDisplay.value = name;

  document.documentElement.style.cssText = styles;
  localStorage.setItem("theme-styles", styles);
}
