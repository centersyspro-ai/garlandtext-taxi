// PWA Installation Manager
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.installButtons = document.querySelectorAll('#installBtn, #installBtnFooter');
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                           window.navigator.standalone;
        
        this.init();
    }
    
    init() {
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButtons();
        });
        
        // Listen for app installed event
        window.addEventListener('appinstalled', (evt) => {
            console.log('App was successfully installed');
            this.hideInstallButtons();
            this.deferredPrompt = null;
        });
        
        // Check if app is already installed
        if (this.isStandalone) {
            this.hideInstallButtons();
        }
        
        // Add click events to install buttons
        this.installButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleInstallClick(e));
        });
    }
    
    showInstallButtons() {
        this.installButtons.forEach(btn => {
            btn.style.display = 'flex';
        });
    }
    
    hideInstallButtons() {
        this.installButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    }
    
    async handleInstallClick(e) {
        // For iOS, show custom instructions
        if (this.isIOS && !this.isStandalone) {
            e.preventDefault();
            this.showIOSInstructions();
            return;
        }
        
        // For Android/Desktop with deferred prompt
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            
            const choiceResult = await this.deferredPrompt.userChoice;
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                this.hideInstallButtons();
            } else {
                console.log('User dismissed the install prompt');
            }
            
            this.deferredPrompt = null;
        } else {
            // Fallback for browsers that don't support beforeinstallprompt
            this.showGenericInstructions();
        }
    }
    
    showIOSInstructions() {
        const iosModal = document.createElement('div');
        iosModal.className = 'ios-install-modal';
        iosModal.innerHTML = `
            <div class="ios-install-content">
                <button class="close-ios-modal">&times;</button>
                <h3><i class="fas fa-mobile-alt"></i> Install Garland Taxi App</h3>
                <p>To install this app on your iOS device:</p>
                <div class="ios-steps">
                    <div class="ios-step">
                        <div class="step-number">1</div>
                        <p>Tap the <strong>Share</strong> button <i class="fas fa-share-square"></i></p>
                    </div>
                    <div class="ios-step">
                        <div class="step-number">2</div>
                        <p>Scroll down and tap <strong>"Add to Home Screen"</strong></p>
                    </div>
                    <div class="ios-step">
                        <div class="step-number">3</div>
                        <p>Tap <strong>"Add"</strong> in the top right corner</p>
                    </div>
                </div>
                <button class="btn btn-primary got-it-btn">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(iosModal);
        
        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .ios-install-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 3000;
            }
            .ios-install-content {
                background: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 400px;
                width: 90%;
                position: relative;
            }
            .close-ios-modal, .got-it-btn {
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #333;
            }
            .got-it-btn {
                position: relative;
                top: auto;
                right: auto;
                width: 100%;
                margin-top: 20px;
            }
            .ios-steps {
                margin: 20px 0;
            }
            .ios-step {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                gap: 15px;
            }
            .step-number {
                background: #FFD700;
                color: #000;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
        
        // Close modal events
        document.querySelector('.close-ios-modal').addEventListener('click', () => {
            iosModal.remove();
            style.remove();
        });
        
        document.querySelector('.got-it-btn').addEventListener('click', () => {
            iosModal.remove();
            style.remove();
        });
        
        iosModal.addEventListener('click', (e) => {
            if (e.target === iosModal) {
                iosModal.remove();
                style.remove();
            }
        });
    }
    
    showGenericInstructions() {
        alert('To install this app:\n\nChrome/Edge: Click the install button in the address bar\nFirefox: Click the menu button and "Install"\niOS Safari: Tap Share → Add to Home Screen');
    }
}

// Initialize PWA Installer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PWAInstaller();
});
