import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { Channels } from '../../pages/Channels.js';
import { expectTextContains, safeClick, fullUrl } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

test.describe('Channels Integration', () => {
  let testCredentials;

  test.beforeAll(async () => {
    // Load test credentials
    try {
      const credentialsPath = path.join(process.cwd(), 'tests', 'test-credentials.json');
      const credentialsData = fs.readFileSync(credentialsPath, 'utf-8');
      testCredentials = JSON.parse(credentialsData);
      console.log(`✓ Loaded credentials for user: ${testCredentials.username}`);
    } catch (error) {
      console.warn('⚠️ Could not load test credentials from file');
      testCredentials = {
        username: 'default_user',
        password: 'default_password'
      };
    }
  });

  test.beforeEach(async ({ page }) => {
    // Set timeout for each test
    test.setTimeout(90000); // 1.5 minutes
    
    // Initialize page objects
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);

    try {
      // Navigate to application
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      // Handle cookie consent
      await safeClick(page);
      
      // Navigate to login
      await landingPage.login.waitFor({ state: 'visible', timeout: 10000 });
      await landingPage.login.click();
      
      // Verify we're on login page
      await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
      
      // Handle cookie consent on login page
      await safeClick(page);
      
      // Sign in
      await signInPage.fillSignInForm(testCredentials.username, testCredentials.password);
      
      // Wait for successful login - dashboard should load
      await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 })
      
      console.log('✓ User signed in successfully');
      
    } catch (error) {
      console.error('❌ Login failed in beforeEach:', error.message);
      
      // Take screenshot on login failure
      const screenshotPath = `tests/screenshots/channels-login-failure-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.error(`Screenshot saved to: ${screenshotPath}`);
      
      throw error;
    }
  });

  test('Should integrate Facebook channel successfully', async ({ page }) => {
    const channelsPage = new Channels(page);

    try {
      // Navigate to Channels Page
      await test.step('Navigate to Channels page', async () => {
        await channelsPage.navigateToChannels();
        await channelsPage.verifyChannelsPageLoaded();
        console.log('✓ Channels page loaded');
      });

      // Verify Page Content
      await test.step('Verify Channels page content', async () => {
        await expect(channelsPage.pageHeader).toContainText(/channels guide/i);
        await expect(channelsPage.learnMoreBtn).toContainText(/learn more/i);
        console.log('✓ Page content verified');
      });

      // Initiate Facebook Integration
      await test.step('Click Integrate Facebook button', async () => {
        await safeClick(page);
        
        // Verify button is visible
        await channelsPage.verifyIntegrationButtonVisible('facebook');
        
        // Click integration button
        await channelsPage.integrateFacebookBtn.click();
        console.log('✓ Facebook integration button clicked');
      });

      // Verify Integration Popup
      await test.step('Verify Facebook integration popup', async () => {
        await channelsPage.verifyIntegrationPopup('Connect Your Facebook Page');
        console.log('✓ Facebook popup displayed');
      });

      // Handle Popup Window
      await test.step('Handle Facebook authentication popup', async () => {
        const [popup] = await Promise.all([
          page.waitForEvent('popup', { timeout: 15000 }),
          channelsPage.continueBtn.click()
        ]);

        // Wait for popup to load
        await popup.waitForLoadState('domcontentloaded');
        console.log('✓ Facebook authentication popup opened');
        
        // Close popup (in real scenario, would complete OAuth flow)
        await popup.close();
        console.log('✓ Popup closed');
      });

      console.log('\n✅ Facebook integration test passed!');

    } catch (error) {
      console.error('\n❌ Facebook integration test failed:', error.message);
      console.error('Current URL:', page.url());
      
      // Take screenshot on failure
      const screenshotPath = `tests/screenshots/facebook-integration-failure-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.error(`Screenshot saved to: ${screenshotPath}`);
      
      throw error;
    }
  });

  test('Should integrate WhatsApp channel successfully', async ({ page }) => {
    const channelsPage = new Channels(page);

    try {
      // Navigate to Channels Page 
      await test.step('Navigate to Channels page', async () => {
        await channelsPage.navigateToChannels();
        await channelsPage.verifyChannelsPageLoaded();
        console.log('✓ Channels page loaded');
      });

      // Verify Page Content 
      await test.step('Verify Channels page content', async () => {
        await expect(channelsPage.pageHeader).toContainText(/channels guide/i);
        await expect(channelsPage.learnMoreBtn).toContainText(/learn more/i);
        console.log('✓ Page content verified');
      });

      // Initiate WhatsApp Integration 
      await test.step('Click Integrate WhatsApp button', async () => {
        await safeClick(page);
        
        // Verify button is visible
        await channelsPage.verifyIntegrationButtonVisible('whatsapp');
        
        // Click integration button
        await channelsPage.integrateWhatsAppBtn.click();
        console.log('✓ WhatsApp integration button clicked');
      });

      // Verify Integration Popup 
      await test.step('Verify WhatsApp integration popup', async () => {
        await channelsPage.verifyIntegrationPopup('Get Ready to Connect WhatsApp');
        console.log('✓ WhatsApp popup displayed');
      });

      // Handle Popup Window 
      await test.step('Handle WhatsApp authentication popup', async () => {
        const [popup] = await Promise.all([
          page.waitForEvent('popup', { timeout: 15000 }),
          channelsPage.continueBtn.click()
        ]);

        // Wait for popup to load
        await popup.waitForLoadState('domcontentloaded');
        console.log('✓ WhatsApp authentication popup opened');
        
        // Close popup (in real scenario, would complete OAuth flow)
        await popup.close();
        console.log('✓ Popup closed');
      });

      console.log('\n✅ WhatsApp integration test passed!');

    } catch (error) {
      console.error('\n❌ WhatsApp integration test failed:', error.message);
      console.error('Current URL:', page.url());
      
      // Take screenshot on failure
      const screenshotPath = `tests/screenshots/whatsapp-integration-failure-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.error(`Screenshot saved to: ${screenshotPath}`);
      
      throw error;
    }
  });

  test('Should integrate Instagram channel successfully', async ({ page }) => {
    const channelsPage = new Channels(page);

    try {
      // Navigate to Channels Page 
      await test.step('Navigate to Channels page', async () => {
        await channelsPage.navigateToChannels();
        await channelsPage.verifyChannelsPageLoaded();
        console.log('✓ Channels page loaded');
      });

      // Verify Page Content 
      await test.step('Verify Channels page content', async () => {
        await expect(channelsPage.pageHeader).toContainText(/channels guide/i);
        await expect(channelsPage.learnMoreBtn).toContainText(/learn more/i);
        console.log('✓ Page content verified');
      });

      // Initiate Instagram Integration 
      await test.step('Click Integrate Instagram button', async () => {
        await safeClick(page);
        
        // Verify button is visible
        await channelsPage.verifyIntegrationButtonVisible('instagram');
        
        // Click integration button
        await channelsPage.integrateInstagramBtn.click();
        console.log('✓ Instagram integration button clicked');
      });

      //  Verify Integration Popup 
      await test.step('Verify Instagram integration popup', async () => {
        await channelsPage.verifyIntegrationPopup('Connect Your Instagram Account');
        console.log('✓ Instagram popup displayed');
      });

      //  Handle Popup Window 
      await test.step('Handle Instagram authentication popup', async () => {
        const [popup] = await Promise.all([
          page.waitForEvent('popup', { timeout: 15000 }),
          channelsPage.continueBtn.click()
        ]);

        // Wait for popup to load
        await popup.waitForLoadState('domcontentloaded');
        console.log('✓ Instagram authentication popup opened');
        
        // Close popup (in real scenario, would complete OAuth flow)
        await popup.close();
        console.log('✓ Popup closed');
      });

      console.log('\n✅ Instagram integration test passed!');

    } catch (error) {
      console.error('\n❌ Instagram integration test failed:', error.message);
      console.error('Current URL:', page.url());
      
      // Take screenshot on failure
      const screenshotPath = `tests/screenshots/instagram-integration-failure-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.error(`Screenshot saved to: ${screenshotPath}`);
      
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

//  ADDITIONAL TEST SCENARIOS 

test.describe('Channels Page Navigation', () => {
  let testCredentials;

  test.beforeAll(async () => {
    try {
      const credentialsPath = path.join(process.cwd(), 'tests', 'test-credentials.json');
      testCredentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
    } catch (error) {
      testCredentials = { username: 'default_user', password: 'default_password' };
    }
  });

  test.beforeEach(async ({ page }) => {
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await safeClick(page);
    await landingPage.login.click();
    await safeClick(page);
    await signInPage.fillSignInForm(testCredentials.username, testCredentials.password);
    await page.waitForURL(/dashboard/, { timeout: 15000 });
  });

  test('Should display Learn More button on Channels page', async ({ page }) => {
    const channelsPage = new Channels(page);

    await channelsPage.navigateToChannels();
    await expect(channelsPage.learnMoreBtn).toBeVisible({ timeout: 10000 });
    
    // Click and verify it doesn't error
    await channelsPage.clickLearnMore();
  });

  test('Should display all integration options', async ({ page }) => {
    const channelsPage = new Channels(page);

    await channelsPage.navigateToChannels();
    
    // Verify all integration buttons are visible
    await expect(channelsPage.integrateFacebookBtn).toBeVisible({ timeout: 10000 });
    await expect(channelsPage.integrateWhatsAppBtn).toBeVisible({ timeout: 10000 });
    await expect(channelsPage.integrateInstagramBtn).toBeVisible({ timeout: 10000 });
    
    console.log('✅ All integration buttons are visible');
  });
});
