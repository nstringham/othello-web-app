import init from "rust-othello";
import { expose } from "comlink";
import { alphaBetaPlayer } from "./game/alpha-beta";
import { Game, type Player } from "./game/game";

const wasmPromise = init();

async function play(player: Player) {
  await wasmPromise;
  const game = new Game(player, alphaBetaPlayer);
  await game.play();
}

expose(play);

export type PlayFunction = typeof play;
