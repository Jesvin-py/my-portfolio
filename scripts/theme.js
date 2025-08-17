// Theme Management System
class ThemeManager {
    constructor() {
        this.currentTheme = this.getSystemTheme();
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.setupSystemThemeListener();
        this.updateThemeColors();
    }

    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Keyboard accessibility
        if (this.themeToggle) {
            this.themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    }

    setupSystemThemeListener() {
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme-preference')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    getSystemTheme() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme) {
            return savedTheme;
        }

        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    loadTheme() {
        this.setTheme(this.currentTheme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Save user preference
        localStorage.setItem('theme-preference', newTheme);
        
        // Add animation feedback
        this.animateToggle();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        this.updateThemeToggle();
        this.updateThemeColors();
        this.dispatchThemeChange();
    }

    updateThemeToggle() {
        if (!this.themeToggle) return;

        const track = this.themeToggle.querySelector('.theme-toggle-track');
        const thumb = this.themeToggle.querySelector('.theme-toggle-thumb');
        
        // Update ARIA attributes for accessibility
        this.themeToggle.setAttribute('aria-label', 
            `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} theme`
        );
        
        // Add smooth transition
        if (track) {
            track.style.background = this.currentTheme === 'dark' 
                ? 'var(--neutral-700)' 
                : 'var(--neutral-200)';
        }
    }

    updateThemeColors() {
        // Update CSS custom properties for smooth transitions
        const root = document.documentElement;
        
        if (this.currentTheme === 'dark') {
            this.applyDarkTheme(root);
        } else {
            this.applyLightTheme(root);
        }
    }

    applyDarkTheme(root) {
        const darkColors = {
            '--background': '#0f172a',
            '--surface': '#1e293b',
            '--surface-elevated': '#334155',
            '--text-primary': '#f8fafc',
            '--text-secondary': '#cbd5e1',
            '--text-tertiary': '#94a3b8',
            '--border': '#475569',
            '--border-subtle': '#334155'
        };

        Object.entries(darkColors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }

    applyLightTheme(root) {
        const lightColors = {
            '--background': '#fafafa',
            '--surface': '#ffffff',
            '--surface-elevated': '#ffffff',
            '--text-primary': '#171717',
            '--text-secondary': '#525252',
            '--text-tertiary': '#737373',
            '--border': '#e5e5e5',
            '--border-subtle': '#f5f5f5'
        };

        Object.entries(lightColors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }

    animateToggle() {
        if (!this.themeToggle) return;

        const thumb = this.themeToggle.querySelector('.theme-toggle-thumb');
        if (thumb) {
            thumb.style.transform += ' scale(0.9)';
            setTimeout(() => {
                thumb.style.transform = thumb.style.transform.replace(' scale(0.9)', '');
            }, 150);
        }

        // Add ripple effect
        this.createRippleEffect();
    }

    createRippleEffect() {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            background: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        `;
        
        if (!document.head.querySelector('#ripple-animation')) {
            style.id = 'ripple-animation';
            document.head.appendChild(style);
        }

        this.themeToggle.style.position = 'relative';
        this.themeToggle.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    dispatchThemeChange() {
        // Dispatch custom event for other components to listen to
        const themeChangeEvent = new CustomEvent('themeChange', {
            detail: { theme: this.currentTheme }
        });
        document.dispatchEvent(themeChangeEvent);
    }

    // Public API methods
    getTheme() {
        return this.currentTheme;
    }

    isDarkMode() {
        return this.currentTheme === 'dark';
    }

    isLightMode() {
        return this.currentTheme === 'light';
    }
}

// Color scheme utilities
class ColorSchemeUtils {
    static generateColorRamp(baseColor, steps = 9) {
        // Generate color ramps from a base color
        const colors = [];
        const hsl = this.hexToHsl(baseColor);
        
        for (let i = 0; i < steps; i++) {
            const lightness = 95 - (i * 10); // 95% to 5%
            colors.push(this.hslToHex(hsl.h, hsl.s, lightness));
        }
        
        return colors;
    }

    static hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    static hslToHex(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        const r = hue2rgb(p, q, h + 1/3);
        const g = hue2rgb(p, q, h);
        const b = hue2rgb(p, q, h - 1/3);

        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    static getContrastRatio(color1, color2) {
        const luminance1 = this.getLuminance(color1);
        const luminance2 = this.getLuminance(color2);
        
        const lighter = Math.max(luminance1, luminance2);
        const darker = Math.min(luminance1, luminance2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    static getLuminance(color) {
        const rgb = this.hexToRgb(color);
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static isColorAccessible(foreground, background, level = 'AA') {
        const ratio = this.getContrastRatio(foreground, background);
        const thresholds = {
            'AAA': 7,
            'AA': 4.5,
            'AA_LARGE': 3
        };
        
        return ratio >= thresholds[level];
    }
}

// Advanced theme features
class AdvancedThemeFeatures {
    constructor(themeManager) {
        this.themeManager = themeManager;
        this.init();
    }

    init() {
        this.setupAutoTheme();
        this.setupCustomColors();
        this.setupThemeTransitions();
    }

    setupAutoTheme() {
        // Auto-switch theme based on time of day
        const hour = new Date().getHours();
        const isNightTime = hour < 6 || hour > 20;
        
        // Only auto-switch if user hasn't manually set preference
        if (!localStorage.getItem('theme-preference') && isNightTime) {
            this.themeManager.setTheme('dark');
        }
    }

    setupCustomColors() {
        // Allow users to customize accent colors
        const customPrimary = localStorage.getItem('custom-primary-color');
        if (customPrimary) {
            document.documentElement.style.setProperty('--primary', customPrimary);
        }
    }

    setupThemeTransitions() {
        // Smooth theme transitions
        document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Listen for theme changes
        document.addEventListener('themeChange', (e) => {
            this.animateThemeTransition(e.detail.theme);
        });
    }

    animateThemeTransition(newTheme) {
        // Create overlay for smooth transition
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${newTheme === 'dark' ? '#0f172a' : '#fafafa'};
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Fade in overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        // Remove overlay after transition
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }

    setCustomAccentColor(color) {
        localStorage.setItem('custom-primary-color', color);
        document.documentElement.style.setProperty('--primary', color);
    }
}

// Initialize theme system
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.advancedThemeFeatures = new AdvancedThemeFeatures(window.themeManager);
    
    // Make theme utilities globally available
    window.ColorSchemeUtils = ColorSchemeUtils;
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, ColorSchemeUtils, AdvancedThemeFeatures };
}