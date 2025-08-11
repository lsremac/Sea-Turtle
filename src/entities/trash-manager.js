// Trash Manager - Handles trash spawning, collection, and ocean health
// Remove ES6 export and make this a regular JavaScript class

class TrashManager {
  constructor(scene, app) {
    this.scene = scene;
    this.app = app;
    this.group = scene.physics.add.group();
    this.trashTypes = ['plastic-bottle', 'fishing-net', 'soda-can', 'plastic-bag'];
    this.difficulty = 1;
    
    // Spawn settings
    this.spawnInterval = 3000; // 3 seconds
    this.maxTrash = 20;
    this.spawnTimer = 0;
    
    // Magnet effect settings
    this.magnetRadius = 150;
    this.magnetForce = 200;
    
    this.init();
  }
  
  init() {
    // Set up trash group properties
    this.group.setDepth(1);
    
    // Create initial trash
    this.spawnInitialTrash();
  }
  
  spawnInitialTrash() {
    const count = Math.min(15 + this.difficulty * 2, this.maxTrash);
    
    for (let i = 0; i < count; i++) {
      this.spawnTrash();
    }
  }
  
  spawnTrash() {
    if (this.group.getChildren().length >= this.maxTrash) {
      return;
    }
    
    // Random position within game bounds
    const x = Phaser.Math.Between(100, 700);
    const y = Phaser.Math.Between(100, 500);
    
    // Random trash type
    const trashType = this.trashTypes[Phaser.Math.Between(0, this.trashTypes.length - 1)];
    
    // Create trash sprite
    const trash = this.scene.physics.add.sprite(x, y, trashType);
    trash.setScale(0.8);
    
    // Set physics properties
    trash.body.setSize(16, 16);
    trash.body.setOffset(8, 8);
    
    // Add random movement
    const velocityX = Phaser.Math.Between(-50, 50);
    const velocityY = Phaser.Math.Between(-50, 50);
    trash.body.setVelocity(velocityX, velocityY);
    
    // Add drag for realistic movement
    trash.body.setDrag(0.98);
    
    // Set data for collision detection
    trash.setData('type', 'trash');
    trash.setData('trashType', trashType);
    trash.setData('value', this.getTrashValue(trashType));
    
    // Add to group
    this.group.add(trash);
    
    // Add floating animation
    this.addFloatingAnimation(trash);
    
    // Add rotation
    trash.setAngularVelocity(Phaser.Math.Between(-30, 30));
  }
  
  getTrashValue(trashType) {
    const values = {
      'plastic-bottle': 15,
      'fishing-net': 25,
      'soda-can': 10,
      'plastic-bag': 20
    };
    
    return values[trashType] || 10;
  }
  
