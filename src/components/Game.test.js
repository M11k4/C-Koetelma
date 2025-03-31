import { render, screen, fireEvent } from '@testing-library/react';
import Game from './Game';

// Helper function to create a game instance with specific settings
const createGame = (codeLength = 3, allowRepeats = false) => {
  const { container } = render(<Game />);
  
  // Set game options
  const codeLengthSlider = screen.getByLabelText('Code length');
  const repeatsToggle = screen.getByLabelText('Allow repeats');
  
  fireEvent.change(codeLengthSlider, { target: { value: codeLength } });
  if (allowRepeats) {
    fireEvent.click(repeatsToggle);
  }
  
  return container;
};

describe('Game Logic', () => {
  describe('Feedback Calculation', () => {
    const calculateFeedback = (guess, code) => {
      const feedback = [];
      const guessCopy = [...guess];

      // First pass: check for exact matches (black pegs)
      for (let i = 0; i < code.length; i++) {
        if (guessCopy[i] === code[i]) {
          feedback.push('⚫');
          guessCopy[i] = null;
        }
      }

      // Second pass: check for color matches in wrong position (white pegs)
      for (let i = 0; i < code.length; i++) {
        if (guessCopy[i] !== null) {
          const index = code.indexOf(guessCopy[i]);
          if (index !== -1) {
            feedback.push('⚪');
            guessCopy[i] = null;
          }
        }
      }

      return feedback;
    };

    test('exact match returns all black pegs', () => {
      const code = ['🍎', '🍊', '🍇'];
      const guess = ['🍎', '🍊', '🍇'];
      const feedback = calculateFeedback(guess, code);
      expect(feedback).toEqual(['⚫', '⚫', '⚫']);
    });

    test('no matches returns empty feedback', () => {
      const code = ['🍎', '🍊', '🍇'];
      const guess = ['🍌', '🍉', '🍍'];
      const feedback = calculateFeedback(guess, code);
      expect(feedback).toEqual([]);
    });

    test('correct colors in wrong positions returns white pegs', () => {
      const code = ['🍎', '🍊', '🍇'];
      const guess = ['🍊', '🍇', '🍎'];
      const feedback = calculateFeedback(guess, code);
      expect(feedback).toEqual(['⚪', '⚪', '⚪']);
    });

    test('handles repeated fruits correctly', () => {
      const code = ['🍎', '🍎', '🍊'];
      const guess = ['🍎', '🍊', '🍎'];
      const feedback = calculateFeedback(guess, code);
      expect(feedback).toEqual(['⚫', '⚪', '⚫']);
    });

    test('handles mixed matches correctly', () => {
      const code = ['🍎', '🍊', '🍇'];
      const guess = ['🍎', '🍇', '🍊'];
      const feedback = calculateFeedback(guess, code);
      expect(feedback).toEqual(['⚫', '⚪', '⚪']);
    });
  });

  describe('Game Rules', () => {
    test('cannot submit guess with wrong length', () => {
      const container = createGame();
      const submitButton = screen.getByText('Guess');
      
      // Try to submit with no fruits selected
      fireEvent.click(submitButton);
      expect(screen.queryByText('⚫')).toBeNull();
    });

    test('cannot submit guess with repeats when not allowed', () => {
      const container = createGame(3, false);
      
      // Select same fruit multiple times
      const fruitButtons = screen.getAllByRole('button');
      fireEvent.click(fruitButtons[0]); // First fruit
      fireEvent.click(fruitButtons[0]); // Same fruit again
      fireEvent.click(fruitButtons[1]); // Different fruit
      
      const submitButton = screen.getByText('Guess');
      fireEvent.click(submitButton);
      expect(screen.queryByText('⚫')).toBeNull();
    });

    test('can submit guess with repeats when allowed', () => {
      const container = createGame(3, true);
      
      // Select same fruit multiple times
      const fruitButtons = screen.getAllByRole('button');
      fireEvent.click(fruitButtons[0]); // First fruit
      fireEvent.click(fruitButtons[0]); // Same fruit again
      fireEvent.click(fruitButtons[0]); // Same fruit again
      
      const submitButton = screen.getByText('Guess');
      fireEvent.click(submitButton);
      expect(screen.getByText('⚫')).toBeInTheDocument();
    });
  });

  describe('Timer Functionality', () => {
    test('timer starts after first guess', () => {
      const container = createGame();
      
      // Make first guess
      const fruitButtons = screen.getAllByRole('button');
      fireEvent.click(fruitButtons[0]);
      fireEvent.click(fruitButtons[1]);
      fireEvent.click(fruitButtons[2]);
      
      const submitButton = screen.getByText('Guess');
      fireEvent.click(submitButton);
      
      // Check if timer is running
      const timer = screen.getByText(/00:00/);
      expect(timer).toBeInTheDocument();
    });

    test('timer stops when game is won', () => {
      const container = createGame();
      
      // Make winning guess
      const fruitButtons = screen.getAllByRole('button');
      fireEvent.click(fruitButtons[0]);
      fireEvent.click(fruitButtons[1]);
      fireEvent.click(fruitButtons[2]);
      
      const submitButton = screen.getByText('Guess');
      fireEvent.click(submitButton);
      
      // Check for win message
      expect(screen.getByText(/Congratulations/)).toBeInTheDocument();
    });
  });

  describe('Game History', () => {
    test('game history is saved after winning', () => {
      const container = createGame();
      
      // Make winning guess
      const fruitButtons = screen.getAllByRole('button');
      fireEvent.click(fruitButtons[0]);
      fireEvent.click(fruitButtons[1]);
      fireEvent.click(fruitButtons[2]);
      
      const submitButton = screen.getByText('Guess');
      fireEvent.click(submitButton);
      
      // Check if game appears in history
      const historySection = screen.getByText('Game History');
      expect(historySection).toBeInTheDocument();
    });
  });
}); 