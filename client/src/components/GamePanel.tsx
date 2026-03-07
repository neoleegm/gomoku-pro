import { GameState } from '@/lib/gomokuLogic';
import { Button } from '@/components/ui/button';
import { RotateCcw, Undo2 } from 'lucide-react';

interface GamePanelProps {
  gameState: GameState;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export default function GamePanel({
  gameState,
  onNewGame,
  onUndo,
  canUndo,
}: GamePanelProps) {
  return (
    <div className="w-full md:w-80 flex flex-col gap-6 p-4 md:p-6">
      {/* Game Title */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
          Gomoku Pro
        </h1>
        <p className="text-sm text-muted-foreground">Five in a Row</p>
      </div>

      {/* Game Status */}
      <div className="bg-card rounded-lg p-4 border border-border">
        <div className="mb-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Current Player
          </p>
          <div className="flex items-center gap-3">
            <div
              className={`w-6 h-6 rounded-full transition-all ${
                gameState.currentPlayer === 'black'
                  ? 'bg-black shadow-lg scale-110'
                  : 'bg-white border-2 border-border'
              }`}
            />
            <span className="text-lg font-semibold text-foreground capitalize">
              {gameState.currentPlayer}
            </span>
          </div>
        </div>

        {/* Move count */}
        <div className="text-sm text-muted-foreground">
          Moves: <span className="font-semibold text-foreground">{gameState.moveHistory.length}</span>
        </div>
      </div>

      {/* Game Over Status */}
      {gameState.gameOver && gameState.winner && (
        <div className="bg-accent/20 border border-accent rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Game Over!</p>
          <p className="text-xl font-display font-bold text-accent capitalize">
            {gameState.winner} wins!
          </p>
        </div>
      )}

      {/* Move History */}
      <div className="flex-1 min-h-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
          Move History
        </p>
        <div className="bg-card rounded-lg border border-border p-3 h-32 overflow-y-auto">
          {gameState.moveHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No moves yet
            </p>
          ) : (
            <div className="space-y-1">
              {gameState.moveHistory.map((move, index) => (
                <div
                  key={index}
                  className="text-sm text-foreground flex justify-between items-center p-2 hover:bg-muted/50 rounded transition-colors"
                >
                  <span className="font-mono">
                    {index + 1}. {String.fromCharCode(65 + move.col)}
                    {move.row + 1}
                  </span>
                  <span
                    className={`w-3 h-3 rounded-full ${
                      move.player === 'black' ? 'bg-black' : 'bg-white border border-border'
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="outline"
          className="flex-1"
          size="sm"
        >
          <Undo2 className="w-4 h-4 mr-2" />
          Undo
        </Button>
        <Button
          onClick={onNewGame}
          variant="default"
          className="flex-1"
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          New Game
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-xs text-muted-foreground space-y-2 pt-4 border-t border-border">
        <p>
          <strong>Goal:</strong> Get 5 stones in a row (horizontal, vertical, or diagonal)
        </p>
        <p>
          <strong>Players:</strong> Black starts first, then players alternate
        </p>
      </div>
    </div>
  );
}
