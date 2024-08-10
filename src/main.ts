import { proxy, wrap } from "comlink";
import { htmlPlayer } from "./game/html-player";
import "./settings";
import type { PlayFunction } from "./worker";
import { updateAndRestart } from "./pwa";

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

const play = wrap<PlayFunction>(worker);

const player = proxy(htmlPlayer);

play(player).then(() => {
  const newGameButton = document.querySelector("#new-game") as HTMLButtonElement;
  newGameButton.addEventListener("click", () => {
    updateAndRestart();
  });
  newGameButton.classList.add("show");
});
