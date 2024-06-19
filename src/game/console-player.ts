import { Board, Color, Player, BLACK } from "./game";

declare global {
  interface Window {
    input: (input: number) => void;
  }
}

export const consolePlayer: Player = {
  setColor(color: Color) {
    if (color != BLACK) {
      throw new Error(`unsupported color: ${color}`);
    }
  },

  getTurn(board: Board) {
    console.log("getting turn for:", board);
    return new Promise((resolve) => {
      window.input = resolve;
    });
  },

  notifyBeforeOpponentTurn() {
    console.log("notifyBeforeOpponentTurn");
  },

  notifyOpponentTurn(move: number) {
    console.log("notifyOpponentTurn", move);
  },

  notifySkippedTurn() {
    console.log("notifySkippedTurn");
  },

  notifyOpponentSkipped() {
    console.log("notifyOpponentSkipped");
  },

  notifyBoardChanged(board: Board) {
    console.log("notifyBoardChanged", board);
  },

  notifyGameOver(board: Board, moves: Uint8Array) {
    console.log("notifyGameOver", board, moves);
  },
};
