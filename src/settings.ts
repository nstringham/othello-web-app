import { showDialog } from "./utils";

const settingsButton = document.getElementById("settings-button") as HTMLButtonElement;
const settingsDialog = document.getElementById("settings-dialog") as HTMLDialogElement;

const DIFFICULTY_NAMES = ["Very Easy", "Easy", "Normal", "Hard", "Very Hard", "Extreme"] as const;

const difficultySelector = settingsDialog.querySelector("#difficulty-input") as HTMLInputElement;
const difficultyDisplay = settingsDialog.querySelector("#difficulty-output") as HTMLOutputElement;

function updateDifficultyDisplay() {
  difficultyDisplay.value = DIFFICULTY_NAMES[parseInt(difficultySelector.value)];
}

difficultySelector.addEventListener("input", updateDifficultyDisplay);

const difficultyString = localStorage.getItem("difficulty");

difficultySelector.value = difficultyString ?? "2";

updateDifficultyDisplay();

const difficultyBroadcastChannel = new BroadcastChannel("difficulty");

function sendDifficulty() {
  localStorage.setItem("difficulty", difficultySelector.value);
  difficultyBroadcastChannel.postMessage(parseInt(difficultySelector.value));
}

difficultySelector.addEventListener("change", sendDifficulty);

difficultyBroadcastChannel.onmessage = (event) => {
  if (typeof event.data == "number") {
    difficultySelector.value = event.data.toString();
  } else if (event.data == null) {
    sendDifficulty();
  }
};

const enableHintsCheckbox = settingsDialog.querySelector("#enable-hints-input") as HTMLInputElement;
const enableHints = localStorage.getItem("enable-hints") === "true";

enableHintsCheckbox.checked = enableHints;
document.documentElement.classList.toggle("hints-enabled", enableHints);

enableHintsCheckbox.addEventListener("change", () => {
  localStorage.setItem("enable-hints", String(enableHintsCheckbox.checked));
  document.documentElement.classList.toggle("hints-enabled", enableHintsCheckbox.checked);
});

class Color {
  constructor(public r: number, public g: number, public b: number) {}

  darker() {
    return new Color(Math.max(this.r * 0.8, 0), Math.max(this.g * 0.8, 0), Math.max(this.b * 0.8, 0));
  }

  toString(): string {
    return `rgb(${this.r} ${this.g} ${this.b})`;
  }
}

const black = new Color(0, 0, 0);
const white = new Color(255, 255, 255);

interface Theme {
  board: Color;
  boardCells?: Color;
  player?: Color;
  ai?: Color;
  accent: Color;
}

const themes: { [id: string]: Theme } = {
  classic: {
    board: new Color(0, 128, 0),
    accent: new Color(0, 128, 0),
  },
  red: {
    board: new Color(160, 8, 0),
    accent: new Color(255, 16, 0),
  },
  blue: {
    board: new Color(0, 16, 192),
    accent: new Color(32, 64, 255),
  },
  pink: {
    board: new Color(255, 64, 128),
    boardCells: new Color(226, 44, 106),
    player: new Color(64, 0, 72),
    ai: new Color(255, 255, 255),
    accent: new Color(255, 0, 128),
  },
};

function applyTheme({ board, boardCells, player, ai, accent }: Theme) {
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

  document.documentElement.style.cssText = style;
  localStorage.setItem("theme-styles", style);
}

const themeLabels = document.querySelectorAll<HTMLLabelElement>("#themes>label");

const currentThemeId = localStorage.getItem("theme-id") ?? "classic";

themeLabels.forEach((label) => {
  const input = label.querySelector('input[type="radio"]') as HTMLInputElement;

  const themeId = input.value;
  const theme = themes[themeId];

  label.style.setProperty("--board", theme.board.toString());
  label.style.setProperty("--player", (theme.player ?? black).toString());
  label.style.setProperty("--ai", (theme.ai ?? white).toString());

  input.addEventListener("change", () => {
    localStorage.setItem("theme-id", themeId);
    applyTheme(theme);
  });

  if (currentThemeId == themeId) {
    input.checked = true;
    applyTheme(theme);
  }
});

async function showSettings() {
  await showDialog(settingsDialog);
  settingsDialog.close();
}

settingsButton.addEventListener("click", showSettings);
