import { describe, expect, it } from 'vitest';
import { createBoardFromMoves, getAIMove } from './gomokuAI';
import {
  checkWin,
  initializeGame,
  makeMove,
  undoMove,
} from './gomokuLogic';

describe('gomoku logic', () => {
  it('detects wins in all four directions', () => {
    const scenarios = [
      Array.from({ length: 5 }, (_, col) => ({ row: 4, col, player: 'black' as const })),
      Array.from({ length: 5 }, (_, row) => ({ row, col: 6, player: 'black' as const })),
      Array.from({ length: 5 }, (_, index) => ({ row: index, col: index, player: 'black' as const })),
      Array.from({ length: 5 }, (_, index) => ({ row: index, col: 8 - index, player: 'black' as const })),
    ];

    for (const moves of scenarios) {
      const board = createBoardFromMoves(moves);
      const last = moves[moves.length - 1];
      expect(checkWin(board, last.row, last.col, 'black')).toBe(true);
    }
  });

  it('undoes the last PvE turn pair', () => {
    let gameState = initializeGame({ gameMode: 'pve', humanPlayer: 'black' });
    gameState = makeMove(gameState, 7, 7, 'black');
    gameState = makeMove(gameState, 7, 8, 'white');

    const undone = undoMove(gameState);
    expect(undone.moveHistory).toHaveLength(0);
    expect(undone.currentPlayer).toBe('black');
    expect(undone.board[7][7]).toBeNull();
    expect(undone.board[7][8]).toBeNull();
  });

  it('returns to the human after the AI opening move when the player chooses white', () => {
    let gameState = initializeGame({ gameMode: 'pve', humanPlayer: 'white' });
    gameState = makeMove(gameState, 7, 7, 'black');

    expect(gameState.currentPlayer).toBe('white');
    expect(gameState.moveHistory).toHaveLength(1);
  });

  it('returns legal moves for every difficulty', () => {
    const board = createBoardFromMoves([
      { row: 7, col: 7, player: 'black' },
      { row: 7, col: 8, player: 'white' },
    ]);

    for (const difficulty of ['easy', 'medium', 'hard'] as const) {
      const move = getAIMove(board, 'black', difficulty);
      expect(move).not.toBeNull();
      expect(board[move!.row][move!.col]).toBeNull();
    }
  });

  it('takes an immediate win before looking elsewhere', () => {
    const board = createBoardFromMoves([
      { row: 7, col: 3, player: 'white' },
      { row: 7, col: 4, player: 'white' },
      { row: 7, col: 5, player: 'white' },
      { row: 7, col: 6, player: 'white' },
    ]);

    const move = getAIMove(board, 'white', 'medium');
    expect(move).not.toBeNull();
    const nextBoard = createBoardFromMoves([
      { row: 7, col: 3, player: 'white' },
      { row: 7, col: 4, player: 'white' },
      { row: 7, col: 5, player: 'white' },
      { row: 7, col: 6, player: 'white' },
      { row: move!.row, col: move!.col, player: 'white' },
    ]);
    expect(checkWin(nextBoard, move!.row, move!.col, 'white')).toBe(true);
  });

  it('blocks an opponent immediate win', () => {
    const board = createBoardFromMoves([
      { row: 8, col: 3, player: 'black' },
      { row: 8, col: 4, player: 'black' },
      { row: 8, col: 5, player: 'black' },
      { row: 8, col: 6, player: 'black' },
    ]);

    const move = getAIMove(board, 'white', 'hard');
    expect(move).not.toBeNull();
    expect([{ row: 8, col: 2 }, { row: 8, col: 7 }]).toContainEqual(move);
  });
});
