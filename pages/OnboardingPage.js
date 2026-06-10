import { expect } from '@playwright/test';

export class OnboardingPage {
  constructor(page) {
    this.page = page;

    // Common Elements
    this.configAccountHeading = page.getByRole('heading', { name: /configure your account/i });
    this.pageHeading = page.locator('.text-3xl.font-bold.text-gray-800.mb-4');
    this.getStartedBtn = page.getByRole('button', { name: /get started/i });
    this.nextBtn = page.getByRole('button', { name: /next/i });
    this.submitBtn = page.getByRole('button', { name: /submit/i });
    this.logOutBtn = page.getByRole('button', { name: /log out/i })
      .or(page.locator('.gap-4 > .bg-secondary'));
    this.goNowBtn = page.getByRole('button', {name: 'Go Now!'});

    // PERSONAL DETAILS STEP 
    this.firstNameField = page.locator('#first_name');
    this.lastNameField = page.locator('#last_name');
    this.timeZoneDropdown = page.getByRole('button', { name: '(GMT+01:00) Africa/Lagos' })
      .or(page.locator('button:has-text("UTC")'));
    this.timeZoneFirstOption = page.locator('div[role="option"]');

    //  BUSINESS INFO STEP 
    this.businessNameField = page.locator('#business_name');
    this.businessEmailField = page.locator('#business_email');
    this.aboutBusinessField = page.locator('#general_info');
    
    // Address Fields
    this.addressField = page.locator('#address1');
    this.cityField = page.locator('#city');
    this.stateField = page.locator('#state');
    this.postalCodeField = page.locator('#zipcode');
    
    // Country Selection
    this.countryDropdown = page.getByRole('button', { name: /select your country/i })
      .or(page.locator('button:has-text("Select your country")'));
    this.searchField = page.getByPlaceholder(/search/i);
    this.dropdownOption = page.locator('div[role="option"]');
    
    // Contact Number
    this.countryCodeFlag = page.locator('.react-international-phone-flag-emoji');
    this.contactNumberField = page.getByPlaceholder(/phone number/i)
      .or(page.getByPlaceholder("Enter your business's phone number"));
    
    // Currency Selection
    this.currencyDropdown = page.getByRole('button', { name: /\$ USD|Currency/i });
    this.currencySearchField = page.locator('xpath=//input[@placeholder="Search..."]')

    //  BOT SETTINGS STEP 
    this.introTextField = page.locator('textarea#responses\\.0\\.response')
      .or(page.locator('textarea[id="responses.0.response"]'));
    this.toneTextField = page.locator('textarea#responses\\.1\\.response')
      .or(page.locator('textarea[id="responses.1.response"]'));
    this.addFileButton = page.locator('button:has(.remixicon.text-secondary.mr-2)')
      .or(page.getByRole('button', { name: /add file/i }));
    
    // AI Model Radio Buttons
    this.aiModel1Radio = page.locator('.space-x-4 > :nth-child(1) input[type="radio"]')
      .or(page.locator('.space-x-4 > :nth-child(1) .relative .absolute'));
    this.aiModel2Radio = page.locator('.space-x-4 > :nth-child(2) input[type="radio"]')
      .or(page.locator('.space-x-4 > :nth-child(2) .relative .absolute'));
    
    // General Toggle Switches (7 toggles)
    this.generalToggles = {
      toggle1: page.locator('.gap-2 > .flex > .relative > .w-12').nth(0),
      toggle2: page.locator('.gap-2 > .flex > .relative > .w-12').nth(1),
      toggle3: page.locator('.gap-2 > .flex > .relative > .w-12').nth(2),
      toggle4: page.locator('.gap-2 > .flex > .relative > .w-12').nth(3),
      toggle5: page.locator('.gap-2 > .flex > .relative > .w-12').nth(4),
      toggle6: page.locator('.gap-2 > .flex > .relative > .w-12').nth(5),
      toggle7: page.locator('.gap-2 > .flex > .relative > .w-12').nth(6)
    };

    //  BUSINESS SCHEDULE STEP 
    this.scheduleTimeZoneDropdown = page.locator('.relative.w-full > .ps-4 > .gap-2 > .flex-1');
    
    // Day Selection Checkboxes
    this.days = {
      monday: page.getByText(/monday/i).or(page.locator('p:has-text("Monday")')),
      tuesday: page.getByText(/tuesday/i).or(page.locator('p:has-text("Tuesday")')),
      wednesday: page.getByText(/wednesday/i).or(page.locator('p:has-text("Wednesday")')),
      thursday: page.getByText(/thursday/i).or(page.locator('p:has-text("Thursday")')),
      friday: page.getByText(/friday/i).or(page.locator('p:has-text("Friday")')),
      saturday: page.getByText(/saturday/i).or(page.locator('p:has-text("Saturday")')),
      sunday: page.getByText(/sunday/i).or(page.locator('p:has-text("Sunday")'))
    };

    // Default test data
    this.testData = {
      address: '20 Church Street',
      city: 'Ikoyi',
      state: 'Lagos',
      postalCode: '12345',
      country: 'Nigeria',
      contactNumber: '07030000000',
      currency: 'USD',
      intro: 'Hello there, welcome to my page',
      tone: 'friendly',
      timeZoneSearch: 'West'
    };
  }

