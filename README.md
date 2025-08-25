# Mahjong App

A beginner-friendly Hong Kong Basic Mahjong web application with intelligent coaching and interactive tutorials.

![Mahjong App Screenshot](https://via.placeholder.com/800x400/f3f4f6/333333?text=Mahjong+App)

## Features

- 🎮 **Interactive Gameplay**: Full Hong Kong Basic Mahjong implementation
- 🤖 **AI Coach**: Real-time strategic advice and move suggestions  
- 📚 **Interactive Tutorials**: Step-by-step learning with guided practice
- ♿ **Accessibility**: Full keyboard navigation and screen reader support
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🔄 **Game Replay**: Review and analyze past games
- 🎯 **Practice Drills**: Focused exercises for specific skills
- 🎨 **Clean UI**: Modern, intuitive interface with visual tile representations

## Architecture

This is a TypeScript monorepo containing:

```
majongapp/
├── apps/
│   ├── web/          # React frontend (Vite + Zustand)
│   └── api/          # Vercel serverless functions
├── packages/
│   ├── core/         # Game logic and rules engine
│   └── ui/           # Reusable React components
├── assets/
│   └── tiles/        # Tile images and spritesheet
└── .github/
    └── workflows/    # CI/CD automation
```

### Key Technologies

- **Frontend**: React 18, TypeScript, Vite, Zustand, React Router, Tailwind CSS
- **Backend**: Vercel Functions, OpenAI API
- **Testing**: Vitest with 95% coverage requirement
- **Build**: npm workspaces, ESLint, Prettier
- **Deployment**: GitHub Pages (frontend), Vercel (API)

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bradmarnold/majongapp.git
   cd majongapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build tile assets**
   ```bash
   cd assets/tiles
   node build-spritesheet.js
   ```

4. **Start development server**
   ```bash
   cd apps/web
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Development Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Build all packages
npm run build

# Type check
npm run typecheck
```

## Deployment

### GitHub Pages (Frontend)

The web app automatically deploys to GitHub Pages on pushes to `main`:

1. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - The app will be available at `https://bradmarnold.github.io/majongapp/`

2. **Manual Build**
   ```bash
   cd apps/web
   npm run build
   # Upload dist/ folder to your hosting provider
   ```

### Vercel (API - Optional)

The coaching advice API can be deployed to Vercel for enhanced tips:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy API**
   ```bash
   cd apps/api
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add OPENAI_API_KEY
   # Enter your OpenAI API key
   ```

4. **Configure Frontend**
   Set `ADVICE_API_URL` environment variable in your web app deployment to enable API integration.

## How to Play Hong Kong Basic Mahjong

### Objective
Form a complete hand of 14 tiles consisting of 4 melds (sets of 3) plus 1 pair.

### Game Setup
- 4 players, each starting with 13 tiles
- 144 tiles total: 3 suits (Characters 萬, Circles 筒, Bamboo 索) + Honor tiles (Winds, Dragons)
- Players take turns drawing and discarding tiles

### Tile Types

**Suited Tiles** (108 tiles)
- **Characters (萬)**: 1萬 through 9萬 (4 copies each)
- **Circles (筒)**: 1筒 through 9筒 (4 copies each)  
- **Bamboo (索)**: 1索 through 9索 (4 copies each)

**Honor Tiles** (28 tiles)
- **Winds**: 東 (East), 南 (South), 西 (West), 北 (North) (4 copies each)
- **Dragons**: 中 (Red), 發 (Green), 白 (White) (4 copies each)

### Melds (Sets)

**Sequence (順子)**: Three consecutive tiles of the same suit
- Example: 1萬 2萬 3萬 or 7筒 8筒 9筒

**Triplet (刻子)**: Three identical tiles
- Example: 5索 5索 5索 or 東 東 東

**Pair (對子)**: Two identical tiles (needed for winning)
- Example: 9萬 9萬 or 中 中

### Basic Gameplay

1. **Draw Phase**: Draw a tile from the wall (14 tiles total)
2. **Action Phase**: 
   - **Discard**: Choose a tile to discard (back to 13 tiles)
   - **Call**: Claim another player's discard to form a meld
   - **Win**: Declare Mahjong if hand is complete

### Calling Rules

**Chi (吃)**: Claim the previous player's discard to complete a sequence
**Pon (碰)**: Claim any player's discard to complete a triplet  
**Kan (槓)**: Claim any player's discard to complete a quartet (advanced)

### Winning Conditions

A winning hand has exactly:
- 4 melds (sequences or triplets)
- 1 pair
- 14 tiles total

**Examples of Winning Hands**:
- 1萬 2萬 3萬 | 4萬 5萬 6萬ａ | 7萬 8萬ａ 9萬 | 東 東 東 | 中 中
- 1筒 1筒 1筒 | 5筒 5筒 5筒 | 9筒 9筒 9筒 | 2索 3索 4索 | 7索 7索

### Basic Strategy Tips

1. **Build Flexibility**: Keep tiles that can form multiple potential melds
2. **Sequence Priority**: Sequences are often easier to complete than triplets
3. **Honor Caution**: Only keep honor tiles if you can form triplets
4. **Watch Discards**: Observe what opponents discard to avoid dangerous tiles
5. **Stay Balanced**: Don't commit to one suit too early

## Coach Explains

### The AI Advisor

The integrated coach analyzes your hand and provides strategic advice:

**Shanten Analysis**: Shows how many tile changes you need to reach winning
**Efficiency Tips**: Suggests optimal discards to improve your hand
**Safety Warnings**: Alerts you to potentially dangerous discards
**Strategic Guidance**: Explains reasoning behind recommendations

### Understanding Advice

**Priority Levels**:
- 🔴 **Urgent (8-10)**: Critical moves, potential wins
- 🟡 **Important (6-7)**: Significant strategic decisions  
- 🟢 **Suggestion (1-5)**: Minor optimizations

**Advice Categories**:
- **Discard Recommendations**: Which tile to discard and why
- **Calling Decisions**: When to claim opponent discards
- **Hand Building**: Long-term strategic direction
- **Defense**: Safe play when opponents are close to winning

### Learning Features

**Interactive Tutorials**: Guided lessons covering all game aspects
**Practice Drills**: Focused exercises for specific skills
**Game Replay**: Review past games with move-by-move analysis
**Mistake Detection**: AI identifies suboptimal plays with explanations

## Development

### Project Structure

```
packages/core/          # Game engine
├── src/
│   ├── types.ts       # Core type definitions
│   ├── wall.ts        # Wall creation and dealing
│   ├── shanten.ts     # Winning distance calculation
│   └── advisor.ts     # Strategic analysis
│
packages/ui/           # React components
├── src/
│   ├── Tile.tsx       # Individual tile display
│   ├── Hand.tsx       # Player hand layout
│   ├── GameHUD.tsx    # Game status display
│   └── CoachOverlay.tsx # Advice interface
│
apps/web/              # Frontend application
├── src/
│   ├── pages/         # Route components
│   ├── store/         # Zustand state management
│   └── components/    # App-specific components
│
apps/api/              # Backend functions
└── api/
    └── advice.ts      # OpenAI coaching endpoint
```

### Testing

The project maintains high test coverage with focus on core algorithms:

```bash
# Run all tests
npm test

# Core package tests (targeting 95% coverage)
npm test packages/core

# Run with coverage report
npm run test:coverage
```

**Coverage Requirements**:
- Overall: 90%+ coverage
- Shanten calculation: 95%+ coverage
- Advisor logic: 95%+ coverage

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Run linting and tests (`npm run lint && npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Standard configuration with React rules
- **Prettier**: Automatic formatting
- **Accessibility**: WCAG 2.1 AA compliance required
- **Testing**: Vitest with comprehensive coverage

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Hong Kong Mahjong rules and traditions
- OpenAI for intelligent coaching capabilities
- React and TypeScript communities
- Accessibility best practices from WCAG guidelines

---

**Live Demo**: [https://bradmarnold.github.io/majongapp/](https://bradmarnold.github.io/majongapp/)

**API Endpoint**: [https://your-vercel-app.vercel.app/api/advice](https://your-vercel-app.vercel.app/api/advice)

Built with ❤️ for Mahjong learners everywhere.