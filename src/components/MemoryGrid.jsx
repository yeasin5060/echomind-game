import React, { useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';

// Geometric glyphs for tiles
const TILE_GLYPHS = ['▲', '◆', '●', '✦', '★', '⬡', '◈', '❖', '✺', '■', '▼', '◀', '▶', '✷', '✸', '⬢'];

// Keyboard key mappings
const KEY_MAP_3X3 = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const KEY_MAP_3X3_KEYS = ['q', 'w', 'e', 'a', 's', 'd', 'z', 'x', 'c'];
const KEY_MAP_4X4 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'q', 'w', 'e', 'r', 't', 'y'];

// Distinct vibrant tile hues for harmonious visual echo
const TILE_HUES = [
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#d946ef', // Fuchsia
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#eab308', // Yellow
  '#ef4444', // Red
  '#a855f7', // Purple
  '#0ea5e9', // Sky
  '#22c55e'  // Green
];

export default function MemoryGrid({
  gridSize,
  mode,
  status,
  activeTiles,
  matrixTargets,
  matrixFound,
  matrixMistakes,
  cards,
  onTileClick,
  theme
}) {
  const totalTiles = gridSize * gridSize;

  // Handle keyboard inputs
  const handleKeyDown = useCallback((e) => {
    if (status !== 'userTurn') return;
    const key = e.key.toLowerCase();

    if (gridSize === 3) {
      // Allow number keys 1-9 or QWE/ASD/ZXC
      const numIdx = KEY_MAP_3X3.indexOf(key);
      if (numIdx !== -1) {
        onTileClick(numIdx);
        return;
      }
      const charIdx = KEY_MAP_3X3_KEYS.indexOf(key);
      if (charIdx !== -1) {
        onTileClick(charIdx);
        return;
      }
    } else if (gridSize === 4) {
      const idx = KEY_MAP_4X4.indexOf(key);
      if (idx !== -1 && idx < 16) {
        onTileClick(idx);
      }
    }
  }, [status, gridSize, onTileClick]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getKeyLabel = (index) => {
    if (gridSize === 3) {
      return `${index + 1}`;
    }
    return KEY_MAP_4X4[index]?.toUpperCase() || '';
  };

  // Render Match Mode (3D Card Flip)
  if (mode === 'match' && cards && cards.length === totalTiles) {
    return (
      <div
        className={`memory-grid grid-${gridSize}x${gridSize} match-grid`}
        style={{
          '--grid-cols': gridSize,
          '--theme-primary': theme.primary
        }}
      >
        {cards.map((card, index) => {
          const isFlipped = card.isFlipped || card.isMatched;
          const cardHue = card.pairId >= 0 ? TILE_HUES[card.pairId % TILE_HUES.length] : theme.primary;

          return (
            <button
              key={card.id || index}
              type="button"
              className={`memory-tile card-tile ${isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
              onClick={() => onTileClick(index)}
              disabled={status !== 'userTurn' || card.isMatched || card.isFlipped}
              aria-label={`Card ${index + 1}`}
              style={{
                '--card-hue': cardHue,
                boxShadow: isFlipped ? `0 0 18px ${cardHue}60` : 'none'
              }}
            >
              <div className="card-inner">
                <div className="card-front">
                  <span className="card-back-pattern">◈</span>
                  <span className="tile-key-hint">{getKeyLabel(index)}</span>
                </div>
                <div
                  className="card-back"
                  style={{
                    background: card.isMatched ? `${cardHue}25` : `${cardHue}15`,
                    borderColor: cardHue
                  }}
                >
                  <span className="card-symbol" style={{ color: cardHue }}>
                    {card.value}
                  </span>
                  {card.isMatched && (
                    <span className="matched-badge" style={{ background: cardHue }}>
                      <Check size={12} color="#fff" />
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Render Sequence & Matrix Modes
  return (
    <div
      className={`memory-grid grid-${gridSize}x${gridSize}`}
      style={{
        '--grid-cols': gridSize,
        '--theme-primary': theme.primary
      }}
    >
      {[...Array(totalTiles)].map((_, index) => {
        const isActive = activeTiles.includes(index);
        const tileHue = TILE_HUES[index % TILE_HUES.length];
        const glyph = TILE_GLYPHS[index % TILE_GLYPHS.length];

        // Matrix Mode state flags
        const isMatrixTarget = mode === 'matrix' && matrixTargets?.has(index);
        const isMatrixFound = mode === 'matrix' && matrixFound?.has(index);
        const isMatrixMistake = mode === 'matrix' && matrixMistakes?.has(index);

        let dynamicStyle = {
          '--tile-hue': tileHue
        };

        if (isActive) {
          dynamicStyle = {
            ...dynamicStyle,
            backgroundColor: tileHue,
            borderColor: '#ffffff',
            boxShadow: `0 0 30px ${tileHue}, 0 0 60px ${tileHue}80`,
            transform: 'scale(0.96)'
          };
        } else if (isMatrixFound) {
          dynamicStyle = {
            ...dynamicStyle,
            backgroundColor: `${tileHue}30`,
            borderColor: tileHue,
            boxShadow: `0 0 20px ${tileHue}50`
          };
        } else if (isMatrixMistake) {
          dynamicStyle = {
            ...dynamicStyle,
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
            borderColor: '#ef4444',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)'
          };
        }

        return (
          <button
            key={index}
            type="button"
            className={`memory-tile ${isActive ? 'tile-active' : ''} ${isMatrixFound ? 'tile-found' : ''} ${isMatrixMistake ? 'tile-mistake' : ''}`}
            onClick={() => onTileClick(index)}
            disabled={status !== 'userTurn' || isMatrixFound || isMatrixMistake}
            style={dynamicStyle}
            aria-label={`Tile ${index + 1}`}
          >
            <div className="tile-ambient-glow" style={{ background: tileHue }} />

            <div className="tile-content">
              <span className="tile-glyph" style={{ color: isActive ? '#fff' : tileHue }}>
                {isMatrixFound ? (
                  <Check size={26} color={tileHue} strokeWidth={3} />
                ) : isMatrixMistake ? (
                  <X size={26} color="#ef4444" strokeWidth={3} />
                ) : (
                  glyph
                )}
              </span>
              <span className="tile-key-hint">{getKeyLabel(index)}</span>
            </div>

            {/* Ripple Pulse wave when active */}
            {isActive && <div className="tile-ripple" style={{ borderColor: tileHue }} />}
          </button>
        );
      })}
    </div>
  );
}
