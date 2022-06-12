import { Board, Color, Player, BLACK } from "./game";

export const consolePlayer: Player = {
  setColor(color: Color) {
    if (color != BLACK) {
      throw new Error(`unsupported color: ${color}`);
    }
  },

  getTurn(board: Board) {
    console.log("getting turn for:", board);
    return new Promise((resolve) => {
      //@ts-ignore
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

  notifyBoardChanged(board: Int8Array) {
    console.log("notifyBoardChanged", board);
  },

  notifyGameOver(winner?: Color) {
    console.log("notifyGameOver", winner);
  },
};
