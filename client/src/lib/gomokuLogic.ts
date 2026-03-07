// Gomoku game logic and utilities
// Board size: 15x15
// Win condition: 5 stones in a row (horizontal, vertical, or diagonal)

export type Stone = 'black' | 'white' | null;
export type Board = Stone[][];

export interface GameState {
  board: Board;
  currentPlayer: 'black' | 'white';
  moveHistory: Array<{ row: number; col: number; player: 'black' | 'white' }>;
  gameOver: boolean;
  winner: 'black' | 'white' | null;
}

export interface GamePosition {
  row: number;
  col: number;
}

const BOARD_SIZE = 15;
const WIN_LENGTH = 5;

/**
 * Initialize an empty game board
 */
export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
}

/**
 * Initialize a new game state
 */
export function initializeGame(): GameState {
  return {
    board: createEmptyBoard(),
    currentPlayer: 'black',
    moveHistory: [],
    gameOver: false,
    winner: null,
  };
}

/**
 * Check if a position is valid (within board bounds and empty)
 */
export function isValidMove(board: Board, row: number, col: number): boolean {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
    return false;
  }
  return board[row][col] === null;
}

/**
 * Place a stone on the board
 */
export function placeStone(
  board: Board,
  row: number,
  col: number,
  player: Stone
): Board {
  const newBoard = board.map((r) => [...r]);
  newBoard[row][col] = player;
  return newBoard;
}

/**
 * Check if a player has won from a specific position
 */
export function checkWin(
  board: Board,
  row: number,
  col: number,
  player: Stone
): boolean {
  if (player === null) return false;

  // Directions: horizontal, vertical, diagonal-right, diagonal-left
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal-right
    [1, -1], // diagonal-left
  ];

  for (const [dr, dc] of directions) {
    let count = 1; // Count the current stone

    // Count in positive direction
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }

    // Count in negative direction
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
      count++;
      r -= dr;
      c -= dc;
    }

    if (count >= WIN_LENGTH) {
      return true;
    }
  }

  return false;
}

/**
 * Make a move in the game
 */
export function makeMove(
  gameState: GameState,
  row: number,
  col: number
): GameState {
  if (!isValidMove(gameState.board, row, col) || gameState.gameOver) {
    return gameState;
  }

  const newBoard = placeStone(gameState.board, row, col, gameState.currentPlayer);
  const newMoveHistory = [
    ...gameState.moveHistory,
    { row, col, player: gameState.currentPlayer },
  ];

  const isWin = checkWin(newBoard, row, col, gameState.currentPlayer);

  return {
    board: newBoard,
    currentPlayer: gameState.currentPlayer === 'black' ? 'white' : 'black',
    moveHistory: newMoveHistory,
    gameOver: isWin,
    winner: isWin ? gameState.currentPlayer : null,
  };
}

/**
 * Undo the last move
 */
export function undoMove(gameState: GameState): GameState {
  if (gameState.moveHistory.length === 0) {
    return gameState;
  }

  const newMoveHistory = gameState.moveHistory.slice(0, -1);
  const newBoard = createEmptyBoard();

  // Rebuild board from move history (excluding the last move)
  for (const move of newMoveHistory) {
    newBoard[move.row][move.col] = move.player;
  }

  return {
    board: newBoard,
    currentPlayer: gameState.currentPlayer === 'black' ? 'white' : 'black',
    moveHistory: newMoveHistory,
    gameOver: false,
    winner: null,
  };
}

/**
 * Get the last move position
 */
export function getLastMove(gameState: GameState): GamePosition | null {
  if (gameState.moveHistory.length === 0) {
    return null;
  }
  const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
  return { row: lastMove.row, col: lastMove.col };
}
