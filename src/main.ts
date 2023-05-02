import * as Comlink from "comlink";
import { htmlPlayer } from "./game/html-player";
import "./settings";
import type { PlayFunction } from "./worker";
import dialogPolyfill from "dialog-polyfill";

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

const play = Comlink.wrap<PlayFunction>(Comlink.proxy(worker));

const player = Comlink.proxy(htmlPlayer);

play(player).then(() => {
  const newGameButton = document.querySelector("#new-game") as HTMLButtonElement;
  newGameButton.addEventListener("click", () => {
    location.reload();
  });
  newGameButton.classList.add("show");
});

for (const dialog of document.querySelectorAll("dialog")) {
  dialogPolyfill.registerDialog(dialog);
}
