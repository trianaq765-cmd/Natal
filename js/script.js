// ==========================================
// NAVBAR SCROLL & MOBILE MENU
// ==========================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ==========================================
// COUNTDOWN TIMER TO CHRISTMAS 2025
// ==========================================
function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let christmasDate = new Date(currentYear, 11, 25, 0, 0, 0); // December 25, 2025
    
    // If Christmas has passed this year, count to next year
    if (now > christmasDate) {
        christmasDate = new Date(currentYear + 1, 11, 25, 0, 0, 0);
    }
    
    const difference = christmasDate - now;
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    // Update DOM
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update every second
setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// ANIMATED COUNTER FOR STATS
// ==========================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString('id-ID');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString('id-ID');
        }
    };
    
    updateCounter();
}

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            
            // Animate stat numbers
            if (entry.target.classList.contains('stat-card')) {
                const numberElement = entry.target.querySelector('.stat-number');
                const targetValue = parseInt(numberElement.getAttribute('data-count'));
                animateCounter(numberElement, targetValue);
                observer.unobserve(entry.target); // Only animate once
            }
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// ==========================================
// PARALLAX EFFECT FOR FLOAT ELEMENTS
// ==========================================
const floatElements = document.querySelectorAll('.float-element');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    floatElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// ==========================================
// QUOTES CAROUSEL/SLIDER
// ==========================================
const quotesSlider = {
    currentIndex: 0,
    quotes: document.querySelectorAll('.quote-card'),
    dots: document.querySelectorAll('.dot'),
    prevBtn: document.querySelector('.quote-nav-btn.prev'),
    nextBtn: document.querySelector('.quote-nav-btn.next'),
    autoPlayInterval: null,
    autoPlayDelay: 6000, // 6 seconds

    init() {
        if (this.quotes.length === 0) return;

        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        // Dots click
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Touch/Swipe support
        this.addSwipeSupport();

        // Auto play
        this.startAutoPlay();

        // Pause on hover
        const sliderContainer = document.querySelector('.quotes-slider');
        sliderContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
        sliderContainer.addEventListener('mouseleave', () => this.startAutoPlay());
    },

    prev() {
        const newIndex = this.currentIndex === 0 ? this.quotes.length - 1 : this.currentIndex - 1;
        this.slide(newIndex, 'left');
    },

    next() {
        const newIndex = this.currentIndex === this.quotes.length - 1 ? 0 : this.currentIndex + 1;
        this.slide(newIndex, 'right');
    },

    goTo(index) {
        if (index === this.currentIndex) return;
        const direction = index > this.currentIndex ? 'right' : 'left';
        this.slide(index, direction);
    },

    slide(newIndex, direction) {
        const currentQuote = this.quotes[this.currentIndex];
        const newQuote = this.quotes[newIndex];

        // Remove all animation classes
        this.quotes.forEach(quote => {
            quote.classList.remove('active', 'slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
        });

        // Animate out current
        if (direction === 'right') {
            currentQuote.classList.add('slide-out-left');
            setTimeout(() => {
                newQuote.classList.add('slide-in-right', 'active');
            }, 100);
        } else {
            currentQuote.classList.add('slide-out-right');
            setTimeout(() => {
                newQuote.classList.add('slide-in-left', 'active');
            }, 100);
        }

        // Update dots
        this.dots[this.currentIndex].classList.remove('active');
        this.dots[newIndex].classList.add('active');

        this.currentIndex = newIndex;
    },

    addSwipeSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        const sliderContainer = document.querySelector('.quotes-slider');

        sliderContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        sliderContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                this.next(); // Swipe left
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                this.prev(); // Swipe right
            }
        };

        this.handleSwipe = handleSwipe;
    },

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    },

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
};

// Initialize quotes slider
document.addEventListener('DOMContentLoaded', () => {
    quotesSlider.init();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    quotesSlider.stopAutoPlay();
});

// ==========================================
// PREVENT FOUC (Flash of Unstyled Content)
// ==========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ==========================================
// CONSOLE EASTER EGG
// ==========================================
console.log('%c🎄 Merry Christmas 2025! 🎄', 'color: #DC143C; font-size: 24px; font-weight: bold;');
console.log('%cWebsite created by ToingDc', 'color: #FFD700; font-size: 16px;');
console.log('%cMay your code be bug-free and your holidays be merry! ✨', 'color: #006B3F; font-size: 14px;');

// ==========================================
// PERFORMANCE MONITORING (Optional)
// ==========================================
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((items) => {
        items.getEntries().forEach((entry) => {
            console.log(`${entry.name}: ${entry.duration}ms`);
        });
    });
    
    // Uncomment to enable performance monitoring
    // perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
}
