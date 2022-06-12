import { alphaBeta } from "rust-othello";
import { Board, Color, Player, WHITE } from "./game";

export const alphaBetaPlayer: Player = {
  setColor(color: Color) {
    if (color != WHITE) {
      throw new Error(`unsupported color: ${color}`);
    }
  },

  getTurn(board: Board) {
    return alphaBeta(board);
  },

  notifyBeforeOpponentTurn() {},

  notifyOpponentTurn() {},

  notifySkippedTurn() {},

  notifyOpponentSkipped() {},

  notifyBoardChanged() {},

  notifyGameOver() {},
};
