// Power-up Manager - Handles power-up spawning and effects
// Remove ES6 export and make this a regular JavaScript class

class PowerUpManager {
  constructor(scene, app) {
    this.scene = scene;
    this.app = app;
    this.group = scene.physics.add.group();
    this.powerUps = [];
    this.spawnTimer = 0;
    this.spawnInterval = 8000; // 8 seconds
    this.maxPowerUps = 3;
    
    this.powerUpTypes = [
      { 
        key: 'turbo', 
        duration: 5000, 
        effect: 'speed', 
        spawnWeight: 0.4,
        icon: '⚡',
        description: 'Turbo Boost'
      },
      { 
        key: 'shield', 
        duration: 4000, 
        effect: 'protection', 
        spawnWeight: 0.35,
        icon: '🛡️',
        description: 'Shield Protection'
      },
      { 
        key: 'magnet', 
        duration: 6000, 
        effect: 'attraction', 
        spawnWeight: 0.25,
        icon: '🔍',
        description: 'Trash Magnet'
      }
    ];
  }
  
  spawnInitialPowerUps() {
    const count = Math.min(2, this.maxPowerUps);
    for (let i = 0; i < count; i++) {
      this.spawnPowerUp();
    }
  }
  
  spawnPowerUp() {
    if (this.powerUps.length >= this.maxPowerUps) return;
    
    const powerUpType = this.selectPowerUpType();
    const spawnPoint = this.getRandomSpawnPoint();
    
    const powerUp = this.scene.physics.add.sprite(
      spawnPoint.x, 
      spawnPoint.y, 
      powerUpType.key
    );
    
    // Set up physics
    powerUp.setCollideWorldBounds(true);
    powerUp.setBounce(0.8);
    
    // Set random velocity for floating effect
    const angle = Math.random() * Math.PI * 2;
    const speed = 30 + Math.random() * 20;
    powerUp.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );
    
    // Store power-up data
    powerUp.setData('type', powerUpType.key);
    powerUp.setData('effect', powerUpType.effect);
    powerUp.setData('duration', powerUpType.duration);
    powerUp.setData('description', powerUpType.description);
    
    // Add to group
    this.group.add(powerUp);
    this.powerUps.push(powerUp);
    
    // Add floating animation
    this.scene.tweens.add({
      targets: powerUp,
      y: powerUp.y + 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Add rotation animation
    this.scene.tweens.add({
      targets: powerUp,
      angle: 360,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });
    
    // Add glow effect
    powerUp.setTint(0x00ffff);
    this.scene.tweens.add({
      targets: powerUp,
      alpha: 0.7,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  selectPowerUpType() {
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const type of this.powerUpTypes) {
      cumulativeWeight += type.spawnWeight;
      if (random <= cumulativeWeight) {
        return type;
      }
    }
    
    return this.powerUpTypes[0];
  }
  
  getRandomSpawnPoint() {
    const margin = 100;
    const width = this.scene.game.config.width;
    const height = this.scene.game.config.height;
    
    return {
      x: margin + Math.random() * (width - 2 * margin),
      y: margin + Math.random() * (height - 2 * margin)
    };
  }
  
  update() {
    // Spawn new power-ups periodically
    this.spawnTimer += this.scene.game.loop.delta;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnPowerUp();
    }
    
    // Update power-up behavior
    this.powerUps.forEach((powerUp, index) => {
      if (!powerUp.active) {
        this.powerUps.splice(index, 1);
        return;
      }
      
      // Keep power-ups moving slowly
      if (powerUp.body.velocity.x === 0 && powerUp.body.velocity.y === 0) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 20 + Math.random() * 10;
        powerUp.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );
      }
      
      // Wrap around screen edges
      this.wrapPowerUp(powerUp);
    });
    
    // Clean up off-screen power-ups
    this.cleanupOffscreenPowerUps();
  }
  
  wrapPowerUp(powerUp) {
    const margin = 50;
    const width = this.scene.game.config.width;
    const height = this.scene.game.config.height;
    
    if (powerUp.x < -margin) powerUp.x = width + margin;
    if (powerUp.x > width + margin) powerUp.x = -margin;
    if (powerUp.y < -margin) powerUp.y = height + margin;
    if (powerUp.y > height + margin) powerUp.y = -margin;
  }
  
  cleanupOffscreenPowerUps() {
    const margin = 200;
    const width = this.scene.game.config.width;
    const height = this.scene.game.config.height;
    
    this.powerUps.forEach((powerUp, index) => {
      if (powerUp.x < -margin || powerUp.x > width + margin ||
          powerUp.y < -margin || powerUp.y > height + margin) {
        powerUp.destroy();
        this.powerUps.splice(index, 1);
      }
    });
  }
  
  setDifficulty(level) {
    // Adjust spawn rate based on difficulty
    this.spawnInterval = Math.max(5000, 8000 - (level - 1) * 500);
    this.maxPowerUps = Math.min(5, 3 + Math.floor(level / 3));
    
    // Increase power-up duration with level
    this.powerUpTypes.forEach(type => {
      type.duration = Math.min(10000, type.duration + (level - 1) * 200);
    });
  }
  
  clearAllPowerUps() {
    this.powerUps.forEach(powerUp => powerUp.destroy());
    this.powerUps = [];
    this.group.clear(true, true);
  }
  
  pausePowerUps() {
    this.powerUps.forEach(powerUp => {
      powerUp.body.setVelocity(0, 0);
    });
  }
  
  resumePowerUps() {
    this.powerUps.forEach(powerUp => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 10;
      powerUp.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
    });
  }
  
  getPowerUpInfo(type) {
    return this.powerUpTypes.find(p => p.key === type);
  }
  
  // Method to create a specific power-up at a given location (for testing)
  createPowerUpAt(type, x, y) {
    const powerUpType = this.powerUpTypes.find(p => p.key === type);
    if (!powerUpType) return null;
    
    const powerUp = this.scene.physics.add.sprite(x, y, powerUpType.key);
    
    // Set up physics and data
    powerUp.setCollideWorldBounds(true);
    powerUp.setBounce(0.8);
    powerUp.setData('type', powerUpType.key);
    powerUp.setData('effect', powerUpType.effect);
    powerUp.setData('duration', powerUpType.duration);
    powerUp.setData('description', powerUpType.description);
    
    // Add to group
    this.group.add(powerUp);
    this.powerUps.push(powerUp);
    
    // Add animations
    this.scene.tweens.add({
      targets: powerUp,
      y: powerUp.y + 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.scene.tweens.add({
      targets: powerUp,
      angle: 360,
      duration: 3000,
      repeat: -1,
      ease: 'Linear'
    });
    
    powerUp.setTint(0x00ffff);
    this.scene.tweens.add({
      targets: powerUp,
      alpha: 0.7,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    return powerUp;
  }
}
