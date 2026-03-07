# Gomoku Pro - Design Concepts

## Selected Design Approach: Modern Minimalist with Strategic Depth

### Design Movement
**Contemporary Minimalism with Functional Elegance** - Drawing from modern game design and Japanese aesthetic principles (Ma - the art of negative space).

### Core Principles
1. **Clarity Through Simplicity**: Every element serves a purpose. The board is the hero; UI elements support without distraction.
2. **Spatial Hierarchy**: Generous whitespace creates breathing room. The game board occupies the visual center with supporting elements arranged asymmetrically.
3. **Tactile Feedback**: Subtle animations and hover states make interactions feel responsive and intentional.
4. **Functional Beauty**: Design decisions are driven by usability first, aesthetics second.

### Color Philosophy
- **Primary Palette**: Deep slate (`#1a2332`) for the board background, creating a sophisticated, focused environment.
- **Accent Colors**: 
  - Black stones: `#1a1a1a` with subtle shadow depth
  - White stones: `#f5f5f5` with soft anti-aliasing
  - Highlights: Warm gold (`#d4a574`) for move indicators and interactive states
- **Emotional Intent**: The dark board evokes focus and contemplation, while gold accents add warmth and celebration of successful moves.

### Layout Paradigm
- **Asymmetric Sidebar Layout**: Game board on the left (70%), control panel on the right (30%).
- **Vertical Rhythm**: Controls stack naturally: Player Info → Game Status → Move History (scrollable) → Action Buttons.
- **Responsive Adaptation**: On mobile, stack vertically with full-width board.

### Signature Elements
1. **Animated Stone Placement**: Stones gently scale-in with a subtle bounce when placed.
2. **Move Indicator Pulse**: The last move glows with a soft pulsing gold ring.
3. **Gradient Dividers**: Soft gradient lines separate sections without harsh borders.

### Interaction Philosophy
- **Immediate Feedback**: Click a cell → stone appears instantly with animation.
- **Hover States**: Cells highlight with a subtle gold glow on hover.
- **State Clarity**: Current player indicator animates, showing whose turn it is.
- **Undo Smoothness**: Removed stones fade out gracefully.

### Animation Guidelines
- **Entrance**: Stones scale from 0.8 to 1 over 150ms with ease-out timing.
- **Hover**: Cell background transitions to a 10% gold overlay over 200ms.
- **Move Indicator**: Gold ring pulses with 1.5s cycle, opacity 0.3 → 0.6 → 0.3.
- **Transitions**: All state changes use 200-300ms durations to feel responsive without being jarring.

### Typography System
- **Display Font**: `Playfair Display` (serif, bold) - for titles and game status.
- **Body Font**: `Inter` (sans-serif, regular/medium) - for controls and information.
- **Hierarchy**:
  - H1 (Game Title): 2.5rem, Playfair Display, bold
  - H2 (Section Headers): 1.5rem, Playfair Display, semi-bold
  - Body: 1rem, Inter, regular
  - Small Labels: 0.875rem, Inter, medium

---

## Design Rationale
This approach balances **visual sophistication** with **functional clarity**. The dark board creates an immersive play environment, while the asymmetric layout ensures controls are always accessible without cluttering the board. The gold accent color adds warmth and celebration, making victories feel rewarding. Animations are purposeful—they confirm actions without distracting from gameplay.
