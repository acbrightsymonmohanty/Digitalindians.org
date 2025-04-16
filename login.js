document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const stepEmail = document.getElementById('step-email');
    const stepOtp = document.getElementById('step-otp');
    const stepSuccess = document.getElementById('step-success');
    
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const requestOtpBtn = document.getElementById('request-otp-btn');
    
    const backToEmailBtn = document.getElementById('back-to-email');
    const otpInputs = document.querySelectorAll('.otp-input');
    const otpError = document.getElementById('otp-error');
    const otpSuccess = document.getElementById('otp-success');
    const resendOtpBtn = document.getElementById('resend-otp');
    const otpTimer = document.getElementById('otp-timer');
    const timerCount = document.getElementById('timer-count');
    const verifyOtpBtn = document.getElementById('verify-otp-btn');
    
    const continueBtn = document.getElementById('continue-btn');
    
    let userEmail = '';
    let timerInterval;
    let secondsLeft = 60;
    
    // Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Start OTP timer
    function startOtpTimer() {
        secondsLeft = 60;
        timerCount.textContent = secondsLeft;
        otpTimer.style.display = 'block';
        resendOtpBtn.disabled = true;
        
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsLeft--;
            timerCount.textContent = secondsLeft;
            
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                resendOtpBtn.disabled = false;
                otpTimer.style.display = 'none';
            }
        }, 1000);
    }
    
    // Handle OTP input focus and auto-tab
    otpInputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            // If input has a value, focus the next input
            if (input.value.length === 1) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
            
            // If backspace is pressed and input is empty, focus the previous input
            if (e.key === 'Backspace' && input.value.length === 0) {
                if (index > 0) {
                    otpInputs[index - 1].focus();
                }
            }
        });
    });
    
    // Get OTP from inputs
    function getOtpValue() {
        let otp = '';
        otpInputs.forEach(input => {
            otp += input.value;
        });
        return otp;
    }
    
    // Clear OTP inputs
    function clearOtpInputs() {
        otpInputs.forEach(input => {
            input.value = '';
        });
        otpInputs[0].focus();
    }
    
    // Show step
    function showStep(step) {
        stepEmail.classList.remove('active');
        stepOtp.classList.remove('active');
        stepSuccess.classList.remove('active');
        
        step.classList.add('active');
    }
    
    // Request OTP API call
    async function requestOtp(email) {
        try {
            const response = await fetch('https://bmsbeta.dileep.live/api/Response/ProcessLoyaltyEmailOTPRequest/000001', {
                method: 'GET',
                headers: {
                    'EmailID': email,
                    'Content-Type': 'application/json',
                    'CCode': 'DGIndians'
                }
            });
            
            const data = await response.json();
            
            if (data.RESPONSE && data.RESPONSE[0].ResponseCode === "200") {
                return {
                    success: true,
                    message: data.RESPONSE[0].ResponseMessage,
                    //otp: data.LoginEmailOTP[0].OTP
                    //remove the auto fill otp
                };
            } else {
                return {
                    success: false,
                    message: data.RESPONSE ? data.RESPONSE[0].ResponseMessage : 'Failed to get OTP'
                };
            }
        } catch (error) {
            console.error('Error requesting OTP:', error);
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    }
    
    // Verify OTP API call
    async function verifyOtp(email, otp) {
        try {
            const response = await fetch('https://bmsbeta.dileep.live/api/Response/ProcessValidateLoyaltyEmailOTP/000001', {
                method: 'GET',
                headers: {
                    'EmailID': email,
                    'OTP': otp,
                    'Content-Type': 'application/json',
                    'CCode': 'DGIndians'
                }
            });
            
            const data = await response.json();
            
            if (data.RESPONSE && data.RESPONSE[0].ResponseCode === "200") {
                // Save token to localStorage
                if (data.LoginDetails && data.LoginDetails[0].TokenCode) {
                    localStorage.setItem('authToken', data.LoginDetails[0].TokenCode);
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userLoggedIn', 'true');
                }
                
                return {
                    success: true,
                    message: data.RESPONSE[0].ResponseMessage
                };
            } else {
                return {
                    success: false,
                    message: data.RESPONSE ? data.RESPONSE[0].ResponseMessage : 'Failed to verify OTP'
                };
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return {
                success: false,
                message: 'Network error. Please try again.'
            };
        }
    }
    
    // Real-time email validation
    emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim();
        
        if (email === '') {
            // If empty, hide error
            emailError.style.display = 'none';
        } else if (!isValidEmail(email)) {
            // If invalid and not empty, show error
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.display = 'block';
        } else {
            // If valid, hide error
            emailError.style.display = 'none';
        }
        
        // Enable/disable button based on validation
        requestOtpBtn.disabled = email === '' || !isValidEmail(email);
    });
    
    // Event Listeners
    requestOtpBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        
        if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.display = 'block';
            return;
        }
        
        emailError.style.display = 'none';
        requestOtpBtn.disabled = true;
        requestOtpBtn.textContent = 'Sending...';
        
        const result = await requestOtp(email);
        
        if (result.success) {
            userEmail = email;
            showStep(stepOtp);
            startOtpTimer();
            otpInputs[0].focus();
            
            // For development/testing - auto-fill OTP if available
            if (result.otp) {
                console.log('OTP for testing:', result.otp);
                // Auto-fill OTP for testing purposes
                const otpDigits = result.otp.split('');
                otpInputs.forEach((input, index) => {
                    if (otpDigits[index]) {
                        input.value = otpDigits[index];
                    }
                });
            }
        } else {
            emailError.textContent = result.message || 'Failed to send OTP. Please try again.';
            emailError.style.display = 'block';
        }
        
        requestOtpBtn.disabled = false;
        requestOtpBtn.textContent = 'Get OTP';
    });
    
    backToEmailBtn.addEventListener('click', () => {
        showStep(stepEmail);
        clearInterval(timerInterval);
    });
    
    resendOtpBtn.addEventListener('click', async () => {
        resendOtpBtn.disabled = true;
        
        const result = await requestOtp(userEmail);
        
        if (result.success) {
            startOtpTimer();
            clearOtpInputs();
            
            // For development/testing - auto-fill OTP if available
            if (result.otp) {
                console.log('OTP for testing:', result.otp);
                // Auto-fill OTP for testing purposes
                const otpDigits = result.otp.split('');
                otpInputs.forEach((input, index) => {
                    if (otpDigits[index]) {
                        input.value = otpDigits[index];
                    }
                });
            }
        } else {
            otpError.textContent = result.message || 'Failed to resend OTP. Please try again.';
            otpError.style.display = 'block';
        }
    });
    
    verifyOtpBtn.addEventListener('click', async () => {
        const otp = getOtpValue();
        
        if (otp.length !== 4) {
            otpError.textContent = 'Please enter a valid 4-digit OTP';
            otpError.style.display = 'block';
            return;
        }
        
        otpError.style.display = 'none';
        verifyOtpBtn.disabled = true;
        verifyOtpBtn.textContent = 'Verifying...';
        
        const result = await verifyOtp(userEmail, otp);
        
        if (result.success) {
            otpSuccess.style.display = 'block';
            
            // Show success step after a short delay
            setTimeout(() => {
                showStep(stepSuccess);
                clearInterval(timerInterval);
            }, 1500);
        } else {
            otpError.textContent = result.message || 'Invalid OTP. Please try again.';
            otpError.style.display = 'block';
        }
        
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = 'Verify & Sign In';
    });
    
    continueBtn.addEventListener('click', () => {
        // Set user as logged in
        localStorage.setItem('userLoggedIn', 'true');
        
        // Check if there's a pending query
        const pendingQuery = localStorage.getItem('pendingQuery');
        
        if (pendingQuery) {
            // Clear the pending query
            localStorage.removeItem('pendingQuery');
            // Redirect to search page with the query
            window.location.href = `search.html?q=${encodeURIComponent(pendingQuery)}`;
        } else {
            // Redirect to dashboard or home page
            window.location.href = 'index.html';
        }
    });
    
    // Initialize
    emailInput.focus();
    
    // Initially disable the button until valid email is entered
    requestOtpBtn.disabled = true;
}); 