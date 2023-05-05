import { setKey } from "./soft-keys";
import { showDialog } from "./utils";

const settingsDialog = document.getElementById("settings-dialog") as HTMLDialogElement;
const settingsInputs = [...settingsDialog.querySelectorAll<HTMLElement>(".body > *")];

settingsDialog.addEventListener("keydown", (event) => {
  if (!(event.target instanceof HTMLElement)) {
    return;
  }

  if (event.key == "ArrowDown" || event.key == "ArrowUp") {
    const index = settingsInputs.indexOf(event.target.closest(".body > *") as HTMLElement);
    const newIndex = (index + (event.key == "ArrowDown" ? 1 : -1) + settingsInputs.length) % settingsInputs.length;
    const container = settingsInputs[newIndex]?.querySelector("theme-selector")?.shadowRoot ?? settingsInputs[newIndex];
    const input = container.querySelector<HTMLElement>('input:not([type="radio"]), input:checked, select');
    input?.focus({ preventScroll: true });
    settingsInputs[newIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else if (event.key == "Enter") {
    event.target.click();
  } else {
    return;
  }

  event.preventDefault();
});

const difficultySelector = settingsDialog.querySelector("#difficulty-input") as HTMLSelectElement;

const difficultyString = localStorage.getItem("difficulty");

difficultySelector.value = difficultyString ?? "2";

const difficultyBroadcastChannel = new BroadcastChannel("difficulty");

function sendDifficulty() {
  localStorage.setItem("difficulty", difficultySelector.value);
  difficultyBroadcastChannel.postMessage(parseInt(difficultySelector.value));
}

difficultySelector.addEventListener("change", sendDifficulty);

difficultyBroadcastChannel.addEventListener("message", (event) => {
  if (typeof event.data == "number") {
    difficultySelector.value = event.data.toString();
  } else if (event.data == null) {
    sendDifficulty();
  }
});

const enableHintsBroadcastChannel = new BroadcastChannel("enable-hints");

const enableHintsCheckbox = settingsDialog.querySelector("#enable-hints-input") as HTMLInputElement;
const enableHints = localStorage.getItem("enable-hints") === "true";

enableHintsCheckbox.checked = enableHints;
document.documentElement.classList.toggle("hints-enabled", enableHints);

enableHintsCheckbox.addEventListener("change", () => {
  localStorage.setItem("enable-hints", String(enableHintsCheckbox.checked));
  document.documentElement.classList.toggle("hints-enabled", enableHintsCheckbox.checked);
  enableHintsBroadcastChannel.postMessage(enableHintsCheckbox.checked);
});

enableHintsBroadcastChannel.addEventListener("message", (event) => {
  enableHintsCheckbox.checked = event.data;
  document.documentElement.classList.toggle("hints-enabled", event.data);
});

const darkThemeBroadcastChannel = new BroadcastChannel("dark-theme");

const darkThemeCheckbox = settingsDialog.querySelector("#dark-theme-input") as HTMLInputElement;
const darkTheme = localStorage.getItem("dark-theme") === "true";

const themeColorMetaTag = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
function setDarkTheme(darkTheme: boolean) {
  document.documentElement.classList.toggle("light-theme", !darkTheme);
  themeColorMetaTag.content = darkTheme ? "#121212" : "#ffffff";
}

darkThemeCheckbox.checked = darkTheme;
setDarkTheme(darkTheme);
document.documentElement.classList.toggle("light-theme", !darkTheme);

darkThemeCheckbox.addEventListener("change", () => {
  localStorage.setItem("dark-theme", String(darkThemeCheckbox.checked));
  setDarkTheme(darkThemeCheckbox.checked);
  darkThemeBroadcastChannel.postMessage(darkThemeCheckbox.checked);
});

darkThemeBroadcastChannel.addEventListener("message", (event) => {
  darkThemeCheckbox.checked = event.data;
  setDarkTheme(event.data);
});

import("./elements/theme-selector");

async function showSettings() {
  await showDialog(settingsDialog, "done");
  setKey("right", "settings", showSettings, true);
}

setKey("right", "settings", showSettings, true);
