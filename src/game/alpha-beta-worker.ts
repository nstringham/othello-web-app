import init, { alphaBeta } from "rust-othello";
import * as Comlink from "comlink";

const wasmPromise = init();

async function wrapper(board: Int8Array, location: number, depth: number) {
  await wasmPromise;
  return alphaBeta(board, location, depth);
}

Comlink.expose(wrapper);

export type AlphaBetaFunction = typeof wrapper;
