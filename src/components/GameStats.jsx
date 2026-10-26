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
        return 'Ready to Train';
      case 'countdown':
        return 'Focus Your Mind...';
      case 'demonstrating':
        return 'Observe Echo';
      case 'userTurn':
        return 'Your Turn: Echo!';
      case 'roundSuccess':
        return 'Perfect Recall! +Level';
      case 'gameOver':
        return 'Memory Disrupted';
      case 'paused':
        return 'Paused';
      default:
        return 'EchoMind';
    }
  };

  const showLives = mode === 'matrix' || mode === 'match' || difficulty === 'relaxed';

  return (
    <div className="stats-container">
      {/* Sleek Integrated Status Bar */}
      <div
        className={`status-banner status-${status}`}
        style={{
          borderColor: status === 'userTurn' ? theme.primary : `${theme.secondary}30`,
          boxShadow: status === 'userTurn' ? `0 0 16px ${theme.glow}` : 'none'
        }}
      >
        <div className="status-indicator">
          <span
            className="status-dot"
            style={{ background: status === 'userTurn' ? theme.secondary : theme.primary }}
          />
          <span className="status-label">{getStatusText()}</span>
        </div>

        {multiplier > 1 && (
          <span
            className="multiplier-pill pulse-glow"
            style={{ background: theme.accent, color: '#fff' }}
          >
            <Zap size={11} className="inline-icon" /> {multiplier}x Boost
          </span>
        )}

        {showLives && (
          <div className="status-lives">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                size={14}
                fill={i < lives ? '#ef4444' : 'transparent'}
                color={i < lives ? '#ef4444' : '#6b7280'}
                className={i < lives ? 'heart-active' : 'heart-empty'}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4-Item Compact Stats Bar */}
      <div className="stats-grid">
        {/* Score */}
        <div className="stat-card">
          <div className="stat-top">
            <Target size={13} color={theme.primary} />
            <span className="stat-name">Score</span>
          </div>
          <div className="stat-value primary-val">{score.toLocaleString()}</div>
        </div>

        {/* Best */}
        <div className="stat-card">
          <div className="stat-top">
            <Trophy size={13} color="#f59e0b" />
            <span className="stat-name">Best</span>
          </div>
          <div className="stat-value">{highScore.toLocaleString()}</div>
        </div>

        {/* Level */}
        <div className="stat-card">
          <div className="stat-top">
            <Layers size={13} color={theme.secondary} />
            <span className="stat-name">Level</span>
          </div>
          <div className="stat-value level-val" style={{ color: theme.secondary }}>
            {level}
          </div>
        </div>

        {/* Streak */}
        <div className="stat-card">
          <div className="stat-top">
            <Flame size={13} color="#f97316" />
            <span className="stat-name">Streak</span>
          </div>
          <div className="stat-value streak-val" style={{ color: streak > 2 ? '#f97316' : 'inherit' }}>
            {streak}
          </div>
        </div>
      </div>
    </div>
  );
}
