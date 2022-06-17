import * as Comlink from "comlink";
import { htmlPlayer } from "./game/html-player";
import type { PlayFunction } from "./worker";
import type { Depth } from "./game/alpha-beta";

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

const play = Comlink.wrap<PlayFunction>(Comlink.proxy(worker));

const player = Comlink.proxy(htmlPlayer);

const newGameDialog = document.getElementById("new-game-dialog") as HTMLDialogElement;

const difficultySelector = newGameDialog.querySelector('input[name="difficulty"]') as HTMLInputElement;

const playButton = newGameDialog.querySelector("button") as HTMLButtonElement;

playButton.addEventListener("click", () => {
  const difficulty = parseInt(difficultySelector.value) as Depth;
  play(player, difficulty);
  newGameDialog.close();
});

newGameDialog.showModal();

import { registerSW } from "virtual:pwa-register";

registerSW();
