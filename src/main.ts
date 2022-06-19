import * as Comlink from "comlink";
import { htmlPlayer } from "./game/html-player";
import "./settings";
import type { PlayFunction } from "./worker";
import type { Depth } from "./game/alpha-beta";

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

const play = Comlink.wrap<PlayFunction>(Comlink.proxy(worker));

const player = Comlink.proxy(htmlPlayer);

const difficulty = parseInt(localStorage.getItem("difficulty") || "2") as Depth;

play(player, difficulty);

import { registerSW } from "virtual:pwa-register";

registerSW();
