// Advanced Animation Controller
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.rafId = null;
        this.scrollY = 0;
        this.init();
    }

    init() {
        this.setupScrollListener();
        this.setupResizeListener();
        this.initIntersectionObservers();
        this.setupPrefersReducedMotion();
        this.initCustomAnimations();
    }

    setupScrollListener() {
        let ticking = false;

        const updateAnimations = () => {
            this.scrollY = window.pageYOffset;
            this.updateParallaxElements();
            this.updateScrollBasedAnimations();
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                this.rafId = requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        }, { passive: true });
    }

    setupResizeListener() {
        const debounce = (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        };

        window.addEventListener('resize', debounce(() => {
            this.recalculateAnimations();
        }, 250));
    }

    initIntersectionObservers() {
        // Main content observer
        const contentObserver = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: [0.1, 0.25, 0.5, 0.75],
                rootMargin: '0px 0px -10% 0px'
            }
        );

        // Stagger animation observer
        const staggerObserver = new IntersectionObserver(
            (entries) => this.handleStaggerAnimations(entries),
            {
                threshold: 0.2,
                rootMargin: '0px 0px -15% 0px'
            }
        );

        this.observers.set('content', contentObserver);
        this.observers.set('stagger', staggerObserver);

        this.observeElements();
    }

    observeElements() {
        const contentObserver = this.observers.get('content');
        const staggerObserver = this.observers.get('stagger');

        // Observe main content elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            contentObserver.observe(el);
        });

        // Observe stagger containers
        document.querySelectorAll('[data-stagger]').forEach(el => {
            staggerObserver.observe(el);
        });

        // Auto-detect animation elements
        this.autoDetectAnimationElements();
    }

    autoDetectAnimationElements() {
        const contentObserver = this.observers.get('content');
        
        // Auto-detect common elements for animation
        const selectors = [
            '.section-title',
            '.section-subtitle',
            '.skill-card',
            '.project-card',
            '.timeline-item',
            '.contact-card',
            '.hero-text > *'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach((el, index) => {
                if (!el.hasAttribute('data-animate')) {
                    el.setAttribute('data-animate', this.getDefaultAnimation(selector));
                    el.style.animationDelay = `${index * 0.1}s`;
                    contentObserver.observe(el);
                }
            });
        });
    }

    getDefaultAnimation(selector) {
        const animationMap = {
            '.section-title': 'fade-in-up',
            '.section-subtitle': 'fade-in-up',
            '.skill-card': 'scale-in',
            '.project-card': 'fade-in-up',
            '.timeline-item': 'fade-in-side',
            '.contact-card': 'fade-in-left',
            '.hero-text > *': 'fade-in-up'
        };
        
        return animationMap[selector] || 'fade-in';
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.triggerAnimation(entry.target);
                
                // Special handling for counters
                if (entry.target.classList.contains('stat-number')) {
                    this.animateCounter(entry.target);
                }
                
                // Special handling for progress bars
                if (entry.target.classList.contains('progress-bar')) {
                    this.animateProgressBar(entry.target);
                }
            }
        });
    }

    handleStaggerAnimations(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const container = entry.target;
                const children = container.querySelectorAll('[data-stagger-item]');
                const delay = parseInt(container.dataset.staggerDelay) || 100;
                const animation = container.dataset.stagger || 'fade-in-up';

                children.forEach((child, index) => {
                    setTimeout(() => {
                        this.applyAnimation(child, animation);
                    }, index * delay);
                });

                this.observers.get('stagger').unobserve(container);
            }
        });
    }

    triggerAnimation(element) {
        const animationType = element.dataset.animate || 'fade-in';
        const delay = parseFloat(element.style.animationDelay) || 0;

        setTimeout(() => {
            this.applyAnimation(element, animationType);
        }, delay * 1000);

        // Unobserve after animation
        this.observers.get('content').unobserve(element);
    }

    applyAnimation(element, animationType) {
        element.classList.add('animated', animationType);
        
        // Remove animation class after completion
        element.addEventListener('animationend', () => {
            element.classList.remove('animated', animationType);
            element.classList.add('animation-complete');
        }, { once: true });
    }

    updateParallaxElements() {
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(this.scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateScrollBasedAnimations() {
        document.querySelectorAll('[data-scroll-animation]').forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementTop = rect.top;
            const elementHeight = rect.height;
            
            // Calculate scroll progress for this element
            const scrollProgress = Math.max(0, Math.min(1, 
                (windowHeight - elementTop) / (windowHeight + elementHeight)
            ));
            
            this.applyScrollAnimation(element, scrollProgress);
        });
    }

    applyScrollAnimation(element, progress) {
        const animationType = element.dataset.scrollAnimation;
        
        switch (animationType) {
            case 'slide-in':
                element.style.transform = `translateX(${(1 - progress) * 100}px)`;
                break;
            case 'fade-in':
                element.style.opacity = progress;
                break;
            case 'scale-in':
                element.style.transform = `scale(${0.8 + progress * 0.2})`;
                break;
            case 'rotate-in':
                element.style.transform = `rotate(${(1 - progress) * 180}deg)`;
                break;
        }
    }

    animateCounter(element) {
        const finalValue = parseInt(element.textContent.replace(/\D/g, ''));
        const duration = parseInt(element.dataset.duration) || 2000;
        const hasPlus = element.textContent.includes('+');
        
        let currentValue = 0;
        const startTime = Date.now();
        
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutCubic)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            currentValue = Math.floor(finalValue * easedProgress);
            element.textContent = currentValue + (hasPlus ? '+' : '');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = finalValue + (hasPlus ? '+' : '');
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    animateProgressBar(element) {
        const progress = parseInt(element.dataset.progress) || 0;
        const duration = parseInt(element.dataset.duration) || 1500;
        
        element.style.width = '0%';
        
        setTimeout(() => {
            element.style.transition = `width ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            element.style.width = progress + '%';
        }, 100);
    }

    // Text animation effects
    initTextAnimations() {
        document.querySelectorAll('[data-text-animation]').forEach(element => {
            const animationType = element.dataset.textAnimation;
            
            switch (animationType) {
                case 'typewriter':
                    this.typewriterEffect(element);
                    break;
                case 'fade-in-words':
                    this.fadeInWordsEffect(element);
                    break;
                case 'slide-in-words':
                    this.slideInWordsEffect(element);
                    break;
            }
        });
    }

    typewriterEffect(element) {
        const text = element.textContent;
        const speed = parseInt(element.dataset.speed) || 50;
        
        element.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            
            if (i >= text.length) {
                clearInterval(typeInterval);
            }
        }, speed);
    }

    fadeInWordsEffect(element) {
        const text = element.textContent;
        const words = text.split(' ');
        const delay = parseInt(element.dataset.delay) || 100;
        
        element.innerHTML = words.map((word, index) => 
            `<span class="word-fade" style="opacity: 0; animation-delay: ${index * delay}ms">${word}</span>`
        ).join(' ');
        
        setTimeout(() => {
            element.querySelectorAll('.word-fade').forEach(span => {
                span.style.animation = 'fadeIn 0.8s ease-out forwards';
            });
        }, 100);
    }

    slideInWordsEffect(element) {
        const text = element.textContent;
        const words = text.split(' ');
        const delay = parseInt(element.dataset.delay) || 100;
        
        element.innerHTML = words.map((word, index) => 
            `<span class="word-slide" style="opacity: 0; transform: translateY(20px); animation-delay: ${index * delay}ms">${word}</span>`
        ).join(' ');
        
        setTimeout(() => {
            element.querySelectorAll('.word-slide').forEach(span => {
                span.style.animation = 'slideInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            });
        }, 100);
    }

    setupPrefersReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0ms');
            document.documentElement.style.setProperty('--transition-duration', '0ms');
            
            // Disable floating elements
            document.querySelectorAll('.floating-cube, .floating-sphere').forEach(element => {
                element.style.display = 'none';
            });
            
            // Disable parallax
            document.querySelectorAll('[data-parallax]').forEach(element => {
                element.removeAttribute('data-parallax');
            });
        }
    }

    initCustomAnimations() {
        this.createCustomKeyframes();
        this.initTextAnimations();
        this.setupHoverAnimations();
    }

    createCustomKeyframes() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .animated {
                animation-fill-mode: both;
                animation-duration: 0.8s;
            }
            
            .fade-in {
                animation-name: fadeIn;
            }
            
            .fade-in-up {
                animation-name: slideInUp;
            }
            
            .fade-in-down {
                animation-name: slideInDown;
            }
            
            .fade-in-left {
                animation-name: slideInLeft;
            }
            
            .fade-in-right {
                animation-name: slideInRight;
            }
            
            .fade-in-side:nth-child(even) {
                animation-name: slideInLeft;
            }
            
            .fade-in-side:nth-child(odd) {
                animation-name: slideInRight;
            }
            
            .scale-in {
                animation-name: scaleIn;
            }
            
            @keyframes slideInDown {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupHoverAnimations() {
        // 3D card hover effects
        document.querySelectorAll('.project-card, .skill-card, .timeline-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    e.currentTarget.style.transform = 'translateY(-10px) rotateX(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', (e) => {
                e.currentTarget.style.transform = 'translateY(0) rotateX(0)';
            });
            
            // Mouse move effect for 3D tilt
            card.addEventListener('mousemove', (e) => {
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                
                const rect = e.currentTarget.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (e.clientX - centerX) / rect.width * 20;
                const deltaY = (e.clientY - centerY) / rect.height * 20;
                
                e.currentTarget.style.transform = `
                    translateY(-10px) 
                    rotateX(${-deltaY}deg) 
                    rotateY(${deltaX}deg)
                `;
            });
        });
    }

    recalculateAnimations() {
        // Recalculate any position-dependent animations
        this.updateScrollBasedAnimations();
    }

    destroy() {
        // Clean up observers and animations
        this.observers.forEach(observer => observer.disconnect());
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
    }
}

// Initialize animation controller
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.animationController) {
        window.animationController.destroy();
    }
});