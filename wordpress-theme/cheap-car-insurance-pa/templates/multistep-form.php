<div class="multistep-form-container">
    <div class="form-progress">
        <div class="progress-text">
            <span>Step 1 of 10</span>
            <span>10% Complete</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: 10%;"></div>
        </div>
    </div>
    
    <form id="insurance-quote-form">
        <!-- Step 1: Age -->
        <div class="form-step active" data-step="1">
            <h2 class="step-title">What is your age?</h2>
            <p class="step-description">This helps us find the best rates for you</p>
            
            <div class="form-group">
                <label class="form-label" for="age">Age</label>
                <input type="number" id="age" name="age" class="form-input" placeholder="Enter your age" min="16" max="100" required>
                <div class="form-error"></div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-next">Next →</button>
            </div>
        </div>
        
        <!-- Step 2: State -->
        <div class="form-step" data-step="2">
            <h2 class="step-title">Which state do you live in?</h2>
            <p class="step-description">Insurance rates vary by location</p>
            
            <div class="form-group">
                <label class="form-label" for="state">State</label>
                <select id="state" name="state" class="form-select" required>
                    <option value="">Select your state</option>
                    <option value="PA" selected>Pennsylvania</option>
                    <option value="NY">New York</option>
                    <option value="NJ">New Jersey</option>
                    <option value="OH">Ohio</option>
                    <option value="MD">Maryland</option>
                    <option value="DE">Delaware</option>
                    <option value="WV">West Virginia</option>
                </select>
                <div class="form-error"></div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-back">← Back</button>
                <button type="button" class="btn btn-primary btn-next">Next →</button>
            </div>
        </div>
        
        <!-- Step 3: ZIP Code -->
        <div class="form-step" data-step="3">
            <h2 class="step-title">What's your ZIP code?</h2>
            <p class="step-description">We'll find local providers in your area</p>
            
            <div class="form-group">
                <label class="form-label" for="zipCode">ZIP Code</label>
                <input type="text" id="zipCode" name="zipCode" class="form-input" placeholder="Enter ZIP code" pattern="[0-9]{5}" required>
                <div class="form-error"></div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-back">← Back</button>
                <button type="button" class="btn btn-primary btn-next">Next →</button>
            </div>
        </div>
        
        <!-- Step 4: Vehicle Type -->
        <div class="form-step" data-step="4">
            <h2 class="step-title">What type of vehicle do you drive?</h2>
            <p class="step-description">Select your primary vehicle</p>
            
            <div class="form-group">
                <div class="radio-group">
                    <div class="radio-option">
                        <input type="radio" id="sedan" name="vehicleType" value="Sedan" required>
                        <label for="sedan">Sedan</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="suv" name="vehicleType" value="SUV">
                        <label for="suv">SUV</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="truck" name="vehicleType" value="Truck">
                        <label for="truck">Truck</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="coupe" name="vehicleType" value="Coupe">
                        <label for="coupe">Coupe</label>
                    </div>
                </div>
                <div class="form-error"></div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-back">← Back</button>
                <button type="button" class="btn btn-primary btn-next">Next →</button>
            </div>
        </div>
        
        <!-- Step 5: Vehicle Year -->
        <div class="form-step" data-step="5">
            <h2 class="step-title">What year is your vehicle?</h2>
            <p class="step-description">Vehicle age affects your insurance rate</p>
            
            <div class="form-group">
                <label class="form-label" for="vehicleYear">Vehicle Year</label>
                <input type="number" id="vehicleYear" name="vehicleYear" class="form-input" placeholder="e.g., 2020" min="1980" max="2025" required>
                <div class="form-error"></div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-back">← Back</button>
                <button type="button" class="btn btn-primary btn-next">Next →</button>
            </div>
        </div>
        
        <!-- Step 6: Recent Accidents -->
        <div class="form-step" data-step="6">
            <h2 class="step-title">Any accidents in the last 3 months?</h2>
            <p class="step-description">This helps us calculate accurate rates</p>
            
            <div class="form-group">
                <div class="radio-group">
                    <div class="radio-option">
                        <input type="radio" id="accidents-no" name="recentAccidents" value="no" required>
                        <label for="accidents-no">No</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="accidents-yes" name="recentAccidents" value="yes">
                        <label for="accidents-yes">Yes</label>
                    </div>
                </div>
                <div class="form-error"></div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-back">← Back</button>
                <button type="button" class="btn btn-primary btn-next">Next →</button>
            </div>
        </div>
        
        <!-- Step 7: Current Insurance Company -->
        <div class="form-step" data-step="7">
            <h2 class="step-title">Who is your current insurance provider?</h2>
            <p class="step-description">Or select "No Insurance" if you don't have one</p>
            
            <div class="form-group">
                <label class="form-label" for="currentInsurer">Current Insurer</label>
                <select id="currentInsurer" name="currentInsurer" class="form-select" required>
                    <option value="">Select your current insurer</option>
                    <option value="No Insurance">No Insurance</option>
                    <option value="State Farm">State Farm</option>
                    <option value="GEICO">GEICO</option>
                    <option value="Progressive">Progressive</option>
                    <option value="Allstate">Allstate</option>
                    <option value="USAA">USAA</option>
                    <option value="Liberty Mutual">Liberty Mutual</option>
                    <option value="Farmers">Farmers</option>
                    <option value="Nationwide">Nationwide</option>
                    <option value="Travelers">Travelers</option>
                    <option value="American Family">American Family</option>
                    <option value="Other">Other</option>
                </select>
                <div class="form-error"></div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-back">← Back</button>
                <button type="button" class="btn btn-primary btn-next">Next →</button>
            </div>
        </div>
        
        <!-- Step 8: Coverage Type -->
        <div class="form-step" data-step="8">
            <h2 class="step-title">What type of coverage do you have?</h2>
            <p class="step-description">Select your current coverage level</p>
            
            <div class="form-group">
                <div class="radio-group">
                    <div class="radio-option">
                        <input type="radio" id="liability" name="coverageType" value="Liability Only" required>
                        <label for="liability">Liability Only</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="full" name="coverageType" value="Full Coverage">
                        <label for="full">Full Coverage</label>
                    </div>
                </div>
                <div class="form-error"></div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-back">← Back</button>
                <button type="button" class="btn btn-primary btn-next">Next →</button>
            </div>
        </div>
        
        <!-- Step 9: Ownership -->
        <div class="form-step" data-step="9">
            <h2 class="step-title">How do you own your vehicle?</h2>
            <p class="step-description">This affects your coverage requirements</p>
            
            <div class="form-group">
                <div class="radio-group">
                    <div class="radio-option">
                        <input type="radio" id="owned" name="ownership" value="Owned" required>
                        <label for="owned">Owned</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="financed" name="ownership" value="Financed">
                        <label for="financed">Financed</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="leased" name="ownership" value="Leased">
                        <label for="leased">Leased</label>
                    </div>
                </div>
                <div class="form-error"></div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-back">← Back</button>
                <button type="button" class="btn btn-primary btn-next">Next →</button>
            </div>
        </div>
        
        <!-- Step 10: Contact Details -->
        <div class="form-step" data-step="10">
            <h2 class="step-title">Almost done! Enter your contact details</h2>
            <p class="step-description">We'll send your personalized quotes here</p>
            
            <div class="form-group">
                <label class="form-label" for="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" class="form-input" placeholder="John" required>
                <div class="form-error"></div>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" class="form-input" placeholder="Doe" required>
                <div class="form-error"></div>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <input type="email" id="email" name="email" class="form-input" placeholder="john@example.com" required>
                <div class="form-error"></div>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" class="form-input" placeholder="(555) 123-4567" required>
                <div class="form-error"></div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-back">← Back</button>
                <button type="button" class="btn btn-primary btn-next">Get My Quotes →</button>
            </div>
        </div>
    </form>
</div>
