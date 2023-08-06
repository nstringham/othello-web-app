import { enableAds } from "../settings";
import { showDialog, showToast, waitForMilliseconds } from "../utils";
import { Board, Color, Player, BLACK, WHITE, EMPTY } from "./game";

const boardElement = document.getElementById("board") as HTMLDivElement;

const cells = [...boardElement.querySelectorAll<HTMLButtonElement>(".cell")];

let cursorPosition = 0;
const cursor = document.createElement("div");
cursor.id = "cursor";
cells[0].appendChild(cursor);

function moveCursor(position: number) {
  cells[position].appendChild(cursor);
  cells[position].focus();
  cursorPosition = position;
}

const ariaLabels: { [key: number]: string } = {
  [BLACK]: "black",
  [WHITE]: "white",
  [EMPTY]: "empty",
};

let doTurn: ((move: number) => void) | undefined;

document.addEventListener("keydown", (event) => {
  if (document.querySelector(".dialog.open") != null) {
    return;
  }

  const row = Math.floor(cursorPosition / 8);
  const column = cursorPosition % 8;

  if (event.key == "ArrowLeft") {
    moveCursor(row * 8 + ((column + 7) % 8));
  } else if (event.key == "ArrowRight") {
    moveCursor(row * 8 + ((column + 1) % 8));
  } else if (event.key == "ArrowUp") {
    moveCursor(((row + 7) % 8) * 8 + column);
  } else if (event.key == "ArrowDown") {
    moveCursor(((row + 1) % 8) * 8 + column);
  } else if (event.key == "Enter") {
    doTurn?.(cursorPosition);
  } else {
    return;
  }

  event.preventDefault();
});

cells[0].focus();

let doneWaiting = () => {};

let animationDone: Promise<void> | undefined;

const gameOverDialog = document.querySelector("#game-over") as HTMLDialogElement;
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
      if (board[move] != EMPTY) {
        return;
      } else if (checkMove(board, move)) {
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
    const timeoutID = setTimeout(() => {
      const turnOver = new Promise<void>((resolve) => {
        doneWaiting = resolve;
      });

      showToast("Waiting for opponent...", Promise.all([turnOver, waitForMilliseconds(500)]));
    }, 1_000);

    doneWaiting = () => clearTimeout(timeoutID);
  },

  notifyOpponentTurn() {
    doneWaiting();
  },

  notifySkippedTurn() {
    showToast("your turn was skipped");
  },

  notifyOpponentSkipped() {
    showToast("opponent's turn was skipped");
  },

  async notifyBoardChanged(board: Board) {
    await animationDone;
    animationDone = waitForMilliseconds(750);
    requestAnimationFrame(() => {
      for (let i = 0; i < 64; i++) {
        cells[i].classList.toggle("black", board[i] === BLACK);
        cells[i].classList.toggle("white", board[i] === WHITE);
        cells[i].classList.toggle("valid", checkMove(board, i));
        cells[i].setAttribute("aria-label", ariaLabels[board[i]]);
      }
    });
  },

  async notifyGameOver(board: Board) {
    gameInProgress = false;

    const adPromise = enableAds ? import("../ads").then(({ getAd }) => getAd()) : undefined;

    await animationDone;
    await waitForMilliseconds(250);

    const { black, white } = countBoard(board);

    if (black > white) {
      gameOverDialogTitle.textContent = "You won!";
    } else if (white > black) {
      gameOverDialogTitle.textContent = "You lost!";
    } else {
      gameOverDialogTitle.textContent = "Draw!";
    }

    gameOverDialogBody.innerHTML = /*html*/ `<table><tbody>
      <tr><th>Your Score</th><td>${black}</td></tr>
      <tr><th>Opponent's Score</th><td>${white}</td></tr>
    </tbody></table>`;

    await showDialog(gameOverDialog, "ok");

    if (enableAds && adPromise != undefined) {
      const { displayAd } = await import("../ads");
      try {
        await displayAd(adPromise);
      } catch (error) {
        console.error(error);
      }
    }
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
