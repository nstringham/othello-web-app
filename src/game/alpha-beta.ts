import { getValidMoves } from "rust-othello";
import * as Comlink from "comlink";
import { Board, Color, Player, WHITE } from "./game";
import type { AlphaBetaFunction } from "./alpha-beta-worker";

export type Depth = 0 | 1 | 2 | 3 | 4;

const workers: AlphaBetaFunction[] = [];

for (let i = 0; i < navigator.hardwareConcurrency; i++) {
  const worker = new Worker(new URL("./alpha-beta-worker.ts", import.meta.url), { type: "module" });
  const alphaBeta = Comlink.wrap<AlphaBetaFunction>(Comlink.proxy(worker));
  workers.push(alphaBeta);
}

export class AlphaBetaPlayer implements Player {
  depth: Depth;

  constructor(depth: Depth) {
    this.depth = depth;
  }

  setColor(color: Color) {
    if (color != WHITE) {
      throw new Error(`unsupported color: ${color}`);
    }
  }

  async getTurn(board: Board) {
    const validMoves = getValidMoves(board);

    const heuristics = new Map<number, Promise<number>>();

    for (const [i, move] of validMoves.entries()) {
      const alphaBeta = workers[i % workers.length];
      console.log(`alphaBeta(${board}, ${move}, ${this.depth})`);
      const heuristicPromise = alphaBeta(board, move, this.depth);
      heuristics.set(move, heuristicPromise);
    }

    let bestMove = 0;
    let bestHeuristic = Number.MIN_SAFE_INTEGER;
    let numberOfMatches = 0;

    for (const [move, heuristic] of heuristics) {
      const value = await heuristic;
      if (value > bestHeuristic) {
        bestHeuristic = value;
        bestMove = move;
        numberOfMatches = 1;
      } else if (value === bestHeuristic) {
        numberOfMatches++;
        if (Math.random() < 1 / numberOfMatches) {
          bestMove = move;
        }
      }
    }

    return bestMove;
  }

  notifyBeforeOpponentTurn() {}

  notifyOpponentTurn() {}

  notifySkippedTurn() {}

  notifyOpponentSkipped() {}

  notifyBoardChanged() {}

  notifyGameOver() {}
}
