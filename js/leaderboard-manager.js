// Leaderboard Manager - Handles score submission and leaderboard display
// Remove ES6 export and make this a regular JavaScript class

class LeaderboardManager {
  constructor() {
    this.apiUrl = 'https://api.turtlequest.com'; // Replace with your actual API
    this.localScores = [];
    this.isOnline = navigator.onLine;
    
    this.init();
  }
  
  init() {
    // Load local scores
    this.loadLocalScores();
    
    // Listen for online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncLocalScores();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  async submitScore(scoreData) {
    const score = {
      ...scoreData,
      playerName: this.getPlayerName(),
      timestamp: Date.now(),
      deviceId: this.getDeviceId()
    };
    
    // Add to local scores
    this.addLocalScore(score);
    
    // Try to submit to server if online
    if (this.isOnline) {
      try {
        await this.submitToServer(score);
        console.log('Score submitted successfully');
      } catch (error) {
        console.warn('Failed to submit score to server, keeping local:', error);
      }
    }
    
    return score;
  }
  
  async getLeaderboard(type = 'global', limit = 50) {
    try {
      if (this.isOnline) {
        // Try to get from server
        const serverScores = await this.fetchFromServer(type, limit);
        if (serverScores && serverScores.length > 0) {
          return serverScores;
        }
      }
      
      // Fallback to local scores
      return this.getLocalLeaderboard(type, limit);
    } catch (error) {
      console.warn('Failed to fetch leaderboard, using local:', error);
      return this.getLocalLeaderboard(type, limit);
    }
  }
  
  async submitToServer(score) {
    if (!this.isOnline) {
      throw new Error('Offline - cannot submit to server');
    }
    
    const response = await fetch(`${this.apiUrl}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(score)
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    return await response.json();
  }
  
  async fetchFromServer(type, limit) {
    const params = new URLSearchParams({
      type: type,
      limit: limit.toString()
    });
    
    const response = await fetch(`${this.apiUrl}/scores?${params}`);
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    return await response.json();
  }
  
  addLocalScore(score) {
    this.localScores.push(score);
    
    // Sort by score (highest first)
    this.localScores.sort((a, b) => b.score - a.score);
    
    // Keep only top 100 local scores
    if (this.localScores.length > 100) {
      this.localScores = this.localScores.slice(0, 100);
    }
    
    // Save to localStorage
    this.saveLocalScores();
  }
  
  getLocalLeaderboard(type, limit) {
    let scores = [...this.localScores];
    
    // Filter by type if needed
    if (type === 'daily') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      scores = scores.filter(score => {
        const scoreDate = new Date(score.timestamp);
        return scoreDate >= today;
      });
    } else if (type === 'friends') {
      // For now, just return global scores
      // In a real app, you'd filter by friends list
    }
    
    return scores.slice(0, limit);
  }
  
  loadLocalScores() {
    try {
      const saved = localStorage.getItem('turtlequest-scores');
      if (saved) {
        this.localScores = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load local scores:', error);
      this.localScores = [];
    }
  }
  
  saveLocalScores() {
    try {
      localStorage.setItem('turtlequest-scores', JSON.stringify(this.localScores));
    } catch (error) {
      console.warn('Failed to save local scores:', error);
    }
  }
  
  async syncLocalScores() {
    if (!this.isOnline || this.localScores.length === 0) return;
    
    console.log('Syncing local scores with server...');
    
    const unsyncedScores = this.localScores.filter(score => !score.synced);
    
    for (const score of unsyncedScores) {
      try {
        await this.submitToServer(score);
        score.synced = true;
      } catch (error) {
        console.warn(`Failed to sync score ${score.id}:`, error);
      }
    }
    
    this.saveLocalScores();
  }
  
  getPlayerName() {
    let playerName = localStorage.getItem('turtlequest-player-name');
    
    if (!playerName) {
      playerName = prompt('Enter your name for the leaderboard:') || 'Anonymous';
      if (playerName.trim()) {
        localStorage.setItem('turtlequest-player-name', playerName.trim());
      }
    }
    
    return playerName;
  }
  
  getDeviceId() {
    let deviceId = localStorage.getItem('turtlequest-device-id');
    
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('turtlequest-device-id', deviceId);
    }
    
    return deviceId;
  }
  
  getPlayerRank(score) {
    const allScores = [...this.localScores];
    allScores.sort((a, b) => b.score - a.score);
    
    const rank = allScores.findIndex(s => s.score === score) + 1;
    return rank > 0 ? rank : 'N/A';
  }
  
  getPlayerStats() {
    const playerName = this.getPlayerName();
    const playerScores = this.localScores.filter(score => 
      score.playerName === playerName
    );
    
    if (playerScores.length === 0) {
      return {
        totalGames: 0,
        bestScore: 0,
        averageScore: 0,
        totalTrash: 0,
        highestLevel: 0
      };
    }
    
    const totalGames = playerScores.length;
    const bestScore = Math.max(...playerScores.map(s => s.score));
    const averageScore = Math.round(
      playerScores.reduce((sum, s) => sum + s.score, 0) / totalGames
    );
    const totalTrash = playerScores.reduce((sum, s) => sum + s.trashCollected, 0);
    const highestLevel = Math.max(...playerScores.map(s => s.level));
    
    return {
      totalGames,
      bestScore,
      averageScore,
      totalTrash,
      highestLevel
    };
  }
  
  // Mock data for development/testing
  generateMockData() {
    const mockNames = [
      'OceanHero', 'TurtleMaster', 'TrashBuster', 'SeaGuardian',
      'WaveRider', 'CoralKeeper', 'DeepDiver', 'MarineWarrior'
    ];
    
    const mockScores = [];
    
    for (let i = 0; i < 20; i++) {
      mockScores.push({
        playerName: mockNames[Math.floor(Math.random() * mockNames.length)],
        score: Math.floor(Math.random() * 10000) + 1000,
        level: Math.floor(Math.random() * 10) + 1,
        trashCollected: Math.floor(Math.random() * 50) + 10,
        timestamp: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Random time in last week
        synced: true
      });
    }
    
    // Sort by score
    mockScores.sort((a, b) => b.score - a.score);
    
    return mockScores;
  }
  
  // Initialize with mock data if no scores exist
  initializeWithMockData() {
    if (this.localScores.length === 0) {
      this.localScores = this.generateMockData();
      this.saveLocalScores();
    }
  }
}
