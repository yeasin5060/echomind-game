import { useState } from 'react';
import { useMemoryGame } from './hooks/useMemoryGame';
import GameHeader from './components/GameHeader';
import GameStats from './components/GameStats';
import MemoryGrid from './components/MemoryGrid';
import GameControls from './components/GameControls';
import GameOverlay from './components/GameOverlay';

export default function App() {
  const [showHelp, setShowHelp] = useState(false);

  const {
    mode,
    setMode,
    gridSize,
    setGridSize,
    difficulty,
    setDifficulty,
    soundEnabled,
    setSoundEnabled,
    theme,
    cycleTheme,
    status,
    countdown,
    score,
    highScore,
    level,
    streak,
    multiplier,
    lives,
    hintAvailable,
    stats,
    activeTiles,
    targetSequence,
    playerInputSequence,
    matrixTargets,
    matrixFound,
    matrixMistakes,
    cards,
    startGame,
    handleTileClick,
    replaySequence,
    togglePause,
    resetGame
  } = useMemoryGame();

  const isMistakeActive = matrixMistakes?.size > 0 || status === 'gameOver';

  return (
    <div
      className={`app-container ${isMistakeActive ? 'screen-shake' : ''}`}
      style={{
        background: theme.bgGradient,
        '--theme-primary': theme.primary,
        '--theme-secondary': theme.secondary,
        '--theme-accent': theme.accent,
        '--theme-glow': theme.glow
      }}
    >
      {/* Dynamic Ambient Background Aura */}
      <div className="ambient-orb orb-primary" style={{ background: theme.primary }} />
      <div className="ambient-orb orb-secondary" style={{ background: theme.secondary }} />

      <main className="game-wrapper">
        <GameHeader
          theme={theme}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          cycleTheme={cycleTheme}
          onOpenHelp={() => setShowHelp(true)}
          onReset={resetGame}
          mode={mode}
          status={status}
        />

        <GameStats
          score={score}
          highScore={highScore}
          level={level}
          streak={streak}
          multiplier={multiplier}
          lives={lives}
          status={status}
          theme={theme}
          mode={mode}
          difficulty={difficulty}
        />

        <section className="grid-section" aria-label="Memory Game Board">
          <MemoryGrid
            gridSize={gridSize}
            mode={mode}
            status={status}
            activeTiles={activeTiles}
            matrixTargets={matrixTargets}
            matrixFound={matrixFound}
            matrixMistakes={matrixMistakes}
            cards={cards}
            onTileClick={handleTileClick}
            theme={theme}
          />
        </section>

        <GameControls
          status={status}
          mode={mode}
          setMode={setMode}
          gridSize={gridSize}
          setGridSize={setGridSize}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          hintAvailable={hintAvailable}
          onStart={startGame}
          onReplaySequence={replaySequence}
          onTogglePause={togglePause}
          onReset={resetGame}
          theme={theme}
        />

        <GameOverlay
          status={status}
          countdown={countdown}
          score={score}
          highScore={highScore}
          level={level}
          stats={stats}
          mode={mode}
          theme={theme}
          onRestart={startGame}
          onResume={togglePause}
          onCloseHelp={() => setShowHelp(false)}
          showHelp={showHelp}
        />
      </main>

      <footer className="game-footer">
        <p>EchoMind Cognitive Lab • Master working memory with auditory & spatial recall</p>
      </footer>
    </div>
  );
}
