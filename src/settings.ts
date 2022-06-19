import { showDialog } from "./utils";

const settingsButton = document.getElementById("settings-button") as HTMLButtonElement;
const settingsDialog = document.getElementById("settings-dialog") as HTMLDialogElement;
const difficultySelector = settingsDialog.querySelector('input[name="difficulty"]') as HTMLInputElement;

const difficultyString = localStorage.getItem("difficulty");

if (difficultyString == null) {
  localStorage.setItem("difficulty", "2");
  difficultySelector.value = "2";
} else {
  difficultySelector.value = difficultyString;
}

difficultySelector.addEventListener("change", () => {
  localStorage.setItem("difficulty", difficultySelector.value);
});

async function showSettings() {
  await showDialog(settingsDialog);
  settingsDialog.close();
}

settingsButton.addEventListener("click", showSettings);
