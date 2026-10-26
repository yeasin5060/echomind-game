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
        return 'Sequence';
      case 'matrix':
        return 'Matrix';
      case 'match':
        return 'Pairs';
      default:
        return 'Memory';
    }
  };

  return (
    <header className="game-header">
      <div className="header-brand">
        <div className="brand-logo" style={{ boxShadow: `0 0 15px ${theme.glow}` }}>
          <Brain className="logo-icon" size={20} color={theme.primary} />
          <div className="logo-sparkle">
            <Sparkles size={9} color={theme.secondary} />
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
            <RotateCcw size={15} />
          </button>
        )}

        <button
          className="action-btn"
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          aria-label={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          style={soundEnabled ? { color: theme.secondary } : { opacity: 0.6 }}
        >
          {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
        </button>

        <button
          className="action-btn"
          onClick={cycleTheme}
          title={`Theme: ${theme.name}`}
          aria-label="Cycle Color Theme"
        >
          <Palette size={15} />
        </button>

        <button
          className="action-btn"
          onClick={onOpenHelp}
          title="How to Play"
          aria-label="How to Play"
        >
          <HelpCircle size={15} />
        </button>
      </div>
    </header>
  );
}
