// Gomoku game logic and utilities
// Board size: 15x15
// Win condition: 5 stones in a row (horizontal, vertical, or diagonal)

export type Player = 'black' | 'white';
export type Stone = Player | null;
export type Board = Stone[][];
export type GameMode = 'pvp' | 'pve';
export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface GameMove {
  row: number;
  col: number;
  player: Player;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  moveHistory: GameMove[];
  gameOver: boolean;
  winner: Player | null;
  gameMode: GameMode;
  difficulty: AIDifficulty;
  humanPlayer: Player;
  aiThinking: boolean;
  stonesPlaced: number;
}

export interface GameOptions {
  gameMode?: GameMode;
  difficulty?: AIDifficulty;
  humanPlayer?: Player;
  aiThinking?: boolean;
}

export interface GamePosition {
  row: number;
  col: number;
}

export const BOARD_SIZE = 15;
export const WIN_LENGTH = 5;

/**
 * Initialize an empty game board
 */
export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null));
}

export function getOpponent(player: Player): Player {
  return player === 'black' ? 'white' : 'black';
}

/**
 * Initialize a new game state
 */
export function initializeGame(options: GameOptions = {}): GameState {
  return {
    board: createEmptyBoard(),
    currentPlayer: 'black',
    moveHistory: [],
    gameOver: false,
    winner: null,
    gameMode: options.gameMode ?? 'pvp',
    difficulty: options.difficulty ?? 'easy',
    humanPlayer: options.humanPlayer ?? 'black',
    aiThinking: options.aiThinking ?? false,
    stonesPlaced: 0,
  };
}

export function resetGame(gameState: GameState): GameState {
  return initializeGame({
    gameMode: gameState.gameMode,
    difficulty: gameState.difficulty,
    humanPlayer: gameState.humanPlayer,
  });
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
  player: Player
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

  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];

  for (const [dr, dc] of directions) {
    let count = 1;

    let r = row + dr;
    let c = col + dc;
    while (isInBounds(r, c) && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }

    r = row - dr;
    c = col - dc;
    while (isInBounds(r, c) && board[r][c] === player) {
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

export function getLegalMoves(board: Board): GamePosition[] {
  const moves: GamePosition[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        moves.push({ row, col });
      }
    }
  }
  return moves;
}

export function isBoardFull(board: Board): boolean {
  return getLegalMoves(board).length === 0;
}

export function isBoardFullByCount(stonesPlaced: number): boolean {
  return stonesPlaced >= BOARD_SIZE * BOARD_SIZE;
}

/**
 * Make a move in the game
 */
export function makeMove(
  gameState: GameState,
  row: number,
  col: number,
  player: Player = gameState.currentPlayer
): GameState {
  if (!isValidMove(gameState.board, row, col) || gameState.gameOver) {
    return gameState;
  }

  const newBoard = placeStone(gameState.board, row, col, player);
  const newMoveHistory = [
    ...gameState.moveHistory,
    { row, col, player },
  ];

  const isWin = checkWin(newBoard, row, col, player);
  const stonesPlaced = gameState.stonesPlaced + 1;
  const isDraw = !isWin && isBoardFullByCount(stonesPlaced);

  return {
    ...gameState,
    board: newBoard,
    currentPlayer: getOpponent(player),
    moveHistory: newMoveHistory,
    gameOver: isWin || isDraw,
    winner: isWin ? player : null,
    aiThinking: false,
    stonesPlaced,
  };
}

export function updateGameOptions(gameState: GameState, options: GameOptions): GameState {
  return {
    ...resetGame({
      ...gameState,
      ...options,
    }),
    ...options,
  };
}

/**
 * Undo the last move for PvP, or the latest human/AI turn pair for PvE.
 */
export function undoMove(gameState: GameState): GameState {
  if (gameState.moveHistory.length === 0 || gameState.aiThinking) {
    return gameState;
  }

  const undoCount = gameState.gameMode === 'pve'
    ? Math.min(2, gameState.moveHistory.length)
    : 1;
  const newMoveHistory = gameState.moveHistory.slice(0, -undoCount);
  return rebuildGameState(gameState, newMoveHistory);
}

export function rebuildGameState(gameState: GameState, moveHistory: GameMove[]): GameState {
  const newBoard = createEmptyBoard();
  for (const move of moveHistory) {
    newBoard[move.row][move.col] = move.player;
  }

  return {
    ...gameState,
    board: newBoard,
    currentPlayer: moveHistory.length % 2 === 0 ? 'black' : 'white',
    moveHistory,
    gameOver: false,
    winner: null,
    aiThinking: false,
    stonesPlaced: moveHistory.length,
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

export function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}
