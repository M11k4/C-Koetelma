# Cursor Koetelma

 This is a test project to feel out the use of Cursor as an editing tool. Below is a short summary created by AI to explain one of the features built in this project. Overall, the editor was a great help in creating things quicker than I could have done alone. 

# MasterFruit

A modern take on the classic Mastermind game, built with React. Instead of colored pegs, players guess combinations of fruit emojis!

## Features

- 🎮 Classic Mastermind gameplay with a fruity twist
- ⚙️ Customizable game settings:
  - Adjustable code length (3-7 fruits) (wip)
  - Configurable number of fruit types (3-10) (wip)
  - Optional repeat fruits
  - Optional timer
- 💾 Persistent game state and history
- 🎯 Visual feedback with black and white pegs
- 🏆 Game history tracking
- 🎨 Modern, responsive UI
- 🌙 Dark theme optimized

## How to Play

1. Configure your game settings:
   - Choose whether to allow repeated fruits
   - Enable/disable the timer
   - Set the code length (3-7 fruits)
   - Select how many different fruit types to use (3-10)

2. Start playing:
   - Click on fruits to build your guess
   - The selector will automatically move to the next position
   - Once all positions are filled, click "Guess"
   - Get feedback with black pegs (⚫) for correct fruits in correct positions
   - Get white pegs (⚪) for correct fruits in wrong positions

3. Win conditions:
   - Guess the correct combination of fruits
   - All feedback pegs will be black (⚫)
   - Your time and number of guesses will be recorded in game history

## Technical Details

### Built With
- React.js
- CSS3
- Local Storage for state persistence

### Project Structure
```
mmsteps/
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   ├── Game.js       # Main game component
│   │   │   ├── Notes.js      # Notes feature
│   │   │   └── Weather.js    # Weather feature
│   │   └── layout/
│   │       └── Main.js       # Main layout component
│   ├── styles/
│   │   ├── App.css
│   │   └── Game.css
│   └── App.js
└── public/
    └── index.html
```

### State Management
- Game state is persisted in localStorage
- Separate storage for:
  - Current game state
  - Game history
  - Notes
  - Weather records

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your chosen license]

## Acknowledgments

- Inspired by the classic Mastermind game
- Built with React.js
