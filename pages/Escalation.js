export class Escalation {
  constructor(page) {
    this.page = page;
    
    // ============ NAVIGATION ============
    this.mobileMenuButton = page.getByRole('button', { name: /menu/i })
      .or(page.locator('button.xl\\:hidden svg').locator('..'));
    this.escalationMenuItem = page.getByRole('link', { name: 'Escalation' });
    
    // ============ TAB NAVIGATION ============
    this.myTicketsTab = page.getByRole('tab', { name: /my tickets/i })
      .or(page.locator('span:has-text("My Tickets")'));
    this.unassignedTab = page.getByRole('tab', { name: /unassigned/i })
      .or(page.locator('span:has-text("Unassigned")'));
    this.resolvedTab = page.getByRole('tab', { name: /resolved/i })
      .or(page.locator('span:has-text("Resolved")'));
    this.closedTab = page.getByRole('tab', { name: /closed/i })
      .or(page.locator('span:has-text("Closed")'));
    
    // ============ FILTERS & SEARCH ============
    this.searchField = page.getByPlaceholder(/search/i)
      .or(page.locator('input[placeholder="Search..."]'));
    this.sortDropdown = page.locator('xpath=//main[@class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100"]//div[1]//div[1]//div[2]//div[1]//div[1]//div[1]//button[1]')
      .or(page.locator('div:has(> div:text-is("Sort by"))').locator('button'));
    this.filterLanguageDropdown = page.getByRole('button', { name: /language/i })
      .or(page.locator('button:has-text("All Languages")'));
    
    // Sort Options
    this.sortAllOption = page.getByRole('option', { name: /^all$/i })
      .or(page.locator('[role="option"]:has-text("All")'));
    this.sortHighOption = page.getByRole('option', { name: /high/i })
      .or(page.locator('span:has-text("High")'));
    this.sortMediumOption = page.getByRole('option', { name: /medium/i })
      .or(page.locator('span:has-text("Medium")'));
    this.sortLowOption = page.getByRole('option', { name: /low/i })
      .or(page.locator('span:has-text("Low")'));
    
    // Language Options
    this.allLanguagesOption = page.getByRole('option', { name: /all languages/i })
      .or(page.locator('span:has-text("All Languages")'));
    this.englishOption = page.getByRole('option', { name: /english/i })
      .or(page.locator('span:has-text("English")'));
    
    // ============ ACTION BUTTONS ============
    this.acceptBtn = page.getByRole('button', { name: /^accept$/i })
      .or(page.locator('button:has-text("Accept")'));
    this.chatBtn = page.getByRole('button', { name: /^chat$/i })
      .or(page.locator('button:has-text("Chat")'));
    this.resolveBtn = page.getByRole('button', { name: /^resolve$/i })
      .or(page.locator('button:has-text("Resolve")'));
    this.reopenBtn = page.getByRole('button', { name: /^reopen$/i })
      .or(page.locator('button:has-text("Reopen")'));
    this.closeBtn = page.getByRole('button', { name: /^close$/i })
      .or(page.locator('button:has-text("Close")'));
    this.generateBtn = page.getByRole('button', { name: /generate/i })
      .or(page.locator('button:has-text("Generate")'));
    
    // ============ TICKET DETAILS ============
    this.ticketDetailsHeader = page.getByRole('heading', { name: /ticket details/i })
      .or(page.locator('h4:has-text("TICKET DETAILS")'));
    this.chatResolveBtn = page.getByRole('button', { name: /resolve ticket/i })
      .or(page.locator('button.bg-purple-600:has-text("Resolve Ticket")'));
    
    // Toggle Switch
    this.escalationToggle = page.locator('[role="switch"]')
      .or(page.locator('div[class*="peer-focus"]').first());
    
    // Modal Elements
    this.closeModalBtn = page.getByRole('button', { name: /close|dismiss/i })
      .or(page.locator('button[aria-label="Close"]'));
    
    // Dropdown Options (generic)
    this.currentOption = page.locator('[role="option"]:has(svg)');
    this.statusOptions = page.locator('[role="option"]');
  }

  // ============ NAVIGATION METHODS ============

  /**
   * Navigates to the Escalation page
   */
  async navigateToEscalation() {
    await this.escalationMenuItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.escalationMenuItem.click();
  }

  /**
   * Switches to a specific ticket tab
   * @param {string} tabName - 'my_tickets', 'unassigned', 'resolved', or 'closed'
   */
  async switchToTab(tabName) {
    const tabMap = {
      my_tickets: this.myTicketsTab,
      unassigned: this.unassignedTab,
      resolved: this.resolvedTab,
      closed: this.closedTab
    };

    const tab = tabMap[tabName.toLowerCase()];
    if (!tab) {
      throw new Error(`Unknown tab: ${tabName}. Use 'my_tickets', 'unassigned', 'resolved', or 'closed'`);
    }

    await tab.waitFor({ state: 'visible', timeout: 10000 });
    await tab.click();
  }

  // ============ TICKET ACTIONS ============

  /**
   * Accepts an unassigned ticket
   */
  async acceptTicket() {
    await this.acceptBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.acceptBtn.click();
  }

  /**
   * Opens chat for a ticket
   */
  async openChat() {
    await this.chatBtn.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.chatBtn.first().click();
    
    // Wait for chat to load
    await this.ticketDetailsHeader.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Resolves a ticket
   */
  async resolveTicket() {
    await this.resolveBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.resolveBtn.click();
  }

  /**
   * Reopens a resolved ticket
   */
  async reopenTicket() {
    await this.reopenBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.reopenBtn.click();
  }

  /**
   * Closes a ticket
   */
  async closeTicket() {
    await this.closeBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.closeBtn.click();
  }

  /**
   * Resolves a ticket from within the chat view
   */
  async resolveTicketFromChat() {
    await this.chatResolveBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.chatResolveBtn.click();
  }

  // ============ FILTER & SORT METHODS ============

  /**
   * Searches for tickets
   * @param {string} searchText - Text to search for
   */
  async searchTickets(searchText) {
    await this.searchField.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchField.fill(searchText);
    
    // Wait for search to process
    await this.page.waitForTimeout(1000);
  }

  /**
   * Sorts tickets by priority
   * @param {string} priority - 'all', 'high', 'medium', or 'low'
   */
  async sortByPriority(priority) {
      const priorityMap = {
      all: 'All',
      high: 'High', 
      medium: 'Medium',
      low: 'Low'
    };
    
    const displayText = priorityMap[priority.toLowerCase()];
    if (!displayText) {
      throw new Error(`Unknown priority: ${priority}. Use 'all', 'high', 'medium', or 'low'`);
    }
    
    // Open dropdown
    await this.sortDropdown.click();
    
    // Click option using filter (more stable than .or() chains)
    await this.page
      .locator('[role="option"]')
      .filter({ hasText: displayText })
      .click();
    
    // Wait for results to update
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  /**
   * Filters tickets by language
   * @param {string} language - 'all' or 'english'
   */
  async filterByLanguage(language) {
    await this.filterLanguageDropdown.click();
    
    if (language.toLowerCase() === 'all') {
      await this.allLanguagesOption.click();
    } else if (language.toLowerCase() === 'english') {
      await this.englishOption.click();
    } else {
      // Try to find the language option dynamically
      await this.page.locator(`[role="option"]:has-text("${language}")`).click();
    }
  }

  /**
   * Iterates through all sort options and validates selection
   */
  async sortBy() {
    // Get all available options
    const options = await this.statusOptions.allTextContents();
    
    for (const option of options) {
      // Open dropdown
      await this.sortDropdown.click();
      
      // Select option
      await this.page.locator(`[role="option"]:has-text("${option}")`).click();
      
      // Verify selection
      await this.page.waitForLoadState('domcontentloaded');
      await this.sortDropdown.waitFor({ state: 'visible', timeout: 5000 });
      
      const dropdownText = await this.sortDropdown.textContent();
      if (dropdownText.includes(option)) {
        console.log(`✅ Successfully selected and validated: ${option}`);
      } else {
        console.warn(`⚠️ Selection mismatch for: ${option}`);
      }
      
      // Brief wait before next iteration
      await this.page.waitForTimeout(500);
    }
  }

  // ============ VERIFICATION METHODS ============

  /**
   * Verifies that the Escalation page is loaded
   */
  async verifyEscalationPageLoaded() {
    await this.myTicketsTab.waitFor({ state: 'visible', timeout: 10000 });
    await this.unassignedTab.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Verifies that a specific button is visible
   * @param {string} buttonName - Name of the button to verify
   * @returns {Promise<boolean>} True if visible
   */
  async isButtonVisible(buttonName) {
    const buttonMap = {
      accept: this.acceptBtn,
      chat: this.chatBtn,
      resolve: this.resolveBtn,
      reopen: this.reopenBtn,
      close: this.closeBtn
    };

    const button = buttonMap[buttonName.toLowerCase()];
    if (!button) {
      throw new Error(`Unknown button: ${buttonName}`);
    }

    try {
      await button.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets the count of visible tickets
   * @returns {Promise<number>} Number of tickets
   */
  async getTicketCount() {
    const tickets = this.page.locator('[data-ticket-id], .ticket-item, tr[role="row"]');
    return await tickets.count();
  }

  /**
   * Toggles escalation setting
   */
  async toggleEscalation() {
    await this.escalationToggle.click();
  }
}