  addFloatingAnimation(trash) {
    // Create a gentle floating motion
    this.scene.tweens.add({
      targets: trash,
      y: trash.y + Phaser.Math.Between(-10, 10),
      duration: Phaser.Math.Between(2000, 4000),
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }
  
  update() {
    // Spawn new trash periodically
    this.spawnTimer += this.scene.game.loop.delta;
    
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTrash();
      this.spawnTimer = 0;
    }
    
    // Update magnet effect
    this.updateMagnetEffect();
    
    // Clean up trash that goes off-screen
    this.cleanupOffscreenTrash();
  }
  
  updateMagnetEffect() {
    // Check if turtle has magnet power-up
    if (!this.app.gameData.powerUpActive || this.app.gameData.powerUpType !== 'magnet') {
      return;
    }
    
    const turtle = this.app.gameManager.turtlePlayer;
    if (!turtle || !turtle.sprite) return;
    
    const turtleX = turtle.sprite.x;
    const turtleY = turtle.sprite.y;
    
    // Apply magnet effect to nearby trash
    this.group.getChildren().forEach(trash => {
      const distance = Phaser.Math.Distance.Between(
        turtleX, turtleY,
        trash.x, trash.y
      );
      
      if (distance <= this.magnetRadius) {
        // Calculate direction to turtle
        const angle = Phaser.Math.Angle.Between(
          trash.x, trash.y,
          turtleX, turtleY
        );
        
        // Apply force towards turtle
        const force = this.magnetForce * (1 - distance / this.magnetRadius);
        const velocityX = Math.cos(angle) * force;
        const velocityY = Math.sin(angle) * force;
        
        trash.body.setVelocity(velocityX, velocityY);
        
        // Add visual effect
        trash.setTint(0xffff00);
      } else {
        // Remove visual effect
        trash.clearTint();
      }
    });
  }
  
  cleanupOffscreenTrash() {
    this.group.getChildren().forEach(trash => {
      if (trash.x < -50 || trash.x > 850 || trash.y < -50 || trash.y > 650) {
        trash.destroy();
      }
    });
  }
  
  setDifficulty(level) {
    this.difficulty = level;
    
    // Adjust spawn settings based on difficulty
    this.spawnInterval = Math.max(1000, 3000 - level * 200);
    this.maxTrash = Math.min(30, 20 + level * 2);
    
    // Spawn more trash for higher levels
    const additionalTrash = Math.min(5, level - 1);
    for (let i = 0; i < additionalTrash; i++) {
      this.spawnTrash();
    }
  }
  
  setMagnetRadius(radius) {
    this.magnetRadius = radius;
  }
  
  removeTrash(trash) {
    if (trash && trash.parent) {
      trash.destroy();
    }
  }
  
  clearAllTrash() {
    this.group.clear(true, true);
  }
  
  getTrashCount() {
    return this.group.getChildren().length;
  }
  
  // Get trash within a certain radius (for special effects)
  getTrashInRadius(x, y, radius) {
    return this.group.getChildren().filter(trash => {
      const distance = Phaser.Math.Distance.Between(x, y, trash.x, trash.y);
      return distance <= radius;
    });
  }
  
  // Spawn trash in a specific pattern (for level design)
  spawnTrashPattern(pattern) {
    pattern.forEach(trashData => {
      const { x, y, type } = trashData;
      this.spawnTrashAt(x, y, type);
    });
  }
  
  spawnTrashAt(x, y, type = null) {
    if (this.group.getChildren().length >= this.maxTrash) {
      return;
    }
    
    const trashType = type || this.trashTypes[Phaser.Math.Between(0, this.trashTypes.length - 1)];
    
    const trash = this.scene.physics.add.sprite(x, y, trashType);
    trash.setScale(0.8);
    
    // Set physics properties
    trash.body.setSize(16, 16);
    trash.body.setOffset(8, 8);
    
    // Set data
    trash.setData('type', 'trash');
    trash.setData('trashType', trashType);
    trash.setData('value', this.getTrashValue(trashType));
    
    // Add to group
    this.group.add(trash);
    
    // Add floating animation
    this.addFloatingAnimation(trash);
  }
  
  // Create a wave of trash (for special events)
  createTrashWave(count, direction = 'random') {
    const waveTrash = [];
    
    for (let i = 0; i < count; i++) {
      let x, y;
      
      switch (direction) {
        case 'left':
          x = -50;
          y = Phaser.Math.Between(100, 500);
          break;
        case 'right':
          x = 850;
          y = Phaser.Math.Between(100, 500);
          break;
        case 'top':
          x = Phaser.Math.Between(100, 700);
          y = -50;
          break;
        case 'bottom':
          x = Phaser.Math.Between(100, 700);
          y = 650;
          break;
        default:
          x = Phaser.Math.Between(-50, 850);
          y = Phaser.Math.Between(-50, 650);
      }
      
      const trash = this.spawnTrashAt(x, y);
      if (trash) {
        waveTrash.push(trash);
        
        // Add movement towards center
        const centerX = 400;
        const centerY = 300;
        const angle = Phaser.Math.Angle.Between(x, y, centerX, centerY);
        const speed = Phaser.Math.Between(50, 100);
        
        trash.body.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );
      }
    }
    
    return waveTrash;
  }
  
  destroy() {
    this.clearAllTrash();
    this.group.destroy();
  }
}
