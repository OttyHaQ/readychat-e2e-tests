import { expect } from '@playwright/test';
import { safeClick } from '../utils/helpers';

export class SignInPage {
  constructor(page) {
    this.page = page;
    
    // Page Elements - Using semantic locators with fallbacks
    this.pageTitle = page.getByRole('heading', { name: /sign in/i })
      .or(page.locator('h4.text-2xl.font-bold'));
    
    // Form Fields
    this.usernameField = page.locator('#username')
      .or(page.getByLabel(/username/i));
    this.passwordField = page.locator('#password')
      .or(page.getByRole('textbox', { name: 'Password*' }));
    
    // Checkbox - "Remember me" or similar
    this.rememberMeCheckbox = page.getByRole('checkbox')
      .or(page.locator('div[class*="border-2 rounded-md"]'));
    
    // Buttons - Using role-based locators
    this.signInBtn = page.getByRole('button', { name: /sign in/i })
      .or(page.locator('button:has-text("Sign in")'));
    
    // Social Login Buttons
    this.facebookBtn = page.getByRole('button', { name: /facebook/i })
      .or(page.locator('button:has-text("Continue with Facebook")'));
    this.googleBtn = page.getByRole('button', { name: /google/i })
      .or(page.locator('button:has-text("Continue with Google")'));
    
    // Links
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password/i })
      .or(page.locator('a[href*="forgot-password"]'));
    this.createAccountLink = page.getByRole('link', { name: /Create One/i })
      .or(page.locator('a.font-bold.text-primary.underline'));
    
    // Alert/Error Messages
    this.successAlert = page.getByText(/authentication successful/i)
      .or(page.locator('[role="alert"]:has-text("successful")'));
    this.errorAlert = page.getByText(/login failed|invalid credentials/i)
      .or(page.locator('[role="alert"]:has-text("failed")'));
    this.generalAlert = page.locator('[role="alert"]')
      .or(page.locator('div[class*="alert"]'));
    
    // Cookie Consent
    this.cookieDeclineBtn = page.getByRole('button', { name: /decline/i })
      .or(page.locator('#CybotCookiebotDialogBodyButtonDecline'));
  }

  /**
   * Handles cookie consent banner if present
   */
  async handleCookieConsent() {
    try {
      await this.cookieDeclineBtn.click({ timeout: 3000 });
      console.log('✓ Cookie consent declined');
    } catch (error) {
      // Cookie banner not present or already handled
      console.log('Cookie consent banner not found or already handled');
    }
  }

  /**
   * Fills and submits the sign-in form
   * @param {string} username - Username or email
   * @param {string} password - User password
   */
  async fillSignInForm(username, password) {
    // Handle cookie consent first
    await this.handleCookieConsent();
    
    // Wait for form to be ready
    await this.usernameField.waitFor({ state: 'visible', timeout: 10000 });
    
    // Fill credentials
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    
    // Click sign in button
    await this.signInBtn.click();
  }

  /**
   * Fills sign-in form with "Remember Me" option
   * @param {string} username - Username or email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to check "Remember Me"
   */
  async fillSignInFormWithRememberMe(username, password, rememberMe = false) {
    await this.handleCookieConsent();
    
    await this.usernameField.waitFor({ state: 'visible', timeout: 10000 });
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    
    if (rememberMe) {
      try {
        await this.rememberMeCheckbox.check({ timeout: 3000 });
      } catch (error) {
        console.log('Remember me checkbox not found');
      }
    }
    
    await this.signInBtn.click();
  }

  /**
   * Verifies successful login by checking for success message
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   */
  async verifySuccessfulLogin(timeout = 10000) {
    await expect(this.successAlert).toBeVisible({ timeout });
  }

  /**
   * Verifies failed login by checking for error message
   * @param {number} timeout - Timeout in milliseconds (default: 10000)
   */
  async verifyFailedLogin(timeout = 10000) {
    await expect(this.errorAlert).toBeVisible({ timeout });
  }

  /**
   * Verifies that user is redirected to expected URL after login
   * @param {string} expectedUrl - Expected URL pattern or exact URL
   * @param {number} timeout - Timeout in milliseconds (default: 15000)
   */
  async verifyLoginRedirect(expectedUrl, timeout = 15000) {
    await this.page.waitForURL(expectedUrl, { timeout });
  }

  /**
   * Gets the alert message text
   * @returns {Promise<string>} Alert message text
   */
  async getAlertMessage() {
    try {
      await this.generalAlert.waitFor({ state: 'visible', timeout: 5000 });
      return await this.generalAlert.textContent();
    } catch (error) {
      return null;
    }
  }

  /**
   * Clicks on "Forgot Password" link
   */
  async navigateToForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL(/forgot-password/, { timeout: 10000 });
  }

  /**
   * Clicks on "Create Account" link
   */
  async navigateToSignup() {
    await this.createAccountLink.click();
    await this.page.waitForURL(/signup|register/, { timeout: 10000 });
  }

  /**
   * Attempts to sign in with Facebook
   */
  async signInWithFacebook() {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup', { timeout: 15000 }),
      this.facebookBtn.click()
    ]);
    return popup;
  }

  /**
   * Attempts to sign in with Google
   */
  async signInWithGoogle() {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup', { timeout: 15000 }),
      this.googleBtn.click()
    ]);
    return popup;
  }

  /**
   * Verifies that the sign-in page is loaded
   */
  async verifyPageLoaded() {
    await this.pageTitle.waitFor({ state: 'visible', timeout: 10000 });
    await this.signInBtn.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Clears the sign-in form fields
   */
  async clearForm() {
    await this.usernameField.clear();
    await this.passwordField.clear();
  }
}