import * as Comlink from "comlink";
import { htmlPlayer } from "./game/html-player";
import "./settings";
import type { PlayFunction } from "./worker";

const worker = new Worker(new URL("./worker", import.meta.url), { type: "module" });

const play = Comlink.wrap<PlayFunction>(Comlink.proxy(worker));

const player = Comlink.proxy(htmlPlayer);

play(player);

import { registerSW } from "virtual:pwa-register";

registerSW();
