import {
  AIDifficulty,
  GameMode,
  GameState,
  Player,
} from '@/lib/gomokuLogic';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot, RotateCcw, Undo2, Users, Volume2, VolumeX } from 'lucide-react';

interface GamePanelProps {
  gameState: GameState;
  aiPlayer: Player;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  soundEnabled: boolean;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: AIDifficulty) => void;
  onHumanPlayerChange: (player: Player) => void;
  onSoundEnabledChange: (enabled: boolean) => void;
}

const difficultyLabel: Record<AIDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

export default function GamePanel({
  gameState,
  aiPlayer,
  onNewGame,
  onUndo,
  canUndo,
  soundEnabled,
  onModeChange,
  onDifficultyChange,
  onHumanPlayerChange,
  onSoundEnabledChange,
}: GamePanelProps) {
  const status = getStatusText(gameState, aiPlayer);

  return (
    <aside className="w-full lg:w-88 flex flex-col gap-5 p-4 sm:p-5 lg:p-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Gomoku Pro
        </h1>
        <p className="text-sm text-muted-foreground">Five in a Row</p>
      </div>

      <section className="rounded-md border border-border bg-panel p-4">
        <p className="mb-3 text-sm font-semibold text-muted-foreground">
          Match
        </p>
        <div className="grid gap-3">
          <label className="grid gap-2 text-sm">
            <span className="text-muted-foreground">Mode</span>
            <Select
              value={gameState.gameMode}
              onValueChange={(value) => onModeChange(value as GameMode)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pve">
                  <span className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    Player vs AI
                  </span>
                </SelectItem>
                <SelectItem value="pvp">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Local two-player
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </label>

          {gameState.gameMode === 'pve' && (
            <>
              <label className="grid gap-2 text-sm">
                <span className="text-muted-foreground">Difficulty</span>
                <Select
                  value={gameState.difficulty}
                  onValueChange={(value) => onDifficultyChange(value as AIDifficulty)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-muted-foreground">Your Stones</span>
                <Select
                  value={gameState.humanPlayer}
                  onValueChange={(value) => onHumanPlayerChange(value as Player)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black, first move</SelectItem>
                    <SelectItem value="white">White, AI opens</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </>
          )}
        </div>
      </section>

      <section className="rounded-md border border-border bg-panel p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Sound
            </p>
            <p className="text-sm text-foreground">
              {soundEnabled ? 'Business tone cues on' : 'Muted'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSoundEnabledChange(!soundEnabled)}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
            {soundEnabled ? 'On' : 'Off'}
          </Button>
        </div>
      </section>

      <section className="rounded-md border border-border bg-panel p-4">
        <p className="mb-2 text-sm font-semibold text-muted-foreground">
          Status
        </p>
        <div className="flex items-center gap-3">
          <span
            className={`h-6 w-6 rounded-full ${
              gameState.currentPlayer === 'black'
                ? 'bg-stone-black shadow-stone-black'
                : 'bg-stone-white shadow-stone-white'
            }`}
          />
          <div className="min-w-0">
            <p className="text-base font-semibold text-foreground">{status}</p>
            <p className="text-sm text-muted-foreground">
              Moves: <span className="font-semibold text-foreground">{gameState.moveHistory.length}</span>
            </p>
          </div>
        </div>
        {gameState.gameMode === 'pve' && (
          <p className="mt-3 text-sm text-muted-foreground">
            AI: {difficultyLabel[gameState.difficulty]} as {aiPlayer}
          </p>
        )}
      </section>

      {gameState.gameOver && (
        <section className="rounded-md border border-primary bg-primary/10 p-4">
          <p className="text-sm text-muted-foreground">
            {gameState.winner ? 'Winner' : 'Draw'}
          </p>
          <p className="text-xl font-display font-bold text-primary">
            {gameState.winner ? `${gameState.winner} wins` : 'Board full'}
          </p>
        </section>
      )}

      <section className="min-h-0 flex-1">
        <p className="mb-3 text-sm font-semibold text-muted-foreground">
          Move History
        </p>
        <div className="h-36 overflow-y-auto rounded-md border border-border bg-panel p-2">
          {gameState.moveHistory.length === 0 ? (
            <p className="py-5 text-center text-sm text-muted-foreground">
              No moves yet
            </p>
          ) : (
            <div className="grid gap-1">
              {gameState.moveHistory.map((move, index) => (
                <div
                  key={`${move.row}-${move.col}-${index}`}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted/50"
                >
                  <span className="font-mono">
                    {index + 1}. {String.fromCharCode(65 + move.col)}
                    {move.row + 1}
                  </span>
                  <span
                    className={`h-3 w-3 rounded-full ${
                      move.player === 'black'
                        ? 'bg-stone-black'
                        : 'bg-stone-white border border-border'
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onUndo}
          disabled={!canUndo}
          variant="outline"
          size="sm"
        >
          <Undo2 className="h-4 w-4" />
          Undo
        </Button>
        <Button onClick={onNewGame} variant="default" size="sm">
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
      </div>

      <div className="rounded-md border border-border bg-panel p-3 text-sm text-muted-foreground">
        Black moves first. Place five stones in a straight line to win.
      </div>
    </aside>
  );
}

function getStatusText(gameState: GameState, aiPlayer: Player): string {
  if (gameState.gameOver) {
    return gameState.winner ? `${gameState.winner} wins` : 'Draw';
  }

  if (gameState.aiThinking) {
    return 'AI is thinking';
  }

  if (gameState.gameMode === 'pve') {
    return gameState.currentPlayer === aiPlayer
      ? 'AI to move'
      : 'Your move';
  }

  return `${gameState.currentPlayer} to move`;
}
