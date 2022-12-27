export class Color {
  constructor(public r: number, public g: number, public b: number) {}

  get hex(): Hex {
    return "#" + [this.r, this.g, this.b].map((x) => x.toString(16).padStart(2, "0")).join("");
  }
}

const black = new Color(0, 0, 0);
const white = new Color(255, 255, 255);

type ThemeConfig = {
  name: string;
  boardBackground: Color;
  boardCells: Color;
  player?: Color;
  ai?: Color;
  accentDark: Color;
  accentLight: Color;
  useLightAccent?: true;
};

const themes = {
  default: {
    name: "Classic",
    boardBackground: new Color(0, 128, 0),
    boardCells: new Color(0, 104, 0),
    accentDark: new Color(0, 104, 0),
    accentLight: new Color(0, 128, 0),
  } satisfies ThemeConfig,

  red: {
    name: "Velvet",
    boardBackground: new Color(160, 8, 0),
    boardCells: new Color(128, 6, 0),
    accentDark: new Color(128, 6, 0),
    accentLight: new Color(190, 16, 0),
  } satisfies ThemeConfig,

  honey: {
    name: "Honey",
    boardBackground: new Color(254, 216, 146),
    boardCells: new Color(252, 174, 30),
    player: new Color(153, 62, 40),
    accentDark: new Color(187, 90, 0),
    accentLight: new Color(252, 174, 30),
    useLightAccent: true,
  } satisfies ThemeConfig,

  oak: {
    name: "Oak",
    boardBackground: new Color(146, 77, 56),
    boardCells: new Color(185, 122, 87),
    player: new Color(103, 48, 80),
    ai: new Color(231, 182, 190),
    accentDark: new Color(146, 77, 56),
    accentLight: new Color(185, 122, 87),
  } satisfies ThemeConfig,

  midnight: {
    name: "Midnight",
    boardBackground: new Color(28, 36, 98),
    boardCells: new Color(46, 54, 114),
    player: new Color(0, 0, 62),
    ai: new Color(248, 245, 214),
    accentDark: new Color(46, 54, 114),
    accentLight: new Color(84, 95, 178),
  } satisfies ThemeConfig,

  glow: {
    name: "Glow",
    boardBackground: new Color(86, 77, 128),
    boardCells: new Color(152, 166, 212),
    player: new Color(68, 52, 79),
    ai: new Color(194, 249, 112),
    accentDark: new Color(86, 77, 128),
    accentLight: new Color(194, 249, 112),
    useLightAccent: true,
  } satisfies ThemeConfig,
} as const;

export type Hex = string;

export type Theme = {
  name: string;
  boardBackground: Hex;
  boardCells: Hex;
  player: Hex;
  ai: Hex;
  accentDark: Hex;
  accentLight: Hex;
  useLightAccent: boolean;
};

export type Themes = { [id in keyof typeof themes]: Theme };

export default (): { data: Themes } => {
  return {
    data: Object.fromEntries(
      (Object.entries(themes) as [keyof Themes, ThemeConfig][]).map(([id, config]): [keyof Themes, Theme] => {
        return [
          id,
          {
            name: config.name,
            boardBackground: config.boardBackground.hex,
            boardCells: config.boardCells.hex,
            player: config.player?.hex ?? black.hex,
            ai: config.ai?.hex ?? white.hex,
            accentDark: config.accentDark.hex,
            accentLight: config.accentLight.hex,
            useLightAccent: config.useLightAccent ?? false,
          },
        ];
      })
    ) as Themes,
  };
};
