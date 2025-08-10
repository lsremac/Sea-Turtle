# 🐢 TurtleQuest: Ocean Savior

An AI-powered ocean cleanup adventure game with real-time leaderboards and environmental education.

## 🚀 How to Run

### Option 1: Simple Browser Test (Recommended)
1. Open `test.html` in your web browser
2. This will test if all components load correctly
3. Check the console output for any errors

### Option 2: Main Game
1. Open `index.html` in your web browser
2. The game should load with a loading screen
3. Navigate through the main menu to start playing

### Option 3: Development Server (if you have Node.js)
```bash
npm install
npm run dev:frontend
```

## 🎮 Game Features

### ✅ Implemented
- **Complete HTML Structure** - Beautiful, responsive UI with all game screens
- **Game Architecture** - Modular JavaScript classes for all game components
- **Turtle Player** - Full player character with movement, animations, and power-ups
- **Game Systems** - Trash collection, hazard avoidance, power-up management
- **Particle Effects** - Visual effects for game events
- **Audio System** - Sound effects and music management
- **PWA Support** - Progressive Web App capabilities
- **AI Companion** - Educational turtle chat with ocean facts
- **Leaderboard System** - Score tracking and global rankings
- **Settings & Customization** - Game preferences and difficulty options

### 🎯 Gameplay
- **Objective**: Collect ocean trash to restore ocean health
- **Controls**: Arrow keys/WASD for movement, Space for turbo boost
- **Power-ups**: Shield, Magnet, and Turbo abilities
- **Hazards**: Avoid sharks and fishing nets
- **Progression**: Multiple levels with increasing difficulty

## 🛠️ Technical Details

### Built With
- **Phaser 3** - Game engine for smooth 2D gameplay
- **Vanilla JavaScript** - No frameworks, pure performance
- **CSS3** - Modern styling with animations and responsive design
- **HTML5** - Semantic markup and accessibility features

### File Structure
```
Sea-Turtle/
├── index.html          # Main game page
├── test.html           # Component testing page
├── styles.css          # Game styling
├── assets/             # Game graphics and audio
├── js/                 # Game logic
│   ├── main.js        # Main application
│   ├── game-manager.js # Game state management
│   ├── ui-manager.js  # User interface handling
│   ├── audio-manager.js # Sound system
│   ├── entities/      # Game objects
│   └── effects/       # Visual effects
└── manifest.json      # PWA configuration
```

## 🌊 Environmental Impact

This game educates players about:
- Ocean pollution and its effects on marine life
- The importance of proper waste disposal
- Conservation efforts and sustainable practices
- Sea turtle biology and behavior

## 🔧 Troubleshooting

### Common Issues
1. **Scripts not loading**: Check browser console for errors
2. **Phaser not found**: Ensure internet connection for CDN loading
3. **Assets missing**: Verify all files are in the correct directories

### Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Mobile**: Responsive design with touch controls

## 🎨 Customization

### Adding New Content
- **New Trash Types**: Add to `trash-manager.js`
- **New Hazards**: Extend `hazard-manager.js`
- **New Power-ups**: Modify `power-up-manager.js`
- **New Levels**: Update `game-manager.js`

### Modifying Assets
- Replace SVG files in `assets/` directory
- Update sprite dimensions in game managers
- Modify colors and themes in `styles.css`

## 📱 PWA Features

- **Installable** - Add to home screen
- **Offline Support** - Service worker caching
- **App-like Experience** - Full-screen gameplay
- **Push Notifications** - Future feature

## 🤝 Contributing

Feel free to:
- Report bugs or issues
- Suggest new features
- Improve the code
- Add new educational content

## 📄 License

MIT License - See LICENSE file for details

---

**Save the ocean, one piece of trash at a time! 🌊🐢**
