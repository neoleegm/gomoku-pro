import { Stone } from '@/lib/gomokuLogic';
import { cn } from '@/lib/utils';

interface BoardCellProps {
  stone: Stone;
  isLastMove: boolean;
  isHoverable: boolean;
  onClick: () => void;
  onHover: (isHovering: boolean) => void;
}

export default function BoardCell({
  stone,
  isLastMove,
  isHoverable,
  onClick,
  onHover,
}: BoardCellProps) {
  return (
    <div
      className={cn(
        'w-full aspect-square relative border border-border/30 transition-colors duration-200',
        isHoverable && 'cursor-pointer hover:bg-accent/20'
      )}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Stone */}
      {stone && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center animate-stone-place',
            stone === 'black' ? 'bg-black' : 'bg-white'
          )}
          style={{
            borderRadius: '50%',
            width: '85%',
            height: '85%',
            left: '7.5%',
            top: '7.5%',
            boxShadow:
              stone === 'black'
                ? '0 4px 12px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(0, 0, 0, 0.3)'
                : '0 4px 12px rgba(0, 0, 0, 0.3), inset -2px -2px 4px rgba(0, 0, 0, 0.1)',
          }}
        />
      )}

      {/* Last move indicator */}
      {isLastMove && stone && (
        <div
          className="absolute inset-0 flex items-center justify-center animate-pulse-ring"
          style={{
            borderRadius: '50%',
            width: '85%',
            height: '85%',
            left: '7.5%',
            top: '7.5%',
          }}
        />
      )}
    </div>
  );
}
