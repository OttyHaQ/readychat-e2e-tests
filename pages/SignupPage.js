import { safeClick } from "../utils/helpers";

export class SignUpPage {
  constructor(page) {
    this.page = page;
    
    // Form Fields - Using more stable locators
    this.usernameField = page.locator('#username');
    this.passwordField = page.locator('#password');
    this.confirmPasswordField = page.locator('#confirmPassword');
    this.emailField = page.locator('#email');
    
    // Checkboxes and Buttons
    this.privacyPolicyCheckbox = page.getByText('I agree to ReadyChatAI\'s Terms of Service and Privacy Policy');
    this.getStartedBtn = page.getByRole('button', { name: /get started for free/i });
    
    // Social Login Buttons
    this.facebookBtn = page.getByRole('button', { name: /facebook/i });
    this.googleBtn = page.getByRole('button', { name: /google/i })
      .or(page.locator('button:has-text("Google")')); // Fallback locator
    
    // Navigation Links
    this.signInLink = page.getByRole('link', { name: /sign in/i })
      .or(page.locator('a.font-bold.text-primary.underline'));
    
    // Email Verification Elements (Mailinator)
    this.publicInboxLink = page.getByRole('link', { name: /public mailinator/i })
      .or(page.locator('.inbox-link'));
    this.inboxSearchField = page.locator('#inbox_field');
    this.goButton = page.getByRole('button', { name: /go/i })
      .or(page.locator('.primary-btn'));
    this.verificationEmail = page.getByRole('row', { name: /automated_noreply/i })
      .or(page.locator('td:has-text("automated_noreply")'));
    
    // Cookie Consent
    this.cookieDeclineBtn = page.getByRole('button', { name: /decline/i })
      .or(page.locator('#CybotCookiebotDialogBodyButtonDecline'));
    
    // Default password
    this.defaultPassword = 'P@ssword01';
  }

  /**
   * Generates a unique username for testing
   * @returns {string} A unique username with random suffix
   */
  generateUsername() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 7);
    return `Test_Business_${timestamp}_${randomString}`;
  }

  /**
   * Generates email based on username
   * @param {string} username - The username to use
   * @returns {string} Email address for testing
   */
  generateEmail(username) {
    return `${username}@mailinator.com`;
  }

  /**
   * Handles cookie consent banner if present
   */
  async handleCookieConsent() {
    try {
      await this.cookieDeclineBtn.click({ timeout: 3000 });
    } catch (error) {
      // Cookie banner not present or already handled
      console.log('Cookie consent banner not found or already handled');
    }
  }

  /**
   * Fills out the signup form with provided credentials
   * @param {string} username - Username for the account
   * @param {string} password - Password for the account
   * @param {string} email - Email address for the account
   */
  async fillSignUpForm(username, password, email) {
    // Handle cookie consent
    await this.handleCookieConsent();
    
    // Wait for form to be ready
    await this.usernameField.waitFor({ state: 'visible', timeout: 10000 });
    
    // Fill form fields
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.confirmPasswordField.fill(password);
    await this.emailField.fill(email);
    
    // Accept privacy policy
    await this.privacyPolicyCheckbox.click();
    
    // Submit form
    await this.getStartedBtn.click();
  }

  /**
   * Verifies email using Mailinator service
   * @param {string} username - Username to search for in inbox
   */
  async verifyEmail(username) {
    // Navigate to public inbox
    await this.publicInboxLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.publicInboxLink.click();
    
    // Search for the inbox
    await this.inboxSearchField.waitFor({ state: 'visible' });
    await this.inboxSearchField.fill(username);
    await this.goButton.click();
    
    // Wait for emails to load
    await this.page.waitForTimeout(2000);
    
    // Click on the verification email
    await this.verificationEmail.last().waitFor({ state: 'visible', timeout: 10000 });
    await this.verificationEmail.last().click();
    
    // Handle the verification link in iframe
    const frame = this.page.frameLocator('#html_msg_body');
    const confirmBtn = frame.getByRole('link', { name: /confirm email/i })
      .or(frame.locator('a:has-text("Confirm Email")'));
    
    // Wait for the button to be visible in the frame
    await confirmBtn.waitFor({ state: 'visible', timeout: 10000 });
    
    // Click and handle popup
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup', { timeout: 15000 }),
      confirmBtn.click()
    ]);
    
    // Wait for popup to process
    await popup.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
    
    // Close popup
    await popup.close();
  }

  /**
   * Navigates to sign in page
   */
  async navigateToSignIn() {
    await this.signInLink.click();
  }

  /**
   * Verifies that signup was successful by checking for expected URL or element
   * @param {string} expectedUrl - The URL fragment to verify
   */
  async verifySignupSuccess(expectedUrl) {
    await this.page.waitForURL(`**/${expectedUrl}`, { timeout: 10000 });
  }
}