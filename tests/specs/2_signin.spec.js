import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import { safeClick, expectTextContains, fullUrl } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

test.describe('User Sign In Flow', () => {
  let testCredentials;

  test.beforeEach(async ({ page }) => {
    // Set default timeout
    test.setTimeout(60000); // 1 minute for sign-in tests

    // Load test credentials from the signup test
    try {
      const credentialsPath = path.join(process.cwd(), 'tests', 'test-credentials.json');
      const credentialsData = fs.readFileSync(credentialsPath, 'utf-8');
      testCredentials = JSON.parse(credentialsData);
      console.log(`Loaded credentials for user: ${testCredentials.username}`);
    } catch (error) {
      console.warn('⚠️ Could not load test credentials. Some tests may fail.');
      // Provide fallback credentials for tests that don't depend on signup
      testCredentials = {
        username: 'test_user',
        password: 'test_password',
        email: 'test@example.com'
      };
    }
  });

  test('Should successfully sign in with valid credentials', async ({ page }) => {
    // Initialize Page Objects 
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);

    try {
      // Navigate to Landing Page 
      await test.step('Navigate to application', async () => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        console.log('✓ Application loaded');
      });

      // Navigate to Sign In Page 
      await test.step('Navigate to sign in page', async () => {
        await landingPage.login.waitFor({ state: 'visible', timeout: 10000 });
        await safeClick(page);
        await landingPage.login.click();
        
        // Verify we're on the sign-in page
        await expect(page).toHaveURL(/login|signin/, { timeout: 10000 });
        console.log('✓ Sign-in page loaded');
      });

      // Fill and Submit Sign In Form 
      await test.step('Fill and submit sign-in form', async () => {
        await safeClick(page);
        await signInPage.fillSignInForm(testCredentials.username, testCredentials.password);
        console.log('✓ Sign-in form submitted');
      });

      // Verify Successful Authentication 
      await test.step('Verify successful authentication', async () => {
        // Wait for success alert
        await expect(page.getByText(/authentication successful/i)).toBeVisible({ 
          timeout: 10000 
        });
        console.log('✓ Authentication successful message displayed');
      });

      // Verify Dashboard Access 
      await test.step('Verify redirect to dashboard', async () => {
        // Wait for redirect to dashboard
        await page.waitForURL(/dashboard/, { timeout: 15000 });
        
        // Verify dashboard title is visible
        await expect(dashboardPage.title).toBeVisible({ timeout: 10000 });
        await expect(dashboardPage.title).toHaveText(/dashboard/i);
        console.log('✓ Successfully redirected to dashboard');
      });

      console.log('\n✅ Valid sign-in test passed!');

    } catch (error) {
      console.error('\n❌ Valid sign-in test failed:', error.message);
      console.error('Current URL:', page.url());
      
      // Take screenshot on failure
      const screenshotPath = `tests/screenshots/signin-valid-failure-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.error(`Screenshot saved to: ${screenshotPath}`);
      
      throw error;
    }
  });

  test('Should fail to sign in with invalid credentials', async ({ page }) => {
    // Initialize Page Objects 
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);

    try {
      // Navigate to Landing Page 
      await test.step('Navigate to application', async () => {
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        console.log('✓ Application loaded');
      });

      // Navigate to Sign In Page 
      await test.step('Navigate to sign in page', async () => {
        await landingPage.login.waitFor({ state: 'visible', timeout: 10000 });
        await safeClick(page);
        await landingPage.login.click();
        
        // Verify we're on the sign-in page
        await expect(page).toHaveURL(/login|signin/, { timeout: 10000 });
        console.log('✓ Sign-in page loaded');
      });

      // Submit Invalid Credentials 
      await test.step('Submit invalid credentials', async () => {
        await safeClick(page);
        
        // Use obviously invalid credentials
        await signInPage.fillSignInForm('invalid_username_12345', 'invalid_password_12345');
        console.log('✓ Invalid credentials submitted');
      });

      // Verify Error Message 
      await test.step('Verify error message is displayed', async () => {
        // Wait for error alert with flexible text matching
        const errorAlert = page.getByText(/login failed|invalid credentials|check your credentials/i);
        await expect(errorAlert).toBeVisible({ timeout: 10000 });
        
        // Get the actual error message
        const errorMessage = await errorAlert.textContent();
        console.log(`✓ Error message displayed: "${errorMessage}"`);
      });

      // Verify No Redirect 
      await test.step('Verify user remains on sign-in page', async () => {
        // User should still be on login page
        await expect(page).toHaveURL(/login|signin/, { timeout: 5000 });
        
        // Sign-in button should still be visible
        await expect(signInPage.signInBtn).toBeVisible();
        console.log('✓ User remains on sign-in page (no redirect)');
      });

      console.log('\n✅ Invalid sign-in test passed!');

    } catch (error) {
      console.error('\n❌ Invalid sign-in test failed:', error.message);
      console.error('Current URL:', page.url());
      
      // Take screenshot on failure
      const screenshotPath = `tests/screenshots/signin-invalid-failure-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.error(`Screenshot saved to: ${screenshotPath}`);
      
      throw error;
    }
  });

  test('Should navigate to forgot password page', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);

    try {
      await test.step('Navigate to sign in page', async () => {
        await page.goto('/');
        await safeClick(page);
        await landingPage.login.click();
        await expect(page).toHaveURL(/login|signin/, { timeout: 10000 });
      });

      await test.step('Click forgot password link', async () => {
        await signInPage.navigateToForgotPassword();
        await expect(page).toHaveURL(/forgot-password/, { timeout: 10000 });
        console.log('✓ Navigated to forgot password page');
      });

      console.log('\n✅ Forgot password navigation test passed!');

    } catch (error) {
      console.error('\n❌ Forgot password test failed:', error.message);
      throw error;
    }
  });

  test('Should navigate to sign up page', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);

    try {
      await test.step('Navigate to sign in page', async () => {
        await page.goto('/');
        await safeClick(page);
        await landingPage.login.click();
        await expect(page).toHaveURL(/login|signin/, { timeout: 10000 });
      });

      await test.step('Click create account link', async () => {
        await signInPage.navigateToSignup();
        await expect(page).toHaveURL(/signup|register/, { timeout: 10000 });
        console.log('✓ Navigated to sign up page');
      });

      console.log('\n✅ Sign up navigation test passed!');

    } catch (error) {
      console.error('\n❌ Sign up navigation test failed:', error.message);
      throw error;
    }
  });
    

  test.afterEach(async ({ page }, testInfo) => {
    // Take screenshot on failure
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = `tests/screenshots/${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    }
  });
});

// ADDITIONAL TEST SCENARIOS 

test.describe('Sign In Edge Cases', () => {
  test('Should show error for empty username', async ({ page }) => {
    const signInPage = new SignInPage(page);
    
    await page.goto('/en/auth/login');
    await signInPage.fillSignInForm('', 'somepassword');
    
    // Assert validation error
    await expect(page.getByText(/username is required/i)).toBeVisible({ timeout: 5000 });
  });

  test('Should show error for empty password', async ({ page }) => {
    const signInPage = new SignInPage(page);
    
    await page.goto('/en/auth/login');
    await signInPage.fillSignInForm('someusername', '');
    
    // Assert validation error
    await expect(page.getByText(/password is required/i)).toBeVisible({ timeout: 5000 });
  });
});