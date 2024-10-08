import { openDB, type DBSchema } from "idb";

export type GameResult = {
  difficulty: number;
  playerMovedFirst: boolean;
  player: number;
  ai: number;
  moves: Uint8Array;
  date: Date;
};

interface OthelloSchema extends DBSchema {
  "game-results": {
    value: GameResult;
    key: number;
  };
}

const db = await openDB<OthelloSchema>("othello", 1, {
  upgrade(db) {
    db.createObjectStore("game-results", {
      keyPath: "id",
      autoIncrement: true,
    });
  },
});

export async function logGame(result: GameResult) {
  db.add("game-results", result);
}
