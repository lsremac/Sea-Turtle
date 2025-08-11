// PWA Installer - Handles Progressive Web App installation and service worker
// Remove ES6 export and make this a regular JavaScript class

class PWAInstaller {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    
    this.init();
  }
  
  async init() {
    // Check if PWA is already installed
    this.checkInstallationStatus();
    
    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });
    
    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallPrompt();
      console.log('PWA was installed successfully!');
    });
  }
  
  checkInstallationStatus() {
    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
      this.isInstalled = true;
      this.hideInstallPrompt();
    }
    
    // Check if already installed via other methods
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length > 0) {
          this.isInstalled = true;
          this.hideInstallPrompt();
        }
      });
    }
  }
  
  showInstallPrompt() {
    if (this.isInstalled || !this.deferredPrompt) return;
    
    const prompt = document.getElementById('pwa-install-prompt');
    if (prompt) {
      prompt.classList.remove('hidden');
    }
  }
  
  hideInstallPrompt() {
    const prompt = document.getElementById('pwa-install-prompt');
    if (prompt) {
      prompt.classList.add('hidden');
    }
  }
  
  async install() {
    if (!this.deferredPrompt) {
      console.warn('No install prompt available');
      return false;
    }
    
    try {
      // Show the install prompt
      this.deferredPrompt.prompt();
      
      // Wait for user response
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        this.isInstalled = true;
        this.hideInstallPrompt();
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return false;
    } finally {
      // Clear the deferred prompt
      this.deferredPrompt = null;
    }
  }
  
  dismiss() {
    this.hideInstallPrompt();
    this.deferredPrompt = null;
  }
  
  checkInstallPrompt() {
    // Check if we should show the install prompt
    if (this.deferredPrompt && !this.isInstalled) {
      // Wait a bit before showing to avoid being too aggressive
      setTimeout(() => {
        this.showInstallPrompt();
      }, 3000);
    }
  }
  
  // Check if PWA features are supported
  isSupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }
  
  // Register service worker
  async registerServiceWorker() {
    if (!this.isSupported()) {
      console.warn('Service Worker not supported');
      return false;
    }
    
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }
  
  // Check for updates
  async checkForUpdates() {
    if (!this.isSupported()) return;
    
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('Service Worker update check completed');
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }
}
