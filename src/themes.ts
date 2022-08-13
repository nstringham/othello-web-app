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
    name: "Classic",
    board: new Color(0, 128, 0),
    accent: new Color(0, 128, 0),
  },

  red: {
    name: "Velvet",
    board: new Color(160, 8, 0),
    accent: new Color(190, 16, 0),
  },

  honey: {
    name: "Honey",
    board: new Color(254, 216, 146),
    boardCells: new Color(252, 174, 30),
    player: new Color(153, 62, 40),
    accent: new Color(203, 98, 0),
  },

  oak: {
    name: "Oak",
    board: new Color(146, 77, 56),
    boardCells: new Color(185, 122, 87),
    player: new Color(103, 48, 80),
    ai: new Color(231, 182, 190),
    accent: new Color(146, 77, 56),
  },

  midnight: {
    name: "Midnight",
    board: new Color(28, 36, 98),
    boardCells: new Color(46, 54, 114),
    player: new Color(0, 0, 62),
    ai: new Color(248, 245, 214),
    accent: new Color(46, 54, 114),
  },

  glow: {
    name: "Glow",
    board: new Color(86, 77, 128),
    boardCells: new Color(152, 166, 212),
    player: new Color(68, 52, 79),
    ai: new Color(194, 249, 112),
    accent: new Color(194, 249, 112),
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
