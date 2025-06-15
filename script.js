// Lacktechnik Michel - JavaScript Funktionalität
// ================================================

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation Toggle für Mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth Scrolling für Navigation Links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Header height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Mobile Menu schließen nach Klick
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar Background bei Scroll
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Auto-hide Navbar beim Runterscrollen (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        
        lastScrollTop = scrollTop;
    });

    // Intersection Observer für Animationen
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Beobachte alle Elemente mit Animation
    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .gallery-item, .contact-card, .stat-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Counter Animation für Statistiken
    const counterElements = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = element.innerText;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const isStar = target.includes('★');
        let number = parseInt(target.replace(/[^\d]/g, ''));
        
        if (isNaN(number)) return;
        
        let current = 0;
        const increment = number / 50; // 50 Schritte
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (isPercentage) displayValue += '%';
            if (isPlus) displayValue += '+';
            if (isStar) displayValue += '★';
            
            element.innerText = displayValue;
        }, 40);
    };

    // Counter Observer
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => {
        counterObserver.observe(el);
    });

    // Form Handling
    const contactForm = document.querySelector('.form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form Validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Hier würdest du normalerweise die Form-Daten senden
                showNotification('Vielen Dank! Ihre Nachricht wurde gesendet. Wir melden uns schnellstmöglich bei Ihnen.', 'success');
                this.reset();
            } else {
                showNotification('Bitte füllen Sie alle Pflichtfelder aus.', 'error');
            }
        });
    }

    // Notification System
    function showNotification(message, type = 'info') {
        // Entferne bestehende Notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Erstelle neue Notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove nach 5 Sekunden
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        // Close Button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    // Gallery Lightbox (einfache Version)
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const bgImage = window.getComputedStyle(this).backgroundImage;
            const imageUrl = bgImage.slice(4, -1).replace(/["']/g, "");
            
            if (imageUrl && imageUrl !== 'none') {
                openLightbox(imageUrl);
            }
        });
    });

    function openLightbox(imageUrl) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${imageUrl}" alt="Galerie Bild">
            </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Close Events
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });
        
        function closeLightbox() {
            lightbox.remove();
            document.body.style.overflow = '';
        }
        
        // Animation
        setTimeout(() => {
            lightbox.classList.add('show');
        }, 10);
    }

    // Parallax Effect für Hero Section (optional)
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }

    // Loading Animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Service Cards Hover Effect Enhancement
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Auto-update current year in footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        yearElement.textContent = yearElement.textContent.replace('2024', currentYear);
    }

    // Performance: Lazy loading für Bilder (falls welche hinzugefügt werden)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Utility Functions
// =================

// Debounce function für Performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function für Scroll Events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth Scroll Polyfill für ältere Browser
if (!window.CSS || !CSS.supports('scroll-behavior', 'smooth')) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    document.head.appendChild(script);
    script.onload = function() {
        window.__forceSmoothScrollPolyfill__ = true;
        smoothscroll.polyfill();
    };
}

// Console Styling (Development)
console.log('%c🚗 Lacktechnik Michel Website geladen!', 'background: #DC2626; color: white; padding: 10px; border-radius: 5px; font-weight: bold;');
console.log('%cEntwickelt für professionelle Autolackierung', 'color: #374151; font-size: 12px;');