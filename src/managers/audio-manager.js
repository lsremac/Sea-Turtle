// Audio Manager - Handles all game audio including sound effects and music
// Remove ES6 export and make this a regular JavaScript class

class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.music = null;
    this.soundVolume = 0.7;
    this.musicVolume = 0.5;
    this.isMuted = false;
    
    this.init();
  }
  
  init() {
    // Create audio context for better audio handling
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported, using fallback audio');
    }
    
    // Preload common sounds
    this.preloadSounds();
  }
  
  preloadSounds() {
    const soundFiles = [
      'collect-trash',
      'hit-hazard',
      'power-up',
      'level-up',
      'game-over',
      'button-click',
      'menu-open',
      'menu-close'
    ];
    
    soundFiles.forEach(soundName => {
      this.loadSound(soundName);
    });
  }
  
  loadSound(soundName) {
    const audio = new Audio();
    audio.preload = 'auto';
    
    // Set default volume
    audio.volume = this.soundVolume;
    
    // Store reference
    this.sounds.set(soundName, audio);
    
    // Try to load the sound file
    audio.src = `assets/audio/${soundName}.mp3`;
    
    // Handle load errors gracefully
    audio.addEventListener('error', () => {
      console.warn(`Failed to load sound: ${soundName}`);
    });
  }
  
  playSound(soundName) {
    if (this.isMuted) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      // Clone the audio to allow multiple simultaneous plays
      const soundClone = sound.cloneNode();
      soundClone.volume = this.soundVolume;
      
      soundClone.play().catch(error => {
        console.warn(`Failed to play sound ${soundName}:`, error);
      });
      
      // Clean up cloned audio after it finishes
      soundClone.addEventListener('ended', () => {
        soundClone.remove();
      });
    }
  }
  
  playBackgroundMusic() {
    if (this.isMuted || this.music) return;
    
    try {
      this.music = new Audio('assets/audio/background-music.mp3');
      this.music.loop = true;
      this.music.volume = this.musicVolume;
      
      this.music.play().catch(error => {
        console.warn('Failed to play background music:', error);
        this.music = null;
      });
    } catch (error) {
      console.warn('Failed to create background music:', error);
    }
  }
  
  stopBackgroundMusic() {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
      this.music = null;
    }
  }
  
  pauseBackgroundMusic() {
    if (this.music) {
      this.music.pause();
    }
  }
  
  resumeBackgroundMusic() {
    if (this.music && !this.isMuted) {
      this.music.play().catch(error => {
        console.warn('Failed to resume background music:', error);
      });
    }
  }
  
  setVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    
    // Update all loaded sounds
    this.sounds.forEach(sound => {
      sound.volume = this.soundVolume;
    });
  }
  
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    
    if (this.music) {
      this.music.volume = this.musicVolume;
    }
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      this.pauseBackgroundMusic();
    } else {
      this.resumeBackgroundMusic();
    }
    
    // Update mute button icon
    const muteBtn = document.getElementById('btn-mute');
    if (muteBtn) {
      muteBtn.textContent = this.isMuted ? '🔇' : '🔊';
    }
    
    return this.isMuted;
  }
  
  pauseAudio() {
    // Pause all audio when window loses focus
    if (this.music && !this.music.paused) {
      this.music.pause();
    }
  }
  
  resumeAudio() {
    // Resume audio when window gains focus
    if (this.music && this.music.paused && !this.isMuted) {
      this.music.play().catch(error => {
        console.warn('Failed to resume audio:', error);
      });
    }
  }
  
  // Special sound effects
  playCollectSound() {
    this.playSound('collect-trash');
  }
  
  playHazardSound() {
    this.playSound('hit-hazard');
  }
  
  playPowerUpSound() {
    this.playSound('power-up');
  }
  
  playLevelUpSound() {
    this.playSound('level-up');
  }
  
  playButtonClick() {
    this.playSound('button-click');
  }
  
  playMenuOpen() {
    this.playSound('menu-open');
  }
  
  playMenuClose() {
    this.playSound('menu-close');
  }
  
  // Audio visualization (for future enhancement)
  createAudioVisualizer() {
    if (!this.audioContext || !this.music) return;
    
    try {
      const analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaElementSource(this.music);
      
      source.connect(analyser);
      analyser.connect(this.audioContext.destination);
      
      return analyser;
    } catch (error) {
      console.warn('Failed to create audio visualizer:', error);
      return null;
    }
  }
  
  // Cleanup
  destroy() {
    this.stopBackgroundMusic();
    this.sounds.clear();
    
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
