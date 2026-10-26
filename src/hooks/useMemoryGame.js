import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';

// Musical scale for tile tones (Pentatonic Major / Ambient Synth scale for harmonious sound)
const TILE_FREQUENCIES = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.00, // G4
  440.00, // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.00, // A5
  1046.50, // C6
  1174.66, // D6
  1318.51, // E6
  1567.98, // G6
  1760.00, // A6
  2093.00  // C7
];

const THEMES = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    accent: '#f43f5e',
    glow: 'rgba(139, 92, 246, 0.4)',
    bgGradient: 'radial-gradient(circle at 50% 20%, #1e113a 0%, #0d091a 60%, #06040b 100%)'
  },
  aurora: {
    id: 'aurora',
    name: 'Cosmic Aurora',
    primary: '#10b981',
    secondary: '#6366f1',
    accent: '#ec4899',
    glow: 'rgba(16, 185, 129, 0.4)',
    bgGradient: 'radial-gradient(circle at 50% 20%, #0b2528 0%, #06151c 60%, #02070a 100%)'
  },
  synthwave: {
    id: 'synthwave',
    name: 'Sunset Synth',
    primary: '#f59e0b',
    secondary: '#ec4899',
    accent: '#8b5cf6',
    glow: 'rgba(245, 158, 11, 0.4)',
    bgGradient: 'radial-gradient(circle at 50% 20%, #291024 0%, #17071c 60%, #0a020d 100%)'
  },
  matrix: {
    id: 'matrix',
    name: 'Matrix Code',
    primary: '#22c55e',
    secondary: '#14b8a6',
    accent: '#84cc16',
    glow: 'rgba(34, 197, 94, 0.4)',
    bgGradient: 'radial-gradient(circle at 50% 20%, #072613 0%, #03140a 60%, #010804 100%)'
  }
};

