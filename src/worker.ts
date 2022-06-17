import init from "rust-othello";
import * as Comlink from "comlink";
import { AlphaBetaPlayer, Depth } from "./game/alpha-beta";
import { Game, Player } from "./game/game";

const wasmPromise = init();

async function play(player: Player, difficulty: Depth) {
  await wasmPromise;
  const game = new Game(player, new AlphaBetaPlayer(difficulty));
  await game.play();
}

Comlink.expose(play);

export type PlayFunction = typeof play;
