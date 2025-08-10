// Login Page JavaScript

// Tab switching functionality
function switchTab(tab) {
    // Remove active class from all tabs and forms
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.login-form').forEach(form => form.classList.remove('active'));
    
    // Add active class to selected tab and form
    if (tab === 'user') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
        document.getElementById('user-login').classList.add('active');
    } else {
        document.querySelector('.tab-btn:last-child').classList.add('active');
        document.getElementById('admin-login').classList.add('active');
    }
}

// Password visibility toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Demo credentials for testing
const demoCredentials = {
    user: {
        email: 'user@ewastenet.com',
        password: 'user123'
    },
    admin: {
        username: 'admin',
        password: 'admin123'
    }
};

// Form submission handlers
document.addEventListener('DOMContentLoaded', function() {
    // User login form
    const userForm = document.getElementById('user-login');
    userForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('user-email').value;
        const password = document.getElementById('user-password').value;
        
        // Check against demo credentials
        if (email === demoCredentials.user.email && password === demoCredentials.user.password) {
            showNotification('Login successful! Redirecting to user dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'user-dashboard.html';
            }, 2000);
        } else {
            showNotification('Invalid email or password. Please try again.', 'error');
        }
    });
    
    // Admin login form
    const adminForm = document.getElementById('admin-login');
    adminForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        // Check against demo credentials
        if (username === demoCredentials.admin.username && password === demoCredentials.admin.password) {
            showNotification('Admin login successful! Redirecting to admin dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 2000);
        } else {
            showNotification('Invalid username or password. Please try again.', 'error');
        }
    });
    
    // Auto-fill demo credentials on double click
    setupDemoCredentialFill();
});

// Notification system
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Demo credential auto-fill
function setupDemoCredentialFill() {
    const demoSection = document.querySelector('.demo-credentials');
    if (demoSection) {
        demoSection.addEventListener('dblclick', function() {
            // Auto-fill user credentials
            document.getElementById('user-email').value = demoCredentials.user.email;
            document.getElementById('user-password').value = demoCredentials.user.password;
            
            // Switch to user tab
            switchTab('user');
            
            showNotification('Demo credentials filled! You can now click Sign In.', 'success');
        });
        
        // Add visual hint
        demoSection.style.cursor = 'pointer';
        demoSection.title = 'Double-click to auto-fill demo credentials';
    }
}

// Input validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const userEmail = document.getElementById('user-email');
    const userPassword = document.getElementById('user-password');
    const adminUsername = document.getElementById('admin-username');
    const adminPassword = document.getElementById('admin-password');
    
    // User email validation
    userEmail.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#f44336';
            showFieldError(this, 'Please enter a valid email address');
        } else {
            this.style.borderColor = '#4CAF50';
            removeFieldError(this);
        }
    });
    
    // User password validation
    userPassword.addEventListener('blur', function() {
        if (this.value && !validatePassword(this.value)) {
            this.style.borderColor = '#f44336';
            showFieldError(this, 'Password must be at least 6 characters');
        } else {
            this.style.borderColor = '#4CAF50';
            removeFieldError(this);
        }
    });
    
    // Admin username validation
    adminUsername.addEventListener('blur', function() {
        if (this.value && this.value.length < 3) {
            this.style.borderColor = '#f44336';
            showFieldError(this, 'Username must be at least 3 characters');
        } else {
            this.style.borderColor = '#4CAF50';
            removeFieldError(this);
        }
    });
    
    // Admin password validation
    adminPassword.addEventListener('blur', function() {
        if (this.value && !validatePassword(this.value)) {
            this.style.borderColor = '#f44336';
            showFieldError(this, 'Password must be at least 6 characters');
        } else {
            this.style.borderColor = '#4CAF50';
            removeFieldError(this);
        }
    });
});

// Field error display
function showFieldError(input, message) {
    removeFieldError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #f44336;
        font-size: 0.8rem;
        margin-top: 5px;
        animation: fadeIn 0.3s ease-in;
    `;
    
    input.parentNode.appendChild(errorDiv);
}

function removeFieldError(input) {
    const existingError = input.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Remember me functionality
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('input[name="remember"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                showNotification('Login credentials will be remembered for 30 days', 'success');
            }
        });
    });
}); 