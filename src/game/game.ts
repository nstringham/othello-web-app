import { doMove, moveExists } from "rust-othello";

export const BLACK = -1;
export const WHITE = 1;
export const EMPTY = 0;

export type Color = typeof BLACK | typeof WHITE;

export type Cell = typeof BLACK | typeof WHITE | typeof EMPTY;

export type Board = Int8Array;

export interface Player {
  setColor(color: Color): void | Promise<void>;

  getTurn(board: Board): number | Promise<number>;

  notifyBeforeOpponentTurn(): void | Promise<void>;

  notifyOpponentTurn(move: number): void | Promise<void>;

  notifySkippedTurn(): void | Promise<void>;

  notifyOpponentSkipped(): void | Promise<void>;

  notifyBoardChanged(board: Board): void | Promise<void>;

  notifyGameOver(winner?: Color): void | Promise<void>;
}

export class Game {
  board: Board;

  gameOver = false;

  player1: Player;
  player2: Player;

  constructor(player1: Player, player2: Player) {
    player1.setColor(BLACK);
    player2.setColor(WHITE);
    this.player1 = player1;
    this.player2 = player2;

    this.board = new Int8Array(64);
    this.board[27] = WHITE;
    this.board[28] = BLACK;
    this.board[35] = BLACK;
    this.board[36] = WHITE;
  }

  async play() {
    this.notify_board_changed();

    while (true) {
      if (this.gameOver) {
        return;
      }
      await this.doTurn(this.player1, BLACK, this.player2, WHITE);

      if (this.gameOver) {
        return;
      }
      await this.doTurn(this.player2, WHITE, this.player1, BLACK);
    }
  }

  async doTurn(player: Player, color: Color, otherPlayer: Player, otherColor: Color) {
    if (moveExists(this.board, color)) {
      await otherPlayer.notifyBeforeOpponentTurn();
      const move = await player.getTurn(this.board);
      await otherPlayer.notifyOpponentTurn(move);
      if (doMove(this.board, move, color)) {
        await this.notify_board_changed();
      } else {
        await this.end_game(otherColor);
        return;
      }
    } else if (!moveExists(this.board, otherColor)) {
      await this.end_game(findWinner(this.board));
      return;
    } else {
      await Promise.all([player.notifySkippedTurn(), otherPlayer.notifyOpponentSkipped()]);
    }
  }

  async notify_board_changed() {
    await Promise.all([this.player1.notifyBoardChanged(this.board), this.player2.notifyBoardChanged(this.board)]);
  }

  async end_game(winner?: Color) {
    this.gameOver = true;
    await Promise.all([this.player1.notifyGameOver(winner), this.player2.notifyGameOver(winner)]);
  }
}

function findWinner(board: Board): Color | undefined {
  let black = 0;
  let white = 0;

  for (let i = 0; i < 64; i++) {
    if (board[i] == BLACK) {
      black++;
    } else if (board[i] == WHITE) {
      white++;
    }
  }

  if (black > white) {
    return BLACK;
  } else if (white > black) {
    return WHITE;
  } else {
    return undefined;
  }
}
