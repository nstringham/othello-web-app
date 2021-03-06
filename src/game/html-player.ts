import { showDialog, showToast, waitForMilliseconds } from "../utils";
import { Board, Color, Player, BLACK, WHITE, EMPTY } from "./game";

const boardElement = document.getElementById("board") as HTMLDivElement;

const cells: HTMLButtonElement[] = [];

const ariaLabels: { [key: number]: string } = {
  [BLACK]: "black",
  [WHITE]: "white",
  [EMPTY]: "empty",
};

boardElement.querySelectorAll<HTMLButtonElement>(".cell").forEach((cell) => {
  cells.push(cell);
});

let doTurn: ((move: number) => void) | undefined;

for (let i = 0; i < 64; i++) {
  cells[i].addEventListener("click", () => {
    doTurn?.(i);
  });
}

let doneWaiting = () => {};

let animationDone: Promise<void> | undefined;

const gameOverDialog = document.querySelector("#game-over-dialog") as HTMLDialogElement;
const gameOverDialogTitle = gameOverDialog.querySelector(".title") as HTMLHeadingElement;
const gameOverDialogBody = gameOverDialog.querySelector(".body") as HTMLParagraphElement;

export const htmlPlayer: Player = {
  setColor(color: Color) {
    if (color != BLACK) {
      throw new Error(`unsupported color: ${color}`);
    }
  },

  getTurn(board: Board): Promise<number> {
    document.documentElement.classList.add("player-turn");
    let resolver: (move: number) => void;
    doTurn = (move: number) => {
      if (checkMove(board, move)) {
        resolver(move);
        doTurn = undefined;
        document.documentElement.classList.remove("player-turn");
        gameInProgress = true;
      } else {
        showToast("Invalid move!");
      }
    };
    return new Promise((resolve) => {
      resolver = resolve;
    });
  },

  notifyBeforeOpponentTurn() {
    const turnOver = new Promise<void>((resolve) => {
      doneWaiting = resolve;
    });

    showToast("waiting for opponent...", turnOver);
  },

  notifyOpponentTurn() {
    doneWaiting();
  },

  notifySkippedTurn() {
    showToast("your turn was skipped");
  },

  notifyOpponentSkipped() {
    showToast("your opponent's turn was skipped");
  },

  async notifyBoardChanged(board: Board) {
    await animationDone;
    requestAnimationFrame(() => {
      for (let i = 0; i < 64; i++) {
        cells[i].classList.toggle("black", board[i] === BLACK);
        cells[i].classList.toggle("white", board[i] === WHITE);
        cells[i].setAttribute("tabindex", checkMove(board, i) ? "0" : "-1");
        cells[i].setAttribute("aria-label", ariaLabels[board[i]]);
      }
      animationDone = waitForMilliseconds(500);
    });
  },

  notifyGameOver(board: Board) {
    gameInProgress = false;

    const { black, white } = countBoard(board);

    if (black > white) {
      gameOverDialogTitle.textContent = "You won!";
    } else if (white > black) {
      gameOverDialogTitle.textContent = "You lost!";
    } else {
      gameOverDialogTitle.textContent = "Draw!";
    }

    gameOverDialogBody.innerHTML = /*html*/ `black: ${black}<br>white: ${white}`;

    return showDialog(gameOverDialog);
  },
};

const DIRECTIONS = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

function checkMove(board: Board, move: number): boolean {
  if (board[move] !== EMPTY) {
    return false;
  }

  const row = (move / 8) >>> 0;
  const column = move % 8;

  for (const [deltaRow, deltaColumn] of DIRECTIONS) {
    for (let i = 1; i < 8; i++) {
      const currentRow = row + deltaRow * i;
      const currentColumn = column + deltaColumn * i;

      if (0 > currentRow || currentRow >= 8 || 0 > currentColumn || currentColumn >= 8) {
        break;
      }

      const current = board[currentRow * 8 + currentColumn];

      if (i === 1 && current !== WHITE) {
        break;
      } else if (current === EMPTY) {
        break;
      } else if (current === BLACK) {
        return true;
      }
    }
  }

  return false;
}

function countBoard(board: Board): { black: number; white: number } {
  let black = 0;
  let white = 0;
  for (let i = 0; i < 64; i++) {
    if (board[i] === BLACK) {
      black++;
    } else if (board[i] === WHITE) {
      white++;
    }
  }
  return { black, white };
}

let gameInProgress = false;

addEventListener("beforeunload", (event) => {
  if (gameInProgress) {
    event.preventDefault();
    event.returnValue = "Are you sure you want to exit? Your game will be lost.";
  }
});
