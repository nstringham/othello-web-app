import { alphaBeta } from "rust-othello";
import { Board, Color, Player, WHITE } from "./game";

export type Depth = 0 | 1 | 2 | 3 | 4;

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

  getTurn(board: Board) {
    return alphaBeta(board, this.depth);
  }

  notifyBeforeOpponentTurn() {}

  notifyOpponentTurn() {}

  notifySkippedTurn() {}

  notifyOpponentSkipped() {}

  notifyBoardChanged() {}

  notifyGameOver() {}
}