  //  HELPER METHODS 

  /**
   * Waits for a specific onboarding step heading to be visible
   * @param {string} headingText - The heading text to wait for
   */
  async waitForStepHeading(headingText) {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(500); // Brief pause for stability
  }

  /**
   * Searches and selects an option from a dropdown
   * @param {Locator} dropdownButton - The dropdown button locator
   * @param {Locator} searchField - The search field locator
   * @param {string} searchText - Text to search for
   * @param {string} exactMatch - Optional exact text match for the option
   */
  async selectDropdownOption(dropdownButton, searchField, searchText, exactMatch = null) {
    await dropdownButton.waitFor({ state: 'visible', timeout: 5000 });
    await dropdownButton.click();
    
    await searchField.waitFor({ state: 'visible', timeout: 5000 });
    await searchField.fill(searchText);
    await this.page.waitForTimeout(500); // Wait for search results
    
    if (exactMatch) {
      await this.dropdownOption.filter({ hasText: exactMatch }).first().click();
    } else {
      await this.dropdownOption.first().click();
    }
  }

  /**
   * Toggles all general settings (for bot settings step)
   * @param {boolean} enable - Whether to enable or disable toggles
   */
  async toggleAllGeneralSettings(enable = true) {
    for (const [key, toggle] of Object.entries(this.generalToggles)) {
      try {
        await toggle.waitFor({ state: 'visible', timeout: 3000 });
        await toggle.click();
      } catch (error) {
        console.log(`Toggle ${key} not found or not clickable`);
      }
    }
  }

  /**
   * Selects all days of the week in business schedule
   */
  async selectAllDays() {
    for (const [dayName, dayLocator] of Object.entries(this.days)) {
      try {
        await dayLocator.waitFor({ state: 'visible', timeout: 3000 });
        await dayLocator.click();
      } catch (error) {
        console.log(`Day ${dayName} not found or not clickable`);
      }
    }
  }

  //  STEP COMPLETION METHODS 

  /**
   * Completes the Personal Details step
   * @param {string} firstName - First name to enter
   * @param {string} lastName - Last name to enter (defaults to firstName)
   */
  async completePersonalDetails(firstName, lastName = null) {
    lastName = lastName || firstName;
    
    // Click Get Started button
    await this.getStartedBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.getStartedBtn.click();

    // Fill personal details
    await this.firstNameField.waitFor({ state: 'visible', timeout: 10000 });
    await this.firstNameField.fill(firstName);
    await this.lastNameField.fill(lastName);

    // Select timezone
    await this.timeZoneDropdown.waitFor({ state: 'visible', timeout: 5000 });
    await this.timeZoneDropdown.click();

    // Wait for dropdown to populate, then click Lagos option directly
    await this.page.waitForTimeout(500);
    await this.page
      .locator('div[role="option"]:has-text("Africa/Lagos")')
      .click({ timeout: 10000 });

    // Proceed to next step
    await this.nextBtn.click();
    
  }

