import { getValidMoves, alphaBeta, Heuristic } from "rust-othello";
import { wrap } from "comlink";
import { type Board, type Color, type Player, WHITE } from "./game";
import type { AlphaBetaFunction } from "./alpha-beta-worker";
import { randomNormal } from "./random";

export type Depth = 0 | 1 | 2 | 3 | 4;

export type Difficulty = { depth: Depth; heuristic: Heuristic; standardDeviation: number };

const DIFFICULTIES: readonly Difficulty[] = [
  { depth: 0, heuristic: Heuristic.Score, standardDeviation: 1.5 },
  { depth: 1, heuristic: Heuristic.Coroners, standardDeviation: 1 },
  { depth: 3, heuristic: Heuristic.Coroners, standardDeviation: 0.7 },
  { depth: 3, heuristic: Heuristic.Weights, standardDeviation: 0.6 },
  { depth: 4, heuristic: Heuristic.Weights, standardDeviation: 0.5 },
];

const workers: AlphaBetaFunction[] = [];

if (typeof Worker !== "undefined") {
  for (let i = 0; i < navigator.hardwareConcurrency; i++) {
    const worker = new Worker(new URL("./alpha-beta-worker.ts", import.meta.url), { type: "module" });
    const alphaBeta = wrap<AlphaBetaFunction>(worker);
    workers.push(alphaBeta);
  }
} else {
  workers.push(async (...args) => alphaBeta(...args));
}

let difficulty = 0;

const difficultyBroadcastChannel = new BroadcastChannel("difficulty");

difficultyBroadcastChannel.onmessage = (event) => {
  if (typeof event.data == "number") {
    difficulty = event.data as number;
  }
};

difficultyBroadcastChannel.postMessage(null);

export const alphaBetaPlayer: Player = {
  setColor(color: Color) {
    if (color != WHITE) {
      throw new Error(`unsupported color: ${color}`);
    }
  },

  async getTurn(board: Board) {
    const validMoves = getValidMoves(board);

    const heuristics = new Map<number, Promise<number>>();

    for (const [i, move] of validMoves.entries()) {
      const alphaBeta = workers[i % workers.length];
      const { depth, heuristic, standardDeviation } = DIFFICULTIES[difficulty];
      const heuristicPromise = alphaBeta(board, move, depth, heuristic).then((value) =>
        randomNormal(value, standardDeviation),
      );
      heuristics.set(move, heuristicPromise);
    }

    let bestMove = 0;
    let bestHeuristic = Number.MIN_SAFE_INTEGER;

    for (const [move, heuristic] of heuristics) {
      const value = await heuristic;
      if (value > bestHeuristic) {
        bestHeuristic = value;
        bestMove = move;
      }
    }

    return bestMove;
  },

  notifyBeforeOpponentTurn() {},

  notifyOpponentTurn() {},

  notifySkippedTurn() {},

  notifyOpponentSkipped() {},

  notifyBoardChanged() {},

  notifyGameOver() {},
};
