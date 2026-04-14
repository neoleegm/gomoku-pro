import { GameState, Player, getLastMove } from '@/lib/gomokuLogic';
import { useState } from 'react';
import BoardCell from './BoardCell';

interface GomokuBoardProps {
  gameState: GameState;
  humanPlayer: Player;
  onCellClick: (row: number, col: number) => void;
}

export default function GomokuBoard({ gameState, humanPlayer, onCellClick }: GomokuBoardProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const lastMove = getLastMove(gameState);
  const isHumanTurn =
    gameState.gameMode === 'pvp' ||
    (!gameState.aiThinking && gameState.currentPlayer === humanPlayer);

  return (
    <main className="flex-1 flex items-center justify-center px-3 py-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[min(92vw,760px)] lg:max-w-[min(68vw,820px)]">
        <div className="mb-4 flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">15 x 15</span>
          <span>{gameState.aiThinking ? 'AI is thinking' : 'Five stones win'}</span>
        </div>

        <div className="wood-board aspect-square rounded-md border border-board-line/60 bg-board p-2 shadow-board sm:p-4">
          <div
            className="h-full w-full grid gap-0 rounded-sm overflow-hidden border border-board-line/70"
            style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}
          >
            {gameState.board.map((row, rowIndex) =>
              row.map((stone, colIndex) => {
                const isLastMove =
                  lastMove?.row === rowIndex && lastMove?.col === colIndex;
                const isAiMove = Boolean(
                  isLastMove &&
                    gameState.gameMode === 'pve' &&
                    stone !== null &&
                    stone !== humanPlayer
                );
                const isHoverable =
                  isHumanTurn && !gameState.gameOver && !gameState.aiThinking && stone === null;
                const isPreview =
                  isHoverable &&
                  hoveredCell?.row === rowIndex &&
                  hoveredCell?.col === colIndex;

                return (
                  <BoardCell
                    key={`${rowIndex}-${colIndex}`}
                    stone={stone}
                    previewStone={isPreview ? gameState.currentPlayer : null}
                    isLastMove={isLastMove}
                    isAiMove={isAiMove}
                    isHoverable={isHoverable}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                    onHover={(isHovering) => {
                      setHoveredCell(
                        isHovering ? { row: rowIndex, col: colIndex } : null
                      );
                    }}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
