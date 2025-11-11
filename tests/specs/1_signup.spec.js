import { test, expect } from '@playwright/test';
import { safeClick, expectTextContains, fullUrl } from '../../utils/helpers.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { SignUpPage } from '../../pages/SignupPage.js';
import { SignInPage } from '../../pages/SigninPage.js';
import { OnboardingPage } from '../../pages/OnboardingPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import fs from 'fs';
import path from 'path';

test.describe('User Signup Flow', () => {
  let testCredentials;

  test.beforeEach(async ({ page }) => {
    // Set default timeout for this test
    test.setTimeout(120000); // 2 minutes for the entire test
  });

  test('Complete user signup and onboarding workflow', async ({ page }) => {
    // Initialize Page Objects
    const landingPage = new LandingPage(page);
    const signupPage = new SignUpPage(page);
    const signinPage = new SignInPage(page);
    const onboardingPage = new OnboardingPage(page);
    const dashboardPage = new DashboardPage(page);

    // Generate Test Data 
    const username = signupPage.generateUsername();
    const email = signupPage.generateEmail(username);
    const password = 'P@ssword01';

    console.log(`Test User Created: ${username}`);
    console.log(`Test Email: ${email}`);

    // Store credentials for potential reuse or debugging
    testCredentials = { username, email, password };

    try {
      // Navigate to Application 
      await test.step('Navigate to landing page', async () => {
        await page.goto('/');
        await landingPage.getStarted.waitFor({ state: 'visible', timeout: 10000 });
      });

      // Access Signup Page 
      await test.step('Navigate to signup page', async () => {
        await safeClick(page);
        await landingPage.clickGetStarted();
        
      // Verify we're on the signup page
        await expect(page).toHaveURL('/en/auth/signup', { timeout: 10000 });
      });

      // Complete Signup Form 
      await test.step('Fill and submit signup form', async () => {
        await signupPage.fillSignUpForm(username, password, email);
        await page.waitForTimeout(5000);
        
        // Verify signup submission
        await expect(page).toHaveURL(fullUrl('en/onboarding'), { timeout: 10000 });
        console.log('✓ Signup form submitted successfully, redirected to Onboarding flow');
      });

      // Save Test Credentials
      await test.step('Save test credentials to file', async () => {
        const credentialsPath = path.join(process.cwd(), 'tests', 'test-credentials.json');
        const credentialsDir = path.dirname(credentialsPath);
        
        // Ensure directory exists
        if (!fs.existsSync(credentialsDir)) {
          fs.mkdirSync(credentialsDir, { recursive: true });
        }
        
        fs.writeFileSync(
          credentialsPath,
          JSON.stringify(testCredentials, null, 2)
        );
        console.log(`✓ Credentials saved to ${credentialsPath}`);
      });

      // // Verify Email via Mailinator 
      // await test.step('Verify email address', async () => {
      //   await page.goto('https://www.mailinator.com/');
      //   await signupPage.verifyEmail(username);
      //   console.log('✓ Email verified successfully');
      // });

      // // Sign In with Verified Account 
      // await test.step('Sign in with verified credentials', async () => {
      //   await page.goto(fullUrl('/en/auth/login'));
      //   await safeClick(page);
      //   await signinPage.fillSignInForm(username, password);
        
      //   // Verify redirect to onboarding
      //   await expect(page).toHaveURL(fullUrl('/en/onboarding'), { timeout: 10000 });
      //   console.log('✓ Signed in successfully');
      // });

      // Complete Onboarding - Personal Details 
      await test.step('Complete personal details step', async () => {
        await expect(onboardingPage.configAccountHeading).toContainText(
          /configure your account/i,
          { timeout: 10000 }
        );
        
        await onboardingPage.completePersonalDetails(username);
        console.log('✓ Personal details completed');
      });

      //  Complete Onboarding - Business Info 
      await test.step('Complete business information step', async () => {
        // Verify we're on the business info step
        await onboardingPage.waitForStepHeading('business information');
        
        await onboardingPage.completeBusinessInfo(username, email);
        console.log('✓ Business information completed');
      });

      // Complete Onboarding - Bot Settings 
      await test.step('Complete bot settings step', async () => {
        // Verify we're on the bot settings step
        await expectTextContains(
          onboardingPage.pageHeading,
          'Set up your business tone',
          { timeout: 10000 }
        );
        
        await onboardingPage.completeBotSettings();
        console.log('✓ Bot settings configured');
      });

      // Complete Onboarding - Business Schedule 
      await test.step('Complete business schedule step', async () => {
        // Verify we're on the business schedule step
        await expectTextContains(
          onboardingPage.pageHeading,
          'Configure your business hours',
          { timeout: 10000 }
        );
        
        await onboardingPage.completeBusinessSchedule();
        console.log('✓ Business schedule configured');
      });

      await test.step('Wait and click Go Now button', async () => {
        // Wait and click Go Now button
        await onboardingPage.goNowBtn.waitFor({ state: 'visible', timeout: 30000 });
        await onboardingPage.goNowBtn.click();
        console.log('✓ Go now button clicked');
        
      });


      // Verify Dashboard Access 
      await test.step('Verify successful onboarding and dashboard access', async () => {
        // Wait for redirect to dashboard
        await expect(page).toHaveURL(fullUrl('en/dashboard'), { timeout: 10000 });
        
        // Verify dashboard elements
        await expect(dashboardPage.title).toHaveText('Dashboard', { timeout: 10000 });
        console.log('✓ Dashboard loaded successfully');
      });

      // Sign Out 
      await test.step('Sign out of application', async () => {
        await dashboardPage.signOut();
        console.log('✓ Signed out successfully');
        
        // Verify redirect to login or landing page
        await expect(page).toHaveURL('en/auth/login', { timeout: 10000 });
      });

      console.log('\n✅ Complete signup and onboarding workflow test passed!');

    } catch (error) {
      // Enhanced error reporting
      console.error('\n❌ Test failed at step:', error.message);
      console.error('Current URL:', page.url());
      console.error('Test credentials:', testCredentials);
      
      // Take screenshot on failure
      const screenshotPath = `tests/screenshots/signup-failure-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.error(`Screenshot saved to: ${screenshotPath}`);
      
      throw error;
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Cleanup: Take screenshot on failure
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = `tests/screenshots/${testInfo.title}-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`Screenshot saved: ${screenshotPath}`);
    }
  });
});
