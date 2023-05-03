import * as Comlink from "comlink";
import { htmlPlayer } from "./game/html-player";
import type { PlayFunction } from "./worker";
import dialogPolyfill from "dialog-polyfill";
import "./settings";
import { setKey } from "./soft-keys";

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

const play = Comlink.wrap<PlayFunction>(Comlink.proxy(worker));

const player = Comlink.proxy(htmlPlayer);

play(player).then(() => {
  setKey("left", "new game", () => {
    location.reload();
  });
});

for (const dialog of document.querySelectorAll("dialog")) {
  dialogPolyfill.registerDialog(dialog);
}
