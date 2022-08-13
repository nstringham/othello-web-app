export class Color {
  constructor(public r: number, public g: number, public b: number) {}

  darker() {
    return new Color(Math.max(this.r * 0.8, 0), Math.max(this.g * 0.8, 0), Math.max(this.b * 0.8, 0));
  }

  toString(): string {
    return `rgb(${this.r} ${this.g} ${this.b})`;
  }
}

export interface Theme {
  name: string;
  board: Color;
  boardCells?: Color;
  player?: Color;
  ai?: Color;
  accent: Color;
}

export const themes: { [id: string]: Theme } = {
  default: {
    name: "Green",
    board: new Color(0, 128, 0),
    accent: new Color(0, 128, 0),
  },
  red: {
    name: "Red",
    board: new Color(160, 8, 0),
    accent: new Color(190, 16, 0),
  },
  blue: {
    name: "Blue",
    board: new Color(0, 16, 192),
    accent: new Color(32, 64, 255),
  },
  pink: {
    name: "Pink",
    board: new Color(255, 64, 128),
    boardCells: new Color(226, 44, 106),
    player: new Color(64, 0, 72),
    ai: new Color(255, 255, 255),
    accent: new Color(255, 0, 128),
  },
  placeholder1: {
    name: "Placeholder 1",
    board: new Color(128, 128, 128),
    accent: new Color(128, 128, 128),
  },
  placeholder2: {
    name: "Placeholder 2",
    board: new Color(128, 128, 128),
    accent: new Color(128, 128, 128),
  },
};

const themeDisplay = document.querySelector("#theme-output") as HTMLOutputElement;

export function applyTheme({ name, board, boardCells, player, ai, accent }: Theme) {
  const colors = new Map<string, Color>();

  colors.set("board", board);
  colors.set("board-cell", boardCells ?? board.darker());

  if (player != undefined) {
    colors.set("player", player);
  }

  if (ai != undefined) {
    colors.set("ai", ai);
  }

  colors.set("accent", accent);

  const styles: string[] = [];
  for (const [key, { r, g, b }] of colors.entries()) {
    styles.push(`--${key}-rgb: ${r} ${g} ${b}`);
  }
  const style = styles.join(";\n");

  themeDisplay.value = name;

  document.documentElement.style.cssText = style;
  localStorage.setItem("theme-styles", style);
}
