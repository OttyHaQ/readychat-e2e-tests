/**
 * MessagesPage - Page Object Model for Messages functionality
 * Handles all interactions with the Messages interface including tabs, 
 * search, chat operations, and user management
 */
export class MessagesPage {
  constructor(page) {
    this.page = page;
    
    // Navigation
    this.messagesNavLink = page.getByRole('link', { name: /^messages$/i });
    
    // Main heading
    this.pageHeading = page.locator('h3');
    
    // Tab Navigation
    this.tabs = {
        allMessages: page.getByText(/^all messages$/i).first(),
        favorites: page.getByText(/^favorites$/i).first(),
        unread: page.getByText(/^unread$/i).first(),
        flagged: page.getByText(/^flagged$/i).first(),
        facebook: page.getByText(/^facebook$/i).first(),
        playground: page.getByText(/^playground$/i).first(),
        instagram: page.getByText(/^instagram$/i).first()
    };
    
    // Search functionality
    this.conversationSearchInput = page.getByPlaceholder(/search conversations/i);
    this.inMessageSearchInput = page.getByPlaceholder(/search for that exact product/i);
    this.searchButton = page.getByRole('button', { name: /search/i });
    
    // Message list
    this.messagesList = page.locator('[class*="conversation"], [data-testid*="conversation"]').first();

    // Target rows within the messages table specifically
    this.messagesTable = page.locator('table').first();
    this.conversationItems = this.messagesTable.getByRole('row');
    
    // Message actions
    // Star/favorite button - it's the first button in each conversation row
    this.starButton = page.getByRole('row').first().locator('button').first();

    // For checking if favorited, look for filled/active state on the button or its SVG child
    this.starIcon = page.getByRole('row').first().locator('button svg').first();
    
    
    // Chat AI toggle
    this.chatAIToggle = page.locator('.gap-2 > .flex > .relative > .w-12');
    this.chatAILabel = page.getByText(/chat ai/i);
    
    // Message composition
    this.messageInput = page.getByPlaceholder(/type your message/i);
    this.sendButton = page.getByRole('button', { name: /send/i }).or(
      page.locator('button[type="submit"]').filter({ has: page.locator('svg') })
    );
    this.emojiButton = page.getByRole('button', { name: /emoji/i });
    
    // User actions menu
    this.moreOptionsButton = page.getByRole('button', { name: /more options|menu/i }).or(
      page.locator('button:has(svg):has-text("")')
    );
    this.blockUserOption = page.getByRole('menuitem', { name: /block user/i });
    this.deleteUserOption = page.getByRole('menuitem', { name: /delete/i });
    this.blockUserButton = page.getByText(/block user/i);
    this.deleteButton = page.getByText(/delete/i, { exact: false });
    
    // Modals and confirmations
    this.confirmationModal = page.getByRole('dialog');
    this.confirmButton = page.getByRole('button', { name: /confirm|yes|ok/i });
    this.cancelButton = page.getByRole('button', { name: /cancel|no/i });
    this.modalTitle = page.locator('[role="dialog"] [class*="title"], [role="dialog"] h2, [role="dialog"] h3');
    
    // User profile
    this.userProfileName = page.locator('[class*="profile-name"], [data-testid="user-name"]');
    this.showProfileLink = page.getByText(/show profile/i);
    
    // Platform badges
    this.facebookBadge = page.getByText(/facebook/i).locator('..').filter({ has: page.locator('svg') });
    this.instagramBadge = page.getByText(/instagram/i).locator('..').filter({ has: page.locator('svg') });
    
    // Message bubbles
    this.messageBubbles = page.locator('[class*="message-bubble"], [class*="chat-message"]');
    this.lastMessage = this.messageBubbles.last();
    
    // Alerts and notifications
    this.successAlert = page.getByRole('alert').filter({ hasText: /success|sent|updated/i });
    this.errorAlert = page.getByRole('alert').filter({ hasText: /error|failed/i });
  }

