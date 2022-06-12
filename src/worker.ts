import init from "rust-othello";
import * as Comlink from "comlink";
import { alphaBetaPlayer } from "./game/alpha-beta";
import { Game, Player } from "./game/game";

const wasmPromise = init();

async function play(player: Player) {
  await wasmPromise;
  const game = new Game(player, alphaBetaPlayer);
  await game.play();
}

Comlink.expose(play);

export type PlayFunction = typeof play;
