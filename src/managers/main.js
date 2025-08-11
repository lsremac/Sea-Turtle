// TurtleQuest: Ocean Savior - Main Application
// Remove ES6 imports and make this a regular JavaScript file

class TurtleQuestApp {
  constructor() {
    this.gameManager = null;
    this.uiManager = null;
    this.audioManager = null;
    this.pwaInstaller = null;
    this.leaderboardManager = null;
    this.aiTurtleChat = null;
    
    this.currentState = 'loading';
    this.gameData = {
      score: 0,
      level: 1,
      trashCollected: 0,
      oceanHealth: 100,
      powerUpActive: false,
      powerUpType: null
    };
    
    this.settings = {
      soundVolume: 70,
      musicVolume: 50,
      difficulty: 'normal',
      particleEffects: true
    };
    
    this.init();
  }
  
  async init() {
    try {
      // Initialize managers
      this.audioManager = new AudioManager();
      this.uiManager = new UIManager(this);
      this.pwaInstaller = new PWAInstaller();
      this.leaderboardManager = new LeaderboardManager();
      this.aiTurtleChat = new AITurtleChat();
      
      // Load settings from localStorage
      this.loadSettings();
      
      // Initialize PWA
      await this.pwaInstaller.init();
      
      // Show loading screen
      this.showLoadingScreen();
      
      // Simulate loading process
      await this.simulateLoading();
      
      // Initialize game manager
      this.gameManager = new GameManager(this);
      
      // Show main menu
      this.showMainMenu();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Check for PWA install prompt
      this.pwaInstaller.checkInstallPrompt();
      
    } catch (error) {
      console.error('Failed to initialize TurtleQuest:', error);
      this.showError('Failed to initialize game. Please refresh the page.');
    }
  }
  