  /**
   * Completes the Business Info step
   * @param {string} businessName - Business name to enter
   * @param {string} businessEmail - Business email to enter
   * @param {Object} customData - Optional custom data to override defaults
   */
  async completeBusinessInfo(businessName, businessEmail, customData = {}) {
    const data = { ...this.testData, ...customData };
    
    // Click Get Started button
    await this.getStartedBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.getStartedBtn.click();
    
    // Fill business details
    await this.businessNameField.waitFor({ state: 'visible', timeout: 10000 });
    await this.businessNameField.fill(businessName);
    await this.businessEmailField.fill(businessEmail);
    
    // Fill address information
    await this.addressField.fill(data.address);
    await this.cityField.fill(data.city);
    await this.postalCodeField.fill(data.postalCode);

    // Select country
    await this.selectDropdownOption(
      this.countryDropdown,
      this.searchField,
      data.country
    );

    // Select state/province — it's a searchable dropdown populated after country selection
    await this.page.waitForTimeout(500);
    const stateDropdownBtn = this.page.locator('button').filter({ hasText: /Enter your state\/province/i }).first();
    const stateIsDropdown = await stateDropdownBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (stateIsDropdown) {
      await stateDropdownBtn.click();
      const stateSearch = this.page.getByPlaceholder(/search/i).last();
      if (await stateSearch.isVisible({ timeout: 3000 }).catch(() => false)) {
        await stateSearch.fill(data.state);
        await this.page.waitForTimeout(500);
      }
      await this.page.locator('[role="option"]').filter({ hasText: new RegExp(data.state, 'i') }).first().click();
    } else {
      await this.stateField.fill(data.state);
    }

    // Select phone country code before filling number
    const phoneCountryBtn = this.page.locator('button').filter({ hasText: 'Select an option' }).first()
      .or(this.page.locator('.react-international-phone-country-selector-button').first());
    const hasPhoneCountry = await phoneCountryBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (hasPhoneCountry) {
      await phoneCountryBtn.click();
      await this.page.waitForTimeout(500);
      const phoneSearch = this.page.getByPlaceholder(/search/i).last();
      if (await phoneSearch.isVisible({ timeout: 3000 }).catch(() => false)) {
        await phoneSearch.fill('Nigeria');
        await this.page.waitForTimeout(500);
      }
      await this.page.locator('[role="option"]').filter({ hasText: /nigeria/i }).first().click();
      await this.page.waitForTimeout(300);
    }

    // Fill contact number
    await this.contactNumberField.waitFor({ state: 'visible', timeout: 5000 });
    await this.contactNumberField.fill(data.contactNumber);
    await this.contactNumberField.dispatchEvent('input');
    
    // Select currency
    await this.currencyDropdown.waitFor({ state: 'visible', timeout: 5000 });
    await this.currencyDropdown.click();
    await this.page.waitForTimeout(3000);
    await this.currencySearchField.waitFor({ state: 'visible', timeout: 5000 });
    await this.currencySearchField.fill(data.currency);
    
    // Select timezone
    await this.timeZoneDropdown.waitFor({ state: 'visible', timeout: 5000 });
    await this.timeZoneDropdown.click();

    // Wait for dropdown to populate, then click Lagos option directly
    await this.page.waitForTimeout(500);
    await this.page
      .locator('div[role="option"]:has-text("Africa/Lagos")')
      .click({ timeout: 10000 });

    // Proceed to next step
    await this.nextBtn.click();

  }


  /**
   * Completes the Bot Settings step
   * @param {Object} customData - Optional custom data to override defaults
   */
  async completeBotSettings(customData = {}) {
    const data = { ...this.testData, ...customData };
    
    // Click Get Started button (if present — some step variants skip this screen)
    const getStartedVisible = await this.getStartedBtn.isVisible().catch(() => false);
    if (getStartedVisible) {
      await this.getStartedBtn.click();
    }

    // Fill intro/tone text fields if present (removed in current UI but kept for backwards compat)
    const introVisible = await this.introTextField.isVisible().catch(() => false);
    if (introVisible) {
      await this.introTextField.fill(data.intro);
      await this.toneTextField.waitFor({ state: 'visible', timeout: 5000 });
      await this.toneTextField.fill(data.tone);
    }

    // Toggle all general settings
    await this.toggleAllGeneralSettings(true);
    
    // Select AI model (toggle between options)
    try {
      await this.aiModel1Radio.waitFor({ state: 'visible', timeout: 3000 });
      await this.aiModel1Radio.click();
      await this.aiModel2Radio.click(); // Toggle back and forth
    } catch (error) {
      console.log('AI model selection not available or already selected');
    }
    
    // Proceed to next step
    await this.nextBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.nextBtn.click();
  }

  /**
   * Completes the Business Schedule step
   * @param {string} timeZoneSearch - Optional timezone search text
   */
  async completeBusinessSchedule(timeZoneSearch = null) {
    
    // Click Get Started button
    await this.getStartedBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.getStartedBtn.click();
    
    // Select all days of the week
    await this.selectAllDays();
    
    // Submit the form
    await this.submitBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.submitBtn.click();
  }

  /**
   * Verifies current step by checking heading text
   * @param {string} expectedHeadingText - The expected heading text
   */
  async verifyStepHeading(expectedHeadingText) {
    await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
    const headingText = await this.pageHeading.textContent();
    if (!headingText.toLowerCase().includes(expectedHeadingText.toLowerCase())) {
      throw new Error(`Expected heading to contain "${expectedHeadingText}", but found "${headingText}"`);
    }
  }
}