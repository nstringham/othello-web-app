import { showAlert, waitForMilliseconds } from "../utils";
import { Board, Color, Player, BLACK, WHITE, EMPTY } from "./game";

const waitingElement = document.getElementById("waiting");

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

let animationDone: Promise<void> | undefined;

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
        showAlert("Invalid move!");
      }
    };
    return new Promise((resolve) => {
      resolver = resolve;
    });
  },

  notifyBeforeOpponentTurn() {
    waitingElement?.classList.remove("hidden");
  },

  notifyOpponentTurn() {
    waitingElement?.classList.add("hidden");
  },

  notifySkippedTurn() {
    return showAlert("your turn was skipped");
  },

  notifyOpponentSkipped() {
    return showAlert("your opponent's turn was skipped");
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

  notifyGameOver(winner?: Color) {
    gameInProgress = false;
    if (winner == BLACK) {
      return showAlert("You won!");
    } else if (winner == WHITE) {
      return showAlert("You lost!");
    } else {
      return showAlert("Draw!");
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

let gameInProgress = false;

addEventListener("beforeunload", (event) => {
  if (gameInProgress) {
    event.preventDefault();
    event.returnValue = "Are you sure you want to exit? Your game will be lost.";
  }
});
