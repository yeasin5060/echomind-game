import React from 'react';
import { Volume2, VolumeX, Palette, HelpCircle, RotateCcw, Brain, Sparkles } from 'lucide-react';

export default function GameHeader({
  theme,
  soundEnabled,
  setSoundEnabled,
  cycleTheme,
  onOpenHelp,
  onReset,
  mode,
  status
}) {
  const getModeTitle = () => {
    switch (mode) {
      case 'sequence':
        return 'Sequence Echo';
      case 'matrix':
        return 'Spatial Recall';
      case 'match':
        return 'Sensory Pairs';
      default:
        return 'Memory Training';
    }
  };

  return (
    <header className="game-header">
      <div className="header-brand">
        <div className="brand-logo" style={{ boxShadow: `0 0 20px ${theme.glow}` }}>
          <Brain className="logo-icon" size={26} color={theme.primary} />
          <div className="logo-sparkle">
            <Sparkles size={12} color={theme.secondary} />
          </div>
        </div>
        <div className="brand-text">
          <div className="title-row">
            <h1 className="brand-title">
              Echo<span style={{ color: theme.primary }}>Mind</span>
            </h1>
            <span
              className="mode-badge"
              style={{
                borderColor: `${theme.primary}50`,
                background: `${theme.primary}18`,
                color: theme.primary
              }}
            >
              {getModeTitle()}
            </span>
          </div>
          <p className="brand-tagline">Cognitive working memory & pattern training</p>
        </div>
      </div>

      <div className="header-actions">
        {status !== 'idle' && (
          <button
            className="action-btn"
            onClick={onReset}
            title="Reset Game"
            aria-label="Reset Game"
          >
            <RotateCcw size={18} />
          </button>
        )}

        <button
          className="action-btn"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          aria-label={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          style={soundEnabled ? { color: theme.secondary } : { opacity: 0.6 }}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <button
          className="action-btn"
          onClick={cycleTheme}
          title={`Current Theme: ${theme.name}. Click to cycle`}
          aria-label="Cycle Color Theme"
        >
          <Palette size={18} />
        </button>

        <button
          className="action-btn"
          onClick={onOpenHelp}
          title="How to Play"
          aria-label="How to Play"
        >
          <HelpCircle size={18} />
        </button>
      </div>
    </header>
  );
}
