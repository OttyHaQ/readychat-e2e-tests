import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick, expectTextContains, fullUrl } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

test.describe('AI Bot Configuration', () => {
    const testCredentials = {
        username: process.env.USER_NAME || 'default_user',
        password: process.env.PASSWORD || 'default_password'
    };

  test.beforeAll(async () => {
        // Load test credentials
        try {
        console.log(`✓ Loaded credentials for user: ${testCredentials.username}`);
        } catch (error) {
        console.warn('⚠️ environment variables not available');
        }
   });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000); // 2 minutes for configure tests

    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);

    try {
      // Navigate and sign in
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      await landingPage.login.waitFor({ state: 'visible', timeout: 10000 });
      await landingPage.login.click();
      
      await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
      await safeClick(page);
      
      await signInPage.fillSignInForm(testCredentials.username, testCredentials.password);
      await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 })
      
      console.log('✓ User signed in successfully');
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  });

  test('Should update general configuration settings', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Configure page', async () => {
        await aiBotPage.navigateToConfigure();
        await safeClick(page);
        console.log('✓ Configure page loaded');
      });

      await test.step('Update professional info and AI tone', async () => {
        // Clear and fill professional info
        await aiBotPage.professionalInfoField.waitFor({ state: 'visible', timeout: 10000 });
        await aiBotPage.professionalInfoField.clear();
        await aiBotPage.professionalInfoField.fill('Welcome to Testhub! How can we help you today?');
        
        // Clear and fill AI tone
        await aiBotPage.aiToneField.clear();
        await aiBotPage.aiToneField.fill('Customer-friendly and professional');
        console.log('✓ Text fields updated');
      });

      await test.step('Toggle all general settings', async () => {
        await aiBotPage.toggleAllGeneralSettings();
        console.log('✓ All toggles clicked');
      });

      await test.step('Select AI model', async () => {
        await aiBotPage.aiModel1Radio.click();
        await aiBotPage.aiModel2Radio.click();
        console.log('✓ AI models toggled');
      });

      await test.step('Save configuration', async () => {
        await aiBotPage.saveBtn.click();
        
        // Wait for success alert
        await aiBotPage.alert.waitFor({ state: 'visible', timeout: 10000 });
        await expect(aiBotPage.alert.first()).toContainText(/successfully/i);
        console.log('✓ Configuration saved successfully');
      });

      console.log('\n✅ General configuration test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should toggle auto-reply on and off', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Configure page', async () => {
        await aiBotPage.navigateToConfigure();
        await safeClick(page);
      });

      await test.step('Turn off auto-reply', async () => {
        await aiBotPage.autoReplyNoBtn.waitFor({ state: 'visible', timeout: 10000 });
        await aiBotPage.autoReplyNoBtn.click();
        await page.waitForTimeout(3000);
        
        // Wait for success message
        await aiBotPage.alert.first().waitFor({ state: 'visible', timeout: 10000 });
        await expect(aiBotPage.alert.first()).toContainText(/successfully/i);
        console.log('✓ Auto-reply turned off');
      });

      await page.waitForTimeout(5000);

      await test.step('Turn on auto-reply', async () => {
        await aiBotPage.autoReplyYesBtn.click();
        await page.waitForTimeout(3000);
        
        // Wait for success message
        await aiBotPage.alert.first().waitFor({ state: 'visible', timeout: 10000 });
        await expect(aiBotPage.alert.first()).toContainText(/successfully/i);
        console.log('✓ Auto-reply turned on');
      });

      console.log('\n✅ Auto-reply toggle test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should create Facebook auto-reply rule', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Configure page', async () => {
        await aiBotPage.navigateToConfigure();
        await safeClick(page);
      });

      await test.step('Enable auto-reply', async () => {
        await aiBotPage.autoReplyYesBtn.click();
        await page.waitForTimeout(2000); // Wait for UI to update
      });

      await test.step('Delete existing Facebook rule if present', async () => {
        const deleted = await aiBotPage.deleteFacebookRuleIfExists();
        if (deleted) {
          console.log('✓ Existing Facebook rule deleted');
          await page.waitForTimeout(2000); // Wait for deletion to complete
        }
      });

      await test.step('Create new Facebook rule', async () => {
        await aiBotPage.createRuleMainBtn.waitFor({ state: 'visible', timeout: 10000 });
        await aiBotPage.createRuleMainBtn.click();
        
        // Select Facebook platform
        await aiBotPage.platformDropdown.click();
        await aiBotPage.selectFacebookOption.click();
        
        // Select Facebook account
        await aiBotPage.accountDropdown.click();
        await page.locator('div[role="option"]').first().click();
        
        await aiBotPage.continueBtn.click();
        console.log('✓ Platform and account selected');
      });

      await test.step('Configure rule settings', async () => {
        await aiBotPage.nextBtn.click();
        
        // Set default reply and keywords
        await aiBotPage.defaultReplyField.fill('Please hold, while we process');
        await aiBotPage.keywordField.fill('Order');
        await aiBotPage.addKeywordBtn.click();
        
        await aiBotPage.nextBtn.click();
        console.log('✓ Messages configured');
      });

      await test.step('Configure advanced settings', async () => {
        await expect(aiBotPage.maxRepliesField).toBeVisible();
        await aiBotPage.maxRepliesField.fill('15');
        await aiBotPage.maxRepliesDayField.fill('55');
        await aiBotPage.minLikesField.fill('1');
        
        console.log('✓ Advanced settings configured');
      });

      await test.step('Create rule', async () => {
        await aiBotPage.createRuleBtn.click();
        
        // Wait for success message
        await aiBotPage.alert.first().waitFor({ state: 'visible', timeout: 15000 });
        await expect(aiBotPage.alert.first()).toContainText(/successfully/i);
        console.log('✓ Facebook rule created successfully');
      });

      console.log('\n✅ Facebook rule creation test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should create Instagram auto-reply rule', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Configure page', async () => {
        await aiBotPage.navigateToConfigure();
        await safeClick(page);
      });

      await test.step('Enable auto-reply', async () => {
        await aiBotPage.autoReplyYesBtn.click();
        await page.waitForTimeout(2000); // Wait for UI to update
      });

      await test.step('Delete existing Instagram rule if present', async () => {
        const deleted = await aiBotPage.deleteInstagramRuleIfExists();
        if (deleted) {
          console.log('✓ Existing Instagram rule deleted');
          await page.waitForTimeout(2000); // Wait for deletion to complete
        }
      });

      await test.step('Create new Instagram rule', async () => {
        await aiBotPage.createRuleMainBtn.waitFor({ state: 'visible', timeout: 10000 });
        await aiBotPage.createRuleMainBtn.click();
        
        // Select Instagram platform
        await aiBotPage.platformDropdown.click();
        await aiBotPage.selectInstagramOption.click();
        
        // Select Instagram account
        await aiBotPage.accountDropdown.click();
        await page.locator('div[role="option"]').first().click();
        
        await aiBotPage.continueBtn.click();
        console.log('✓ Platform and account selected');
      });

      await test.step('Configure rule settings', async () => {
        await aiBotPage.nextBtn.click();
        
        // Set default reply and keywords
        await aiBotPage.defaultReplyField.fill('Please hold, while we process');
        await aiBotPage.keywordField.fill('Order');
        await aiBotPage.addKeywordBtn.click();
        
        await aiBotPage.nextBtn.click();
        console.log('✓ Messages configured');
      });

      await test.step('Configure advanced settings', async () => {
        await expect(aiBotPage.maxRepliesField).toBeVisible();
        await aiBotPage.maxRepliesField.fill('15');
        await aiBotPage.maxRepliesDayField.fill('55');
        await aiBotPage.minLikesField.fill('1');
        
        console.log('✓ Advanced settings configured');
      });

      await test.step('Create rule', async () => {
        await aiBotPage.createRuleBtn.click();
        
        // Wait for success message
        await aiBotPage.alert.first().waitFor({ state: 'visible', timeout: 15000 });
        await expect(aiBotPage.alert.first()).toContainText(/successfully/i);
        console.log('✓ Instagram rule created successfully');
      });

      console.log('\n✅ Instagram rule creation test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should verify configuration page elements', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Configure page', async () => {
        await aiBotPage.navigateToConfigure();
        await safeClick(page);
      });

      await test.step('Verify general settings elements', async () => {
        await expect(aiBotPage.professionalInfoField).toBeVisible({ timeout: 10000 });
        await expect(aiBotPage.aiToneField).toBeVisible();
        await expect(aiBotPage.saveBtn).toBeVisible();
        console.log('✓ General settings elements visible');
      });

      await test.step('Verify auto-reply settings', async () => {
        await expect(aiBotPage.autoReplyYesBtn).toBeVisible();
        await expect(aiBotPage.autoReplyNoBtn).toBeVisible();
        console.log('✓ Auto-reply settings visible');
      });

      console.log('\n✅ Configuration page elements test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = `tests/screenshots/${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    }
  });
});