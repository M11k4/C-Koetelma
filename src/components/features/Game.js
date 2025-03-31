import React, { useState, useEffect } from 'react';
import '../../styles/Game.css';

const FRUITS = ['🍎', '🍊', '🍇', '🍓', '🥝']; // Red, Orange, Purple, Pink, Green
const CODE_LENGTH = 3;

function Game() {
  // Load saved state from localStorage
  const loadSavedState = () => {
    const savedState = localStorage.getItem('cursorKoetelmaGameState');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (error) {
        console.error('Error loading game state:', error);
        return null;
      }
    }
    return null;
  };

  const savedState = loadSavedState();

  // Game state
  const [gameTimerEnabled, setGameTimerEnabled] = useState(savedState?.gameTimerEnabled ?? false);
  const [time, setTime] = useState(savedState?.time ?? 0);
  const [secretCode, setSecretCode] = useState(savedState?.secretCode ?? []);
  const [currentGuess, setCurrentGuess] = useState(savedState?.currentGuess ?? []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [preGameGuess, setPreGameGuess] = useState(savedState?.preGameGuess ?? []);
  const [pastGuesses, setPastGuesses] = useState(savedState?.pastGuesses ?? []);
  const [isGameWon, setIsGameWon] = useState(savedState?.isGameWon ?? false);
  const [hasMadeFirstGuess, setHasMadeFirstGuess] = useState(savedState?.hasMadeFirstGuess ?? false);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const [showCheatDialog, setShowCheatDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [gameHistory, setGameHistory] = useState(() => {
    const saved = localStorage.getItem('cursorKoetelmaHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Game settings
  const [displayAllowRepeats, setDisplayAllowRepeats] = useState(savedState?.displayAllowRepeats ?? true);
  const [gameAllowRepeats, setGameAllowRepeats] = useState(savedState?.gameAllowRepeats ?? true);
  const [displayTimerEnabled, setDisplayTimerEnabled] = useState(savedState?.displayTimerEnabled ?? true);
  const [slider1Value, setSlider1Value] = useState(savedState?.slider1Value ?? 3);
  const [slider2Value, setSlider2Value] = useState(savedState?.slider2Value ?? 5);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    try {
      const state = {
        // Game settings
        displayAllowRepeats,
        displayTimerEnabled,
        slider1Value,
        slider2Value,
        gameAllowRepeats,
        // Game state
        gameTimerEnabled,
        time,
        secretCode,
        currentGuess,
        preGameGuess,
        pastGuesses,
        isGameWon,
        hasMadeFirstGuess
      };
      localStorage.setItem('cursorKoetelmaGameState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  }, [
    displayAllowRepeats,
    displayTimerEnabled,
    slider1Value,
    slider2Value,
    gameAllowRepeats,
    gameTimerEnabled,
    time,
    secretCode,
    currentGuess,
    preGameGuess,
    pastGuesses,
    isGameWon,
    hasMadeFirstGuess
  ]);

  // Save game history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cursorKoetelmaHistory', JSON.stringify(gameHistory));
    } catch (error) {
      console.error('Error saving game history:', error);
    }
  }, [gameHistory]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameTimerEnabled && !isGameWon && hasMadeFirstGuess) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameTimerEnabled, isGameWon, hasMadeFirstGuess]);

  // Update game settings when they change
  useEffect(() => {
    if (!hasMadeFirstGuess) {
      setGameAllowRepeats(displayAllowRepeats);
      setGameTimerEnabled(displayTimerEnabled);
      if (displayTimerEnabled) {
        setTime(0); // Reset timer when enabling it
      }
    }
  }, [displayAllowRepeats, displayTimerEnabled, hasMadeFirstGuess]);

  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startNewGame = () => {
    // Reset game state
    setGameTimerEnabled(displayTimerEnabled);
    setTime(0);
    setSecretCode([]);
    setCurrentGuess(new Array(slider1Value).fill(''));
    setSelectedIndex(0);
    setPreGameGuess([]);
    setPastGuesses([]);
    setIsGameWon(false);
    setHasMadeFirstGuess(false);
    setShowAbandonDialog(false);
    setShowCheatDialog(false);
  };

  const restoreDefaults = () => {
    setDisplayAllowRepeats(true);
    setDisplayTimerEnabled(true);
    setSlider1Value(3);
    setSlider2Value(5);
    setPreGameGuess([]);
    startNewGame(); // This will start a new game with the default settings
  };

  const abandonGame = () => {
    setIsGameWon(false);
    setTime(0);
    setCurrentGuess(new Array(slider1Value).fill(''));
    setPreGameGuess([]);
    setPastGuesses([]);
    setSecretCode([]);
    setHasMadeFirstGuess(false);
    setGameTimerEnabled(false); // Reset timer state
    setSelectedIndex(0); // Reset selected index
  };

  const handleFruitClick = (fruit) => {
    if (isGameWon) return;

    const newGuess = [...currentGuess];
    newGuess[selectedIndex] = fruit;
    setCurrentGuess(newGuess);
    
    // Move to next position, wrapping around to beginning if at the end
    const nextIndex = (selectedIndex + 1) % slider1Value;
    setSelectedIndex(nextIndex);
  };

  const isFruitDisabled = (fruit) => {
    if (gameAllowRepeats) return false;
    
    // If the array is not full, disable any fruit that's already in the guess
    if (currentGuess.length < slider1Value) {
      return currentGuess.includes(fruit);
    }
    
    // If the array is full, only disable fruits that are in other positions
    // (allow replacing the fruit at the current position)
    return currentGuess.some((f, i) => f === fruit && i !== selectedIndex);
  };

  const calculateFeedback = (guess, code) => {
    const feedback = [];
    const guessCopy = [...guess];
    const codeCopy = [...code];

    // First pass: check for exact matches (black pegs)
    for (let i = 0; i < code.length; i++) {
      if (guessCopy[i] === codeCopy[i]) {
        feedback.push('⚫');
        guessCopy[i] = null;
        codeCopy[i] = null;  // Mark this position as used in the code as well
      }
    }

    // Second pass: check for color matches in wrong position (white pegs)
    for (let i = 0; i < code.length; i++) {
      if (guessCopy[i] !== null) {
        const index = codeCopy.indexOf(guessCopy[i]);
        if (index !== -1) {
          feedback.push('⚪');
          guessCopy[i] = null;
          codeCopy[index] = null;  // Mark this position as used in the code
        }
      }
    }

    return feedback;
  };

  const hasRepeats = (guess) => {
    if (gameAllowRepeats) return false;
    return new Set(guess).size !== guess.length;
  };

  const handleGuessSubmit = () => {
    if (currentGuess.length !== slider1Value) return;
    if (!gameAllowRepeats && hasRepeats(currentGuess)) return;

    // Check if this guess has already been made
    const isDuplicate = pastGuesses.some(guess => 
      guess.guess.every((fruit, i) => fruit === currentGuess[i])
    );

    if (isDuplicate) {
      setShowDuplicateDialog(true);
      return;
    }

    let currentSecretCode = secretCode;
    if (!hasMadeFirstGuess) {
      // Generate new secret code on first guess
      const newCode = [];
      const availableFruits = FRUITS.slice(0, slider2Value);
      
      for (let i = 0; i < slider1Value; i++) {
        const randomIndex = Math.floor(Math.random() * availableFruits.length);
        newCode.push(availableFruits[randomIndex]);
        if (!gameAllowRepeats) {
          availableFruits.splice(randomIndex, 1);
        }
      }
      
      currentSecretCode = newCode;
      setSecretCode(newCode);
      setHasMadeFirstGuess(true);
    }

    const feedback = calculateFeedback(currentGuess, currentSecretCode);
    const newGuess = {
      guess: [...currentGuess],
      feedback: feedback
    };

    setPastGuesses(prev => [...prev, newGuess]);
    setCurrentGuess(new Array(slider1Value).fill('')); // Reset current guess
    setSelectedIndex(0); // Reset selected index

    if (feedback.length === slider1Value && feedback.every(peg => peg === '⚫')) {
      setIsGameWon(true);
      setGameHistory(prev => [{
        code: [...currentSecretCode],
        time: time,
        guesses: pastGuesses.length + 1,
        timerEnabled: gameTimerEnabled
      }, ...prev]);
    }
  };

  const handleNewGame = () => {
    if (hasMadeFirstGuess && !isGameWon) {
      setShowAbandonDialog(true);
    } else if (isGameWon) {
      startNewGame();
    } else {
      restoreDefaults();
    }
  };

  const confirmAbandonGame = () => {
    setShowAbandonDialog(false);
    abandonGame();
  };

  const cancelAbandonGame = () => {
    setShowAbandonDialog(false);
  };

  const handleCheat = () => {
    if (hasMadeFirstGuess && !isGameWon) {
      setCurrentGuess([...secretCode]);
    }
  };

  const closeDuplicateDialog = () => {
    setShowDuplicateDialog(false);
  };

  return (
    <div className="game-container">
      {/* Left Column - Game Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="game-card">
          <div className="game-options">
            <div className="option-row">
              <input
                type="checkbox"
                id="allowRepeats"
                checked={displayAllowRepeats}
                onChange={(e) => setDisplayAllowRepeats(e.target.checked)}
                style={{ width: '1rem', height: '1rem' }}
              />
              <label htmlFor="allowRepeats">Allow repeats</label>
            </div>
            <div className="option-row">
              <input
                type="checkbox"
                id="timer"
                checked={displayTimerEnabled}
                onChange={(e) => setDisplayTimerEnabled(e.target.checked)}
                style={{ width: '1rem', height: '1rem' }}
              />
              <label htmlFor="timer">Timer</label>
            </div>
            <div className="slider-container">
              <div className="slider-header">
                <span>Code length</span>
                <span>{slider1Value}</span>
              </div>
              <input
                type="range"
                min="3"
                max="7"
                value={slider1Value}
                onChange={(e) => setSlider1Value(Number(e.target.value))}
                className="slider"
              />
            </div>
            <div className="slider-container">
              <div className="slider-header">
                <span>Fruit types</span>
                <span>{slider2Value}</span>
              </div>
              <input
                type="range"
                id="fruitTypes"
                min="3"
                max="10"
                value={slider2Value}
                onChange={(e) => setSlider2Value(Number(e.target.value))}
                className="slider"
              />
            </div>
            <button 
              onClick={handleNewGame}
              className={`new-game-button ${isGameWon ? 'won' : (hasMadeFirstGuess ? 'in-progress' : '')}`}
            >
              {isGameWon ? 'New Game' : (hasMadeFirstGuess ? 'New Game' : 'Restore Defaults')}
            </button>
          </div>
        </div>

        {/* Game History - Only show if there are games */}
        {gameHistory.length > 0 && (
          <div className="game-card">
            <div className="game-history">
              {gameHistory.map((game, index) => (
                <div key={index} className="history-item">
                  <div className="history-code">
                    {game.code.map((fruit, i) => (
                      <span key={i}>{fruit}</span>
                    ))}
                  </div>
                  <div className="history-stats">
                    <span>{game.guesses} guesses</span>
                    {game.timerEnabled && <span>{formatTime(game.time)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Game Board - Center */}
      <div className="game-card main-board">
        <div className="cheat-button-container">
          {hasMadeFirstGuess && !isGameWon && (
            <div className="cheat-button-wrapper">
              <button
                onClick={handleCheat}
                className="cheat-button"
                onMouseEnter={e => e.target.style.opacity = '0.7'}
                onMouseLeave={e => e.target.style.opacity = '0'}
              >
                Cheat
              </button>
            </div>
          )}
        </div>

        <div className="timer-container">
          {gameTimerEnabled && (
            <div className="timer">
              {formatTime(time)}
            </div>
          )}
        </div>

        {/* Hidden Key */}
        <div className="hidden-key">
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <div key={i} className="key-circle">
              {isGameWon ? secretCode[i] : '?'}
            </div>
          ))}
        </div>

        {/* Past Guesses */}
        <div className="past-guesses">
          {pastGuesses.map((guessData, index) => (
            <div key={index} className="guess-row">
              <div className="feedback-grid">
                {guessData.feedback.map((peg, i) => (
                  <div key={i} className={`feedback-peg ${peg === '⚪' ? 'white' : ''}`}>
                    {peg}
                  </div>
                ))}
              </div>
              <div className="guess-fruits">
                {guessData.guess.map((fruit, i) => (
                  <div key={i}>{fruit}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Fruit Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {isGameWon && (
          <div className="win-message">
            🎉 Congratulations! You've won!<br />
            {gameTimerEnabled && `Time: ${formatTime(time)}`} 🎉
          </div>
        )}
        <div className="game-card">
          <div className="game-options">
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              {/* Select Fruit */}
            </div>

            {/* Current Guess */}
            <div className="current-guess">
              {Array.from({ length: slider1Value }).map((_, i) => (
                <div
                  key={i}
                  className={`guess-circle ${i === selectedIndex ? 'active' : ''}`}
                >
                  {currentGuess[i] || ''}
                </div>
              ))}
            </div>

            {/* Fruit Selector */}
            <div className="fruit-grid">
              {FRUITS.slice(0, slider2Value).map((fruit, index) => (
                <button
                  key={index}
                  onClick={() => handleFruitClick(fruit)}
                  disabled={isFruitDisabled(fruit)}
                  className="fruit-button"
                  onMouseDown={e => !isFruitDisabled(fruit) && (e.target.style.transform = 'scale(0.95)')}
                  onMouseUp={e => e.target.style.transform = 'scale(1)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                >
                  {fruit}
                </button>
              ))}
            </div>

            <button
              onClick={handleGuessSubmit}
              disabled={
                currentGuess.some(fruit => fruit === '') || 
                isGameWon ||
                (!gameAllowRepeats && hasRepeats(currentGuess))
              }
              className="guess-button"
            >
              Guess
            </button>
          </div>
        </div>
      </div>

      {/* Abandon Game Dialog */}
      {showAbandonDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3 className="dialog-title">Abandon Current Game?</h3>
            <p className="dialog-message">Are you sure you want to abandon this game? All progress will be lost.</p>
            <div className="dialog-buttons">
              <button
                onClick={confirmAbandonGame}
                className="dialog-button confirm"
              >
                Yes, Abandon
              </button>
              <button
                onClick={cancelAbandonGame}
                className="dialog-button cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Guess Dialog */}
      {showDuplicateDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3 className="dialog-title">Duplicate Guess</h3>
            <p className="dialog-message">You've already tried this combination. Try a different guess!</p>
            <div className="dialog-buttons">
              <button
                onClick={closeDuplicateDialog}
                className="dialog-button confirm"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game; 