  async simulateLoading() {
    return new Promise(resolve => {
      const loadingProgress = document.querySelector('.loading-progress');
      const loadingText = document.querySelector('.loading-text');
      
      const loadingSteps = [
        'Loading ocean assets...',
        'Preparing turtle animations...',
        'Generating trash patterns...',
        'Setting up particle effects...',
        'Initializing AI companion...',
        'Connecting to leaderboards...',
        'Ready to dive in!'
      ];
      
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < loadingSteps.length) {
          loadingProgress.style.width = `${((currentStep + 1) / loadingSteps.length) * 100}%`;
          loadingText.textContent = loadingSteps[currentStep];
          currentStep++;
        } else {
          clearInterval(interval);
          setTimeout(resolve, 500);
        }
      }, 300);
    });
  }
  
  showLoadingScreen() {
    this.currentState = 'loading';
    document.getElementById('loading-screen').classList.remove('hidden');
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-ui').classList.add('hidden');
  }
  
  showMainMenu() {
    this.currentState = 'menu';
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('game-ui').classList.add('hidden');
    
    // Check if there's a saved game
    const savedGame = this.loadGameData();
    if (savedGame) {
      document.getElementById('btn-continue-game').classList.remove('hidden');
    } else {
      document.getElementById('btn-continue-game').classList.add('hidden');
    }
  }
  
  startGame() {
    this.currentState = 'playing';
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    
    // Debug: Check if game container exists
    const gameContainer = document.getElementById('phaser-game');
    console.log('Game container found:', gameContainer);
    console.log('Game container dimensions:', gameContainer?.offsetWidth, 'x', gameContainer?.offsetHeight);
    
    // Reset game data
    this.resetGameData();
    
    // Start the game
    this.gameManager.startGame();
    
    // Start background music
    this.audioManager.playBackgroundMusic();
  }
  
  continueGame() {
    const savedGame = this.loadGameData();
    if (savedGame) {
      this.gameData = { ...savedGame };
      this.startGame();
      this.gameManager.loadGameState(savedGame);
    }
  }
  
  pauseGame() {
    if (this.currentState === 'playing') {
      this.currentState = 'paused';
      this.gameManager.pauseGame();
      this.uiManager.showPauseOverlay();
    }
  }
  
  resumeGame() {
    if (this.currentState === 'paused') {
      this.currentState = 'playing';
      this.gameManager.resumeGame();
      this.uiManager.hidePauseOverlay();
    }
  }
  
  gameOver() {
    this.currentState = 'gameOver';
    this.gameManager.stopGame();
    this.audioManager.stopBackgroundMusic();
    this.uiManager.showGameOverOverlay(this.gameData);
    
    // Save score to leaderboard
    this.leaderboardManager.submitScore({
      score: this.gameData.score,
      level: this.gameData.level,
      trashCollected: this.gameData.trashCollected,
      timestamp: Date.now()
    });
  }
  
  levelComplete() {
    this.currentState = 'levelComplete';
    this.gameManager.pauseGame();
    
    // Calculate time bonus
    const timeBonus = Math.floor(this.gameData.score * 0.1);
    this.gameData.score += timeBonus;
    
    // Get AI turtle message
    const aiMessage = this.aiTurtleChat.getLevelCompleteMessage(this.gameData.level);
    
    this.uiManager.showLevelCompleteOverlay({
      score: this.gameData.score,
      trashCollected: this.gameData.trashCollected,
      timeBonus: timeBonus,
      aiMessage: aiMessage
    });
  }
  
  nextLevel() {
    this.gameData.level++;
    this.gameData.trashCollected = 0;
    this.gameData.oceanHealth = 100;
    this.gameData.powerUpActive = false;
    this.gameData.powerUpType = null;
    
    this.currentState = 'playing';
    this.gameManager.nextLevel();
    this.uiManager.hideLevelCompleteOverlay();
    this.uiManager.updateHUD(this.gameData);
  }
  
  updateGameData(newData) {
    this.gameData = { ...this.gameData, ...newData };
    this.uiManager.updateHUD(this.gameData);
    
    // Save game data
    this.saveGameData();
  }
  
  resetGameData() {
    this.gameData = {
      score: 0,
      level: 1,
      trashCollected: 0,
      oceanHealth: 100,
      powerUpActive: false,
      powerUpType: null
    };
    this.uiManager.updateHUD(this.gameData);
  }
  
  saveGameData() {
    try {
      localStorage.setItem('turtlequest-save', JSON.stringify(this.gameData));
    } catch (error) {
      console.warn('Failed to save game data:', error);
    }
  }
  
  loadGameData() {
    try {
      const saved = localStorage.getItem('turtlequest-save');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load game data:', error);
      return null;
    }
  }
  
  loadSettings() {
    try {
      const saved = localStorage.getItem('turtlequest-settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
        this.applySettings();
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
  }
  
  saveSettings() {
    try {
      localStorage.setItem('turtlequest-settings', JSON.stringify(this.settings));
      this.applySettings();
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }
  
  applySettings() {
    // Apply audio settings
    this.audioManager.setVolume(this.settings.soundVolume / 100);
    this.audioManager.setMusicVolume(this.settings.musicVolume / 100);
    
    // Apply UI settings
    this.uiManager.updateSettings(this.settings);
    
    // Apply game settings
    if (this.gameManager) {
      this.gameManager.updateSettings(this.settings);
    }
  }
  
  setupEventListeners() {
    // Main menu events
    document.getElementById('btn-start-game').addEventListener('click', () => {
      this.startGame();
    });
    
    document.getElementById('btn-continue-game').addEventListener('click', () => {
      this.continueGame();
    });
    
    document.getElementById('btn-leaderboard-menu').addEventListener('click', () => {
      this.uiManager.showLeaderboardOverlay();
    });
    
    document.getElementById('btn-settings').addEventListener('click', () => {
      console.log('Settings button clicked');
      console.log('UIManager:', this.uiManager);
      console.log('Settings:', this.settings);
      this.uiManager.showSettingsOverlay(this.settings);
    });
    
    document.getElementById('btn-about').addEventListener('click', () => {
      this.uiManager.showAboutOverlay();
    });
    
    // Game UI events
    document.getElementById('btn-pause').addEventListener('click', () => {
      this.pauseGame();
    });
    
    document.getElementById('btn-mute').addEventListener('click', () => {
      this.audioManager.toggleMute();
    });
    
    document.getElementById('btn-help').addEventListener('click', () => {
      this.uiManager.showHelpOverlay();
    });
    
    document.getElementById('btn-leaderboard').addEventListener('click', () => {
      this.uiManager.showLeaderboardOverlay();
    });
    
    // Pause overlay events
    document.getElementById('btn-resume').addEventListener('click', () => {
      this.resumeGame();
    });
    
    document.getElementById('btn-restart').addEventListener('click', () => {
      this.uiManager.hidePauseOverlay();
      this.restartGame();
    });
    
    document.getElementById('btn-main-menu').addEventListener('click', () => {
      this.uiManager.hidePauseOverlay();
      this.showMainMenu();
    });
    
    // Game over overlay events
    document.getElementById('btn-play-again').addEventListener('click', () => {
      this.uiManager.hideGameOverOverlay();
      this.startGame();
    });
    
    document.getElementById('btn-share-score').addEventListener('click', () => {
      this.shareScore();
    });
    
    // Level complete overlay events
    document.getElementById('btn-next-level').addEventListener('click', () => {
      this.nextLevel();
    });
    
    document.getElementById('btn-continue').addEventListener('click', () => {
      this.uiManager.hideLevelCompleteOverlay();
      this.resumeGame();
    });
    
    // Help overlay events
    document.getElementById('btn-close-help').addEventListener('click', () => {
      this.uiManager.hideHelpOverlay();
    });
    
    // Leaderboard overlay events
    document.getElementById('btn-close-leaderboard').addEventListener('click', () => {
      this.uiManager.hideLeaderboardOverlay();
    });
    
    // Settings overlay events
    document.getElementById('btn-save-settings').addEventListener('click', () => {
      this.saveSettingsFromUI();
    });
    
    document.getElementById('btn-cancel-settings').addEventListener('click', () => {
      this.uiManager.hideSettingsOverlay();
    });
    
    // About overlay events
    document.getElementById('btn-close-about').addEventListener('click', () => {
      this.uiManager.hideAboutOverlay();
    });
    
    // PWA install events
    document.getElementById('btn-install-pwa').addEventListener('click', () => {
      this.pwaInstaller.install();
    });
    
    document.getElementById('btn-dismiss-pwa').addEventListener('click', () => {
      this.pwaInstaller.dismiss();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardInput(e);
    });
    
    // Window events
    window.addEventListener('beforeunload', () => {
      this.saveGameData();
    });
    
    window.addEventListener('focus', () => {
      if (this.currentState === 'playing') {
        this.audioManager.resumeAudio();
      }
    });
    
    window.addEventListener('blur', () => {
      if (this.currentState === 'playing') {
        this.audioManager.pauseAudio();
      }
    });
  }
  
  handleKeyboardInput(e) {
    switch (e.code) {
      case 'KeyP':
        if (this.currentState === 'playing') {
          this.pauseGame();
        } else if (this.currentState === 'paused') {
          this.resumeGame();
        }
        break;
      case 'KeyM':
        this.audioManager.toggleMute();
        break;
      case 'KeyH':
        if (this.currentState === 'playing') {
          this.uiManager.showHelpOverlay();
        }
        break;
      case 'KeyL':
        if (this.currentState === 'playing') {
          this.uiManager.showLeaderboardOverlay();
        }
        break;
      case 'Escape':
        if (this.currentState === 'playing') {
          this.pauseGame();
        } else if (this.currentState === 'paused') {
          this.resumeGame();
        }
        break;
    }
  }
  
  saveSettingsFromUI() {
    this.settings.soundVolume = parseInt(document.getElementById('sound-volume').value);
    this.settings.musicVolume = parseInt(document.getElementById('music-volume').value);
    this.settings.difficulty = document.getElementById('difficulty').value;
    this.settings.particleEffects = document.getElementById('particle-effects').checked;
    
    this.saveSettings();
    this.uiManager.hideSettingsOverlay();
  }
  
  restartGame() {
    this.resetGameData();
    this.gameManager.restartGame();
    this.startGame();
  }
  
  shareScore() {
    if (navigator.share) {
      navigator.share({
        title: 'TurtleQuest Score',
        text: `I scored ${this.gameData.score} points in TurtleQuest: Ocean Savior! Can you beat my score?`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      const text = `I scored ${this.gameData.score} points in TurtleQuest: Ocean Savior! Can you beat my score? Play at ${window.location.href}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Score copied to clipboard!');
      }).catch(() => {
        alert('Failed to copy score to clipboard.');
      });
    }
  }
  
  showError(message) {
    console.error(message);
    // You could implement a proper error display UI here
    alert(message);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.turtleQuestApp = new TurtleQuestApp();
});
