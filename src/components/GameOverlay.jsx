import React from 'react';
import { Trophy, RotateCcw, X, Target, Zap, Award, Flame, Play, Volume2, HelpCircle } from 'lucide-react';

export default function GameOverlay({
  status,
  countdown,
  score,
  highScore,
  level,
  stats,
  mode,
  theme,
  onRestart,
  onResume,
  onCloseHelp,
  showHelp
}) {
  const isNewRecord = score > 0 && score >= highScore;
  const accuracy = stats.totalClicks > 0
    ? Math.round((stats.correctClicks / stats.totalClicks) * 100)
    : 100;

  // Render Help Modal
  if (showHelp) {
    return (
      <div className="overlay-backdrop">
        <div className="overlay-modal help-modal">
          <div className="modal-header">
            <div className="modal-title-row">
              <HelpCircle size={22} color={theme.primary} />
              <h2>How to Play EchoMind</h2>
            </div>
            <button className="close-btn" onClick={onCloseHelp} aria-label="Close Help">
              <X size={20} />
            </button>
          </div>

          <div className="help-content">
            <div className="help-section">
              <h3 style={{ color: theme.primary }}>1. Sequence Echo</h3>
              <p>
                Observe the sequence of glowing sonic tiles. When your turn arrives, repeat the sequence in exact chronological order. Each successful round appends a new tile to the stream.
              </p>
            </div>

            <div className="help-section">
              <h3 style={{ color: theme.secondary }}>2. Spatial Matrix</h3>
              <p>
                A cluster of tiles flashes into existence for a split second. Memorize their spatial coordinates and tap all the target tiles without triggering error sectors.
              </p>
            </div>

            <div className="help-section">
              <h3 style={{ color: theme.accent }}>3. Sensory Pairs</h3>
              <p>
                Flip cards to match identical geometric symbols and audio chords. Clear all pairs in minimal turns to boost your memory score.
              </p>
            </div>

            <div className="help-section shortcut-section">
              <h4>Keyboard Shortcuts</h4>
              <div className="shortcut-tags">
                <span className="kbd-badge">1 - 9</span>
                <span className="kbd-desc">or</span>
                <span className="kbd-badge">Q W E / A S D / Z X C</span>
                <span className="kbd-desc">Direct tile triggers</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary modal-action-btn"
            onClick={onCloseHelp}
            style={{ background: theme.primary }}
          >
            Got It, Let's Train!
          </button>
        </div>
      </div>
    );
  }

  // Render Countdown
  if (status === 'countdown') {
    return (
      <div className="overlay-backdrop countdown-backdrop">
        <div className="countdown-ring" style={{ borderColor: theme.primary, boxShadow: `0 0 50px ${theme.glow}` }}>
          <span className="countdown-number" style={{ color: theme.primary }}>
            {countdown > 0 ? countdown : 'ECHO!'}
          </span>
        </div>
      </div>
    );
  }

  // Render Paused
  if (status === 'paused') {
    return (
      <div className="overlay-backdrop">
        <div className="overlay-modal pause-modal">
          <h2>Game Paused</h2>
          <p>Take a breath and steady your focus.</p>
          <div className="modal-buttons">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onResume}
              style={{ background: theme.primary }}
            >
              <Play size={18} fill="currentColor" /> Resume
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onRestart}
            >
              <RotateCcw size={18} /> Restart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Game Over
  if (status === 'gameOver') {
    return (
      <div className="overlay-backdrop">
        <div className="overlay-modal game-over-modal">
          {isNewRecord && (
            <div className="new-record-badge pulse-glow" style={{ background: theme.accent }}>
              <Award size={16} /> NEW HIGH SCORE!
            </div>
          )}

          <h2 className="modal-heading">Mind Disrupted</h2>
          <p className="modal-sub">Neural sync lost at Level {level}</p>

          <div className="score-spotlight" style={{ borderColor: theme.primary }}>
            <span className="spotlight-label">Final Score</span>
            <span className="spotlight-value" style={{ color: theme.primary }}>
              {score.toLocaleString()}
            </span>
          </div>

          {/* Performance Stats Matrix */}
          <div className="modal-stats-matrix">
            <div className="mini-stat">
              <span className="mini-stat-label">
                <Trophy size={14} color="#f59e0b" /> Best
              </span>
              <span className="mini-stat-val">{highScore.toLocaleString()}</span>
            </div>

            <div className="mini-stat">
              <span className="mini-stat-label">
                <Target size={14} color="#06b6d4" /> Accuracy
              </span>
              <span className="mini-stat-val">{accuracy}%</span>
            </div>

            <div className="mini-stat">
              <span className="mini-stat-label">
                <Flame size={14} color="#f97316" /> Max Streak
              </span>
              <span className="mini-stat-val">{stats.maxStreak}</span>
            </div>

            <div className="mini-stat">
              <span className="mini-stat-label">
                <Zap size={14} color="#8b5cf6" /> Rounds
              </span>
              <span className="mini-stat-val">{stats.roundsCompleted}</span>
            </div>
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              className="btn btn-primary retry-btn pulse-glow"
              onClick={onRestart}
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                boxShadow: `0 0 20px ${theme.glow}`
              }}
            >
              <RotateCcw size={18} /> Re-Synchronize (Play Again)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
