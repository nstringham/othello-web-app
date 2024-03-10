import { preventRestart } from "./pwa";
import { showDialog } from "./utils";

const settingsButton = document.getElementById("settings-button") as HTMLButtonElement;
const settingsDialog = document.getElementById("settings") as HTMLDialogElement;

const DIFFICULTY_NAMES = ["Very Easy", "Easy", "Normal", "Hard", "Very Hard"] as const;

const difficultySelector = settingsDialog.querySelector("#difficulty-input") as HTMLInputElement;
const difficultyDisplay = settingsDialog.querySelector("#difficulty-output") as HTMLOutputElement;

function updateDifficultyDisplay() {
  difficultyDisplay.value = DIFFICULTY_NAMES[parseInt(difficultySelector.value)];
}

difficultySelector.addEventListener("input", updateDifficultyDisplay);

const difficultyString = localStorage.getItem("difficulty");

difficultySelector.value = difficultyString ?? "1";

updateDifficultyDisplay();

const difficultyBroadcastChannel = new BroadcastChannel("difficulty");

function sendDifficulty() {
  localStorage.setItem("difficulty", difficultySelector.value);
  difficultyBroadcastChannel.postMessage(parseInt(difficultySelector.value));
}

difficultySelector.addEventListener("change", sendDifficulty);

difficultyBroadcastChannel.addEventListener("message", (event) => {
  if (typeof event.data == "number") {
    difficultySelector.value = event.data.toString();
    updateDifficultyDisplay();
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

import("./elements/theme-selector");

async function showSettings() {
  preventRestart();
  await showDialog(settingsDialog);
}

settingsButton.addEventListener("click", showSettings);

function checkHash() {
  if (location.hash == "#settings") {
    showSettings();
  }
}

window.addEventListener("hashchange", checkHash);

checkHash();
