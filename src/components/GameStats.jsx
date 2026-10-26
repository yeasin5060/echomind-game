import React from 'react';
import { Trophy, Flame, Zap, Heart, Target, Layers } from 'lucide-react';

export default function GameStats({
  score,
  highScore,
  level,
  streak,
  multiplier,
  lives,
  status,
  theme,
  mode,
  difficulty
}) {
  const getStatusText = () => {
    switch (status) {
      case 'idle':
        return 'Press Start to Begin';
      case 'countdown':
        return 'Prepare Your Mind...';
      case 'demonstrating':
        return 'Observe the Echo Pattern';
      case 'userTurn':
        return 'Echo the Pattern!';
      case 'roundSuccess':
        return 'Perfect Recall! +Level';
      case 'gameOver':
        return 'Pattern Disrupted';
      case 'paused':
        return 'Game Paused';
      default:
        return 'EchoMind';
    }
  };

  const showLives = mode === 'matrix' || mode === 'match' || difficulty === 'relaxed';

  return (
    <div className="stats-container">
      {/* Primary Status Banner */}
      <div
        className={`status-banner status-${status}`}
        style={{
          borderColor: status === 'userTurn' ? theme.primary : `${theme.secondary}40`,
          boxShadow: status === 'userTurn' ? `0 0 15px ${theme.glow}` : 'none'
        }}
      >
        <span className="status-dot" style={{ background: status === 'userTurn' ? theme.secondary : theme.primary }} />
        <span className="status-label">{getStatusText()}</span>
      </div>

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        {/* Score Card */}
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-icon-wrapper" style={{ background: `${theme.primary}20` }}>
              <Target size={16} color={theme.primary} />
            </span>
            <span className="stat-name">Score</span>
            {multiplier > 1 && (
              <span
                className="multiplier-pill pulse-glow"
                style={{ background: theme.accent, color: '#fff' }}
              >
                <Zap size={11} className="inline-icon" /> {multiplier}x
              </span>
            )}
          </div>
          <div className="stat-value primary-val">{score.toLocaleString()}</div>
        </div>

        {/* High Score Card */}
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
              <Trophy size={16} color="#f59e0b" />
            </span>
            <span className="stat-name">Best</span>
          </div>
          <div className="stat-value">{highScore.toLocaleString()}</div>
        </div>

        {/* Level / Round Card */}
        <div className="stat-card">
          <div className="stat-top">
            <span className="stat-icon-wrapper" style={{ background: `${theme.secondary}20` }}>
              <Layers size={16} color={theme.secondary} />
            </span>
            <span className="stat-name">Level</span>
          </div>
          <div className="stat-value level-val" style={{ color: theme.secondary }}>
            {level}
          </div>
        </div>

        {/* Streak / Lives Card */}
        {showLives ? (
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                <Heart size={16} color="#ef4444" />
              </span>
              <span className="stat-name">Lives</span>
            </div>
            <div className="stat-value lives-row">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  size={18}
                  fill={i < lives ? '#ef4444' : 'transparent'}
                  color={i < lives ? '#ef4444' : '#4b5563'}
                  className={i < lives ? 'heart-active' : 'heart-empty'}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-icon-wrapper" style={{ background: 'rgba(249, 115, 22, 0.2)' }}>
                <Flame size={16} color="#f97316" />
              </span>
              <span className="stat-name">Streak</span>
            </div>
            <div className="stat-value streak-val" style={{ color: streak > 2 ? '#f97316' : 'inherit' }}>
              {streak} <span className="stat-sub">combo</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
