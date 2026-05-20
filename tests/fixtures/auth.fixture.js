/**
 * Authentication Fixture
 * Provides authenticated page instances to eliminate login duplication across tests
 */

import { test as base } from '@playwright/test';
import { LandingPage } from '../../pages/LandingPage.js';
import { SignInPage } from '../../pages/SigninPage.js';
import { safeClick } from '../../utils/helpers.js';
import { TIMEOUTS } from '../../utils/constants.js';
import fs from 'fs';
import path from 'path';

/**
 * Load test credentials from environment or file
 */
function getTestCredentials() {
  // Priority 1: Environment variables
  if (process.env.USER_NAME && process.env.PASSWORD) {
    return {
      username: process.env.USER_NAME,
      password: process.env.PASSWORD
    };
  }

  // Priority 2: Test credentials file
  try {
    const credentialsPath = path.join(process.cwd(), 'tests', 'test-credentials.json');
    if (fs.existsSync(credentialsPath)) {
      const credentialsData = fs.readFileSync(credentialsPath, 'utf-8');
      const creds = JSON.parse(credentialsData);
      console.log(`✓ Loaded credentials for user: ${creds.username}`);
      return {
        username: creds.username,
        password: creds.password
      };
    }
  } catch (error) {
    console.warn('⚠️ Could not load test credentials from file');
  }

  // Fallback: Default credentials (not recommended for production)
  console.warn('⚠️ Using default credentials');
  return {
    username: 'default_user',
    password: 'default_password'
  };
}

/**
 * Perform login with retry logic
 * @param {Page} page - Playwright page object
 * @param {Object} credentials - User credentials
 */
async function performLogin(page, credentials) {
  const landingPage = new LandingPage(page);
  const signInPage = new SignInPage(page);

  // Navigate to app
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  await landingPage.login.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });

  // Navigate to login page with retry logic
  let navigationSuccess = false;
  let attempts = 0;
  const maxAttempts = 3;

  while (!navigationSuccess && attempts < maxAttempts) {
    attempts++;

    try {
      const navigationPromise = page.waitForURL(
        url => url.href.includes('/en/auth/login'),
        { timeout: TIMEOUTS.NAVIGATION_RETRY }
      );

      await landingPage.login.click();
      await navigationPromise;

      // Verify we're on login page
      const currentUrl = page.url();
      if (currentUrl.includes('/en/auth/login')) {
        navigationSuccess = true;
        console.log(`✓ Navigated to login (attempt ${attempts})`);
      }
    } catch (error) {
      if (attempts === maxAttempts) {
        throw new Error(`Failed to navigate to login page after ${maxAttempts} attempts: ${error.message}`);
      }
      console.log(`⚠️ Navigation attempt ${attempts} failed, retrying...`);
      await page.waitForTimeout(TIMEOUTS.DELAY_RETRY);
    }
  }

  // Wait for form and handle cookies
  await signInPage.usernameField.waitFor({ state: 'visible', timeout: TIMEOUTS.ELEMENT_VISIBLE });
  await safeClick(page);

  // Fill and submit login form
  await signInPage.fillSignInForm(credentials.username, credentials.password);

  // Wait for successful login
  await page.waitForURL('/en/dashboard', { timeout: TIMEOUTS.NAVIGATION });
  console.log('✓ User signed in successfully');
}

/**
 * Extended test with authentication fixture
 */
export const test = base.extend({
  /**
   * Authenticated page - automatically logs in before each test
   */
  authenticatedPage: async ({ page }, use) => {
    const credentials = getTestCredentials();
    await performLogin(page, credentials);
    await use(page);
    // Cleanup happens automatically
  },

  /**
   * Credentials - provides test credentials to tests that need them
   */
  credentials: async ({}, use) => {
    const creds = getTestCredentials();
    await use(creds);
  }
});

export { expect } from '@playwright/test';
