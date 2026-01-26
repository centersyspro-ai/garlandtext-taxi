// PWA Installation Simplified
let deferredPrompt;
const installButtons = document.querySelectorAll('#installBtn, #installBtnFooter');

// Mostrar botones de instalación
function showInstallButton() {
    installButtons.forEach(btn => {
        btn.style.display = 'flex';
        btn.addEventListener('click', installPWA);
    });
}

// Ocultar botones de instalación
function hideInstallButton() {
    installButtons.forEach(btn => {
        btn.style.display = 'none';
    });
}

// Manejar instalación
function installPWA(e) {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted install');
                hideInstallButton();
            }
            deferredPrompt = null;
        });
    } else {
        // Para iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
            alert('To install this app on iOS:\n1. Tap the Share button\n2. Tap "Add to Home Screen"\n3. Tap "Add"');
        } else {
            alert('Install option should appear in your browser menu.');
        }
    }
}

// Event Listeners
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt fired');
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

window.addEventListener('appinstalled', (evt) => {
    console.log('App installed');
    hideInstallButton();
});

// Check if already installed
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
    hideInstallButton();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('PWA Installer initialized');
});
