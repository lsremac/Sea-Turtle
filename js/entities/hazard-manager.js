// Hazard Manager - Handles dangerous obstacles like sharks and fishing nets
// Remove ES6 export and make this a regular JavaScript class

class HazardManager {
  constructor(scene, app) {
    this.scene = scene;
    this.app = app;
    this.group = scene.physics.add.group();
    this.hazards = [];
    this.difficulty = 1;
    this.spawnTimer = 0;
    this.spawnInterval = 3000; // 3 seconds
    
    this.hazardTypes = [
      { key: 'shark', speed: 100, damage: 20, spawnWeight: 0.6 },
      { key: 'jellyfish', speed: 80, damage: 15, spawnWeight: 0.4 }
    ];
  }
  
  spawnInitialHazards() {
    const count = Math.min(3 + this.difficulty, 8);
    for (let i = 0; i < count; i++) {
      this.spawnHazard();
    }
  }
  
  spawnHazard() {
    const hazardType = this.selectHazardType();
    const spawnPoint = this.getRandomSpawnPoint();
    
    const hazard = this.scene.physics.add.sprite(
      spawnPoint.x, 
      spawnPoint.y, 
      hazardType.key
    );
    
    // Set up physics
    hazard.setCollideWorldBounds(true);
    hazard.setBounce(1);
    
    // Set random velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = hazardType.speed + (Math.random() * 20 - 10);
    hazard.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );
    
    // Store hazard data
    hazard.setData('type', hazardType.key);
    hazard.setData('damage', hazardType.damage);
    hazard.setData('speed', hazardType.speed);
    
    // Add to group
    this.group.add(hazard);
    this.hazards.push(hazard);
    
    // Add rotation animation
    this.scene.tweens.add({
      targets: hazard,
      angle: 360,
      duration: 2000,
      repeat: -1,
      ease: 'Linear'
    });
  }
  
  selectHazardType() {
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const type of this.hazardTypes) {
      cumulativeWeight += type.spawnWeight;
      if (random <= cumulativeWeight) {
        return type;
      }
    }
    
    return this.hazardTypes[0];
  }
  
  getRandomSpawnPoint() {
    const margin = 50;
    const side = Math.floor(Math.random() * 4);
    
    switch (side) {
      case 0: // Top
        return {
          x: Math.random() * this.scene.game.config.width,
          y: -margin
        };
      case 1: // Right
        return {
          x: this.scene.game.config.width + margin,
          y: Math.random() * this.scene.game.config.height
        };
      case 2: // Bottom
        return {
          x: Math.random() * this.scene.game.config.width,
          y: this.scene.game.config.height + margin
        };
      case 3: // Left
        return {
          x: -margin,
          y: Math.random() * this.scene.game.config.height
        };
    }
  }
  
  update() {
    // Spawn new hazards periodically
    this.spawnTimer += this.scene.game.loop.delta;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnHazard();
    }
    
    // Update hazard behavior
    this.hazards.forEach((hazard, index) => {
      if (!hazard.active) {
        this.hazards.splice(index, 1);
        return;
      }
      
      // Keep hazards moving
      if (hazard.body.velocity.x === 0 && hazard.body.velocity.y === 0) {
        const angle = Math.random() * Math.PI * 2;
        const speed = hazard.getData('speed');
        hazard.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        );
      }
      
      // Wrap around screen edges
      this.wrapHazard(hazard);
    });
    
    // Clean up off-screen hazards
    this.cleanupOffscreenHazards();
  }
  
  wrapHazard(hazard) {
    const margin = 100;
    const width = this.scene.game.config.width;
    const height = this.scene.game.config.height;
    
    if (hazard.x < -margin) hazard.x = width + margin;
    if (hazard.x > width + margin) hazard.x = -margin;
    if (hazard.y < -margin) hazard.y = height + margin;
    if (hazard.y > height + margin) hazard.y = -margin;
  }
  
  cleanupOffscreenHazards() {
    const margin = 200;
    const width = this.scene.game.config.width;
    const height = this.scene.game.config.height;
    
    this.hazards.forEach((hazard, index) => {
      if (hazard.x < -margin || hazard.x > width + margin ||
          hazard.y < -margin || hazard.y > height + margin) {
        hazard.destroy();
        this.hazards.splice(index, 1);
      }
    });
  }
  
  setDifficulty(level) {
    this.difficulty = level;
    this.spawnInterval = Math.max(1000, 3000 - (level - 1) * 200);
    
    // Increase hazard speed and damage with level
    this.hazardTypes.forEach(type => {
      type.speed = Math.min(200, 100 + (level - 1) * 10);
      type.damage = Math.min(40, 20 + (level - 1) * 2);
    });
  }
  
  clearAllHazards() {
    this.hazards.forEach(hazard => hazard.destroy());
    this.hazards = [];
    this.group.clear(true, true);
  }
  
  pauseHazards() {
    this.hazards.forEach(hazard => {
      hazard.body.setVelocity(0, 0);
    });
  }
  
  resumeHazards() {
    this.hazards.forEach(hazard => {
      const angle = Math.random() * Math.PI * 2;
      const speed = hazard.getData('speed');
      hazard.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
    });
  }
}
