export class Channels {
  constructor(page) {
    this.page = page;
    
    // Navigation Elements
    this.mobileMenuButton = page.getByRole('button', { name: /menu/i })
      .or(page.locator('button.xl\\:hidden svg').locator('..'));
    this.channelsMenuItem = page.getByRole('button', { name: /channels/i })
      .or(page.getByText(/channels/i).first());
    
    // Page Headers
    this.pageHeader = page.getByRole('heading', { name: /channels guide/i })
      .or(page.locator('h1:has-text("Channels Guide")'));
    this.popupHeader = page.locator('div[class*="text-center"][class*="font-bold"]')
      .or(page.locator('div.text-lg.font-bold, div.text-xl.font-bold'));
    
    // Buttons
    this.learnMoreBtn = page.getByRole('button', { name: /learn more/i })
      .or(page.locator('button:has-text("Learn More")'));
    
    // Integration Buttons - Using semantic locators
    this.integrateFacebookBtn = page.getByRole('button', { name: /integrate facebook/i })
      .or(page.locator('button:has-text("Integrate Facebook")'));
    this.integrateWhatsAppBtn = page.getByRole('button', { name: /integrate whatsapp/i })
      .or(page.locator('button:has-text("Integrate WhatsApp")'));
    this.integrateInstagramBtn = page.getByRole('button', { name: /integrate instagram/i })
      .or(page.locator('button:has-text("Integrate Instagram")'));
    
    this.addAnotherAccountBtn = page.getByRole('button', { name: /add another account/i })
      .or(page.locator('button:has-text("Add Another Account")'));
    
    // Popup/Modal Buttons
    this.continueBtn = page.getByRole('button', { name: /^continue$/i })
      .or(page.locator('button:has-text("Continue")'));
    
    // User Profile Elements
    this.userProfileName = page.getByRole('heading', { name: /test hub/i, level: 6 })
      .or(page.locator('h6:has-text("Test Hub")'));
    this.showMoreButton = page.locator('.cursor-pointer.text-2xl')
      .or(page.getByRole('button', { name: /show more|more options/i }));
    this.logoutBtn = page.getByRole('button', { name: /logout/i })
      .or(page.locator('button:has-text("Logout")'));
    
    // Toggle Switch
    this.toggleSwitch = page.locator('[role="switch"]')
      .or(page.locator('div[class*="peer-focus"]').first());
    
    // Facebook Integration Elements (for popup/new window)
    this.facebookEmailField = page.locator('#email');
    this.facebookPasswordField = page.locator('#pass');
    this.facebookLoginBtn = page.getByRole('button', { type: 'submit' })
      .or(page.locator('button[type="submit"]'));
    this.facebookRadioBtn = page.locator('input[value="false"]');
    this.facebookContinueBtn = page.getByRole('button', { name: /continue/i })
      .or(page.locator('div:has-text("Continue")'));
    this.facebookSaveBtn = page.getByRole('button', { name: /save/i })
      .or(page.locator('div:has-text("Save")'));
    this.facebookGotItBtn = page.getByRole('button', { name: /got it/i })
      .or(page.locator('div[class*="x8t9es0"]'));
  }

  /**
   * Navigates to the Channels page from anywhere in the app
   */
  async navigateToChannels() {
    await this.channelsMenuItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.channelsMenuItem.click();
    
    // Wait for page to load
    await this.pageHeader.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Verifies the Channels page is loaded
   */
  async verifyChannelsPageLoaded() {
    await this.pageHeader.waitFor({ state: 'visible', timeout: 10000 });
    await this.learnMoreBtn.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Clicks on Learn More button
   */
  async clickLearnMore() {
    await this.learnMoreBtn.click();
  }

  /**
   * Initiates Facebook integration flow
   * @returns {Promise<Page>} Returns the popup window
   */
  async integrateFacebook() {
    await this.integrateFacebookBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.integrateFacebookBtn.click();
    
    // Wait for popup header
    await this.popupHeader.waitFor({ state: 'visible', timeout: 5000 });
    
    // Click continue and wait for popup
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup', { timeout: 15000 }),
      this.continueBtn.click()
    ]);
    
    await popup.waitForLoadState('domcontentloaded');
    return popup;
  }

