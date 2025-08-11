# TurtleQuest: Ocean Savior 🐢🌊

An AI-powered ocean cleanup adventure game with real-time leaderboards and environmental education.

## 🚀 Quick Start

### Option 1: Python HTTP Server (Recommended)
```bash
# If you have Python installed
python -m http.server 8000
```

### Option 2: Node.js HTTP Server
```bash
# Install dependencies first
npm install

# Then run the server
npm run dev:node
```

### Option 3: Live Server (Auto-reload)
```bash
# Install dependencies first
npm install

# Then run with auto-reload
npm run dev:live
```

## 🌐 Access the Game
Open your browser and go to: `http://localhost:8000`

## 📁 Project Structure
```
Sea-Turtle/
├── index.html          # Main game page
├── src/
│   ├── managers/       # Game managers (audio, UI, game logic)
│   ├── entities/       # Game objects (player, trash, hazards)
│   └── effects/        # Visual effects and particles
├── assets/             # Images, sounds, and sprites
├── styles/             # CSS stylesheets
└── package.json        # Dependencies and scripts
```

## 🎮 How to Play
- **Arrow Keys / WASD**: Move turtle
- **Space**: Turbo boost (when available)
- **P**: Pause game
- **M**: Mute sound

## 🎯 Objectives
- Collect trash to increase ocean health
- Avoid hazards like fishing nets and sharks
- Use power-ups to enhance abilities
- Complete levels to unlock new areas

## 🛠️ Development
This is a static HTML/JavaScript game that runs entirely in the browser. No build process is required.

## 🚀 Deployment
Ready for deployment to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## 📱 Features
- Progressive Web App (PWA) support
- Responsive design for mobile and desktop
- AI-powered turtle companion
- Real-time leaderboards
- Beautiful particle effects and animations
