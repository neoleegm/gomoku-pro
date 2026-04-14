# Gomoku Pro - Five in a Row Game

A professional, feature-rich implementation of Gomoku (Five in a Row) built with **React 19**, **TypeScript**, and **Tailwind CSS 4**. Play directly in your browser with a beautiful, responsive interface.

## Features

**Core Gameplay**
- 15×15 game board with classic Gomoku rules
- Two-player local multiplayer (Black vs White)
- Player vs AI mode with Easy, Medium, and Hard difficulties
- Optional side selection: play first as Black or answer the AI as White
- Automatic win detection (5 stones in a row: horizontal, vertical, or diagonal)
- Move history tracking with visual indicators
- Undo functionality for both PvP and PvE turn pairs
- New Game button to restart anytime

**User Experience**
- **Light Wood Board Theme**: Warm pale-yellow wood texture with crisp contrast and distinct AI markers
- **Responsive Design**: Seamlessly adapts from mobile phones to desktop screens
- **Smooth Animations**: Stone placement animations and move indicator pulses provide satisfying feedback
- **Business Tone Sound Cues**: Subtle Web Audio cues for stone placement, wins, and losses, with a mute toggle
- **Intuitive Controls**: Click any empty cell to place a stone; hover previews show available moves
- **Move History Panel**: Displays all moves in algebraic notation (A1, B2, etc.)

**Technical Excellence**
- Built with React 19 and TypeScript for type safety and modern development practices
- Tailwind CSS 4 for utility-first styling and responsive design
- Pure game logic with no external dependencies for gameplay mechanics
- Optimized build with Vite for fast loading times
- Deployed automatically to GitHub Pages with every push

## Getting Started

### Local Development

**Prerequisites**
- Node.js 22+ and pnpm 10+

**Installation**
```bash
# Clone the repository
git clone https://github.com/neoleegm/gomoku-pro.git
cd gomoku-pro

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The game will be available at `http://localhost:3000/`

**Building for Production**
```bash
pnpm build
pnpm preview  # Preview production build locally
```

**Testing**
```bash
pnpm test
pnpm check
```

## How to Play

1. **Choose Mode**: Play local two-player or Player vs AI
2. **Set AI Options**: Pick Easy, Medium, or Hard, then choose Black or White
3. **Game Start**: Black always moves first; if you choose White, the AI opens
4. **Placing Stones**: Click any empty cell on the board to place your stone
5. **Winning**: First player to get 5 stones in a row wins
6. **Undo**: PvP takes back one move; PvE takes back the latest player/AI turn pair
7. **Sound**: Use the Sound toggle to keep the subtle move and result cues on or muted
8. **New Game**: Click "New Game" to restart with the current settings

## Project Structure

```
gomoku-pro/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BoardCell.tsx       # Individual board cell component
│   │   │   ├── GomokuBoard.tsx      # Main game board
│   │   │   └── GamePanel.tsx        # Control panel with game status
│   │   ├── lib/
│   │   │   ├── gomokuLogic.ts       # Core game logic and rules
│   │   │   ├── gomokuAI.ts          # Local AI move selection
│   │   │   └── gomokuLogic.test.ts  # Logic and AI tests
│   │   ├── pages/
│   │   │   └── Home.tsx             # Main game page
│   │   ├── App.tsx                  # Root component with routing
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global styles and design tokens
│   ├── index.html                   # HTML template
│   └── public/                      # Static assets
├── .github/workflows/
│   └── deploy.yml                   # GitHub Actions deployment workflow
├── package.json                     # Project dependencies
└── README.md                        # This file
```

## Design Philosophy

**Clear Competitive Focus** - The design keeps the board as the main experience and uses compact controls for mode, difficulty, side selection, undo, and move review.

**Color Palette**
- **Board Background**: Pale yellow wood grain with warm brown grid lines
- **Black Stones**: Pure black with subtle shadow depth
- **White Stones**: Off-white with soft anti-aliasing
- **Accents**: Coral and blue markers for current actions and AI moves

**Typography**
- **Titles**: Playfair Display (serif) for elegance and hierarchy
- **Body**: Inter (sans-serif) for clarity and readability

**Interactions**
- Stones scale in smoothly when placed (150ms ease-out)
- Last move and AI move indicators stay visible after each turn
- Hover previews provide clear feedback on available moves
- Move, win, and loss sounds use short synthesized tones designed to stay understated
- AI moves run locally in the browser without server calls

## Technologies Used

| Technology | Purpose |
|---|---|
| React 19 | UI framework and component management |
| TypeScript | Type-safe development |
| Tailwind CSS 4 | Utility-first styling and responsive design |
| Vite | Fast build tool and dev server |
| shadcn/ui | Pre-built accessible UI components |
| Lucide React | Beautiful icon library |
| Wouter | Lightweight client-side routing |

## Game Rules

Gomoku is a classic strategy board game with simple rules:

1. Players alternate placing stones on a 15×15 board
2. Black always plays first
3. The first player to create an unbroken line of 5 stones wins
4. Stones cannot be moved or removed (except via undo)
5. The line can be horizontal, vertical, or diagonal
6. This implementation uses classic Gomoku rules and does not enforce Renju forbidden moves

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Initial Load**: ~150KB gzipped (optimized bundle)
- **Game Logic**: O(1) move validation and directional win detection
- **AI**: Candidate pruning keeps Hard mode responsive in the browser
- **Responsive**: 60 FPS animations on modern devices
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation support

## Contributing

Contributions are welcome! Feel free to:
- Report bugs or suggest features via GitHub Issues
- Submit pull requests with improvements
- Share your gameplay experiences

## License

This project is open source and available under the MIT License.

## Credits

Developed with ❤️ using modern web technologies. Inspired by the classic game of Gomoku and contemporary game design principles.

---

**Repository**: [https://github.com/neoleegm/gomoku-pro](https://github.com/neoleegm/gomoku-pro)