  /**
   * Navigate to Messages page
   */
  async navigate() {
    await this.messagesNavLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.pageHeading.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Switch to a specific tab
   * @param {string} tabName - Name of the tab (allMessages, favorites, unread, etc.)
   */
  async switchToTab(tabName) {
    const tab = this.tabs[tabName];
    if (!tab) {
      throw new Error(`Tab "${tabName}" not found. Available tabs: ${Object.keys(this.tabs).join(', ')}`);
    }
    
    await tab.waitFor({ state: 'visible', timeout: 5000 });
    await tab.click();
    
    // Wait for tab to be active
    await this.page.waitForTimeout(500); // Small wait for tab transition
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Check if a tab is active/selected
   * @param {string} tabName - Name of the tab
   * @returns {Promise<boolean>}
   */
  async isTabActive(tabName) {
    const tab = this.tabs[tabName];
    const classList = await tab.getAttribute('class');
    return classList.includes('active') || classList.includes('selected');
  }

  /**
   * Search in conversations list
   * @param {string} searchTerm - Term to search for
   */
  async searchConversations(searchTerm) {
    await this.conversationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.conversationSearchInput.clear();
    await this.conversationSearchInput.fill(searchTerm);
    await this.page.waitForTimeout(1000); // Wait for search results to filter
  }

  /**
   * Search within a message thread
   * @param {string} searchTerm - Term to search for in messages
   */
  async searchInMessage(searchTerm) {
    await this.inMessageSearchInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.inMessageSearchInput.clear();
    await this.inMessageSearchInput.fill(searchTerm);
    await this.page.keyboard.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Select a conversation from the list
   * @param {string} userName - Name of the user/conversation to select
   */
  async selectConversation(userName) {
    const conversation = this.page.getByText(userName, { exact: false }).first();
    await conversation.waitFor({ state: 'visible', timeout: 5000 });
    await conversation.click();
    
    // Wait for conversation to load
    await this.page.waitForLoadState('domcontentloaded');
    await this.messageInput.waitFor({ state: 'visible', timeout: 5000 });
  }
    

  /**
 * Check if conversation is favorited (Remixicon-specific)
 */
  async isFavorited() {
    try {
      await this.starButton.waitFor({ state: 'visible', timeout: 3000 });
      
      // Get the fill color from the SVG path
      const fillColor = await this.starButton.locator('svg path').getAttribute('fill');
      
      // Gold/orange fill = favorited, dark gray = not favorited
      const isFilled = fillColor === '#FDB345' || 
                      fillColor?.toLowerCase().includes('fdb345');
      
      console.log(`  isFavorited check: ${isFilled} (fill: ${fillColor})`);
      return isFilled;
    } catch (error) {
      console.log(`  ℹ️ Could not determine favorite state: ${error.message}`);
      return false;
    }
  }


  async clickStarIcon() {
    // Click the star button 
    const starButton = this.page.getByRole('row').first().locator('button').first();
    await starButton.waitFor({ state: 'visible', timeout: 5000 });
    await starButton.click();
    
    await this.page.waitForTimeout(500); // Wait for action to complete
    console.log('  ✓ Star Button Clicked');
    return true;
  }

  /**
   * Toggle Chat AI on/off
   */
  async toggleChatAI() {
    await this.chatAIToggle.waitFor({ state: 'visible', timeout: 5000 });
    await this.chatAIToggle.click();
    await this.page.waitForTimeout(500); // Wait for toggle animation
  }

  /**
   * Check if Chat AI is enabled
   * @returns {Promise<boolean>}
   */
  async isChatAIEnabled() {
    await this.chatAIToggle.waitFor({ state: 'visible', timeout: 5000 });
    const isChecked = await this.chatAIToggle.isChecked();
    return isChecked;
  }

  async waitForConversationsToLoad() {
    // Wait for table to be visible
    await this.page.locator('table').first().waitFor({ 
      state: 'visible', 
      timeout: 10000 
    });
    
    // Wait for at least one conversation row
    await this.conversationItems.first().waitFor({ 
      state: 'visible', 
      timeout: 10000 
    });
    
    console.log('✓ Conversations loaded');
  }

  /**
   * Send a message in the current conversation
   * @param {string} message - Message text to send
   */
  async sendMessage(message) {
    // Wait for input to be both visible AND enabled
    await this.messageInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Check if enabled before attempting to interact
    const isEnabled = await this.messageInput.isEnabled({ timeout: 10000 }).catch(() => false);
    
    if (!isEnabled) {
      throw new Error('Message input is disabled - conversation may not be ready or is blocked');
    }
    
    await this.messageInput.clear();
    await this.messageInput.fill(message);
    await this.page.keyboard.press('Enter');
    
    // Wait for the sent message to appear in the thread
    await this.page
      .getByText(message, { exact: false })
      .last() // Get the most recent occurrence
      .waitFor({ state: 'visible', timeout: 10000 });
    
    console.log('✓ Message sent and visible in thread');
  }

  /**
   * Get the last message text
   * @returns {Promise<string>}
   */
  async getLastMessageText() {
    await this.lastMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.lastMessage.textContent();
  }

  /**
   * Open more options menu
   */
  async openMoreOptions() {
    // Try different selectors for the more options button
    const optionsButton = this.page.locator('button').filter({ 
      has: this.page.locator('svg') 
    }).filter({ hasText: '' }).last();
    
    const isVisible = await optionsButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await optionsButton.click();
    } else {
      await this.moreOptionsButton.click();
    }
    
    await this.page.waitForTimeout(500); // Wait for menu to appear
  }

  /**
   * Block a user
   */
  async blockUser() {
    // Look for Block User button/text
    const blockUserElement = this.page.getByText(/block user/i).first();
    await blockUserElement.waitFor({ state: 'visible', timeout: 5000 });
    await blockUserElement.click();
    
    // Handle confirmation if present
    const confirmVisible = await this.confirmButton.isVisible({ timeout: 3000 }).catch(() => false);
    if (confirmVisible) {
      await this.confirmButton.click();
    }
    
    // Wait for action to complete
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Delete a conversation/user
   */
  async deleteConversation() {
    // Look for Delete button/text
    const deleteElement = this.page.getByText(/^delete$/i).first();
    await deleteElement.waitFor({ state: 'visible', timeout: 5000 });
    await deleteElement.click();
    
    // Handle confirmation modal
    const confirmVisible = await this.confirmButton.isVisible({ timeout: 3000 }).catch(() => false);
    if (confirmVisible) {
      await this.confirmButton.click();
    }
    
    // Wait for deletion to complete
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get conversation count in current view
   * @returns {Promise<number>}
   */
  async getConversationCount() {
    await this.page.waitForTimeout(1000); // Wait for list to stabilize
    return await this.conversationItems.count();
  }

  /**
   * Check if a conversation exists by name
   * @param {string} userName - Name to search for
   * @returns {Promise<boolean>}
   */
  async conversationExists(userName) {
    const conversation = this.page.getByText(userName, { exact: false });
    return await conversation.isVisible().catch(() => false);
  }

  /**
   * Wait for success notification
   * @param {string} expectedText - Optional text to match in success message
   */
  async waitForSuccessNotification(expectedText = '') {
    if (expectedText) {
      await this.page.getByText(new RegExp(expectedText, 'i')).waitFor({ 
        state: 'visible', 
        timeout: 10000 
      });
    } else {
      await this.successAlert.waitFor({ state: 'visible', timeout: 10000 });
    }
  }

  /**
   * Get current selected user name
   * @returns {Promise<string>}
   */
  async getSelectedUserName() {
    await this.userProfileName.waitFor({ state: 'visible', timeout: 5000 });
    return await this.userProfileName.textContent();
  }
}