import {
  BOARD_SIZE,
  Board,
  GamePosition,
  Player,
  AIDifficulty,
  checkWin,
  createEmptyBoard,
  getLegalMoves,
  getOpponent,
  isInBounds,
  placeStone,
} from './gomokuLogic';

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
] as const;

const MAX_CANDIDATES = 14;
const HARD_DEPTH = 3;
const WIN_SCORE = 1_000_000;

export function getAIMove(
  board: Board,
  aiPlayer: Player,
  difficulty: AIDifficulty
): GamePosition | null {
  const moves = getCandidateMoves(board);
  if (moves.length === 0) return null;

  if (difficulty === 'easy') {
    return getEasyMove(board, moves);
  }

  const immediateWin = findImmediateWin(board, aiPlayer, moves);
  if (immediateWin) return immediateWin;

  const opponent = getOpponent(aiPlayer);
  const immediateBlock = findImmediateWin(board, opponent, moves);
  if (immediateBlock) return immediateBlock;

  if (difficulty === 'medium') {
    return getMediumMove(board, aiPlayer, moves);
  }

  return getHardMove(board, aiPlayer, moves);
}

function getEasyMove(board: Board, moves: GamePosition[]): GamePosition {
  if (isBoardEmpty(board)) {
    return centerMove();
  }
  return moves[Math.floor(Math.random() * moves.length)];
}

function getMediumMove(
  board: Board,
  aiPlayer: Player,
  moves: GamePosition[]
): GamePosition {
  const sorted = scoreMoves(board, aiPlayer, moves);
  return sorted[0].move;
}

function getHardMove(
  board: Board,
  aiPlayer: Player,
  moves: GamePosition[]
): GamePosition {
  let bestMove = moves[0];
  let bestScore = -Infinity;
  let alpha = -Infinity;
  const rankedMoves = scoreMoves(board, aiPlayer, moves).slice(0, MAX_CANDIDATES);

  for (const { move } of rankedMoves) {
    const nextBoard = placeStone(board, move.row, move.col, aiPlayer);
    const score = -negamax(
      nextBoard,
      getOpponent(aiPlayer),
      HARD_DEPTH - 1,
      -Infinity,
      -alpha
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    alpha = Math.max(alpha, score);
  }

  return bestMove;
}

function negamax(
  board: Board,
  currentPlayer: Player,
  depth: number,
  alpha: number,
  beta: number
): number {
  const candidates = getCandidateMoves(board);
  if (candidates.length === 0 || depth === 0) {
    return evaluateBoard(board, currentPlayer);
  }

  const rankedMoves = scoreMoves(board, currentPlayer, candidates).slice(0, MAX_CANDIDATES);
  let bestScore = -Infinity;

  for (const { move } of rankedMoves) {
    const nextBoard = placeStone(board, move.row, move.col, currentPlayer);
    if (checkWin(nextBoard, move.row, move.col, currentPlayer)) {
      return WIN_SCORE + depth;
    }

    const score = -negamax(
      nextBoard,
      getOpponent(currentPlayer),
      depth - 1,
      -beta,
      -alpha
    );
    bestScore = Math.max(bestScore, score);
    alpha = Math.max(alpha, score);
    if (alpha >= beta) {
      break;
    }
  }

  return bestScore;
}

function scoreMoves(
  board: Board,
  player: Player,
  moves: GamePosition[]
): Array<{ move: GamePosition; score: number }> {
  const opponent = getOpponent(player);
  return moves
    .map((move) => ({
      move,
      score:
        scoreMove(board, move, player) * 1.1 +
        scoreMove(board, move, opponent) +
        centerBias(move),
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreMove(board: Board, move: GamePosition, player: Player): number {
  let score = 0;
  for (const [dr, dc] of DIRECTIONS) {
    const positive = countDirection(board, move.row, move.col, dr, dc, player);
    const negative = countDirection(board, move.row, move.col, -dr, -dc, player);
    const length = positive.count + negative.count + 1;
    const openEnds = Number(positive.open) + Number(negative.open);
    score += scorePattern(length, openEnds);
  }
  return score;
}

function scorePattern(length: number, openEnds: number): number {
  if (length >= 5) return WIN_SCORE;
  if (length === 4 && openEnds === 2) return 120_000;
  if (length === 4 && openEnds === 1) return 25_000;
  if (length === 3 && openEnds === 2) return 6_000;
  if (length === 3 && openEnds === 1) return 800;
  if (length === 2 && openEnds === 2) return 300;
  if (length === 2 && openEnds === 1) return 80;
  return openEnds > 0 ? 12 : 1;
}

function evaluateBoard(board: Board, player: Player): number {
  const moves = getCandidateMoves(board).slice(0, MAX_CANDIDATES);
  if (moves.length === 0) return 0;

  const opponent = getOpponent(player);
  let score = 0;
  for (const move of moves) {
    score += scoreMove(board, move, player);
    score -= scoreMove(board, move, opponent) * 0.95;
  }
  return score;
}

function findImmediateWin(
  board: Board,
  player: Player,
  moves: GamePosition[]
): GamePosition | null {
  for (const move of moves) {
    const nextBoard = placeStone(board, move.row, move.col, player);
    if (checkWin(nextBoard, move.row, move.col, player)) {
      return move;
    }
  }
  return null;
}

function getCandidateMoves(board: Board): GamePosition[] {
  const legalMoves = getLegalMoves(board);
  if (legalMoves.length === 0) return [];
  if (legalMoves.length === BOARD_SIZE * BOARD_SIZE) {
    return [centerMove()];
  }

  const candidates = legalMoves.filter((move) => hasNeighbor(board, move, 2));
  const scopedMoves = candidates.length > 0 ? candidates : legalMoves;
  return scopedMoves
    .map((move) => ({ move, score: centerBias(move) + neighborScore(board, move) }))
    .sort((a, b) => b.score - a.score)
    .map(({ move }) => move);
}

function countDirection(
  board: Board,
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: Player
): { count: number; open: boolean } {
  let count = 0;
  let r = row + dr;
  let c = col + dc;
  while (isInBounds(r, c) && board[r][c] === player) {
    count++;
    r += dr;
    c += dc;
  }
  return { count, open: isInBounds(r, c) && board[r][c] === null };
}

function hasNeighbor(board: Board, move: GamePosition, distance: number): boolean {
  for (let row = move.row - distance; row <= move.row + distance; row++) {
    for (let col = move.col - distance; col <= move.col + distance; col++) {
      if (isInBounds(row, col) && board[row][col] !== null) {
        return true;
      }
    }
  }
  return false;
}

function neighborScore(board: Board, move: GamePosition): number {
  let score = 0;
  for (let row = move.row - 2; row <= move.row + 2; row++) {
    for (let col = move.col - 2; col <= move.col + 2; col++) {
      if (isInBounds(row, col) && board[row][col] !== null) {
        score += 4 - Math.max(Math.abs(row - move.row), Math.abs(col - move.col));
      }
    }
  }
  return score;
}

function centerBias(move: GamePosition): number {
  const center = Math.floor(BOARD_SIZE / 2);
  return 20 - Math.abs(move.row - center) - Math.abs(move.col - center);
}

function centerMove(): GamePosition {
  const center = Math.floor(BOARD_SIZE / 2);
  return { row: center, col: center };
}

function isBoardEmpty(board: Board): boolean {
  return board.every((row) => row.every((stone) => stone === null));
}

export function createBoardFromMoves(
  moves: Array<{ row: number; col: number; player: Player }>
): Board {
  return moves.reduce((board, move) => {
    board[move.row][move.col] = move.player;
    return board;
  }, createEmptyBoard());
}
