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
    
    // Combo system
    this.comboSystem = {
      currentCombo: 0,
      maxCombo: 0,
      comboMultiplier: 1,
      comboTimeWindow: 3000, // 3 seconds
      lastCollectionTime: 0,
      comboDisplay: null
    };
    
    // Ocean Guardian mode
    this.oceanGuardianMode = {
      isActive: false,
      activationThreshold: 10, // Activate at 10x combo
      duration: 8000, // 8 seconds
      timer: null,
      visualEffect: null
    };
    
    // Ocean Cleanup Challenge
    this.cleanupChallenge = {
      isActive: false,
      timer: null,
      challengeDuration: 15000, // 15 seconds
      targetTrash: 0,
      collectedTrash: 0,
      challengeDisplay: null,
      reward: 0
    };
    
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
      render: {
        pixelArt: false,
        antialias: true
      },
      scene: {
        preload: this.preload.bind(this),
        create: this.create.bind(this),
        update: this.update.bind(this)
      }
    };
  }
  
  startGame() {
    try {
      if (this.game) {
        this.game.destroy(true);
      }
      
      // Check if game container exists
      const gameContainer = document.getElementById('phaser-game');
      if (!gameContainer) {
        console.error('Game container not found!');
        return;
      }
      
      console.log('Game container found:', gameContainer);
      console.log('Game container dimensions:', gameContainer.offsetWidth, 'x', gameContainer.offsetHeight);
      console.log('Game container style:', gameContainer.style);
      
      // Update game config with container info
      this.gameConfig.parent = 'phaser-game';
      this.gameConfig.width = gameContainer.offsetWidth || 800;
      this.gameConfig.height = gameContainer.offsetHeight || 600;
      
      console.log('Game config:', this.gameConfig);
      console.log('Starting Phaser game...');
      
      this.game = new Phaser.Game(this.gameConfig);
      console.log('Phaser game created:', this.game);
      
      // Add error handling for the game
      this.game.events.on('error', (error) => {
        console.error('Phaser game error:', error);
      });
      
      // Add ready event listener
      this.game.events.on('ready', () => {
        console.log('Phaser game is ready!');
      });
      
    } catch (error) {
      console.error('Failed to start game:', error);
    }
  }
  
  preload() {
    console.log('Game preload started');
    
    // Load game assets
    this.scene = this.game.scene.scenes[0];
    console.log('Scene reference:', this.scene);
    
    // Load PNG game assets
    try {
      console.log('Loading PNG game assets...');
      
      // Turtle spritesheet (4x4 grid of 32x32 sprites)
      this.scene.load.spritesheet('turtle', 'assets/turtle-sheet.png', { 
        frameWidth: 32, 
        frameHeight: 32 
      });
      
      // Trash items (2x2 grid of 16x16 sprites)
      this.scene.load.spritesheet('trash-items', 'assets/trash-items.png', {
        frameWidth: 32,
        frameHeight: 32
      });
      
      // Hazards (2x2 grid of 24x24 sprites)
      this.scene.load.spritesheet('hazards', 'assets/hazards.png', {
        frameWidth: 32,
        frameHeight: 32
      });
      
      // Power-ups (2x2 grid of 20x20 sprites)
      this.scene.load.spritesheet('powerups', 'assets/powerups.png', {
        frameWidth: 32,
        frameHeight: 32
      });
      
      // Background
      this.scene.load.image('ocean-bg', 'assets/background.png');
      
      // Individual asset references for easy access
      this.scene.load.image('plastic-bottle', 'assets/trash-items.png');
      this.scene.load.image('fishing-net', 'assets/trash-items.png');
      this.scene.load.image('soda-can', 'assets/trash-items.png');
      this.scene.load.image('plastic-bag', 'assets/trash-items.png');
      
      this.scene.load.image('shark', 'assets/hazards.png');
      this.scene.load.image('jellyfish', 'assets/hazards.png');
      
      this.scene.load.image('turbo', 'assets/powerups.png');
      this.scene.load.image('shield', 'assets/powerups.png');
      this.scene.load.image('magnet', 'assets/powerups.png');
      
      console.log('PNG assets loaded successfully');
    } catch (error) {
      console.warn('PNG assets failed to load, using fallbacks:', error);
    }
    
    console.log('Preload completed');
  }
  
  createFallbackTurtle() {
    // Create a simple colored rectangle as fallback for turtle
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x00ff00); // Bright green
    graphics.fillRect(0, 0, 64, 64); // Make it bigger
    graphics.lineStyle(2, 0x000000); // Black border
    graphics.strokeRect(0, 0, 64, 64);
    
    // Add a simple turtle face
    graphics.fillStyle(0x000000);
    graphics.fillCircle(16, 16, 4); // Left eye
    graphics.fillCircle(48, 16, 4); // Right eye
    graphics.fillStyle(0xff0000);
    graphics.fillCircle(32, 48, 6); // Red nose
    
    graphics.generateTexture('turtle', 64, 64);
    graphics.destroy();
  }
  
  createFallbackAssets() {
    // Create fallback assets for all required sprites
    this.createFallbackTurtle();
    this.createFallbackTrash();
    this.createFallbackHazards();
    this.createFallbackPowerUps();
    this.createFallbackBackground();
  }
  
  createFallbackTrash() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xff0000);
    graphics.fillRect(0, 0, 16, 16);
    graphics.generateTexture('plastic-bottle', 16, 16);
    graphics.generateTexture('fishing-net', 16, 16);
    graphics.generateTexture('soda-can', 16, 16);
    graphics.generateTexture('plastic-bag', 16, 16);
    graphics.destroy();
  }
  
  createFallbackHazards() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x800080);
    graphics.fillRect(0, 0, 24, 24);
    graphics.generateTexture('shark', 24, 24);
    graphics.generateTexture('jellyfish', 24, 24);
    graphics.destroy();
  }
  
  createFallbackPowerUps() {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffff00);
    graphics.fillRect(0, 0, 20, 20);
    graphics.generateTexture('turbo', 20, 20);
    graphics.generateTexture('shield', 20, 20);
    graphics.generateTexture('magnet', 20, 20);
    graphics.destroy();
  }
  
  create() {
    console.log('Game create started');
    
    // Create fallback assets if SVG assets failed to load
    console.log('Creating fallback assets...');
    this.createFallbackAssets();
    
    // Create background with fallback
    try {
      console.log('Creating ocean background...');
      const bg = this.scene.add.tileSprite(400, 300, 800, 600, 'ocean-bg');
      bg.setDepth(-10); // Put background behind everything
      console.log('Ocean background created successfully');
    } catch (error) {
      console.warn('Failed to create ocean background, using fallback:', error);
      this.createFallbackBackground();
    }
    
    // Add a simple test text to verify the scene is working
    console.log('Adding test text...');
    this.scene.add.text(400, 100, 'TurtleQuest Game Running!', {
      fontSize: '24px',
      fill: '#00ff00'
    }).setOrigin(0.5).setDepth(5);
    
    // Add control instructions
    this.scene.add.text(400, 150, 'Use ARROW KEYS or WASD to move the turtle', {
      fontSize: '18px',
      fill: '#ffff00'
    }).setOrigin(0.5).setDepth(5);
    
    this.scene.add.text(400, 180, 'SPACEBAR for turbo boost (when available)', {
      fontSize: '16px',
      fill: '#ffff00'
    }).setOrigin(0.5).setDepth(5);
    
    // Initialize managers
    console.log('Initializing managers...');
    this.particleManager = new ParticleManager(this.scene);
    this.trashManager = new TrashManager(this.scene, this.app);
    this.hazardManager = new HazardManager(this.scene, this.app);
    this.powerUpManager = new PowerUpManager(this.scene, this.app);
    console.log('Managers initialized');
    
    // Create turtle player
    console.log('Creating turtle player...');
    this.turtlePlayer = new TurtlePlayer(this.scene, 400, 300, this.app);
    console.log('Turtle player created:', this.turtlePlayer);
    
    // Set up camera
    console.log('Setting up camera...');
    this.scene.cameras.main.startFollow(this.turtlePlayer.sprite);
    this.scene.cameras.main.setZoom(1.2);
    console.log('Camera setup complete');
    
    // Create combo display
    this.comboSystem.comboDisplay = this.scene.add.text(400, 50, '', {
      fontSize: '24px',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 4,
      fontFamily: 'Orbitron'
    }).setOrigin(0.5).setDepth(10);
    this.comboSystem.comboDisplay.setVisible(false);
    
    // Create challenge display
    this.cleanupChallenge.challengeDisplay = this.scene.add.text(400, 80, '', {
      fontSize: '20px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 3,
      fontFamily: 'Orbitron'
    }).setOrigin(0.5).setDepth(10);
    this.cleanupChallenge.challengeDisplay.setVisible(false);
    
    // Create initial game objects
    console.log('Creating initial game objects...');
    this.trashManager.spawnInitialTrash();
    this.hazardManager.spawnInitialHazards();
    this.powerUpManager.spawnInitialPowerUps();
    console.log('Initial game objects created');
    
    // Set up collision detection
    console.log('Setting up collisions...');
    this.setupCollisions();
    console.log('Collisions setup complete');
    
    // Start game loop
    console.log('Starting game loop...');
    this.startGameLoop();
    
    console.log('Game created successfully with turtle at:', this.turtlePlayer.sprite.x, this.turtlePlayer.sprite.y);
  }
  
  createFallbackBackground() {
    // Create a simple blue background as fallback
    const graphics = this.scene.add.graphics();
    graphics.setDepth(-10); // Put background behind everything
    graphics.fillStyle(0x87CEEB); // Sky blue
    graphics.fillRect(0, 0, 800, 600);
    
    // Add some simple wave lines
    graphics.lineStyle(2, 0x4682B4, 0.3);
    for (let i = 0; i < 5; i++) {
      const y = 100 + i * 100;
      graphics.beginPath();
      graphics.moveTo(0, y);
      graphics.lineTo(800, y);
      graphics.strokePath();
    }
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
    
    // Maybe start a challenge
    this.maybeStartChallenge();
    
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
    
    // Update combo system
    this.updateCombo();
    
    // Calculate score with combo multiplier
    const trashValue = trash.getData('value') || 10;
    const comboBonus = Math.floor(this.comboSystem.currentCombo * 0.5) * trashValue;
    const totalScore = trashValue + comboBonus;
    
    // Update game data
    this.app.updateGameData({
      score: this.app.gameData.score + totalScore,
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
    
    // Update challenge progress if active
    if (this.cleanupChallenge.isActive) {
      this.updateChallengeProgress();
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
    
    // Apply difficulty settings
    if (this.trashManager) {
      this.trashManager.setDifficulty(settings.difficulty === 'easy' ? 0.8 : settings.difficulty === 'hard' ? 1.5 : 1);
    }
    if (this.hazardManager) {
      this.hazardManager.setDifficulty(settings.difficulty === 'easy' ? 0.8 : settings.difficulty === 'hard' ? 1.5 : 1);
    }
    if (this.powerUpManager) {
      this.powerUpManager.setDifficulty(settings.difficulty === 'easy' ? 0.8 : settings.difficulty === 'hard' ? 1.5 : 1);
    }
  }
  
  updateCombo() {
    const currentTime = Date.now();
    
    // Check if we're within the combo time window
    if (currentTime - this.comboSystem.lastCollectionTime < this.comboSystem.comboTimeWindow) {
      this.comboSystem.currentCombo++;
      this.comboSystem.comboMultiplier = 1 + (this.comboSystem.currentCombo * 0.1);
      
      // Update max combo if needed
      if (this.comboSystem.currentCombo > this.comboSystem.maxCombo) {
        this.comboSystem.maxCombo = this.comboSystem.currentCombo;
      }
      
      // Show combo display
      this.showComboDisplay();
      
      // Check for Ocean Guardian mode activation
      if (this.comboSystem.currentCombo >= this.oceanGuardianMode.activationThreshold && !this.oceanGuardianMode.isActive) {
        this.activateOceanGuardianMode();
      }
    } else {
      // Reset combo if too much time has passed
      this.comboSystem.currentCombo = 1;
      this.comboSystem.comboMultiplier = 1;
    }
    
    this.comboSystem.lastCollectionTime = currentTime;
    
    // Schedule combo reset
    setTimeout(() => {
      if (currentTime === this.comboSystem.lastCollectionTime) {
        this.resetCombo();
      }
    }, this.comboSystem.comboTimeWindow);
  }
  
  showComboDisplay() {
    if (this.comboSystem.comboDisplay) {
      const comboText = this.comboSystem.currentCombo > 1 ? 
        `COMBO x${this.comboSystem.currentCombo}!` : '';
      
      this.comboSystem.comboDisplay.setText(comboText);
      this.comboSystem.comboDisplay.setVisible(true);
      
      // Add some visual flair
      this.scene.tweens.add({
        targets: this.comboSystem.comboDisplay,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 200,
        yoyo: true,
        ease: 'Back.easeOut'
      });
      
      // Hide after a short delay
      setTimeout(() => {
        this.comboSystem.comboDisplay.setVisible(false);
      }, 1500);
    }
  }
  
  resetCombo() {
    this.comboSystem.currentCombo = 0;
    this.comboSystem.comboMultiplier = 1;
    if (this.comboSystem.comboDisplay) {
      this.comboSystem.comboDisplay.setVisible(false);
    }
  }
  
  getComboStats() {
    return {
      currentCombo: this.comboSystem.currentCombo,
      maxCombo: this.comboSystem.maxCombo,
      multiplier: this.comboSystem.comboMultiplier
    };
  }
  
  activateOceanGuardianMode() {
    this.oceanGuardianMode.isActive = true;
    
    // Create visual effect
    this.oceanGuardianMode.visualEffect = this.scene.add.graphics();
    this.oceanGuardianMode.visualEffect.setDepth(5);
    
    // Add pulsing aura around turtle
    this.scene.tweens.add({
      targets: this.oceanGuardianMode.visualEffect,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Show activation message
    const guardianText = this.scene.add.text(400, 100, 'OCEAN GUARDIAN MODE!', {
      fontSize: '32px',
      fill: '#00ffff',
      stroke: '#000000',
      strokeThickness: 6,
      fontFamily: 'Orbitron'
    }).setOrigin(0.5).setDepth(10);
    
    // Animate the text
    this.scene.tweens.add({
      targets: guardianText,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 500,
      yoyo: true,
      repeat: 3,
      ease: 'Back.easeOut'
    });
    
    // Remove text after animation
    setTimeout(() => {
      guardianText.destroy();
    }, 3000);
    
    // Set timer to deactivate
    this.oceanGuardianMode.timer = setTimeout(() => {
      this.deactivateOceanGuardianMode();
    }, this.oceanGuardianMode.duration);
    
    // Apply special effects
    this.applyOceanGuardianEffects();
    
    console.log('Ocean Guardian mode activated!');
  }
  
  deactivateOceanGuardianMode() {
    this.oceanGuardianMode.isActive = false;
    
    // Clear timer
    if (this.oceanGuardianMode.timer) {
      clearTimeout(this.oceanGuardianMode.timer);
      this.oceanGuardianMode.timer = null;
    }
    
    // Remove visual effect
    if (this.oceanGuardianMode.visualEffect) {
      this.oceanGuardianMode.visualEffect.destroy();
      this.oceanGuardianMode.visualEffect = null;
    }
    
    // Remove special effects
    this.removeOceanGuardianEffects();
    
    console.log('Ocean Guardian mode deactivated');
  }
  
  applyOceanGuardianEffects() {
    // Make turtle invincible
    if (this.turtlePlayer) {
      this.turtlePlayer.setInvincible(true);
    }
    
    // Increase trash collection radius
    if (this.trashManager) {
      this.trashManager.setMagnetRadius(300); // Double the magnet radius
    }
    
    // Slow down hazards
    if (this.hazardManager) {
      this.hazardManager.setSpeedMultiplier(0.5);
    }
    
    // Spawn extra power-ups
    if (this.powerUpManager) {
      this.powerUpManager.spawnBonusPowerUps();
    }
  }
  
  removeOceanGuardianEffects() {
    // Restore normal turtle state
    if (this.turtlePlayer) {
      this.turtlePlayer.setInvincible(false);
    }
    
    // Restore normal magnet radius
    if (this.trashManager) {
      this.trashManager.setMagnetRadius(150);
    }
    
    // Restore normal hazard speed
    if (this.hazardManager) {
      this.hazardManager.setSpeedMultiplier(1);
    }
  }
  
  isOceanGuardianActive() {
    return this.oceanGuardianMode.isActive;
  }
  
  startCleanupChallenge() {
    if (this.cleanupChallenge.isActive) return;
    
    this.cleanupChallenge.isActive = true;
    this.cleanupChallenge.targetTrash = Phaser.Math.Between(8, 15);
    this.cleanupChallenge.collectedTrash = 0;
    this.cleanupChallenge.reward = this.cleanupChallenge.targetTrash * 25;
    
    // Show challenge display
    this.showChallengeDisplay();
    
    // Set timer
    this.cleanupChallenge.timer = setTimeout(() => {
      this.endCleanupChallenge();
    }, this.cleanupChallenge.challengeDuration);
    
    console.log(`Cleanup Challenge started! Collect ${this.cleanupChallenge.targetTrash} trash in ${this.cleanupChallenge.challengeDuration / 1000} seconds!`);
  }
  
  showChallengeDisplay() {
    if (this.cleanupChallenge.challengeDisplay) {
      const timeLeft = Math.ceil(this.cleanupChallenge.challengeDuration / 1000);
      const text = `CLEANUP CHALLENGE: ${this.cleanupChallenge.collectedTrash}/${this.cleanupChallenge.targetTrash} (${timeLeft}s)`;
      
      this.cleanupChallenge.challengeDisplay.setText(text);
      this.cleanupChallenge.challengeDisplay.setVisible(true);
      
      // Update display every second
      const updateInterval = setInterval(() => {
        if (!this.cleanupChallenge.isActive) {
          clearInterval(updateInterval);
          return;
        }
        
        const remainingTime = Math.ceil((this.cleanupChallenge.challengeDuration - (Date.now() - this.cleanupChallenge.startTime)) / 1000);
        if (remainingTime <= 0) {
          clearInterval(updateInterval);
          return;
        }
        
        const text = `CLEANUP CHALLENGE: ${this.cleanupChallenge.collectedTrash}/${this.cleanupChallenge.targetTrash} (${remainingTime}s)`;
        this.cleanupChallenge.challengeDisplay.setText(text);
      }, 1000);
    }
  }
  
  updateChallengeProgress() {
    if (!this.cleanupChallenge.isActive) return;
    
    this.cleanupChallenge.collectedTrash++;
    
    // Check if challenge is complete
    if (this.cleanupChallenge.collectedTrash >= this.cleanupChallenge.targetTrash) {
      this.completeCleanupChallenge();
    }
  }
  
  completeCleanupChallenge() {
    if (!this.cleanupChallenge.isActive) return;
    
    // Award bonus points
    this.app.updateGameData({
      score: this.app.gameData.score + this.cleanupChallenge.reward
    });
    
    // Show completion message
    const completionText = this.scene.add.text(400, 150, `CHALLENGE COMPLETE! +${this.cleanupChallenge.reward} points!`, {
      fontSize: '28px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 4,
      fontFamily: 'Orbitron'
    }).setOrigin(0.5).setDepth(10);
    
    // Animate completion
    this.scene.tweens.add({
      targets: completionText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 500,
      yoyo: true,
      repeat: 2,
      ease: 'Back.easeOut'
    });
    
    // Remove text after animation
    setTimeout(() => {
      completionText.destroy();
    }, 3000);
    
    this.endCleanupChallenge();
  }
  
  endCleanupChallenge() {
    this.cleanupChallenge.isActive = false;
    
    // Clear timer
    if (this.cleanupChallenge.timer) {
      clearTimeout(this.cleanupChallenge.timer);
      this.cleanupChallenge.timer = null;
    }
    
    // Hide display
    if (this.cleanupChallenge.challengeDisplay) {
      this.cleanupChallenge.challengeDisplay.setVisible(false);
    }
    
    console.log('Cleanup Challenge ended');
  }
  
  // Randomly start challenges
  maybeStartChallenge() {
    if (Math.random() < 0.1 && !this.cleanupChallenge.isActive) { // 10% chance
      this.startCleanupChallenge();
    }
  }
}
