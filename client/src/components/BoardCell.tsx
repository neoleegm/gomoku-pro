import { memo, useCallback } from 'react';
import { Stone } from '@/lib/gomokuLogic';
import { cn } from '@/lib/utils';

interface BoardCellProps {
  row: number;
  col: number;
  stone: Stone;
  previewStone: Stone;
  isLastMove: boolean;
  isAiMove: boolean;
  isHoverable: boolean;
  onClick: (row: number, col: number) => void;
  onHover: (row: number, col: number, isHovering: boolean) => void;
}

function BoardCell({
  row,
  col,
  stone,
  previewStone,
  isLastMove,
  isAiMove,
  isHoverable,
  onClick,
  onHover,
}: BoardCellProps) {
  const displayStone = stone ?? previewStone;

  const handleClick = useCallback(() => {
    onClick(row, col);
  }, [onClick, row, col]);

  const handleMouseEnter = useCallback(() => {
    onHover(row, col, true);
  }, [onHover, row, col]);

  const handleMouseLeave = useCallback(() => {
    onHover(row, col, false);
  }, [onHover, row, col]);

  const stoneLabel = displayStone === 'black' ? '黑子' : displayStone === 'white' ? '白子' : '';
  const ariaLabel = `${row + 1}行${col + 1}列${stoneLabel ? `，${stoneLabel}` : '，空位'}`;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={!isHoverable}
      className={cn(
        'wood-cell relative aspect-square w-full border border-board-line/45 bg-board-cell transition-colors duration-150',
        'focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isHoverable && 'hover:bg-board-hover active:bg-board-active',
        !isHoverable && 'cursor-default'
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayStone && (
        <span
          className={cn(
            'absolute left-1/2 top-1/2 block h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150',
            stone ? 'animate-stone-place' : 'opacity-35',
            displayStone === 'black'
              ? 'bg-stone-black shadow-stone-black'
              : 'bg-stone-white shadow-stone-white'
          )}
        />
      )}

      {isLastMove && stone && (
        <span
          className={cn(
            'absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2',
            isAiMove ? 'border-ai-marker bg-ai-marker/20' : 'border-primary bg-primary/20'
          )}
        />
      )}
    </button>
  );
}

export default memo(BoardCell);
