// Particle Manager - Handles visual effects and particle systems
// Remove ES6 export and make this a regular JavaScript class

class ParticleManager {
  constructor(scene) {
    this.scene = scene;
    this.enabled = true;
    this.particleGroups = new Map();
    
    this.initParticleGroups();
  }
  
  initParticleGroups() {
    // Collection effect particles (bubbles and sparkles)
    this.particleGroups.set('collection', this.scene.add.particles('bubble'));
    
    // Hit effect particles (explosion-like)
    this.particleGroups.set('hit', this.scene.add.particles('bubble'));
    
    // Power-up effect particles (energy orbs)
    this.particleGroups.set('powerUp', this.scene.add.particles('bubble'));
    
    // Shield effect particles (protective barrier)
    this.particleGroups.set('shield', this.scene.add.particles('bubble'));
    
    // Level complete particles (celebration)
    this.particleGroups.set('celebration', this.scene.add.particles('bubble'));
  }
  
  createCollectionEffect(x, y) {
    if (!this.enabled) return;
    
    const emitter = this.particleGroups.get('collection').createEmitter({
      x: x,
      y: y,
      speed: { min: 50, max: 150 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 800,
      quantity: 8,
      blendMode: 'ADD',
      tint: [0x00ffff, 0x00ff00, 0xffff00],
      on: false
    });
    
    // Emit particles
    emitter.explode(12);
    
    // Clean up emitter after particles are gone
    setTimeout(() => {
      emitter.remove();
    }, 1000);
  }
  
  createHitEffect(x, y) {
    if (!this.enabled) return;
    
    const emitter = this.particleGroups.get('hit').createEmitter({
      x: x,
      y: y,
      speed: { min: 100, max: 250 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 600,
      quantity: 15,
      blendMode: 'ADD',
      tint: [0xff0000, 0xff6600, 0xffff00],
      on: false
    });
    
    // Emit particles in a circular pattern
    emitter.explode(20);
    
    // Clean up emitter
    setTimeout(() => {
      emitter.remove();
    }, 800);
  }
  
  createPowerUpEffect(x, y, powerUpType) {
    if (!this.enabled) return;
    
    let tint, speed, quantity;
    
    switch (powerUpType) {
      case 'turbo':
        tint = [0x00ffff, 0x0080ff, 0x0040ff];
        speed = { min: 80, max: 200 };
        quantity = 10;
        break;
      case 'shield':
        tint = [0xffff00, 0xff8000, 0xff4000];
        speed = { min: 60, max: 150 };
        quantity = 12;
        break;
      case 'magnet':
        tint = [0xff00ff, 0x8000ff, 0x4000ff];
        speed = { min: 70, max: 180 };
        quantity = 8;
        break;
      default:
        tint = [0x00ff00, 0x00ff80, 0x00ff40];
        speed = { min: 70, max: 170 };
        quantity = 10;
    }
    
    const emitter = this.particleGroups.get('powerUp').createEmitter({
      x: x,
      y: y,
      speed: speed,
      scale: { start: 0.4, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 1000,
      quantity: quantity,
      blendMode: 'ADD',
      tint: tint,
      on: false
    });
    
    // Emit particles
    emitter.explode(quantity);
    
    // Clean up emitter
    setTimeout(() => {
      emitter.remove();
    }, 1200);
  }
  
  createShieldEffect(x, y) {
    if (!this.enabled) return;
    
    const emitter = this.particleGroups.get('shield').createEmitter({
      x: x,
      y: y,
      speed: { min: 30, max: 80 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.8, end: 0 },
      lifespan: 1200,
      quantity: 6,
      blendMode: 'ADD',
      tint: [0xffff00, 0xff8000, 0xff4000],
      on: false
    });
    
    // Emit particles in a shield-like pattern
    emitter.explode(8);
    
    // Clean up emitter
    setTimeout(() => {
      emitter.remove();
    }, 1400);
  }
  
  createCelebrationEffect(x, y) {
    if (!this.enabled) return;
    
    const emitter = this.particleGroups.get('celebration').createEmitter({
      x: x,
      y: y,
      speed: { min: 100, max: 300 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 1500,
      quantity: 20,
      blendMode: 'ADD',
      tint: [0xff00ff, 0x00ffff, 0xffff00, 0x00ff00, 0xff8000],
      on: false
    });
    
    // Emit particles in all directions
    emitter.explode(25);
    
    // Clean up emitter
    setTimeout(() => {
      emitter.remove();
    }, 1800);
  }
  
  createBubbleTrail(x, y) {
    if (!this.enabled) return;
    
    const emitter = this.particleGroups.get('collection').createEmitter({
      x: x,
      y: y,
      speed: { min: 20, max: 60 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 1000,
      quantity: 1,
      blendMode: 'ADD',
      tint: 0x00ffff,
      on: true
    });
    
    // Stop emitting after a short time
    setTimeout(() => {
      emitter.stop();
      setTimeout(() => {
        emitter.remove();
      }, 1000);
    }, 100);
  }
  
  createRippleEffect(x, y) {
    if (!this.enabled) return;
    
    // Create a ripple effect using graphics
    const ripple = this.scene.add.graphics();
    ripple.lineStyle(2, 0x00ffff, 1);
    ripple.strokeCircle(x, y, 10);
    
    // Animate the ripple
    this.scene.tweens.add({
      targets: ripple,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => {
        ripple.destroy();
      }
    });
  }
  
  createTrashCollectionEffect(x, y, trashType) {
    if (!this.enabled) return;
    
    let tint;
    switch (trashType) {
      case 'plastic-bottle':
        tint = [0x00ff00, 0x00ff80];
        break;
      case 'soda-can':
        tint = [0xff8000, 0xff4000];
        break;
      case 'plastic-bag':
        tint = [0x8080ff, 0x4040ff];
        break;
      default:
        tint = [0x00ffff, 0x00ff80];
    }
    
    const emitter = this.particleGroups.get('collection').createEmitter({
      x: x,
      y: y,
      speed: { min: 40, max: 120 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 600,
      quantity: 6,
      blendMode: 'ADD',
      tint: tint,
      on: false
    });
    
    emitter.explode(8);
    
    setTimeout(() => {
      emitter.remove();
    }, 800);
  }
  
  setEnabled(enabled) {
    this.enabled = enabled;
    
    if (!enabled) {
      // Clear all active particles
      this.particleGroups.forEach(group => {
        group.clear(true, true);
      });
    }
  }
  
  // Method to create a custom particle effect
  createCustomEffect(x, y, config) {
    if (!this.enabled) return;
    
    const defaultConfig = {
      speed: { min: 50, max: 150 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 800,
      quantity: 10,
      tint: [0x00ffff],
      blendMode: 'ADD'
    };
    
    const finalConfig = { ...defaultConfig, ...config };
    
    const emitter = this.particleGroups.get('collection').createEmitter({
      x: x,
      y: y,
      ...finalConfig,
      on: false
    });
    
    emitter.explode(finalConfig.quantity);
    
    setTimeout(() => {
      emitter.remove();
    }, finalConfig.lifespan + 200);
  }
  
  // Clean up all particles
  cleanup() {
    this.particleGroups.forEach(group => {
      group.clear(true, true);
    });
  }
}
