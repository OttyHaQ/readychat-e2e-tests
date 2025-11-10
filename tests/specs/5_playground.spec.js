import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick, expectTextContains, fullUrl } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

test.describe('AI Bot Playground', () => {
  let testCredentials;

  test.beforeAll(async () => {
    // Load test credentials
    try {
      const credentialsPath = path.join(process.cwd(), 'tests', 'test-credentials.json');
      testCredentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));
      console.log(`✓ Loaded credentials for user: ${testCredentials.username}`);
    } catch (error) {
      testCredentials = {
        username: process.env.USER_NAME || 'default_user',
        password: process.env.PASSWORD || 'default_password'
      };
      console.warn('⚠️ Using environment variables for credentials');
    }
  });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000); // 1.5 minutes

    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);

    try {
            // Navigate and sign in with retry logic
            await page.goto('/');
            await page.waitForLoadState('domcontentloaded');
            
            await landingPage.login.waitFor({ state: 'visible', timeout: 10000 });
            
            // Click and wait for navigation with retry
            let navigationSuccess = false;
            let attempts = 0;
            const maxAttempts = 3;
            
            while (!navigationSuccess && attempts < maxAttempts) {
                attempts++;
                
                try {
                    const navigationPromise = page.waitForURL(
                    url => url.href.includes('/en/auth/login'), 
                    { timeout: 30000 }
                );
                
                await landingPage.login.click();
                await navigationPromise;
                
                // Verify we're actually on login page
                const currentUrl = page.url();
                if (currentUrl.includes('/en/auth/login')) {
                    navigationSuccess = true;
                    console.log(`✓ Navigated to login (attempt ${attempts})`);
                }
                } catch (error) {
                if (attempts === maxAttempts) throw error;
                    console.log(`⚠️ Navigation attempt ${attempts} failed, retrying...`);
                    await page.waitForTimeout(2000);
                }
            }
            
            // Wait for form to be ready
            await signInPage.usernameField.waitFor({ state: 'visible', timeout: 10000 });
            await safeClick(page);
            
            await signInPage.fillSignInForm(testCredentials.username, testCredentials.password);
            await expect(page).toHaveURL('/en/dashboard', { timeout: 30000 });
            
            console.log('✓ User signed in successfully');
            } catch (error) {
            console.error('❌ Login failed:', error.message);
            throw error;
        }
  });

  test('Should send a message successfully', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Playground', async () => {
        await aiBotPage.navigateToPlayground();
        await safeClick(page);
        console.log('✓ Playground loaded');
      });

      await test.step('Verify playground elements', async () => {
        await expect(aiBotPage.playgroundHeader).toContainText(/readychatai/i);
        await expect(aiBotPage.defaultWelcomeMessage.first()).toContainText(/hi there.*help you/i);
        console.log('✓ Playground elements verified');
      });

      await test.step('Send a message', async () => {
        const message = 'I want to place an order';
        await aiBotPage.chatInputField.fill(message);
        
        // Add emoji
        await aiBotPage.emojiButton.click();
        await aiBotPage.emojiSmile.click();
        
        // Send message
        await aiBotPage.sendMessageBtn.first().click();
        
        // Verify message was sent
        await expect(aiBotPage.sentMessage).toBeVisible({ timeout: 10000 });
        console.log('✓ Message sent successfully');
      });

      console.log('\n✅ Send message test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should display and use example prompts', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Playground', async () => {
        await aiBotPage.navigateToPlayground();
        await safeClick(page);
      });

      await test.step('Verify all example prompts are visible', async () => {
        await expect(aiBotPage.promptLocationBtn).toBeVisible();
        await expect(aiBotPage.promptBusinessHoursBtn).toBeVisible();
        await expect(aiBotPage.promptProductsBtn).toBeVisible();
        await expect(aiBotPage.promptOrderBtn).toBeVisible();
        console.log('✓ All example prompts visible');
      });

      await test.step('Click first prompt and send', async () => {
        await aiBotPage.promptOrderBtn.click();
        await aiBotPage.sendMessageBtn.first().click();
        
        // Verify message appears
        await expect(aiBotPage.sentMessage.first()).toContainText(/want to make an order/i);
        console.log('✓ Prompt clicked and message sent');
      });

      console.log('\n✅ Example prompts test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should reset playground conversation', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Playground', async () => {
        await aiBotPage.navigateToPlayground();
        await safeClick(page);
      });

      await test.step('Send a message', async () => {
        await aiBotPage.clickExamplePrompt(4); // "I want to make an order"
        await aiBotPage.sendMessageBtn.first().click();
        
        // Verify message is visible
        await expect(aiBotPage.sentMessage.first()).toBeVisible({ timeout: 10000 });
        console.log('✓ Message sent');
      });

      await test.step('Reset playground', async () => {
        await aiBotPage.resetPlayground();
        
        // Verify conversation is reset (only default message remains)
        await expect(aiBotPage.sentMessage).toHaveCount(1, { timeout: 10000 });
        console.log('✓ Playground reset successfully');
      });

      console.log('\n✅ Reset playground test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should navigate to Data Sources via "Add More Knowledge" link', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Playground', async () => {
        await aiBotPage.navigateToPlayground();
        await safeClick(page);
      });

      await test.step('Click Add More Knowledge link', async () => {
        await aiBotPage.addMoreKnowledgeLink.waitFor({ state: 'visible', timeout: 10000 });
        await aiBotPage.addMoreKnowledgeLink.click();
        
        // Verify navigation to Data Sources
        await expect(aiBotPage.addSourceBtn).toBeVisible({ timeout: 10000 });
        console.log('✓ Navigated to Data Sources page');
      });

      console.log('\n✅ Add More Knowledge link test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should handle emoji picker interaction', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Playground', async () => {
        await aiBotPage.navigateToPlayground();
        await safeClick(page);
      });

      await test.step('Open emoji picker and select emoji', async () => {
        // Click emoji button
        await aiBotPage.emojiButton.waitFor({ state: 'visible', timeout: 10000 });
        await aiBotPage.emojiButton.click();
        
        // Select an emoji
        await aiBotPage.emojiSmile.waitFor({ state: 'visible', timeout: 5000 });
        await aiBotPage.emojiSmile.click();
        
        // Verify emoji was added to input
        const inputValue = await aiBotPage.chatInputField.inputValue();
        expect(inputValue).toContain('😀');
        console.log('✓ Emoji added to input field');
      });

      console.log('\n✅ Emoji picker test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should handle multiple messages in conversation', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Playground', async () => {
        await aiBotPage.navigateToPlayground();
        await safeClick(page);
      });

      await test.step('Send multiple messages', async () => {
        // Send first message
        await aiBotPage.sendMessage('Hello');
        await page.waitForTimeout(1000); // Brief pause for message to send
        
        // Send second message
        await aiBotPage.sendMessage('I need help');
        await page.waitForTimeout(1000);
        
        // Send third message via prompt
        await aiBotPage.clickExamplePrompt(4);
        await aiBotPage.sendMessageBtn.first().click();
        
        // Verify messages are visible
        await expect(aiBotPage.page.locator('text=Hello')).toBeVisible();
        await expect(aiBotPage.page.locator('text=I need help')).toBeVisible();
        
        console.log('✓ Multiple messages sent and displayed');
      });

      console.log('\n✅ Multiple messages test passed!');
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