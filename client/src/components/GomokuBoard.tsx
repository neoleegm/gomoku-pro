import { GameState, getLastMove } from '@/lib/gomokuLogic';
import { useState } from 'react';
import BoardCell from './BoardCell';

interface GomokuBoardProps {
  gameState: GameState;
  onCellClick: (row: number, col: number) => void;
}

export default function GomokuBoard({ gameState, onCellClick }: GomokuBoardProps) {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const lastMove = getLastMove(gameState);

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl aspect-square bg-card rounded-lg p-4 md:p-6 shadow-2xl">
        {/* Board grid */}
        <div className="w-full h-full grid gap-0" style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}>
          {gameState.board.map((row, rowIndex) =>
            row.map((stone, colIndex) => {
              const isLastMove =
                lastMove?.row === rowIndex && lastMove?.col === colIndex;
              const isHoverable = !gameState.gameOver && stone === null;

              return (
                <BoardCell
                  key={`${rowIndex}-${colIndex}`}
                  stone={stone}
                  isLastMove={isLastMove}
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
  );
}
