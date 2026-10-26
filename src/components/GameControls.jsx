import React from 'react';
import { Play, Pause, RotateCcw, Lightbulb, Grid3X3, Zap, Shield, Flame } from 'lucide-react';

export default function GameControls({
  status,
  mode,
  setMode,
  gridSize,
  setGridSize,
  difficulty,
  setDifficulty,
  hintAvailable,
  onStart,
  onReplaySequence,
  onTogglePause,
  onReset,
  theme
}) {
  const isGameRunning = status === 'demonstrating' || status === 'userTurn' || status === 'paused';

  return (
    <div className="controls-container">
      {/* Primary Action Buttons */}
      <div className="primary-actions">
        {status === 'idle' || status === 'gameOver' ? (
          <button
            type="button"
            className="btn btn-primary start-btn pulse-glow"
            onClick={onStart}
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              boxShadow: `0 0 25px ${theme.glow}`
            }}
          >
            <Play size={20} fill="currentColor" />
            <span>{status === 'gameOver' ? 'Play Again' : 'Initiate Echo'}</span>
          </button>
        ) : (
          <div className="ingame-action-group">
            <button
              type="button"
              className="btn btn-secondary pause-btn"
              onClick={onTogglePause}
            >
              {status === 'paused' ? (
                <>
                  <Play size={18} fill="currentColor" /> Resume
                </>
              ) : (
                <>
                  <Pause size={18} /> Pause
                </>
              )}
            </button>

            {mode === 'sequence' && (
              <button
                type="button"
                className={`btn btn-hint ${!hintAvailable ? 'disabled' : ''}`}
                onClick={onReplaySequence}
                disabled={!hintAvailable || status !== 'userTurn'}
                title={hintAvailable ? 'Replay sequence echo' : 'Hint used for this level'}
              >
                <Lightbulb size={18} color={hintAvailable ? '#f59e0b' : '#6b7280'} />
                <span>Replay</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary reset-btn"
              onClick={onReset}
              title="Quit to Menu"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Mode & Configuration Pickers */}
      <div className="settings-panel">
        {/* Mode Selector */}
        <div className="setting-group">
          <label className="setting-label">Mode</label>
          <div className="pill-group">
            <button
              type="button"
              className={`pill-btn ${mode === 'sequence' ? 'active' : ''}`}
              onClick={() => !isGameRunning && setMode('sequence')}
              disabled={isGameRunning}
              style={mode === 'sequence' ? { background: theme.primary, color: '#fff' } : {}}
            >
              Sequence
            </button>
            <button
              type="button"
              className={`pill-btn ${mode === 'matrix' ? 'active' : ''}`}
              onClick={() => !isGameRunning && setMode('matrix')}
              disabled={isGameRunning}
              style={mode === 'matrix' ? { background: theme.primary, color: '#fff' } : {}}
            >
              <span className="text-desktop">Spatial Matrix</span>
              <span className="text-mobile">Matrix</span>
            </button>
            <button
              type="button"
              className={`pill-btn ${mode === 'match' ? 'active' : ''}`}
              onClick={() => !isGameRunning && setMode('match')}
              disabled={isGameRunning}
              style={mode === 'match' ? { background: theme.primary, color: '#fff' } : {}}
            >
              <span className="text-desktop">Pairs Match</span>
              <span className="text-mobile">Pairs</span>
            </button>
          </div>
        </div>

        {/* Grid Size & Difficulty */}
        <div className="settings-sub-row">
          <div className="setting-group compact">
            <label className="setting-label">
              <Grid3X3 size={13} className="inline-icon" /> Grid Size
            </label>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-btn ${gridSize === 3 ? 'active' : ''}`}
                onClick={() => !isGameRunning && setGridSize(3)}
                disabled={isGameRunning}
                style={gridSize === 3 ? { borderColor: theme.secondary, color: theme.secondary } : {}}
              >
                3 × 3
              </button>
              <button
                type="button"
                className={`pill-btn ${gridSize === 4 ? 'active' : ''}`}
                onClick={() => !isGameRunning && setGridSize(4)}
                disabled={isGameRunning}
                style={gridSize === 4 ? { borderColor: theme.secondary, color: theme.secondary } : {}}
              >
                4 × 4
              </button>
            </div>
          </div>

          <div className="setting-group compact">
            <label className="setting-label">
              <Zap size={13} className="inline-icon" /> Speed & Rules
            </label>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-btn ${difficulty === 'relaxed' ? 'active' : ''}`}
                onClick={() => !isGameRunning && setDifficulty('relaxed')}
                disabled={isGameRunning}
                title="Relaxed tempo + extra lives"
                style={difficulty === 'relaxed' ? { borderColor: '#10b981', color: '#10b981' } : {}}
              >
                <Shield size={12} className="inline-icon" /> Zen
              </button>
              <button
                type="button"
                className={`pill-btn ${difficulty === 'standard' ? 'active' : ''}`}
                onClick={() => !isGameRunning && setDifficulty('standard')}
                disabled={isGameRunning}
                title="Standard tempo and multiplier"
                style={difficulty === 'standard' ? { borderColor: theme.primary, color: theme.primary } : {}}
              >
                Normal
              </button>
              <button
                type="button"
                className={`pill-btn ${difficulty === 'hyper' ? 'active' : ''}`}
                onClick={() => !isGameRunning && setDifficulty('hyper')}
                disabled={isGameRunning}
                title="Hyper speed + double score growth"
                style={difficulty === 'hyper' ? { borderColor: '#f97316', color: '#f97316' } : {}}
              >
                <Flame size={12} className="inline-icon" /> Hyper
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
