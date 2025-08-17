// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.isSubmitting = false;
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.setupEventListeners();
        this.setupValidation();
        this.setupRealTimeValidation();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add input animations
        this.form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', (e) => this.handleInputFocus(e));
            input.addEventListener('blur', (e) => this.handleInputBlur(e));
        });
    }

    setupValidation() {
        this.validators = {
            name: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid name (letters and spaces only)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            subject: {
                required: true,
                minLength: 5,
                maxLength: 100,
                message: 'Subject must be between 5 and 100 characters'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Message must be between 10 and 1000 characters'
            }
        };
    }

    setupRealTimeValidation() {
        Object.keys(this.validators).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.addEventListener('input', () => this.validateField(fieldName));
                field.addEventListener('blur', () => this.validateField(fieldName));
            }
        });
    }

    validateField(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const validator = this.validators[fieldName];
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldName}Error`);

        let isValid = true;
        let errorMessage = '';

        // Required validation
        if (validator.required && !value) {
            isValid = false;
            errorMessage = `${this.capitalize(fieldName)} is required`;
        }

        // Length validation
        if (isValid && validator.minLength && value.length < validator.minLength) {
            isValid = false;
            errorMessage = `${this.capitalize(fieldName)} must be at least ${validator.minLength} characters`;
        }

        if (isValid && validator.maxLength && value.length > validator.maxLength) {
            isValid = false;
            errorMessage = `${this.capitalize(fieldName)} must not exceed ${validator.maxLength} characters`;
        }

        // Pattern validation
        if (isValid && validator.pattern && !validator.pattern.test(value)) {
            isValid = false;
            errorMessage = validator.message;
        }

        // Update UI
        this.updateFieldValidation(field, errorElement, isValid, errorMessage);

        return isValid;
    }

    updateFieldValidation(field, errorElement, isValid, errorMessage) {
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
            }
        }
    }

    validateForm() {
        let isValid = true;
        
        Object.keys(this.validators).forEach(fieldName => {
            const fieldValid = this.validateField(fieldName);
            if (!fieldValid) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const isValid = this.validateForm();
        if (!isValid) {
            this.showNotification('Please fix the errors before submitting', 'error');
            return;
        }

        this.isSubmitting = true;
        this.setSubmitButtonState('loading');

        try {
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Simulate API call (replace with actual endpoint)
            await this.submitForm(data);
            
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
            this.clearValidation();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonState('normal');
        }
    }

    async submitForm(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real application, you would send the data to your backend
        console.log('Form submitted with data:', data);
        
        // You can implement actual form submission here:
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        return response.json();
        */
    }

    setSubmitButtonState(state) {
        const button = this.form.querySelector('.btn-submit');
        const textElement = button.querySelector('.btn-text');
        const loadingElement = button.querySelector('.btn-loading');

        switch (state) {
            case 'loading':
                button.classList.add('loading');
                button.disabled = true;
                if (textElement) textElement.style.display = 'none';
                if (loadingElement) loadingElement.style.display = 'inline';
                break;
            case 'normal':
                button.classList.remove('loading');
                button.disabled = false;
                if (textElement) textElement.style.display = 'inline';
                if (loadingElement) loadingElement.style.display = 'none';
                break;
        }
    }

    clearValidation() {
        this.form.querySelectorAll('input, textarea').forEach(field => {
            field.classList.remove('valid', 'error');
        });

        this.form.querySelectorAll('.form-error').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
    }

    handleInputFocus(e) {
        const field = e.target;
        const formGroup = field.closest('.form-group');
        
        if (formGroup) {
            formGroup.classList.add('focused');
        }
        
        // Add subtle animation
        field.style.transform = 'translateY(-1px)';
    }

    handleInputBlur(e) {
        const field = e.target;
        const formGroup = field.closest('.form-group');
        
        if (formGroup) {
            formGroup.classList.remove('focused');
        }
        
        field.style.transform = 'translateY(0)';
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 16px 20px;
            border-radius: 12px;
            color: white;
            font-weight: 500;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            max-width: 400px;
            backdrop-filter: blur(10px);
        `;

        // Set background color based on type
        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            info: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            warning: 'linear-gradient(135deg, #f59e0b, #d97706)'
        };
        
        notification.style.background = colors[type] || colors.info;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Add close functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            this.closeNotification(notification);
        });

        closeButton.style.cssText = `
            background: none;
            border: none;
            color: inherit;
            font-size: 20px;
            font-weight: bold;
            cursor: pointer;
            padding: 0;
            margin-left: 12px;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        `;

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.opacity = '1';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.opacity = '0.8';
        });

        // Style the content
        const content = notification.querySelector('.notification-content');
        content.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;

        // Auto-remove after delay
        setTimeout(() => {
            if (notification.parentNode) {
                this.closeNotification(notification);
            }
        }, 5000);
    }

    closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

// Add enhanced form styling
const style = document.createElement('style');
style.textContent = `
    .form-group {
        position: relative;
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        transform: translateY(-1px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
    }

    .form-group input.valid,
    .form-group textarea.valid {
        border-color: #10b981;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .form-group input.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .form-error {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        animation: slideInDown 0.3s ease;
    }

    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .btn-submit:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .btn-submit.loading {
        position: relative;
        color: transparent;
    }

    .btn-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
    }
`;

document.head.appendChild(style);