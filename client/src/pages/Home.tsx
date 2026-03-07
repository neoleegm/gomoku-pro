import { useState } from 'react';
import { GameState, initializeGame, makeMove, undoMove } from '@/lib/gomokuLogic';
import GomokuBoard from '@/components/GomokuBoard';
import GamePanel from '@/components/GamePanel';

/**
 * Home page - Main Gomoku game interface
 * Layout: Asymmetric with board on left, control panel on right
 * Design: Modern minimalist with dark board and gold accents
 */
export default function Home() {
  const [gameState, setGameState] = useState<GameState>(initializeGame());

  const handleCellClick = (row: number, col: number) => {
    const newGameState = makeMove(gameState, row, col);
    setGameState(newGameState);
  };

  const handleNewGame = () => {
    setGameState(initializeGame());
  };

  const handleUndo = () => {
    const newGameState = undoMove(gameState);
    setGameState(newGameState);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Main board area */}
      <GomokuBoard gameState={gameState} onCellClick={handleCellClick} />

      {/* Control panel */}
      <div className="w-full md:w-80 bg-card border-t md:border-t-0 md:border-l border-border flex flex-col">
        <GamePanel
          gameState={gameState}
          onNewGame={handleNewGame}
          onUndo={handleUndo}
          canUndo={gameState.moveHistory.length > 0}
        />
      </div>
    </div>
  );
}
