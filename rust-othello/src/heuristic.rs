use wasm_bindgen::prelude::*;

use crate::Board;

#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Heuristic {
    Score,
    Corners,
    Weights,
}

impl Heuristic {
    pub fn compute(self, board: Board) -> i8 {
        match self {
            Heuristic::Score => score(board),
            Heuristic::Corners => corners_heuristic(board),
            Heuristic::Weights => weighted_heuristic(board),
        }
    }
}

#[rustfmt::skip]
const WEIGHTS: Board = [
     8, -1,  3,  1,  1,  3, -1,  8,
    -1, -2,  0,  1,  1,  0, -2, -1,
     3,  0,  2,  1,  1,  2,  0,  3,
     1,  1,  1,  1,  1,  1,  1,  1,
     1,  1,  1,  1,  1,  1,  1,  1,
     3,  0,  2,  1,  1,  2,  0,  3,
    -1, -2,  0,  1,  1,  0, -2, -1,
     8, -1,  3,  1,  1,  3, -1,  8,
];

fn weighted_heuristic(board: Board) -> i8 {
    board
        .iter()
        .zip(WEIGHTS.iter())
        .map(|(&cell, &weight)| cell * weight)
        .sum()
}

fn corners_heuristic(board: Board) -> i8 {
    score(board) + board[0] + board[7] + board[56] + board[63]
}

pub fn score(board: Board) -> i8 {
    board.iter().sum()
}

#[cfg(test)]
mod tests {
    use crate::WIN_VALUE;

    use super::*;

    #[test]
    fn max_hubristic_less_than_win_value() {
        let max: i32 = WEIGHTS.iter().map(|&x| x.abs() as i32).sum();
        assert!(max < WIN_VALUE as i32);
    }
}
