// Game Manager - Handles the Phaser game instance and game logic
// Remove ES6 imports and make this a regular JavaScript file

class GameManager {
  constructor(app) {
    this.app = app;
    this.game = null;
    this.scene = null;
    this.turtlePlayer = null;
    this.trashManager = null;
    this.hazardManager = null;
    this.powerUpManager = null;
    this.particleManager = null;
    
    this.gameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'phaser-game',
      backgroundColor: '#87CEEB',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this)
      }
    };
  }
  
  startGame() {
    if (this.game) {
      this.game.destroy(true);
    }
    
    this.game = new Phaser.Game(this.gameConfig);
  }
  
  preload() {
    // Load game assets
    this.scene = this.game.scene.scenes[0];
    
    // Turtle sprites
    this.scene.load.spritesheet('turtle', 'assets/turtle-sheet.svg', { 
      frameWidth: 32, 
      frameHeight: 32 
    });
    
    // Trash sprites
    this.scene.load.image('plastic-bottle', 'assets/plastic-bottle.svg');
    this.scene.load.image('fishing-net', 'assets/plastic-bottle.svg'); // Using bottle as placeholder
    this.scene.load.image('soda-can', 'assets/plastic-bottle.svg'); // Using bottle as placeholder
    this.scene.load.image('plastic-bag', 'assets/plastic-bottle.svg'); // Using bottle as placeholder
    
    // Hazard sprites
    this.scene.load.image('shark', 'assets/shark.svg');
    this.scene.load.image('jellyfish', 'assets/shark.svg'); // Using shark as placeholder
    
    // Power-up sprites
    this.scene.load.image('turbo', 'assets/plastic-bottle.svg'); // Using bottle as placeholder
    this.scene.load.image('shield', 'assets/plastic-bottle.svg'); // Using bottle as placeholder
    this.scene.load.image('magnet', 'assets/plastic-bottle.svg'); // Using bottle as placeholder
    
    // Background and effects
    this.scene.load.image('ocean-bg', 'assets/ocean-bg.svg');
    this.scene.load.image('bubble', 'assets/plastic-bottle.svg'); // Using bottle as placeholder
    
    // Audio - commented out for now since we don't have audio files
    // this.scene.load.audio('collect-trash', 'assets/audio/collect-trash.mp3');
    // this.scene.load.audio('hit-hazard', 'assets/audio/hit-hazard.mp3');
    // this.scene.load.audio('power-up', 'assets/audio/power-up.mp3');
    // this.scene.load.audio('level-up', 'assets/audio/level-up.mp3');
  }
  
  create() {
    // Create background
    this.scene.add.tileSprite(400, 300, 800, 600, 'ocean-bg');
    
    // Initialize managers
    this.particleManager = new ParticleManager(this.scene);
    this.trashManager = new TrashManager(this.scene, this.app);
    this.hazardManager = new HazardManager(this.scene, this.app);
    this.powerUpManager = new PowerUpManager(this.scene, this.app);
    
    // Create turtle player
    this.turtlePlayer = new TurtlePlayer(this.scene, 400, 300, this.app);
    
    // Set up camera
    this.scene.cameras.main.startFollow(this.turtlePlayer.sprite);
    this.scene.cameras.main.setZoom(1.2);
    
    // Create initial game objects
    this.trashManager.spawnInitialTrash();
    this.hazardManager.spawnInitialHazards();
    this.powerUpManager.spawnInitialPowerUps();
    
    // Set up collision detection
    this.setupCollisions();
    
    // Start game loop
    this.startGameLoop();
  }
  
  startGameLoop() {
    // Game loop is handled by Phaser's update method
    // Additional game loop logic can be added here
    console.log('Game loop started');
  }
  
  update() {
    if (!this.turtlePlayer) return;
    
    // Update turtle player
    this.turtlePlayer.update();
    
    // Update managers
    this.trashManager.update();
    this.hazardManager.update();
    this.powerUpManager.update();
    
    // Check win conditions
    this.checkWinConditions();
  }
  
  setupCollisions() {
    // Turtle vs Trash
    this.scene.physics.add.overlap(
      this.turtlePlayer.sprite,
      this.trashManager.group,
      this.onTrashCollected.bind(this),
      null,
      this
    );
    
    // Turtle vs Hazards
    this.scene.physics.add.overlap(
      this.turtlePlayer.sprite,
      this.hazardManager.group,
      this.onHazardHit.bind(this),
      null,
      this
    );
    
    // Turtle vs Power-ups
    this.scene.physics.add.overlap(
      this.turtlePlayer.sprite,
      this.powerUpManager.group,
      this.onPowerUpCollected.bind(this),
      null,
      this
    );
  }
  
  onTrashCollected(turtle, trash) {
    // Play collection effect
    this.particleManager.createCollectionEffect(trash.x, trash.y);
    
    // Update game data
    const trashValue = trash.getData('value') || 10;
    this.app.updateGameData({
      score: this.app.gameData.score + trashValue,
      trashCollected: this.app.gameData.trashCollected + 1,
      oceanHealth: Math.min(100, this.app.gameData.oceanHealth + 2)
    });
    
    // Remove trash
    trash.destroy();
    
    // Play sound (if available)
    try {
      this.app.audioManager.playSound('collect-trash');
    } catch (error) {
      console.log('Audio not available');
    }
    
    // Check if level is complete
    if (this.app.gameData.trashCollected >= this.getRequiredTrashForLevel()) {
      this.levelComplete();
    }
  }
  
  onHazardHit(turtle, hazard) {
    if (this.turtlePlayer.isShielded()) {
      // Turtle is protected
      this.particleManager.createShieldEffect(turtle.x, turtle.y);
      hazard.destroy();
      return;
    }
    
    // Play hit effect
    this.particleManager.createHitEffect(turtle.x, turtle.y);
    
    // Update game data
    this.app.updateGameData({
      oceanHealth: Math.max(0, this.app.gameData.oceanHealth - 20)
    });
    
    // Remove hazard
    hazard.destroy();
    
    // Play sound (if available)
    try {
      this.app.audioManager.playSound('hit-hazard');
    } catch (error) {
      console.log('Audio not available');
    }
    
    // Check game over
    if (this.app.gameData.oceanHealth <= 0) {
      this.gameOver();
    }
  }
  
  onPowerUpCollected(turtle, powerUp) {
    const powerUpType = powerUp.getData('type');
    
    // Apply power-up effect
    this.turtlePlayer.activatePowerUp(powerUpType);
    
    // Play effect
    this.particleManager.createPowerUpEffect(turtle.x, turtle.y, powerUpType);
    
    // Update game data
    this.app.updateGameData({
      powerUpActive: true,
      powerUpType: powerUpType
    });
    
    // Remove power-up
    powerUp.destroy();
    
    // Play sound (if available)
    try {
      this.app.audioManager.playSound('power-up');
    } catch (error) {
      console.log('Audio not available');
    }
  }
  
  checkWinConditions() {
    // Check if all trash is collected
    if (this.trashManager.group.getChildren().length === 0) {
      this.levelComplete();
    }
  }
  
  levelComplete() {
    this.app.levelComplete();
  }
  
  gameOver() {
    this.app.gameOver();
  }
  
  getRequiredTrashForLevel() {
    return Math.min(20 + (this.app.gameData.level - 1) * 5, 50);
  }
  
  pauseGame() {
    if (this.game) {
      this.game.scene.pause();
    }
  }
  
  resumeGame() {
    if (this.game) {
      this.game.scene.resume();
    }
  }
  
  stopGame() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
  
  nextLevel() {
    // Increase difficulty
    this.trashManager.setDifficulty(this.app.gameData.level);
    this.hazardManager.setDifficulty(this.app.gameData.level);
    
    // Spawn new objects
    this.trashManager.spawnInitialTrash();
    this.hazardManager.spawnInitialHazards();
    
    // Reset turtle position
    this.turtlePlayer.resetPosition();
  }
  
  restartGame() {
    this.stopGame();
    this.startGame();
  }
  
  loadGameState(gameData) {
    // Load saved game state
    this.app.gameData = { ...gameData };
    this.app.uiManager.updateHUD(this.app.gameData);
  }
  
  updateSettings(settings) {
    // Update game settings
    if (this.particleManager) {
      this.particleManager.setEnabled(settings.particleEffects);
    }
  }
}
