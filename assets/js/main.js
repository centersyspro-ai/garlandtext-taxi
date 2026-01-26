// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Promotion popup after 10 seconds
    setTimeout(() => {
        const popup = document.getElementById('promotionPopup');
        if (popup && !localStorage.getItem('popupClosed')) {
            popup.style.display = 'flex';
        }
    }, 10000);
    
    // Close popup
    const closePopup = document.querySelector('.popup-close');
    if (closePopup) {
        closePopup.addEventListener('click', function() {
            const popup = document.getElementById('promotionPopup');
            popup.style.display = 'none';
            localStorage.setItem('popupClosed', 'true');
        });
    }
    
    // Close popup when clicking outside
    const popup = document.getElementById('promotionPopup');
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                localStorage.setItem('popupClosed', 'true');
            }
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update copyright year
    const copyrightElement = document.querySelector('.footer-bottom p');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = `&copy; 1990-${currentYear} Garland Taxi. All rights reserved.`;
    }
});
