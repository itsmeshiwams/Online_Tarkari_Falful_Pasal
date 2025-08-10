// Pickup Request JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('pickup-date').min = today;
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize form submission
    initializeFormSubmission();
    
    // Initialize dynamic features
    initializeDynamicFeatures();
});

// Form validation
function initializeFormValidation() {
    const form = document.getElementById('pickup-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', formatPhoneNumber);
    
    // ZIP code validation
    const zipInput = document.getElementById('zipcode');
    zipInput.addEventListener('input', formatZipCode);
}

// Validate individual field
function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error
    clearFieldError(event);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // ZIP code validation
    if (fieldName === 'zipcode' && value) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(value)) {
            showFieldError(field, 'Please enter a valid ZIP code');
            return false;
        }
    }
    
    // Date validation
    if (fieldName === 'pickupDate' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showFieldError(field, 'Pickup date cannot be in the past');
            return false;
        }
    }
    
    // Mark field as valid
    field.style.borderColor = '#4CAF50';
    return true;
}

// Clear field error
function clearFieldError(event) {
    const field = event.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '#e0e0e0';
}

// Show field error
function showFieldError(field, message) {
    field.style.borderColor = '#f44336';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #f44336;
        font-size: 0.8rem;
        margin-top: 5px;
        animation: fadeIn 0.3s ease-in;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

// Get field label
function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace(' *', '') : 'This field';
}

// Format phone number
function formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    
    event.target.value = value;
}

// Format ZIP code
function formatZipCode(event) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 5) {
        value = `${value.slice(0, 5)}-${value.slice(5, 9)}`;
    }
    
    event.target.value = value;
}

// Form submission
function initializeFormSubmission() {
    const form = document.getElementById('pickup-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('pickup-form');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Check required fields
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    // Check if at least one item is selected
    const selectedItems = form.querySelectorAll('input[name="items[]"]:checked');
    if (selectedItems.length === 0) {
        showNotification('Please select at least one e-waste item', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Submit form
function submitForm() {
    const form = document.getElementById('pickup-form');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Generate tracking number
        const trackingNumber = generateTrackingNumber();
        
        // Show success message
        showNotification(`Pickup request submitted successfully! Your tracking number is: ${trackingNumber}`, 'success');
        
        // Reset form
        resetForm();
        
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Redirect to tracking page after 3 seconds
        setTimeout(() => {
            window.location.href = `tracking.html?tracking=${trackingNumber}`;
        }, 3000);
        
    }, 2000);
}

// Generate tracking number
function generateTrackingNumber() {
    const prefix = 'EW';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
}

// Reset form
function resetForm() {
    const form = document.getElementById('pickup-form');
    form.reset();
    
    // Clear all field errors
    const errorElements = form.querySelectorAll('.field-error');
    errorElements.forEach(error => error.remove());
    
    // Reset border colors
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.style.borderColor = '#e0e0e0';
    });
    
    // Reset date minimum
    document.getElementById('pickup-date').min = new Date().toISOString().split('T')[0];
}

// Initialize dynamic features
function initializeDynamicFeatures() {
    // Update pickup time options based on selected date
    const dateInput = document.getElementById('pickup-date');
    const timeSelect = document.getElementById('pickup-time');
    
    dateInput.addEventListener('change', function() {
        updateTimeSlots(this.value);
    });
    
    // Calculate total fee
    const checkboxes = document.querySelectorAll('input[name="dataWipe"], input[name="certificate"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotalFee);
    });
}

// Update time slots based on selected date
function updateTimeSlots(selectedDate) {
    const timeSelect = document.getElementById('pickup-time');
    const selectedDateObj = new Date(selectedDate);
    const dayOfWeek = selectedDateObj.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Clear existing options
    timeSelect.innerHTML = '<option value="">Select Time</option>';
    
    let timeSlots = [];
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Weekdays
        timeSlots = [
            '09:00-11:00',
            '11:00-13:00',
            '13:00-15:00',
            '15:00-17:00',
            '17:00-19:00'
        ];
    } else if (dayOfWeek === 6) {
        // Saturday
        timeSlots = [
            '10:00-12:00',
            '12:00-14:00',
            '14:00-16:00',
            '16:00-18:00'
        ];
    } else {
        // Sunday
        timeSelect.innerHTML = '<option value="">No pickup available on Sundays</option>';
        timeSelect.disabled = true;
        return;
    }
    
    timeSelect.disabled = false;
    
    timeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = formatTimeSlot(slot);
        timeSelect.appendChild(option);
    });
}

// Format time slot for display
function formatTimeSlot(slot) {
    const [start, end] = slot.split('-');
    const startTime = formatTime(start);
    const endTime = formatTime(end);
    return `${startTime} - ${endTime}`;
}

// Format time
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Calculate total fee
function calculateTotalFee() {
    const dataWipe = document.querySelector('input[name="dataWipe"]').checked;
    const certificate = document.querySelector('input[name="certificate"]').checked;
    
    let total = 0;
    let services = [];
    
    if (dataWipe) {
        total += 10;
        services.push('Data Wiping');
    }
    
    if (certificate) {
        total += 5;
        services.push('Disposal Certificate');
    }
    
    // Show fee breakdown if any services selected
    if (total > 0) {
        showNotification(`Additional services: ${services.join(', ')} - Total: $${total}`, 'info');
    }
}

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
    
    let icon = 'fa-info-circle';
    let bgColor = '#2196F3';
    
    if (type === 'success') {
        icon = 'fa-check-circle';
        bgColor = '#4CAF50';
    } else if (type === 'error') {
        icon = 'fa-exclamation-circle';
        bgColor = '#f44336';
    }
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
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
        background: ${bgColor};
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

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
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style); 