import init, { alphaBeta, type Heuristic } from "rust-othello";
import { expose } from "comlink";
import type { Depth } from "./alpha-beta";

const wasmPromise = init();

async function wrapper(board: Int8Array, location: number, depth: Depth, heuristic: Heuristic) {
  await wasmPromise;
  return alphaBeta(board, location, depth, heuristic);
}

expose(wrapper);

export type AlphaBetaFunction = typeof wrapper;
