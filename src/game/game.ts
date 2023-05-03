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

  notifyGameOver(board: Board): void | Promise<void>;
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
    await this.notifyBoardChanged();

    while (true) {
      if (this.gameOver) {
        return;
      }
      await this.doTurn(this.player1, BLACK, this.player2, WHITE);

      if (this.gameOver) {
        return;
      }
      await this.doTurn(this.player2, WHITE, this.player1, BLACK);

      await this.endGame();
    }
  }

  async doTurn(player: Player, color: Color, otherPlayer: Player, otherColor: Color) {
    if (moveExists(this.board, color)) {
      await otherPlayer.notifyBeforeOpponentTurn();
      const move = await player.getTurn(this.board);
      await otherPlayer.notifyOpponentTurn(move);
      if (doMove(this.board, move, color)) {
        await this.notifyBoardChanged();
      } else {
        await this.endGame();
        return;
      }
    } else if (!moveExists(this.board, otherColor)) {
      await this.endGame();
      return;
    } else {
      await Promise.all([player.notifySkippedTurn(), otherPlayer.notifyOpponentSkipped()]);
    }
  }

  async notifyBoardChanged() {
    await Promise.all([this.player1.notifyBoardChanged(this.board), this.player2.notifyBoardChanged(this.board)]);
  }

  async endGame() {
    this.gameOver = true;
    await Promise.all([this.player1.notifyGameOver(this.board), this.player2.notifyGameOver(this.board)]);
  }
}
