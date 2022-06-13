import * as Comlink from "comlink";
import { htmlPlayer } from "./game/html-player";
import type { PlayFunction } from "./worker";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    updateSW(false);
    console.log("will update");
  },
  onOfflineReady() {
    console.log("offline ready");
  },
});

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

const play = Comlink.wrap<PlayFunction>(Comlink.proxy(worker));

const player = Comlink.proxy(htmlPlayer);

play(player);