export function useMemoryGame() {
  // Game Configuration State
  const [mode, setMode] = useState(() => localStorage.getItem('echomind_mode') || 'sequence');
  const [gridSize, setGridSize] = useState(3); // 3x3 = 9 tiles, 4x4 = 16 tiles
  const [difficulty, setDifficulty] = useState('standard'); // 'relaxed', 'standard', 'hyper'
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('echomind_sound') !== 'false');
  const [theme, setTheme] = useState(() => localStorage.getItem('echomind_theme') || 'cyberpunk');

  // Game Loop State
  // Statuses: 'idle' | 'countdown' | 'demonstrating' | 'userTurn' | 'roundSuccess' | 'gameOver' | 'paused'
  const [status, setStatus] = useState('idle');
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem(`echomind_highscore_${mode}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [lives, setLives] = useState(3);
  const [hintAvailable, setHintAvailable] = useState(true);

  // Active highlighted tile(s)
  const [activeTiles, setActiveTiles] = useState([]); // indices currently lit
  const [playerInputSequence, setPlayerInputSequence] = useState([]);
  const [targetSequence, setTargetSequence] = useState([]);
  
  // Matrix pattern mode specific
  const [matrixTargets, setMatrixTargets] = useState(new Set());
  const [matrixFound, setMatrixFound] = useState(new Set());
  const [matrixMistakes, setMatrixMistakes] = useState(new Set());

  // Match mode specific (pairs)
  const [cards, setCards] = useState([]); // [{ id, value, isFlipped, isMatched }]
  const [flippedCards, setFlippedCards] = useState([]);

  // Stats tracking
  const [stats, setStats] = useState({
    totalClicks: 0,
    correctClicks: 0,
    maxStreak: 0,
    roundsCompleted: 0
  });

  // Audio Context Ref
  const audioCtxRef = useRef(null);

  // Initialize or resume AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Play custom tone via Web Audio API
  const playTone = useCallback((frequency, duration = 0.28, type = 'sine') => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Smooth attack and release envelope to prevent clicks
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [soundEnabled, getAudioContext]);

  // Audio helper sounds
  const playTileTone = useCallback((tileIndex) => {
    const freq = TILE_FREQUENCIES[tileIndex % TILE_FREQUENCIES.length] || 440;
    playTone(freq, 0.32, 'triangle');
  }, [playTone]);

  const playSuccessSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          playTone(freq, 0.2, 'sine');
        }, idx * 75);
      });
    } catch {}
  }, [soundEnabled, getAudioContext, playTone]);

  const playErrorSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      // Low detuned buzz
      playTone(130.81, 0.45, 'sawtooth');
      setTimeout(() => playTone(123.47, 0.35, 'sawtooth'), 80);
    } catch {}
  }, [soundEnabled, getAudioContext, playTone]);

  const playGameOverSound = useCallback(() => {
    if (!soundEnabled) return;
    const chords = [392, 349.23, 311.13, 261.63];
    chords.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 0.35, 'triangle'), idx * 120);
    });
  }, [soundEnabled, playTone]);

  // Speed calculation based on difficulty and level
  const getPlaybackSpeed = useCallback(() => {
    let base = 550;
    if (difficulty === 'relaxed') base = 700;
    if (difficulty === 'hyper') base = 380;
    // Speed increases with level, minimum threshold
    return Math.max(160, base - (level * 22));
  }, [difficulty, level]);

  // Trigger celebratory confetti
  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981', '#f59e0b']
      });
    } catch {}
  }, []);

  // Update High Score if needed
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem(`echomind_highscore_${mode}`, score.toString());
    }
  }, [score, highScore, mode]);

  // Save settings in localStorage
  useEffect(() => {
    localStorage.setItem('echomind_sound', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('echomind_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('echomind_mode', mode);
    const savedHigh = localStorage.getItem(`echomind_highscore_${mode}`);
    setHighScore(savedHigh ? parseInt(savedHigh, 10) : 0);
  }, [mode]);

  // Update multiplier according to streak
  useEffect(() => {
    if (streak >= 12) setMultiplier(4);
    else if (streak >= 7) setMultiplier(3);
    else if (streak >= 3) setMultiplier(2);
    else setMultiplier(1);
  }, [streak]);

  // Total tiles count
  const totalTiles = gridSize * gridSize;

  // Initialize a new game round for Match Mode
  const initMatchCards = useCallback(() => {
    const numPairs = Math.floor(totalTiles / 2);
    const symbols = ['◈', '◉', '▲', '✦', '◆', '❖', '★', '⬡', '✺', '⬢', '✷', '✸'];
    const selectedSymbols = symbols.slice(0, numPairs);
    const deck = [];

    selectedSymbols.forEach((sym, idx) => {
      deck.push({ id: `${idx}-a`, value: sym, pairId: idx, isFlipped: false, isMatched: false });
      deck.push({ id: `${idx}-b`, value: sym, pairId: idx, isFlipped: false, isMatched: false });
    });

    // If odd number of tiles (like 3x3=9), add one wild/bonus tile or dummy
    if (totalTiles % 2 !== 0) {
      deck.push({ id: 'wild', value: '⚡', pairId: -1, isFlipped: false, isMatched: true });
    }

    // Shuffle deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedCards([]);
  }, [totalTiles]);

  // Start a new round of Sequence mode
  const startSequenceRound = useCallback((nextLevel = 1, currentSeq = []) => {
    setLevel(nextLevel);
    setStatus('demonstrating');
    setActiveTiles([]);
    setPlayerInputSequence([]);

    // Add 1 random tile to the sequence
    const nextTile = Math.floor(Math.random() * totalTiles);
    const updatedSequence = [...currentSeq, nextTile];
    setTargetSequence(updatedSequence);

    // Playback sequence to user
    const stepDuration = getPlaybackSpeed();
    const pauseBetween = Math.max(90, stepDuration * 0.35);

    updatedSequence.forEach((tileIdx, i) => {
      setTimeout(() => {
        setActiveTiles([tileIdx]);
        playTileTone(tileIdx);

        setTimeout(() => {
          setActiveTiles([]);
        }, stepDuration - pauseBetween);
      }, (i + 1) * stepDuration);
    });

    // Hand over control to user after playback finishes
    setTimeout(() => {
      setActiveTiles([]);
      setStatus('userTurn');
    }, (updatedSequence.length + 1) * stepDuration + 100);
  }, [totalTiles, getPlaybackSpeed, playTileTone]);

  // Start a new round of Matrix Mode
  const startMatrixRound = useCallback((nextLevel = 1) => {
    setLevel(nextLevel);
    setStatus('demonstrating');
    setMatrixFound(new Set());
    setMatrixMistakes(new Set());

    // Calculate number of target tiles (starts at 3, scales up)
    const targetCount = Math.min(totalTiles - 2, 2 + Math.floor(nextLevel * 0.7));
    const targetSet = new Set();
    while (targetSet.size < targetCount) {
      targetSet.add(Math.floor(Math.random() * totalTiles));
    }
    setMatrixTargets(targetSet);
    setActiveTiles(Array.from(targetSet));

    // Flash for a limited time, then hide
    const flashDuration = Math.max(650, 1500 - (nextLevel * 80));
    setTimeout(() => {
      setActiveTiles([]);
      setStatus('userTurn');
    }, flashDuration);
  }, [totalTiles]);

  // Start or restart a game
  const startGame = useCallback(() => {
    getAudioContext();
    setScore(0);
    setStreak(0);
    setMultiplier(1);
    setLives(3);
    setHintAvailable(true);
    setStats({
      totalClicks: 0,
      correctClicks: 0,
      maxStreak: 0,
      roundsCompleted: 0
    });

    setStatus('countdown');
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        playTone(350 + count * 80, 0.12, 'sine');
      } else {
        clearInterval(interval);
        setCountdown(0);
        if (mode === 'sequence') {
          startSequenceRound(1, []);
        } else if (mode === 'matrix') {
          startMatrixRound(1);
        } else if (mode === 'match') {
          setLevel(1);
          initMatchCards();
          setStatus('userTurn');
        }
      }
    }, 700);
  }, [getAudioContext, mode, playTone, startSequenceRound, startMatrixRound, initMatchCards]);

  // Replay sequence (hint)
  const replaySequence = useCallback(() => {
    if (status !== 'userTurn' || mode !== 'sequence' || !hintAvailable) return;

    setHintAvailable(false);
    setStatus('demonstrating');
    setActiveTiles([]);
    setPlayerInputSequence([]);

    const stepDuration = getPlaybackSpeed();
    const pauseBetween = Math.max(90, stepDuration * 0.35);

    targetSequence.forEach((tileIdx, i) => {
      setTimeout(() => {
        setActiveTiles([tileIdx]);
        playTileTone(tileIdx);

        setTimeout(() => {
          setActiveTiles([]);
        }, stepDuration - pauseBetween);
      }, (i + 1) * stepDuration);
    });

    setTimeout(() => {
      setActiveTiles([]);
      setStatus('userTurn');
    }, (targetSequence.length + 1) * stepDuration + 100);
  }, [status, mode, hintAvailable, getPlaybackSpeed, targetSequence, playTileTone]);

  // Handle tile click in Sequence Mode
  const handleSequenceClick = useCallback((tileIndex) => {
    if (status !== 'userTurn') return;

    playTileTone(tileIndex);
    setActiveTiles([tileIndex]);
    setTimeout(() => setActiveTiles([]), 200);

    const nextInput = [...playerInputSequence, tileIndex];
    setPlayerInputSequence(nextInput);

    const currentIndex = nextInput.length - 1;
    const isCorrect = targetSequence[currentIndex] === tileIndex;

    setStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      correctClicks: prev.correctClicks + (isCorrect ? 1 : 0)
    }));

    if (!isCorrect) {
      // Mistake made!
      playErrorSound();
      setStreak(0);

      if (difficulty === 'relaxed' && lives > 1) {
        setLives(l => l - 1);
        setPlayerInputSequence([]);
        // Re-prompt the player
        setTimeout(() => {
          replaySequence();
        }, 600);
        return;
      }

      setStatus('gameOver');
      playGameOverSound();
      return;
    }

    // Correct tap
    const currentStreak = streak + 1;
    setStreak(currentStreak);
    setStats(prev => ({
      ...prev,
      maxStreak: Math.max(prev.maxStreak, currentStreak)
    }));

    // Check if finished entire sequence
    if (nextInput.length === targetSequence.length) {
      // Round completed!
      setStatus('roundSuccess');
      playSuccessSound();

      const pointsEarned = (100 * targetSequence.length) * multiplier;
      setScore(s => s + pointsEarned);
      setStats(prev => ({ ...prev, roundsCompleted: prev.roundsCompleted + 1 }));

      if ((level + 1) % 5 === 0) {
        triggerConfetti();
      }

      // Automatically give hint back every 3 levels
      if ((level + 1) % 3 === 0) {
        setHintAvailable(true);
      }

      setTimeout(() => {
        startSequenceRound(level + 1, targetSequence);
      }, 900);
    }
  }, [
    status,
    playTileTone,
    playerInputSequence,
    targetSequence,
    playErrorSound,
    streak,
    difficulty,
    lives,
    playGameOverSound,
    playSuccessSound,
    multiplier,
    level,
    triggerConfetti,
    startSequenceRound,
    replaySequence
  ]);

  // Handle tile click in Matrix Mode
  const handleMatrixClick = useCallback((tileIndex) => {
    if (status !== 'userTurn') return;
    if (matrixFound.has(tileIndex) || matrixMistakes.has(tileIndex)) return;

    setStats(prev => ({ ...prev, totalClicks: prev.totalClicks + 1 }));

    if (matrixTargets.has(tileIndex)) {
      // Correct tile!
      playTileTone(tileIndex);
      const updatedFound = new Set(matrixFound).add(tileIndex);
      setMatrixFound(updatedFound);
      setStats(prev => ({
        ...prev,
        correctClicks: prev.correctClicks + 1,
        maxStreak: Math.max(prev.maxStreak, streak + 1)
      }));
      setStreak(s => s + 1);
      setScore(s => s + (50 * multiplier));

      // Check if all found
      if (updatedFound.size === matrixTargets.size) {
        setStatus('roundSuccess');
        playSuccessSound();
        setStats(prev => ({ ...prev, roundsCompleted: prev.roundsCompleted + 1 }));
        if ((level + 1) % 4 === 0) triggerConfetti();

        setTimeout(() => {
          startMatrixRound(level + 1);
        }, 900);
      }
    } else {
      // Wrong tile!
      playErrorSound();
      setMatrixMistakes(new Set(matrixMistakes).add(tileIndex));
      setStreak(0);
      const remainingLives = lives - 1;
      setLives(remainingLives);

      if (remainingLives <= 0) {
        setStatus('gameOver');
        playGameOverSound();
      }
    }
  }, [
    status,
    matrixFound,
    matrixMistakes,
    matrixTargets,
    playTileTone,
    streak,
    multiplier,
    playSuccessSound,
    level,
    triggerConfetti,
    startMatrixRound,
    playErrorSound,
    lives,
    playGameOverSound
  ]);

  // Handle tile click in Match Mode
  const handleMatchCardClick = useCallback((index) => {
    if (status !== 'userTurn') return;
    const card = cards[index];
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    playTileTone(index);
    const updatedCards = [...cards];
    updatedCards[index] = { ...card, isFlipped: true };
    setCards(updatedCards);

    const nextFlipped = [...flippedCards, { ...card, index }];
    setFlippedCards(nextFlipped);

    if (nextFlipped.length === 2) {
      setStats(prev => ({ ...prev, totalClicks: prev.totalClicks + 1 }));
      const [first, second] = nextFlipped;

      if (first.pairId === second.pairId) {
        // Matched!
        setTimeout(() => {
          playSuccessSound();
          setCards(prevCards =>
            prevCards.map(c =>
              c.pairId === first.pairId ? { ...c, isMatched: true } : c
            )
          );
          setFlippedCards([]);
          setScore(s => s + (150 * multiplier));
          setStreak(s => s + 1);
          setStats(prev => ({
            ...prev,
            correctClicks: prev.correctClicks + 1,
            maxStreak: Math.max(prev.maxStreak, streak + 1)
          }));

          // Check if board cleared
          const remainingUnmatched = updatedCards.filter(
            c => !c.isMatched && c.pairId !== first.pairId && c.pairId !== -1
          );

          if (remainingUnmatched.length === 0) {
            setStatus('roundSuccess');
            triggerConfetti();
            setStats(prev => ({ ...prev, roundsCompleted: prev.roundsCompleted + 1 }));
            setTimeout(() => {
              setLevel(l => l + 1);
              initMatchCards();
              setStatus('userTurn');
            }, 1200);
          }
        }, 350);
      } else {
        // Not matched
        setTimeout(() => {
          playErrorSound();
          setCards(prevCards =>
            prevCards.map((c, i) =>
              i === first.index || i === second.index ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedCards([]);
          setStreak(0);
        }, 800);
      }
    }
  }, [
    status,
    cards,
    flippedCards,
    playTileTone,
    playSuccessSound,
    multiplier,
    streak,
    triggerConfetti,
    initMatchCards,
    playErrorSound
  ]);

  // Dispatch click to correct mode handler
  const handleTileClick = useCallback((tileIndex) => {
    if (mode === 'sequence') {
      handleSequenceClick(tileIndex);
    } else if (mode === 'matrix') {
      handleMatrixClick(tileIndex);
    } else if (mode === 'match') {
      handleMatchCardClick(tileIndex);
    }
  }, [mode, handleSequenceClick, handleMatrixClick, handleMatchCardClick]);

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (status === 'userTurn') {
      setStatus('paused');
    } else if (status === 'paused') {
      setStatus('userTurn');
    }
  }, [status]);

  // Reset / Quit
  const resetGame = useCallback(() => {
    setStatus('idle');
    setScore(0);
    setLevel(1);
    setStreak(0);
    setActiveTiles([]);
    setPlayerInputSequence([]);
    setTargetSequence([]);
    setMatrixFound(new Set());
    setMatrixMistakes(new Set());
    setFlippedCards([]);
  }, []);

  // Theme changer
  const cycleTheme = useCallback(() => {
    const themeKeys = Object.keys(THEMES);
    const currentIndex = themeKeys.indexOf(theme);
    const nextKey = themeKeys[(currentIndex + 1) % themeKeys.length];
    setTheme(nextKey);
  }, [theme]);

  return {
    // Game config
    mode,
    setMode,
    gridSize,
    setGridSize,
    difficulty,
    setDifficulty,
    soundEnabled,
    setSoundEnabled,
    theme: THEMES[theme] || THEMES.cyberpunk,
    themeKey: theme,
    cycleTheme,
    themes: THEMES,

    // Game loop status & stats
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
    totalTiles,

    // Active board state
    activeTiles,
    targetSequence,
    playerInputSequence,
    matrixTargets,
    matrixFound,
    matrixMistakes,
    cards,

    // Actions
    startGame,
    handleTileClick,
    replaySequence,
    togglePause,
    resetGame,
    playTone
  };
}
