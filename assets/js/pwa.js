// PWA Installation
let deferredPrompt;
const installButtons = document.querySelectorAll('#installBtn, #installBtnFooter');

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install buttons
    installButtons.forEach(btn => {
        btn.style.display = 'flex';
        btn.addEventListener('click', installApp);
    });
    
    // Log the event for debugging
    console.log('beforeinstallprompt event fired');
});

// Installation function
function installApp() {
    if (!deferredPrompt) {
        alert('App installation is not available in your browser. Please try using Chrome or Edge on desktop, or add to home screen from your browser menu on mobile.');
        return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
            // Hide the install buttons
            installButtons.forEach(btn => {
                btn.style.display = 'none';
            });
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the saved prompt since it can't be used again
        deferredPrompt = null;
    });
}

// Detect if app is already installed
window.addEventListener('appinstalled', (evt) => {
    console.log('App was successfully installed');
    // Hide the install buttons
    installButtons.forEach(btn => {
        btn.style.display = 'none';
    });
});

// Check if app is already installed on page load
window.addEventListener('load', () => {
    // For iOS
    if (window.navigator.standalone) {
        installButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    }
    
    // For Android/other platforms
    if (window.matchMedia('(display-mode: standalone)').matches) {
        installButtons.forEach(btn => {
            btn.style.display = 'none';
        });
    }
});

// iOS specific installation instructions
function showIOSInstallInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS && isSafari) {
        // Show custom iOS installation instructions
        const iosInstallInfo = document.createElement('div');
        iosInstallInfo.className = 'ios-install-info';
        iosInstallInfo.innerHTML = `
            <div class="ios-install-content">
                <button class="close-ios-info">&times;</button>
                <h3>Install Garland Taxi App</h3>
                <p>To install this app on your iOS device:</p>
                <ol>
                    <li>Tap the Share button <i class="fas fa-share-square"></i></li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" in the top right corner</li>
                </ol>
            </div>
        `;
        document.body.appendChild(iosInstallInfo);
        
        document.querySelector('.close-ios-info').addEventListener('click', () => {
            iosInstallInfo.remove();
        });
    }
}

// Call iOS instructions when install button is clicked (for iOS)
installButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS && !window.navigator.standalone) {
            e.preventDefault();
            showIOSInstallInstructions();
        }
    });
});
