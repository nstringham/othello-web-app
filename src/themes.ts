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
    "accent-dark-20": accentDark + "20",
    "accent-dark-30": accentDark + "30",
    "accent-light": accentLight,
    "accent-light-20": accentLight + "20",
    "accent-light-30": accentLight + "30",
    "fab-background": useLightAccent ? accentLight : accentDark,
    "fab-foreground": useLightAccent ? "#000000" : "#ffffff",
  } as const;

  const styles: string[] = [];
  for (const [key, value] of Object.entries(variables)) {
    styles.push(`--${key}: ${value}`);
  }
  const style = styles.join(";\n");

  themeDisplay.value = name;

  document.documentElement.style.cssText = style;
  localStorage.setItem("theme-styles", style);
}
