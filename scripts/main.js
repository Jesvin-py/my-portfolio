// Main JavaScript functionality
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupNavigation();
        this.setupParallax();
        this.initializeAnimations();
        this.setupScrollIndicator();
    }

    setupEventListeners() {
        // Navigation toggle for mobile
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && navToggle && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target) &&
                navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add micro-interactions to buttons
        document.querySelectorAll('.btn, .skill-card, .project-card, .contact-card').forEach(element => {
            element.addEventListener('click', function(e) {
                this.classList.add('micro-bounce');
                setTimeout(() => {
                    this.classList.remove('micro-bounce');
                }, 300);
            });
        });

        // Add hover effects to interactive elements
        document.querySelectorAll('.skill-card, .project-card, .timeline-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) rotateX(5deg)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateX(0)';
            });
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add stagger animation for containers
                    if (entry.target.classList.contains('stagger-container')) {
                        entry.target.classList.add('animate');
                    }
                    
                    // Trigger counter animations
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, options);

        // Observe elements for animation
        document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });

        // Add animation classes to elements
        document.querySelectorAll('.hero-text > *').forEach((el, index) => {
            el.classList.add('fade-in-up');
            el.style.animationDelay = `${index * 0.1}s`;
        });

        document.querySelectorAll('.skill-card').forEach((el, index) => {
            el.classList.add('scale-in');
            el.style.animationDelay = `${index * 0.1}s`;
            observer.observe(el);
        });

        document.querySelectorAll('.project-card').forEach((el, index) => {
            el.classList.add('fade-in-up');
            el.style.animationDelay = `${index * 0.2}s`;
            observer.observe(el);
        });

        document.querySelectorAll('.timeline-item').forEach((el, index) => {
            if (index % 2 === 0) {
                el.classList.add('fade-in-left');
            } else {
                el.classList.add('fade-in-right');
            }
            el.style.animationDelay = `${index * 0.2}s`;
            observer.observe(el);
        });
    }

    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            const scrolled = window.pageYOffset;
            const navbar = document.getElementById('navbar');
            
            // Navbar scroll effect
            if (navbar) {
                if (scrolled > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            // Parallax effects for floating elements
            document.querySelectorAll('.floating-cube, .floating-sphere').forEach((element, index) => {
                const speed = (index % 2 === 0) ? 0.5 : 0.3;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');
        
        // Update active nav link based on scroll position
        const updateActiveLink = () => {
            const scrollPos = window.pageYOffset + 100;
            
            sections.forEach(section => {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                const id = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
                
                if (scrollPos >= top && scrollPos < bottom) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateActiveLink);
        });
    }

    setupParallax() {
        let ticking = false;
        
        const updateParallax = () => {
            const scrollTop = window.pageYOffset;
            
            document.querySelectorAll('.parallax-slow').forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrollTop * speed}px)`;
            });
            
            document.querySelectorAll('.parallax-fast').forEach(element => {
                const speed = 0.8;
                element.style.transform = `translateY(${scrollTop * speed}px)`;
            });
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    initializeAnimations() {
        // Add entrance animations to hero elements
        const heroElements = document.querySelectorAll('.hero-text > *');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Animate profile card
        const profileCard = document.querySelector('.profile-card');
        if (profileCard) {
            setTimeout(() => {
                profileCard.style.opacity = '0';
                profileCard.style.transform = 'translateY(50px) scale(0.9)';
                profileCard.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
                
                setTimeout(() => {
                    profileCard.style.opacity = '1';
                    profileCard.style.transform = 'translateY(0) scale(1)';
                }, 100);
            }, 500);
        }

        // Animate floating elements
        this.animateFloatingElements();
    }

    animateFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-cube, .floating-sphere');
        
        floatingElements.forEach((element, index) => {
            const randomDelay = Math.random() * 2000;
            const randomDuration = 4000 + Math.random() * 4000;
            
            element.style.animationDelay = `${randomDelay}ms`;
            element.style.animationDuration = `${randomDuration}ms`;
            
            // Add random movement
            setInterval(() => {
                const randomX = (Math.random() - 0.5) * 100;
                const randomY = (Math.random() - 0.5) * 100;
                element.style.transform += ` translate(${randomX}px, ${randomY}px)`;
            }, 8000 + Math.random() * 4000);
        });
    }

    setupScrollIndicator() {
        // Create scroll indicator
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'scroll-indicator';
        document.body.appendChild(scrollIndicator);

        const updateScrollIndicator = () => {
            const scrollTop = window.pageYOffset;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / documentHeight) * 100;
            
            scrollIndicator.style.transform = `scaleX(${scrollPercent / 100})`;
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateScrollIndicator);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.textContent);
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, stepTime);
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
    
    // Add loading animation completion
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.querySelectorAll('.floating-cube, .floating-sphere').forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        document.querySelectorAll('.floating-cube, .floating-sphere').forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Update any size-dependent calculations
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const handleResize = debounce(() => {
        // Recalculate any dynamic positioning
        console.log('Window resized');
    }, 250);

    handleResize();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}