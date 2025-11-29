jQuery(document).ready(function($) {
    let currentStep = 1;
    const totalSteps = 10;
    const formData = {};
    
    // Update progress bar
    function updateProgress() {
        const progress = (currentStep / totalSteps) * 100;
        $('.progress-fill').css('width', progress + '%');
        $('.progress-text span:first-child').text(`Step ${currentStep} of ${totalSteps}`);
        $('.progress-text span:last-child').text(Math.round(progress) + '% Complete');
    }
    
    // Show specific step
    function showStep(step) {
        $('.form-step').removeClass('active');
        $(`.form-step[data-step="${step}"]`).addClass('active');
        currentStep = step;
        updateProgress();
        
        // Scroll to form
        $('html, body').animate({
            scrollTop: $('.multistep-form-container').offset().top - 100
        }, 300);
    }
    
    // Validate current step
    function validateStep(step) {
        const $currentStep = $(`.form-step[data-step="${step}"]`);
        const $inputs = $currentStep.find('input, select');
        let isValid = true;
        
        $inputs.each(function() {
            const $input = $(this);
            const $error = $input.siblings('.form-error');
            
            if ($input.prop('required') && !$input.val()) {
                isValid = false;
                $error.addClass('show').text('This field is required');
            } else if ($input.attr('type') === 'email' && $input.val()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test($input.val())) {
                    isValid = false;
                    $error.addClass('show').text('Please enter a valid email');
                } else {
                    $error.removeClass('show');
                }
            } else if ($input.attr('type') === 'tel' && $input.val()) {
                const phoneRegex = /^[\d\s\-\(\)]+$/;
                if (!phoneRegex.test($input.val())) {
                    isValid = false;
                    $error.addClass('show').text('Please enter a valid phone number');
                } else {
                    $error.removeClass('show');
                }
            } else {
                $error.removeClass('show');
            }
        });
        
        // Check radio buttons
        const $radioGroups = $currentStep.find('.radio-group');
        $radioGroups.each(function() {
            const $group = $(this);
            const name = $group.find('input[type="radio"]').attr('name');
            if (!$group.find(`input[name="${name}"]:checked`).length) {
                isValid = false;
                $group.siblings('.form-error').addClass('show').text('Please select an option');
            } else {
                $group.siblings('.form-error').removeClass('show');
            }
        });
        
        return isValid;
    }
    
    // Next button click
    $(document).on('click', '.btn-next', function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            return;
        }
        
        // Save current step data
        const $currentStep = $(`.form-step[data-step="${currentStep}"]`);
        $currentStep.find('input, select').each(function() {
            const $input = $(this);
            if ($input.attr('type') === 'radio') {
                if ($input.is(':checked')) {
                    formData[$input.attr('name')] = $input.val();
                }
            } else {
                formData[$input.attr('name')] = $input.val();
            }
        });
        
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        } else {
            submitForm();
        }
    });
    
    // Back button click
    $(document).on('click', '.btn-back', function(e) {
        e.preventDefault();
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });
    
    // Submit form
    function submitForm() {
        // Show matching animation
        showMatchingAnimation();
        
        // Prepare data
        const submitData = {
            action: 'submit_insurance_lead',
            nonce: ajaxData.nonce,
            ...formData
        };
        
        // Submit via AJAX
        $.ajax({
            url: ajaxData.ajaxurl,
            type: 'POST',
            data: submitData,
            success: function(response) {
                if (response.success) {
                    setTimeout(function() {
                        showSuccessScreen(response.data.redirect_url);
                    }, 2500);
                } else {
                    alert('Error: ' + response.data.message);
                    showStep(1);
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
                showStep(1);
            }
        });
    }
    
    // Show matching animation
    function showMatchingAnimation() {
        const html = `
            <div class="matching-animation">
                <div class="matching-spinner"></div>
                <div class="matching-status">Finding Your Perfect Match...</div>
                <ul class="matching-steps">
                    <li id="step1">Verifying your information</li>
                    <li id="step2">Matching with top providers</li>
                    <li id="step3">Calculating potential savings</li>
                    <li id="step4">Preparing your quotes</li>
                </ul>
            </div>
        `;
        
        $('.multistep-form-container').html(html);
        
        // Animate steps
        setTimeout(() => $('#step1').addClass('completed'), 500);
        setTimeout(() => $('#step2').addClass('completed'), 1000);
        setTimeout(() => $('#step3').addClass('completed'), 1500);
        setTimeout(() => $('#step4').addClass('completed'), 2000);
    }
    
    // Show success screen
    function showSuccessScreen(redirectUrl) {
        const html = `
            <div class="success-screen">
                <div class="success-icon">✓</div>
                <h2 class="success-title">Perfect Match Found!</h2>
                <p class="success-message">
                    We've found the best insurance options for you. Redirecting you to view your personalized quotes...
                </p>
                <div class="success-stats">
                    <div class="stat-card">
                        <div class="stat-value">5</div>
                        <div class="stat-label">Matched Providers</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">$847</div>
                        <div class="stat-label">Potential Savings/Year</div>
                    </div>
                </div>
            </div>
        `;
        
        $('.multistep-form-container').html(html);
        
        // Redirect after 3 seconds if URL provided
        if (redirectUrl) {
            setTimeout(function() {
                window.location.href = redirectUrl;
            }, 3000);
        }
    }
    
    // Initialize
    updateProgress();
});
