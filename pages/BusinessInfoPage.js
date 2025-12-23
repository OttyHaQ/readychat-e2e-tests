export class BusinessInfoPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.settingsLink = page.getByText('Settings', { exact: true });
    this.businessInfoLink = page.getByText('Business Info', { exact: true });
    
    // Form Fields - Basic Info
    this.businessNameInput = page.getByLabel('Business Name*');
    this.businessEmailInput = page.getByLabel('Business Email Address');
    this.aboutBusinessTextarea = page.getByLabel('Anything About My Business');
    
    // Form Fields - Address
    this.address1Input = page.getByLabel('Address 1*', { exact: true });
    this.address2Input = page.getByLabel('Address 2 (optional)');
    this.townCityInput = page.getByLabel('Town/City*');
    this.stateProvinceInput = page.getByLabel('State/Province*');
    this.postalCodeInput = page.getByLabel('Postal Code/PLZ*');
    this.countryDropdown = page.getByRole('button', { name: /Nigeria|Country/ });
    
    // Form Fields - Contact & Settings
    this.contactNumberInput = page.getByRole('textbox', { name: /phone number/i });
    this.businessWebsiteInput = page.getByLabel('Business Website');
    this.timeZoneDropdown = page.getByRole('button', { name: /Africa\/Lagos|GMT/ });
    this.currencyDropdown = page.getByRole('button').filter({ hasText: /[$€£¥₦]\s*[A-Z]{3}/ });
    // Email Notifications
    this.emailNotificationToggle = page.locator('label').filter({ 
      hasText: 'Email me when there are unanswered questions' 
    }).locator('input[type="checkbox"]');
    
    // Business Hours - Day Checkboxes
    this.mondayCheckbox = page.locator('label').filter({ hasText: /^Monday$/ }).locator('input[type="checkbox"]');
    this.tuesdayCheckbox = page.locator('label').filter({ hasText: /^Tuesday$/ }).locator('input[type="checkbox"]');
    this.wednesdayCheckbox = page.locator('label').filter({ hasText: /^Wednesday$/ }).locator('input[type="checkbox"]');
    this.thursdayCheckbox = page.locator('label').filter({ hasText: /^Thursday$/ }).locator('input[type="checkbox"]');
    this.fridayCheckbox = page.locator('label').filter({ hasText: /^Friday$/ }).locator('input[type="checkbox"]');
    this.saturdayCheckbox = page.locator('label').filter({ hasText: /^Saturday$/ }).locator('input[type="checkbox"]');
    this.sundayCheckbox = page.locator('label').filter({ hasText: /^Sunday$/ }).locator('input[type="checkbox"]');
    
    // Update Button
    this.updateButton = page.getByRole('button', { name: 'Update' });
    
    // Success/Error Messages
    this.successMessage = page.locator('text=successfully updated', { hasText: /updated/i });
    this.errorMessage = page.locator('[role="alert"], .error, .alert-error');
  }

  /**
   * Navigate to Business Info page
   */
  async navigateToBusinessInfo() {
    await this.page.goto('/en/dashboard/settings/business-info');
    await this.businessNameInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get business hours time dropdown for a specific day and type
   * @param {string} day - Day of week (Monday, Tuesday, etc.)
   * @param {string} type - 'start' or 'end'
   */
  getDayTimeDropdown(day, type) {
    const dayRow = this.page.locator('label').filter({ hasText: new RegExp(`^${day}$`) }).locator('..');
    if (type === 'start') {
      return dayRow.locator('select').first();
    } else {
      return dayRow.locator('select').nth(1);
    }
  }

  /**
   * Set business hours for a specific day
   * @param {string} day - Day of week
   * @param {boolean} enabled - Whether day should be enabled
   * @param {string} startTime - Start time (e.g., "08:00 | AM")
   * @param {string} endTime - End time (e.g., "09:00 | PM")
   */
  async setBusinessHours(day, enabled, startTime = null, endTime = null) {
    const checkboxMap = {
      'Monday': this.mondayCheckbox,
      'Tuesday': this.tuesdayCheckbox,
      'Wednesday': this.wednesdayCheckbox,
      'Thursday': this.thursdayCheckbox,
      'Friday': this.fridayCheckbox,
      'Saturday': this.saturdayCheckbox,
      'Sunday': this.sundayCheckbox
    };

    const checkbox = checkboxMap[day];
    const isChecked = await checkbox.isChecked();

    // Toggle checkbox if needed
    if (enabled && !isChecked) {
      await checkbox.check();
    } else if (!enabled && isChecked) {
      await checkbox.uncheck();
    }

    // Set times if provided and day is enabled
    if (enabled && startTime) {
      const startDropdown = this.getDayTimeDropdown(day, 'start');
      await startDropdown.selectOption({ label: startTime });
    }

    if (enabled && endTime) {
      const endDropdown = this.getDayTimeDropdown(day, 'end');
      await endDropdown.selectOption({ label: endTime });
    }
  }

  /**
   * Get the status of a day's business hours
   * @param {string} day - Day of week
   */
  async getDayStatus(day) {
    const checkboxMap = {
      'Monday': this.mondayCheckbox,
      'Tuesday': this.tuesdayCheckbox,
      'Wednesday': this.wednesdayCheckbox,
      'Thursday': this.thursdayCheckbox,
      'Friday': this.fridayCheckbox,
      'Saturday': this.saturdayCheckbox,
      'Sunday': this.sundayCheckbox
    };

    const checkbox = checkboxMap[day];
    return await checkbox.isChecked();
  }


    /**
     * Select from custom button dropdown
     * @param {Locator} buttonDropdown - The dropdown button
     * @param {string} optionText - Text of option to select
     */
    
   // In BusinessInfoPage.js - selectFromDropdown method
    async selectFromDropdown(buttonDropdown, optionText) {
        // Ensure optionText is a string
        const countryName = typeof optionText === 'string' 
            ? optionText 
            : optionText.name || String(optionText);
        
        await buttonDropdown.click();
        await this.page.getByRole('option', { name: countryName }).click();
    }

  /**
   * Fill all basic business information
   */
  async fillBasicInfo(data) {
    if (data.businessName) {
      await this.businessNameInput.clear();
      await this.businessNameInput.fill(data.businessName);
    }

    if (data.businessEmail) {
      await this.businessEmailInput.clear();
      await this.businessEmailInput.fill(data.businessEmail);
    }

    if (data.aboutBusiness) {
      await this.aboutBusinessTextarea.clear();
      await this.aboutBusinessTextarea.fill(data.aboutBusiness);
    }
  }

  /**
   * Fill address information
   */
  async fillAddressInfo(data) {
    if (data.address1) {
      await this.address1Input.clear();
      await this.address1Input.fill(data.address1);
    }

    if (data.address2) {
      await this.address2Input.clear();
      await this.address2Input.fill(data.address2);
    }

    if (data.townCity) {
      await this.townCityInput.clear();
      await this.townCityInput.fill(data.townCity);
    }

    if (data.stateProvince) {
      await this.stateProvinceInput.clear();
      await this.stateProvinceInput.fill(data.stateProvince);
    }

    if (data.postalCode) {
      await this.postalCodeInput.clear();
      await this.postalCodeInput.fill(data.postalCode);
    }

    if (data.country) {
        await this.selectFromDropdown(this.countryDropdown, data.country);
    }
  }

  /**
   * Fill contact and settings information
   */
  async fillContactSettings(data) {
    if (data.contactNumber) {
        await this.contactNumberInput.click();
        await this.contactNumberInput.clear();
        await this.contactNumberInput.pressSequentially(data.contactNumber, { delay: 50 });
        await this.contactNumberInput.blur();
        await this.page.waitForTimeout(500);
        // Verify the field has a value
        const value = await this.contactNumberInput.inputValue();
        if (!value) {
            throw new Error('Contact number failed to fill');
        }
    }

    if (data.businessWebsite) {
      await this.businessWebsiteInput.clear();
      await this.businessWebsiteInput.fill(data.businessWebsite);
    }

    if (data.timeZone) {
      await this.selectFromDropdown(this.timeZoneDropdown, data.timeZone);
    }

    if (data.currency) {
      await this.selectFromDropdown(this.currencyDropdown, data.currency);
    }
  }

  /**
   * Toggle email notifications
   * @param {boolean} enabled - Whether to enable or disable
   */
  async setEmailNotifications(enabled) {
    const isChecked = await this.emailNotificationToggle.isChecked();
    
    if (enabled && !isChecked) {
      await this.emailNotificationToggle.check();
    } else if (!enabled && isChecked) {
      await this.emailNotificationToggle.uncheck();
    }
  }

  /**
   * Get current email notification status
   */
  async getEmailNotificationStatus() {
    return await this.emailNotificationToggle.isChecked();
  }

  /**
   * Click the Update button
   */
  async clickUpdate() {
    await this.updateButton.click();
  }

  /**
   * Wait for success message
   */
  async waitForSuccess(timeout = 10000) {
    await this.successMessage.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if form has validation errors
   */
  async hasValidationErrors() {
    const errorVisible = await this.errorMessage.isVisible({ timeout: 2000 }).catch(() => false);
    return errorVisible;
  }

  /**
   * Get all current form values
   */
  async getCurrentFormValues() {
    return {
      businessName: await this.businessNameInput.inputValue(),
      businessEmail: await this.businessEmailInput.inputValue(),
      aboutBusiness: await this.aboutBusinessTextarea.inputValue(),
      address1: await this.address1Input.inputValue(),
      address2: await this.address2Input.inputValue(),
      townCity: await this.townCityInput.inputValue(),
      stateProvince: await this.stateProvinceInput.inputValue(),
      postalCode: await this.postalCodeInput.inputValue(),
      contactNumber: await this.contactNumberInput.inputValue(),
      businessWebsite: await this.businessWebsiteInput.inputValue(),
      mondayEnabled: await this.getDayStatus('Monday'),
      tuesdayEnabled: await this.getDayStatus('Tuesday'),
      wednesdayEnabled: await this.getDayStatus('Wednesday'),
      thursdayEnabled: await this.getDayStatus('Thursday'),
      fridayEnabled: await this.getDayStatus('Friday'),
      saturdayEnabled: await this.getDayStatus('Saturday'),
      sundayEnabled: await this.getDayStatus('Sunday')
    };
  }
}
