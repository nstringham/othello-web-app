import * as Comlink from "comlink";
import { htmlPlayer } from "./game/html-player";
import "./settings";
import Worker from "./worker?worker";
import type { PlayFunction } from "./worker";

const play = Comlink.wrap<PlayFunction>(Comlink.proxy(new Worker()));

const player = Comlink.proxy(htmlPlayer);

play(player);

import { registerSW } from "virtual:pwa-register";

registerSW();
