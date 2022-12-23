use std::cmp::min;
use wasm_bindgen::prelude::*;

type Board = [i8; 64];

fn convert_board(input_board: &[i8]) -> Board {
    let mut board: Board = [0; 64];
    board.copy_from_slice(input_board);
    board
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn doMove(board: &mut [i8], origin: usize, color: i8) -> bool {
    match do_move(&convert_board(board), origin, color) {
        Ok(new_board) => {
            board.copy_from_slice(&new_board);
            true
        }
        Err(()) => false,
    }
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn moveExists(board: &[i8], color: i8) -> bool {
    let board = convert_board(board);
    for i in 0..64 {
        if do_move(&board, i, color).is_ok() {
            return true;
        }
    }
    return false;
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn getValidMoves(input_board: &[i8]) -> Vec<u8> {
    let board = convert_board(input_board);
    let mut valid_moves = Vec::with_capacity(64);
    for location in 0..64 {
        if do_move(&board, location, 1).is_ok() {
            valid_moves.push(location as u8);
        }
    }
    valid_moves
}

#[allow(non_snake_case)]
#[wasm_bindgen]
pub fn alphaBeta(input_board: &[i8], location: usize, depth: u8) -> i8 {
    let board = convert_board(input_board);

    let new_board = do_move(&board, location, 1).unwrap();

    ab_min(new_board, depth, false, i8::MIN, i8::MAX)
}

fn ab_min(board: Board, depth: u8, was_skip: bool, alpha: i8, mut beta: i8) -> i8 {
    if depth == 0 {
        return heuristic(board);
    }

    let mut min = i8::MAX;

    for i in 0..64 {
        if let Ok(new_board) = do_move(&board, i, -1) {
            let value = ab_max(new_board, depth, false, alpha, beta);

            if value < min {
                min = value;
            }

            if value <= alpha {
                break;
            }

            if value < beta {
                beta = value;
            }
        }
    }

    if min == i8::MAX {
        if was_skip {
            heuristic(board).signum() * 64
        } else {
            ab_max(board, depth, true, alpha, beta)
        }
    } else {
        min
    }
}

fn ab_max(board: Board, depth: u8, was_skip: bool, mut alpha: i8, beta: i8) -> i8 {
    let mut max = i8::MIN;

    for i in 0..64 {
        if let Ok(new_board) = do_move(&board, i, 1) {
            let value = ab_min(new_board, depth - 1, false, alpha, beta);

            if value > max {
                max = value;
            }

            if value >= beta {
                break;
            }

            if value > alpha {
                alpha = value;
            }
        }
    }

    if max == i8::MIN {
        if was_skip {
            heuristic(board).signum() * 64
        } else {
            ab_min(board, depth - 1, true, alpha, beta)
        }
    } else {
        max
    }
}

fn do_move(board: &Board, origin: usize, placing: i8) -> Result<Board, ()> {
    if board[origin] != 0 {
        return Err(());
    }

    let left: usize = origin % 8;
    let right: usize = 7 - left;
    let up: usize = origin / 8;
    let down: usize = 7 - up;

    let mut board = *board;

    board[origin] = placing;

    let mut valid = false;

    if left >= 2 && board[origin - 1] == -placing {
        for i in 2..left + 1 {
            let current = board[origin - i];
            if current == placing {
                valid = true;
                for j in 1..i {
                    board[origin - j] = placing;
                }
                break;
            } else if current == 0 {
                break;
            }
        }
    }

    if right >= 2 && board[origin + 1] == -placing {
        for i in 2..right + 1 {
            let current = board[origin + i];
            if current == placing {
                valid = true;
                for j in 1..i {
                    board[origin + j] = placing;
                }
                break;
            } else if current == 0 {
                break;
            }
        }
    }

    if up >= 2 && board[origin - 8] == -placing {
        for i in 2..up + 1 {
            let current = board[origin - i * 8];
            if current == placing {
                valid = true;
                for j in 1..i {
                    board[origin - j * 8] = placing;
                }
                break;
            } else if current == 0 {
                break;
            }
        }
    }

    if down >= 2 && board[origin + 8] == -placing {
        for i in 2..down + 1 {
            let current = board[origin + i * 8];
            if current == placing {
                valid = true;
                for j in 1..i {
                    board[origin + j * 8] = placing;
                }
                break;
            } else if current == 0 {
                break;
            }
        }
    }

    if left >= 2 && up >= 2 && board[origin - 9] == -placing {
        for i in 2..min(left + 1, up + 1) {
            let current = board[origin - i * 9];
            if current == placing {
                valid = true;
                for j in 1..i {
                    board[origin - j * 9] = placing;
                }
                break;
            } else if current == 0 {
                break;
            }
        }
    }

    if right >= 2 && up >= 2 && board[origin - 7] == -placing {
        for i in 2..min(right + 1, up + 1) {
            let current = board[origin - i * 7];
            if current == placing {
                valid = true;
                for j in 1..i {
                    board[origin - j * 7] = placing;
                }
                break;
            } else if current == 0 {
                break;
            }
        }
    }

    if left >= 2 && down >= 2 && board[origin + 7] == -placing {
        for i in 2..min(left + 1, down + 1) {
            let current = board[origin + i * 7];
            if current == placing {
                valid = true;
                for j in 1..i {
                    board[origin + j * 7] = placing;
                }
                break;
            } else if current == 0 {
                break;
            }
        }
    }

    if right >= 2 && down >= 2 && board[origin + 9] == -placing {
        for i in 2..min(right + 1, down + 1) {
            let current = board[origin + i * 9];
            if current == placing {
                valid = true;
                for j in 1..i {
                    board[origin + j * 9] = placing;
                }
                break;
            } else if current == 0 {
                break;
            }
        }
    }

    if valid {
        Ok(board)
    } else {
        Err(())
    }
}

fn heuristic(board: Board) -> i8 {
    board.iter().sum()
}
