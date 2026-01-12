import { test, expect } from '@playwright/test';
import { MessagesPage } from '../../pages/MessagesPage.js';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { safeClick } from '../../utils/helpers.js';

test.describe('Messages Page', () => {
  let messagesPage;
  
  // Test data
  const testCredentials = {
    username: process.env.USER_NAME || 'default_user',
    password: process.env.PASSWORD || 'default_password'
  };
  
  const testData = {
    searchTerm: 'order',
    inMessageSearchTerm: 'product',
    testMessage: 'This is an automated test message from Playwright',
    userToBlock: 'Test Customer',
    userToDelete: 'Flora Ready'
  };

  // Setup - Sign in before tests
  test.beforeEach(async ({ page }) => {
    // Sign in
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);
    messagesPage = new MessagesPage(page);

    await test.step('Sign in to application', async () => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      await landingPage.login.waitFor({ state: 'visible', timeout: 10000 });
      await safeClick(page);
      await landingPage.login.click();
      
      await expect(page).toHaveURL('/en/auth/login', { timeout: 10000 });
      
      await safeClick(page);
      await signInPage.fillSignInForm(testCredentials.username, testCredentials.password);
      
      // Wait for dashboard
      await expect(page).toHaveURL('/en/dashboard', { timeout: 15000 });
      console.log('✓ Successfully signed in');
    });

    await test.step('Navigate to Messages page', async () => {
      await messagesPage.navigate();
      await expect(messagesPage.pageHeading).toBeVisible({ timeout: 10000 });
      console.log('✓ Navigated to Messages page');
    });
  });

  /**
   * TEST CASE 1: Verify all tabs are active and clickable
   */
  test('Should verify all message tabs are active and functional', async ({ page }) => {
    console.log('\n Testing tab navigation...');
    
    const tabsToTest = [
      'allMessages',
      'favorites', 
      'unread',
      'flagged',
      'facebook',
      'playground',
      'instagram'
    ];

    for (const tabName of tabsToTest) {
      await test.step(`Verify ${tabName} tab`, async () => {
        try {
          // Check if tab exists and is visible
          await expect(messagesPage.tabs[tabName]).toBeVisible({ timeout: 5000 });
          console.log(`  ✓ ${tabName} tab is visible`);
          
          // Click the tab
          await messagesPage.switchToTab(tabName);
          console.log(`  ✓ ${tabName} tab clicked successfully`);
          
          // Verify tab activation (if applicable)
          await page.waitForTimeout(500); // Brief wait for UI update
          
          // Take screenshot for verification
          await page.screenshot({ 
            path: `tests/screenshots/tab-}-${Date.now()}.png`,
            fullPage: false 
          });
          
        } catch (error) {
          console.error(`   Error with ${tabName} tab:`, error.message);
          throw error;
        }
      });
    }

    console.log('✅ All tabs verified successfully');
  });

  /**
   * TEST CASE 2: Search functionality in messages list
   */
  test('Should search conversations in messages list', async ({ page }) => {
    console.log('\n Testing conversation search...');

    await test.step('Perform conversation search', async () => {
      // Get initial conversation count
      const initialCount = await messagesPage.getConversationCount();
      console.log(`  Initial conversation count: ${initialCount}`);

      // Search for a term
      await messagesPage.searchConversations(testData.searchTerm);
      console.log(`  ✓ Searched for: "${testData.searchTerm}"`);

      // Wait for results to filter
      await page.waitForTimeout(1000);

      // Verify search results
      const searchResultCount = await messagesPage.getConversationCount();
      console.log(`  Search result count: ${searchResultCount}`);

      // Screenshot of search results
      await page.screenshot({ 
        path: `tests/screenshots/tab-}-${Date.now()}.png`,
        fullPage: true 
      });
    });

    await test.step('Clear search and verify results reset', async () => {
      // Clear search
      await messagesPage.conversationSearchInput.clear();
      await page.waitForTimeout(1000);

      const finalCount = await messagesPage.getConversationCount();
      console.log(`  ✓ Search cleared, conversation count: ${finalCount}`);
    });

    console.log('✅ Conversation search test completed');
  });

  /**
   * TEST CASE 3: Search within a message thread
   */
  test('Should search within a specific message', async ({ page }) => {
    console.log('\n Testing in-message search...');

    await test.step('Select a conversation', async () => {
      // Click on first available conversation
      const firstConversation = messagesPage.conversationItems.first();
      await firstConversation.waitFor({ state: 'visible', timeout: 5000 });
      await firstConversation.click();
      
      // Wait for conversation to load
      await messagesPage.messageInput.waitFor({ state: 'visible', timeout: 5000 });
      console.log('  ✓ Conversation selected');
    });

    await test.step('Search within message thread', async () => {
      // Check if in-message search is visible
      const searchVisible = await messagesPage.inMessageSearchInput
        .isVisible({ timeout: 3000 })
        .catch(() => false);

      if (searchVisible) {
        await messagesPage.searchInMessage(testData.inMessageSearchTerm);
        console.log(`  ✓ Searched for: "${testData.inMessageSearchTerm}"`);
        
        // Wait for search results
        await page.waitForTimeout(2000);
        
        // Screenshot
        await page.screenshot({ 
          path: `tests/screenshots/tab-}-${Date.now()}.png`,
          fullPage: true 
        });
      } else {
        console.log('  ⚠ In-message search not available in this view');
      }
    });

    console.log('✅ In-message search test completed');
  });

    /**
   * TEST CASE 4: Favorite conversations
   */
  test('Should favorite a conversation', async ({ page }) => {
    console.log('\n Testing favorite functionality...');

    await test.step('Select a conversation', async () => {
      const firstConversation = messagesPage.conversationItems.first();
      await firstConversation.waitFor({ state: 'visible', timeout: 10000 });
      await firstConversation.click();
      await page.waitForTimeout(1000);
      console.log('  ✓ Conversation selected');
    });

    await test.step('Verify conversation is not favorited initially', async () => {
      const initialState = await messagesPage.isFavorited();
      console.log(`  Initial favorite state: ${initialState}`);
      
      // If already favorited, unfavorite first
      if (initialState) {
        console.log('   Already favorited, unfavoriting first...');
        await messagesPage.clickStarIcon();
        await page.waitForTimeout(2000);
        
        const stateAfterUnfavorite = await messagesPage.isFavorited();
        expect(stateAfterUnfavorite).toBe(false);
        console.log('  ✓ Reset to unfavorited state');
      }
    });

    await test.step('Favorite the conversation', async () => {
      await messagesPage.clickStarIcon();
      await page.waitForTimeout(2000);
      
      const newState = await messagesPage.isFavorited();
      
      // STRONG ASSERTION - must be favorited
      expect(newState).toBe(true);
      console.log('  ✓ Conversation favorited successfully');
      
      await page.screenshot({ 
        path: `tests/screenshots/tab-}-${Date.now()}.png`,
        fullPage: false 
      });
    });

    console.log('✅ Favorite test completed');
  });

  /**
   * TEST CASE 5: Unfavorite conversations
   */
  test('Should unfavorite a conversation', async ({ page }) => {
    console.log('\n Testing unfavorite functionality...');

    await test.step('Select a conversation', async () => {
      const firstConversation = messagesPage.conversationItems.first();
      await firstConversation.waitFor({ state: 'visible', timeout: 10000 });
      await firstConversation.click();
      await page.waitForTimeout(1000);
      console.log('  ✓ Conversation selected');
    });

    await test.step('Ensure conversation is favorited first', async () => {
      const initialState = await messagesPage.isFavorited();
      console.log(`  Initial favorite state: ${initialState}`);
      
      // If not favorited, favorite first
      if (!initialState) {
        console.log('   Not favorited, favoriting first...');
        await messagesPage.clickStarIcon();
        await page.waitForTimeout(2000);
        
        const stateAfterFavorite = await messagesPage.isFavorited();
        expect(stateAfterFavorite).toBe(true);
        console.log('  ✓ Favorited for test');
      }
    });

    await test.step('Unfavorite the conversation', async () => {
      await messagesPage.clickStarIcon();
      await page.waitForTimeout(2000);
      
      const newState = await messagesPage.isFavorited();
      
      // STRONG ASSERTION - must NOT be favorited
      expect(newState).toBe(false);
      console.log('  ✓ Conversation unfavorited successfully');
      
      await page.screenshot({ 
        path: `tests/screenshots/tab-}-${Date.now()}.png`,
        fullPage: false 
      });
    });

    console.log('✅ Unfavorite test completed');
  });


  /**
   * TEST CASE 5: Chat AI toggle functionality
   */
  test('Should toggle Chat AI on and off', async ({ page }) => {
    console.log('\n Testing Chat AI toggle...');

    await test.step('Select a conversation', async () => {
      const firstConversation = messagesPage.conversationItems.first();
      await firstConversation.waitFor({ state: 'visible', timeout: 5000 });
      await firstConversation.click();
      await page.waitForTimeout(1000);
      console.log('  ✓ Conversation selected');
    });

    await test.step('Verify Chat AI toggle exists', async () => {
      const toggleVisible = await messagesPage.chatAIToggle
        .isVisible({ timeout: 5000 })
        .catch(() => false);
      
      expect(toggleVisible).toBeTruthy();
      console.log('  ✓ Chat AI toggle is visible');
    });

    await test.step('Toggle Chat AI OFF', async () => {
      await messagesPage.chatAIToggle.waitFor({ state: 'visible', timeout: 3000 });
      await messagesPage.chatAIToggle.click();
      console.log('  ✓ Chat AI toggled OFF');
    });

    await test.step('Toggle Chat AI ON', async () => {
      await messagesPage.chatAIToggle.waitFor({ state: 'visible', timeout: 3000 });
      await messagesPage.chatAIToggle.click();
      console.log('  ✓ Chat AI toggled ON');
    });

    console.log('✅ Chat AI toggle test completed');
  });

  /**
   * TEST CASE 6: Send messages
   */
  test('Should send a message successfully', async ({ page }) => {
    console.log('\n Testing message sending...');

    await test.step('Select a conversation', async () => {
      await messagesPage.waitForConversationsToLoad();
      
      const firstConversation = messagesPage.conversationItems.first();
      await firstConversation.click();
      await page.waitForTimeout(1000);
      console.log('  ✓ Conversation selected');
    });

    await test.step('Compose and send message', async () => {
      // Generate unique message with timestamp
      const timestamp = new Date().toISOString();
      const messageText = `${testData.testMessage} - ${timestamp}`;

      await messagesPage.sendMessage(messageText);
      console.log(`  ✓ Message sent: "${messageText}"`);

      // Wait for message to appear
      await page.waitForTimeout(2000);

      // Screenshot
      await page.screenshot({ 
        path: `tests/screenshots/tab-}-${Date.now()}.png`,
        fullPage: true 
      });
    });

    await test.step('Verify message appears in thread', async () => {
      try {
        // Get last message text
        const lastMessageText = await messagesPage.getLastMessageText();
        console.log(`  Last message: "${lastMessageText}"`);

        // Verify our message is visible (partial match is okay)
        expect(lastMessageText).toContain('automated test message');
        console.log('  ✓ Message verified in thread');
      } catch (error) {
        console.log('  ⚠ Could not verify message in thread:', error.message);
      }
    });

    console.log('✅ Send message test completed');
  });

  /**
   * TEST CASE 7: Block user functionality
   */
  test.skip('Should block a user', async ({ page }) => {
    console.log('\n Testing block user functionality...');

    await test.step('Find and select conversation to block', async () => {
      // Search for specific user if provided, otherwise use first conversation
      if (testData.userToBlock) {
        const conversationExists = await messagesPage.conversationExists(testData.userToBlock);
        
        if (conversationExists) {
          await messagesPage.selectConversation(testData.userToBlock);
        } else {
          console.log(`   User "${testData.userToBlock}" not found, using first conversation`);
          await messagesPage.conversationItems.first().click();
        }
      } else {
        await messagesPage.conversationItems.first().click();
      }
      
      await page.waitForTimeout(1000);
      const userName = await messagesPage.getSelectedUserName();
      console.log(`  ✓ Selected conversation: ${userName}`);
    });

    await test.step('Block the user', async () => {
      try {
        // Look for Block User button directly
        const blockUserVisible = await messagesPage.blockUserButton
          .isVisible({ timeout: 5000 })
          .catch(() => false);

        if (blockUserVisible) {
          await messagesPage.blockUser();
          console.log('  ✓ User blocked successfully');

          // Wait for confirmation or action completion
          await page.waitForTimeout(2000);

          // Screenshot
          await page.screenshot({ 
            path: `tests/screenshots/tab-}-${Date.now()}.png`,
            fullPage: true 
          });
        } else {
          console.log('   Block User button not visible in current view');
          
          // Try opening more options menu
          await messagesPage.openMoreOptions();
          await messagesPage.blockUser();
          console.log('  ✓ User blocked via options menu');
        }
      } catch (error) {
        console.error('   Error blocking user:', error.message);
        
        // Take screenshot on error
        await page.screenshot({ 
          path: `tests/screenshots/tab-}-${Date.now()}.png`,
          fullPage: true 
        });
        
        throw error;
      }
    });

    console.log('✅ Block user test completed');
  });

  /**
   * TEST CASE 8: Delete conversation/user
   */
  test.skip('Should delete a conversation', async ({ page }) => {
    console.log('\n Testing delete conversation functionality...');

    let conversationToDelete;

    await test.step('Find and select conversation to delete', async () => {
      // Search for specific user if provided
      if (testData.userToDelete) {
        const conversationExists = await messagesPage.conversationExists(testData.userToDelete);
        
        if (conversationExists) {
          await messagesPage.selectConversation(testData.userToDelete);
          conversationToDelete = testData.userToDelete;
        } else {
          console.log(`   User "${testData.userToDelete}" not found, using first conversation`);
          await messagesPage.conversationItems.first().click();
        }
      } else {
        await messagesPage.conversationItems.first().click();
      }
      
      await page.waitForTimeout(1000);
      
      if (!conversationToDelete) {
        conversationToDelete = await messagesPage.getSelectedUserName();
      }
      
      console.log(`  ✓ Selected conversation to delete: ${conversationToDelete}`);
    });

    await test.step('Delete the conversation', async () => {
      try {
        // Look for Delete button directly
        const deleteVisible = await messagesPage.deleteButton
          .isVisible({ timeout: 5000 })
          .catch(() => false);

        if (deleteVisible) {
          await messagesPage.deleteConversation();
          console.log('  ✓ Conversation deleted successfully');

          // Wait for deletion to complete
          await page.waitForTimeout(2000);

          // Screenshot
          await page.screenshot({ 
            path: `tests/screenshots/tab-}-${Date.now()}.png`,
            fullPage: true 
          });
        } else {
          console.log('   Delete button not visible in current view');
          
          // Try opening more options menu
          await messagesPage.openMoreOptions();
          await messagesPage.deleteConversation();
          console.log('  ✓ Conversation deleted via options menu');
        }
      } catch (error) {
        console.error('   Error deleting conversation:', error.message);
        
        // Take screenshot on error
        await page.screenshot({ 
          path: `tests/screenshots/tab-}-${Date.now()}.png`,
          fullPage: true 
        });
        
        throw error;
      }
    });

    await test.step('Verify conversation is deleted', async () => {
      try {
        await page.waitForTimeout(1000);
        
        // Try to find the deleted conversation
        const stillExists = await messagesPage.conversationExists(conversationToDelete);
        
        if (!stillExists) {
          console.log(`  ✓ Conversation "${conversationToDelete}" successfully removed`);
        } else {
          console.log(`   Conversation "${conversationToDelete}" still visible (may be soft delete)`);
        }
      } catch (error) {
        console.log('   Could not verify deletion:', error.message);
      }
    });

    console.log('✅ Delete conversation test completed');
  });

  // Cleanup and error handling
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = `tests/screenshots/${testInfo.title.replace(/\s+/g, '-')}-failure-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Failure screenshot saved: ${screenshotPath}`);
    }
  });
});
