// UI Manager - Handles all user interface elements and overlays
// Remove ES6 export and make this a regular JavaScript class

class UIManager {
  constructor(app) {
    this.app = app;
    this.currentOverlay = null;
  }
  
  updateHUD(gameData) {
    // Update score
    document.getElementById('score').textContent = gameData.score;
    
    // Update level
    document.getElementById('level').textContent = gameData.level;
    
    // Update trash count
    document.getElementById('trash-count').textContent = gameData.trashCollected;
    
    // Update ocean health bar
    const healthFill = document.getElementById('health-fill');
    healthFill.style.width = `${gameData.oceanHealth}%`;
    
    // Update power-up indicator
    const powerUpIcon = document.getElementById('power-up-icon');
    if (gameData.powerUpActive && gameData.powerUpType) {
      powerUpIcon.textContent = this.getPowerUpIcon(gameData.powerUpType);
      powerUpIcon.classList.remove('hidden');
    } else {
      powerUpIcon.classList.add('hidden');
    }
  }
  
  getPowerUpIcon(type) {
    const icons = {
      'turbo': '⚡',
      'shield': '🛡️',
      'magnet': '🔍'
    };
    return icons[type] || '⚡';
  }
  
  showPauseOverlay() {
    this.showOverlay('pause-overlay');
  }
  
  hidePauseOverlay() {
    this.hideOverlay('pause-overlay');
  }
  
  showGameOverOverlay(gameData) {
    document.getElementById('final-score').textContent = gameData.score;
    document.getElementById('final-level').textContent = gameData.level;
    document.getElementById('final-trash').textContent = gameData.trashCollected;
    this.showOverlay('game-over-overlay');
  }
  
  hideGameOverOverlay() {
    this.hideOverlay('game-over-overlay');
  }
  
  showLevelCompleteOverlay(data) {
    document.getElementById('level-score').textContent = data.score;
    document.getElementById('level-trash').textContent = data.trashCollected;
    document.getElementById('time-bonus').textContent = data.timeBonus;
    document.getElementById('ai-message').textContent = data.aiMessage;
    this.showOverlay('level-complete-overlay');
  }
  
  hideLevelCompleteOverlay() {
    this.hideOverlay('level-complete-overlay');
  }
  
  showHelpOverlay() {
    this.showOverlay('help-overlay');
  }
  
  hideHelpOverlay() {
    this.hideOverlay('help-overlay');
  }
  
  showLeaderboardOverlay() {
    this.showOverlay('leaderboard-overlay');
    this.loadLeaderboardData();
  }
  
  hideLeaderboardOverlay() {
    this.hideOverlay('leaderboard-overlay');
  }
  
  showSettingsOverlay(settings) {
    // Populate settings form
    document.getElementById('sound-volume').value = settings.soundVolume;
    document.getElementById('music-volume').value = settings.musicVolume;
    document.getElementById('difficulty').value = settings.difficulty;
    document.getElementById('particle-effects').checked = settings.particleEffects;
    
    this.showOverlay('settings-overlay');
  }
  
  hideSettingsOverlay() {
    this.hideOverlay('settings-overlay');
  }
  
  showAboutOverlay() {
    this.showOverlay('about-overlay');
  }
  
  hideAboutOverlay() {
    this.hideOverlay('about-overlay');
  }
  
  showOverlay(overlayId) {
    // Hide current overlay if any
    if (this.currentOverlay) {
      this.hideOverlay(this.currentOverlay);
    }
    
    // Show new overlay
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      overlay.classList.remove('hidden');
      this.currentOverlay = overlayId;
      
      // Add escape key listener
      this.addEscapeListener();
    }
  }
  
  hideOverlay(overlayId) {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      overlay.classList.add('hidden');
      
      if (this.currentOverlay === overlayId) {
        this.currentOverlay = null;
        this.removeEscapeListener();
      }
    }
  }
  
  addEscapeListener() {
    this.escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.hideOverlay(this.currentOverlay);
      }
    };
    document.addEventListener('keydown', this.escapeHandler);
  }
  
  removeEscapeListener() {
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
      this.escapeHandler = null;
    }
  }
  
  async loadLeaderboardData() {
    const content = document.getElementById('leaderboard-content');
    content.innerHTML = '<div class="loading-spinner">Loading...</div>';
    
    try {
      const leaderboardData = await this.app.leaderboardManager.getLeaderboard();
      this.displayLeaderboard(leaderboardData);
    } catch (error) {
      content.innerHTML = '<div class="error-message">Failed to load leaderboard</div>';
    }
  }
  
  displayLeaderboard(data) {
    const content = document.getElementById('leaderboard-content');
    
    if (!data || data.length === 0) {
      content.innerHTML = '<div class="no-data">No scores yet. Be the first!</div>';
      return;
    }
    
    const html = data.map((entry, index) => `
      <div class="leaderboard-entry ${index < 3 ? 'top-three' : ''}">
        <div class="rank">${index + 1}</div>
        <div class="player-info">
          <div class="player-name">${entry.playerName || 'Anonymous'}</div>
          <div class="player-details">
            Level ${entry.level} • ${entry.trashCollected} trash
          </div>
        </div>
        <div class="score">${entry.score.toLocaleString()}</div>
      </div>
    `).join('');
    
    content.innerHTML = html;
  }
  
  updateSettings(settings) {
    // Update UI based on settings
    if (settings.particleEffects) {
      document.body.classList.add('particles-enabled');
    } else {
      document.body.classList.remove('particles-enabled');
    }
  }
  
  showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Remove after duration
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }
  
  showError(message) {
    this.showNotification(message, 'error', 5000);
  }
  
  showSuccess(message) {
    this.showNotification(message, 'success', 3000);
  }
  
  showInfo(message) {
    this.showNotification(message, 'info', 3000);
  }
}