  /**
   * Initiates WhatsApp integration flow
   * @returns {Promise<Page>} Returns the popup window
   */
  async integrateWhatsApp() {
    await this.integrateWhatsAppBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.integrateWhatsAppBtn.click();
    
    // Wait for popup header
    await this.popupHeader.waitFor({ state: 'visible', timeout: 5000 });
    
    // Click continue and wait for popup
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup', { timeout: 15000 }),
      this.continueBtn.click()
    ]);
    
    await popup.waitForLoadState('domcontentloaded');
    return popup;
  }

  /**
   * Initiates Instagram integration flow
   * @returns {Promise<Page>} Returns the popup window
   */
  async integrateInstagram() {
    await this.integrateInstagramBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.integrateInstagramBtn.click();
    
    // Wait for popup header
    await this.popupHeader.waitFor({ state: 'visible', timeout: 5000 });
    
    // Click continue and wait for popup
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup', { timeout: 15000 }),
      this.continueBtn.click()
    ]);
    
    await popup.waitForLoadState('domcontentloaded');
    return popup;
  }

  /**
   * Verifies integration popup is displayed
   * @param {string} expectedText - Expected text in popup header
   */
  async verifyIntegrationPopup(expectedText) {
    await this.popupHeader.waitFor({ state: 'visible', timeout: 5000 });
    const headerText = await this.popupHeader.textContent();
    
    if (!headerText.toLowerCase().includes(expectedText.toLowerCase())) {
      throw new Error(`Expected popup header to contain "${expectedText}", but found "${headerText}"`);
    }
  }

  /**
   * Completes Facebook login in popup window
   * @param {Page} popup - The popup window
   * @param {string} email - Facebook email
   * @param {string} password - Facebook password
   */
  async completeFacebookLogin(popup, email, password) {
    // Wait for Facebook login page
    await popup.locator('#email').waitFor({ state: 'visible', timeout: 10000 });
    
    // Fill credentials
    await popup.locator('#email').fill(email);
    await popup.locator('#pass').fill(password);
    
    // Click login
    await popup.locator('button[type="submit"]').click();
    
    // Wait for redirect or next step
    await popup.waitForLoadState('domcontentloaded');
  }

  /**
   * Handles Facebook permissions dialog
   * @param {Page} popup - The popup window
   */
  async handleFacebookPermissions(popup) {
    try {
      // Wait for radio button to appear
      await popup.locator('input[value="false"]').waitFor({ 
        state: 'visible', 
        timeout: 5000 
      });
      await popup.locator('input[value="false"]').click();
      
      // Click continue
      await popup.getByText(/continue/i).click();
      
      // Click save
      await popup.getByText(/save/i).click();
      
      // Handle "Got it" button if present
      await popup.getByRole('button', { name: /got it/i }).click({ timeout: 3000 });
    } catch (error) {
      console.log('Some Facebook permission steps were not found or already completed');
    }
  }

  /**
   * Toggles a setting switch
   */
  async toggleSetting() {
    await this.toggleSwitch.click();
  }

  /**
   * Logs out from the application
   */
  async logout() {
    // Click show more if needed
    try {
      await this.showMoreButton.click({ timeout: 3000 });
    } catch (error) {
      console.log('Show more button not needed');
    }
    
    // Click logout
    await this.logoutBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.logoutBtn.click();
  }

  /**
   * Adds another account for integration
   */
  async addAnotherAccount() {
    await this.addAnotherAccountBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.addAnotherAccountBtn.click();
  }

  /**
   * Verifies a specific integration button is visible
   * @param {string} platform - Platform name (facebook, whatsapp, instagram)
   */
  async verifyIntegrationButtonVisible(platform) {
    const buttonMap = {
      facebook: this.integrateFacebookBtn,
      whatsapp: this.integrateWhatsAppBtn,
      instagram: this.integrateInstagramBtn
    };
    
    const button = buttonMap[platform.toLowerCase()];
    if (!button) {
      throw new Error(`Unknown platform: ${platform}`);
    }
    
    await button.waitFor({ state: 'visible', timeout: 10000 });
  }
}