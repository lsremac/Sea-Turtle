// Turtle Player - Main player character with movement and power-up handling
// Remove ES6 export and make this a regular JavaScript class

class TurtlePlayer {
  constructor(scene, x, y, app) {
    this.scene = scene;
    this.app = app;
    this.x = x;
    this.y = y;
    
    // Player state
    this.speed = 200;
    this.maxSpeed = 400;
    this.isShielded = false;
    this.isMagnetized = false;
    this.isTurboActive = false;
    
    // Power-up timers
    this.powerUpTimers = {
      shield: 0,
      magnet: 0,
      turbo: 0
    };
    
    // Create sprite
    this.createSprite();
    
    // Set up animations
    this.setupAnimations();
    
    // Set up input handling
    this.setupInput();
    
    // Set up physics
    this.setupPhysics();
  }
  
  createSprite() {
    console.log('Creating turtle sprite at:', this.x, this.y);
    console.log('Scene physics:', this.scene.physics);
    console.log('Turtle texture available:', this.scene.textures.exists('turtle'));
    
    this.sprite = this.scene.physics.add.sprite(this.x, this.y, 'turtle');
    console.log('Turtle sprite created:', this.sprite);
    
    this.sprite.setScale(2.0); // Make it bigger for visibility
    this.sprite.setCollideWorldBounds(true);
    
    // Set data for collision detection
    this.sprite.setData('type', 'player');
    this.sprite.setData('damage', 0);
    
    // Add debug text above turtle
    this.debugText = this.scene.add.text(this.x, this.y - 50, '🐢 TURTLE', {
      fontSize: '16px',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);
    
    // Add position display
    this.positionText = this.scene.add.text(this.x, this.y + 50, `X: ${this.x}, Y: ${this.y}`, {
      fontSize: '12px',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    }).setOrigin(0.5);
    
    console.log('Turtle sprite setup complete');
  }
  
  setupAnimations() {
    // Create turtle animations
    this.scene.anims.create({
      key: 'turtle-swim',
      frames: this.scene.anims.generateFrameNumbers('turtle', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });
    
    this.scene.anims.create({
      key: 'turtle-idle',
      frames: this.scene.anims.generateFrameNumbers('turtle', { start: 4, end: 7 }),
      frameRate: 4,
      repeat: -1
    });
    
    this.scene.anims.create({
      key: 'turtle-turbo',
      frames: this.scene.anims.generateFrameNumbers('turtle', { start: 8, end: 11 }),
      frameRate: 12,
      repeat: -1
    });
    
    // Start with idle animation
    this.sprite.play('turtle-idle');
  }
  
  setupInput() {
    // Wait for scene to be ready
    if (this.scene && this.scene.input && this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasd = this.scene.input.keyboard.addKeys('W', 'A', 'S', 'D');
      this.spaceKey = this.scene.input.keyboard.addKey('SPACE');
      
      // Mobile touch controls
      this.setupMobileControls();
    } else {
      console.warn('Scene input not ready, retrying in next frame');
      // Retry in next frame
      this.scene.time.delayedCall(100, () => this.setupInput());
    }
  }
  
  setupMobileControls() {
    // Left control stick for movement
    const leftStick = document.querySelector('.left-stick');
    if (leftStick) {
      this.setupTouchStick(leftStick, 'left');
    }
    
    // Right control stick for actions
    const rightStick = document.querySelector('.right-stick');
    if (rightStick) {
      this.setupTouchStick(rightStick, 'right');
    }
  }
  
  setupTouchStick(stickElement, type) {
    let isDragging = false;
    let startPos = { x: 0, y: 0 };
    let currentPos = { x: 0, y: 0 };
    
    stickElement.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isDragging = true;
      const touch = e.touches[0];
      const rect = stickElement.getBoundingClientRect();
      startPos = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      currentPos = { x: touch.clientX, y: touch.clientY };
    });
    
    stickElement.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (isDragging) {
        const touch = e.touches[0];
        currentPos = { x: touch.clientX, y: touch.clientY };
        
        if (type === 'left') {
          this.handleTouchMovement(currentPos, startPos);
        } else if (type === 'right') {
          this.handleTouchAction(currentPos, startPos);
        }
      }
    });
    
    stickElement.addEventListener('touchend', () => {
      isDragging = false;
      if (type === 'left') {
        this.stopMovement();
      }
    });
  }
  
  handleTouchMovement(currentPos, startPos) {
    const deltaX = currentPos.x - startPos.x;
    const deltaY = currentPos.y - startPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 20) {
      const angle = Math.atan2(deltaY, deltaX);
      this.moveDirection = {
        x: Math.cos(angle),
        y: Math.sin(angle)
      };
    }
  }
  
  handleTouchAction(currentPos, startPos) {
    const deltaX = currentPos.x - startPos.x;
    const deltaY = currentPos.y - startPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance > 30) {
      // Activate turbo boost
      if (this.isTurboActive) {
        this.activateTurbo();
      }
    }
  }
  
  stopMovement() {
    this.moveDirection = null;
    this.sprite.setVelocity(0, 0);
    this.sprite.play('turtle-idle');
  }
  
  setupPhysics() {
    // Set up physics body
    this.sprite.body.setSize(20, 20);
    this.sprite.body.setOffset(6, 6);
    
    // Add drag for more realistic movement
    this.sprite.body.setDrag(0.95);
  }
  
  update() {
    this.handleInput();
    this.updatePowerUps();
    this.updateAnimation();
    this.updatePosition();
  }
  
  handleInput() {
    // Check if input is ready
    if (!this.cursors || !this.wasd || !this.spaceKey) {
      return; // Input not ready yet
    }

    // Reset velocity
    this.sprite.setVelocity(0, 0);
    
    // Handle keyboard input
    let moveX = 0;
    let moveY = 0;
    
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      moveX = -1;
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      moveX = 1;
    }
    
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      moveY = -1;
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      moveY = 1;
    }
    
    // Handle touch movement
    if (this.moveDirection) {
      moveX = this.moveDirection.x;
      moveY = this.moveDirection.y;
    }
    
    // Apply movement
    if (moveX !== 0 || moveY !== 0) {
      const currentSpeed = this.isTurboActive ? this.maxSpeed : this.speed;
      this.sprite.setVelocity(moveX * currentSpeed, moveY * currentSpeed);
      
      // Update sprite direction
      if (moveX < 0) {
        this.sprite.setFlipX(true);
      } else if (moveX > 0) {
        this.sprite.setFlipX(false);
      }
    }
    
    // Handle turbo boost
    if (this.spaceKey.isDown && this.isTurboActive) {
      this.activateTurbo();
    }
  }
  
  updatePowerUps() {
    const currentTime = Date.now();
    
    // Update shield timer
    if (this.powerUpTimers.shield > 0) {
      if (currentTime >= this.powerUpTimers.shield) {
        this.deactivateShield();
      }
    }
    
    // Update magnet timer
    if (this.powerUpTimers.magnet > 0) {
      if (currentTime >= this.powerUpTimers.magnet) {
        this.deactivateMagnet();
      }
    }
    
    // Update turbo timer
    if (this.powerUpTimers.turbo > 0) {
      if (currentTime >= this.powerUpTimers.turbo) {
        this.deactivateTurbo();
      }
    }
  }
  
  updateAnimation() {
    if (this.sprite.body.velocity.length() > 0) {
      if (this.isTurboActive) {
        this.sprite.play('turtle-turbo', true);
      } else {
        this.sprite.play('turtle-swim', true);
      }
    } else {
      this.sprite.play('turtle-idle', true);
    }
  }
  
  updatePosition() {
    // Update position for magnet effect
    if (this.isMagnetized) {
      this.attractNearbyTrash();
    }
  }
  
  attractNearbyTrash() {
    // This will be implemented in the TrashManager
    // The turtle will attract trash within a certain radius
  }
  
  activatePowerUp(type) {
    const duration = 10000; // 10 seconds
    const currentTime = Date.now();
    
    switch (type) {
      case 'shield':
        this.activateShield(currentTime + duration);
        break;
      case 'magnet':
        this.activateMagnet(currentTime + duration);
        break;
      case 'turbo':
        this.activateTurbo(currentTime + duration);
        break;
    }
    
    // Update app state
    this.app.updateGameData({
      powerUpActive: true,
      powerUpType: type
    });
  }
  
  activateShield(expiryTime) {
    this.isShielded = true;
    this.powerUpTimers.shield = expiryTime;
    
    // Add visual effect
    this.sprite.setTint(0x00ffff);
    
    // Play shield sound
    this.app.audioManager.playSound('power-up');
  }
  
  deactivateShield() {
    this.isShielded = false;
    this.powerUpTimers.shield = 0;
    
    // Remove visual effect
    this.sprite.clearTint();
    
    // Update app state
    this.app.updateGameData({
      powerUpActive: false,
      powerUpType: null
    });
  }
  
  activateMagnet(expiryTime) {
    this.isMagnetized = true;
    this.powerUpTimers.magnet = expiryTime;
    
    // Add visual effect
    this.sprite.setTint(0xffff00);
    
    // Play magnet sound
    this.app.audioManager.playSound('power-up');
  }
  
  deactivateMagnet() {
    this.isMagnetized = false;
    this.powerUpTimers.magnet = 0;
    
    // Remove visual effect
    this.sprite.clearTint();
    
    // Update app state
    this.app.updateGameData({
      powerUpActive: false,
      powerUpType: null
    });
  }
  
  activateTurbo(expiryTime) {
    this.isTurboActive = true;
    this.powerUpTimers.turbo = expiryTime;
    
    // Add visual effect
    this.sprite.setTint(0xff0000);
    
    // Play turbo sound
    this.app.audioManager.playSound('power-up');
  }
  
  deactivateTurbo() {
    this.isTurboActive = false;
    this.powerUpTimers.turbo = 0;
    
    // Remove visual effect
    this.sprite.clearTint();
    
    // Update app state
    this.app.updateGameData({
      powerUpActive: false,
      powerUpType: null
    });
  }
  
  isShielded() {
    return this.isShielded;
  }
  
  setInvincible(invincible) {
    this.isInvincible = invincible;
    if (invincible) {
      // Add visual effect for invincibility
      this.sprite.setTint(0x00ffff);
      this.sprite.setAlpha(0.8);
    } else {
      // Remove visual effect
      this.sprite.clearTint();
      this.sprite.setAlpha(1);
    }
  }
  
  resetPosition() {
    this.sprite.setPosition(this.x, this.y);
    this.sprite.setVelocity(0, 0);
  }
  
  takeDamage(amount) {
    if (this.isShielded) {
      return false; // No damage taken
    }
    
    // Flash red to indicate damage
    this.sprite.setTint(0xff0000);
    setTimeout(() => {
      this.sprite.clearTint();
    }, 200);
    
    return true; // Damage taken
  }
  
  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}
