import { useEffect, useMemo, useState } from 'react';
import { getAIMove } from '@/lib/gomokuAI';
import { useGameAudio } from '@/hooks/useGameAudio';
import {
  AIDifficulty,
  GameMode,
  GameState,
  Player,
  getOpponent,
  initializeGame,
  makeMove,
  resetGame,
  undoMove,
  updateGameOptions,
} from '@/lib/gomokuLogic';
import GomokuBoard from '@/components/GomokuBoard';
import GamePanel from '@/components/GamePanel';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(() =>
    initializeGame({
      gameMode: 'pve',
      difficulty: 'medium',
      humanPlayer: 'black',
    })
  );

  const {
    soundEnabled,
    setSoundEnabled,
    playMove,
    playWin,
    playLoss,
  } = useGameAudio();

  const aiPlayer = useMemo(
    () => getOpponent(gameState.humanPlayer),
    [gameState.humanPlayer]
  );

  useEffect(() => {
    const shouldAIMove =
      gameState.gameMode === 'pve' &&
      gameState.currentPlayer === aiPlayer &&
      !gameState.gameOver &&
      !gameState.aiThinking;

    if (!shouldAIMove) return;

    const boardSnapshot = gameState.board;
    const difficultySnapshot = gameState.difficulty;
    const aiPlayerSnapshot = aiPlayer;

    setGameState((current) => ({ ...current, aiThinking: true }));

    window.setTimeout(() => {
      const aiMove = getAIMove(boardSnapshot, aiPlayerSnapshot, difficultySnapshot);
      setGameState((current) => {
        if (
          !aiMove ||
          current.gameOver ||
          current.gameMode !== 'pve' ||
          current.currentPlayer !== aiPlayerSnapshot
        ) {
          return { ...current, aiThinking: false };
        }
        const nextState = makeMove({ ...current, aiThinking: false }, aiMove.row, aiMove.col, aiPlayerSnapshot);
        playMove();
        if (nextState.gameOver && nextState.winner) {
          if (nextState.winner === current.humanPlayer) {
            playWin();
          } else {
            playLoss();
          }
        }
        return nextState;
      });
    }, 280);
  }, [aiPlayer, gameState, playLoss, playMove, playWin]);

  const handleCellClick = (row: number, col: number) => {
    if (
      gameState.aiThinking ||
      gameState.gameOver ||
      (gameState.gameMode === 'pve' && gameState.currentPlayer !== gameState.humanPlayer)
    ) {
      return;
    }
    setGameState((current) => {
      const nextState = makeMove(current, row, col);
      if (nextState !== current) {
        playMove();
        if (nextState.gameOver && nextState.winner) {
          playWin();
        }
      }
      return nextState;
    });
  };

  const handleNewGame = () => {
    setGameState((current) => resetGame(current));
  };

  const handleUndo = () => {
    setGameState((current) => undoMove(current));
  };

  const handleModeChange = (gameMode: GameMode) => {
    setGameState((current) => updateGameOptions(current, { gameMode }));
  };

  const handleDifficultyChange = (difficulty: AIDifficulty) => {
    setGameState((current) => updateGameOptions(current, { difficulty }));
  };

  const handleHumanPlayerChange = (humanPlayer: Player) => {
    setGameState((current) => updateGameOptions(current, { humanPlayer }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      <GomokuBoard
        gameState={gameState}
        humanPlayer={gameState.humanPlayer}
        onCellClick={handleCellClick}
      />

      <div className="w-full lg:w-88 bg-card/90 border-t lg:border-t-0 lg:border-l border-border flex flex-col">
        <GamePanel
          gameState={gameState}
          aiPlayer={aiPlayer}
          onNewGame={handleNewGame}
          onUndo={handleUndo}
          canUndo={gameState.moveHistory.length > 0 && !gameState.aiThinking}
          soundEnabled={soundEnabled}
          onModeChange={handleModeChange}
          onDifficultyChange={handleDifficultyChange}
          onHumanPlayerChange={handleHumanPlayerChange}
          onSoundEnabledChange={setSoundEnabled}
        />
      </div>
    </div>
  );
}
