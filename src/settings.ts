import { type } from "os";
import { showDialog } from "./utils";

const settingsButton = document.getElementById("settings-button") as HTMLButtonElement;
const settingsDialog = document.getElementById("settings-dialog") as HTMLDialogElement;

const difficultySelector = settingsDialog.querySelector("#difficulty-input") as HTMLInputElement;
const difficultyString = localStorage.getItem("difficulty");

if (difficultyString == null) {
  difficultySelector.value = "2";
}

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

async function showSettings() {
  await showDialog(settingsDialog);
  settingsDialog.close();
}

settingsButton.addEventListener("click", showSettings);
