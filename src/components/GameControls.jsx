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
  // Game is actively running through all stages: countdown, demonstrating, userTurn, roundSuccess, paused
  const isGameActive = status !== 'idle' && status !== 'gameOver';

  return (
    <div className="controls-container">
      {/* Primary Action Buttons */}
      <div className="primary-actions">
        {!isGameActive ? (
          <button
            type="button"
            className="btn btn-primary start-btn pulse-glow"
            onClick={onStart}
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              boxShadow: `0 0 20px ${theme.glow}`
            }}
          >
            <Play size={18} fill="currentColor" />
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
                  <Play size={16} fill="currentColor" /> Resume
                </>
              ) : (
                <>
                  <Pause size={16} /> Pause
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
                <Lightbulb size={16} color={hintAvailable ? '#f59e0b' : '#6b7280'} />
                <span>Replay</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary reset-btn"
              onClick={onReset}
              title="Quit to Menu"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Mode & Configuration Pickers - ONLY shown on idle start screen, NEVER during active gameplay or round transitions */}
      {status === 'idle' && (
        <div className="settings-panel">
          {/* Mode Selector */}
          <div className="setting-group">
            <span className="setting-label">Mode</span>
            <div className="pill-group">
              <button
                type="button"
                className={`pill-btn ${mode === 'sequence' ? 'active' : ''}`}
                onClick={() => setMode('sequence')}
                style={mode === 'sequence' ? { background: theme.primary, color: '#fff' } : {}}
              >
                Sequence
              </button>
              <button
                type="button"
                className={`pill-btn ${mode === 'matrix' ? 'active' : ''}`}
                onClick={() => setMode('matrix')}
                style={mode === 'matrix' ? { background: theme.primary, color: '#fff' } : {}}
              >
                <span className="text-desktop">Spatial Matrix</span>
                <span className="text-mobile">Matrix</span>
              </button>
              <button
                type="button"
                className={`pill-btn ${mode === 'match' ? 'active' : ''}`}
                onClick={() => setMode('match')}
                style={mode === 'match' ? { background: theme.primary, color: '#fff' } : {}}
              >
                <span className="text-desktop">Pairs Match</span>
                <span className="text-mobile">Pairs</span>
              </button>
            </div>
          </div>

          {/* Grid Size & Difficulty in single compact row */}
          <div className="settings-sub-row">
            <div className="setting-group compact">
              <span className="setting-label">
                <Grid3X3 size={12} className="inline-icon" /> Grid
              </span>
              <div className="pill-group">
                <button
                  type="button"
                  className={`pill-btn ${gridSize === 3 ? 'active' : ''}`}
                  onClick={() => setGridSize(3)}
                  style={gridSize === 3 ? { borderColor: theme.secondary, color: theme.secondary } : {}}
                >
                  3 × 3
                </button>
                <button
                  type="button"
                  className={`pill-btn ${gridSize === 4 ? 'active' : ''}`}
                  onClick={() => setGridSize(4)}
                  style={gridSize === 4 ? { borderColor: theme.secondary, color: theme.secondary } : {}}
                >
                  4 × 4
                </button>
              </div>
            </div>

            <div className="setting-group compact">
              <span className="setting-label">
                <Zap size={12} className="inline-icon" /> Tempo
              </span>
              <div className="pill-group">
                <button
                  type="button"
                  className={`pill-btn ${difficulty === 'relaxed' ? 'active' : ''}`}
                  onClick={() => setDifficulty('relaxed')}
                  title="Relaxed tempo + extra lives"
                  style={difficulty === 'relaxed' ? { borderColor: '#10b981', color: '#10b981' } : {}}
                >
                  <Shield size={11} className="inline-icon" /> Zen
                </button>
                <button
                  type="button"
                  className={`pill-btn ${difficulty === 'standard' ? 'active' : ''}`}
                  onClick={() => setDifficulty('standard')}
                  title="Standard tempo and multiplier"
                  style={difficulty === 'standard' ? { borderColor: theme.primary, color: theme.primary } : {}}
                >
                  Normal
                </button>
                <button
                  type="button"
                  className={`pill-btn ${difficulty === 'hyper' ? 'active' : ''}`}
                  onClick={() => setDifficulty('hyper')}
                  title="Hyper speed + double score growth"
                  style={difficulty === 'hyper' ? { borderColor: '#f97316', color: '#f97316' } : {}}
                >
                  <Flame size={11} className="inline-icon" /> Hyper
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
