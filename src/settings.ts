import { showDialog } from "./utils";

const settingsButton = document.getElementById("settings-button") as HTMLButtonElement;
const settingsDialog = document.getElementById("settings-dialog") as HTMLDialogElement;

{
  const difficultySelector = settingsDialog.querySelector("#difficulty-input") as HTMLInputElement;
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
}

{
  const enableHintsCheckbox = settingsDialog.querySelector("#enable-hints-input") as HTMLInputElement;
  const enableHints = localStorage.getItem("enable-hints") === "true";

  enableHintsCheckbox.checked = enableHints;
  document.documentElement.classList.toggle("hints-enabled", enableHints);

  enableHintsCheckbox.addEventListener("change", () => {
    localStorage.setItem("enable-hints", String(enableHintsCheckbox.checked));
    document.documentElement.classList.toggle("hints-enabled", enableHintsCheckbox.checked);
  });
}

async function showSettings() {
  await showDialog(settingsDialog);
  settingsDialog.close();
}

settingsButton.addEventListener("click", showSettings);
