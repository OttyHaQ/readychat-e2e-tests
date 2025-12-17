export class AIBot {
  constructor(page) {
    this.page = page;

    //  NAVIGATION 
    this.aiBotMenuItem = page.getByRole('link', { name: /ai bot/i })
      .or(page.getByText(/ai bot/i).first());
    this.dataSourcesLink = page.locator('xpath=//a[normalize-space()="Data Sources"]')
      .or(page.getByRole('link', { name: /data sources/i }));
    this.playgroundLink = page.locator('xpath=//a[normalize-space()="Playground"]')
      .or(page.getByRole('link', { name: /playground/i }));
    this.configureLink = page.locator('xpath=//a[normalize-space()="Configure"]')
      .or(page.getByRole('link', { name: /configure/i }));


    //  ALERTS 
    this.alert = page.locator('[role="alert"]:not(#__next-route-announcer__)');
    this.alertMessage = page.locator('[role="alert"]').first();


    //  DATA SOURCES - Q&A SECTION 
    this.qnaTab = page.getByRole('tab', { name: /q and a|q&a/i })
      .or(page.locator('span:has-text("Q and A")'));
    this.answeredQuestionsTab = page.getByText('Answered Questions', { exact: true });
    this.unansweredQuestionsTab = page.getByText('Unanswered Questions')
      .or(page.locator('div[data-tour-target="faq-table"] span:has-text("Unanswered")'));

    // Table Columns
    this.questionColumn = page.getByRole('columnheader', { name: /question/i })
      .or(page.locator('div:has-text("Question")').first());
    this.productsColumn = page.getByRole('columnheader', { name: /products/i })
      .or(page.locator('div:has-text("Products")').first());
    this.serviceColumn = page.getByRole('columnheader', { name: /service/i })
      .or(page.locator('div:has-text("Service")').first());
    this.lastAskedColumn = page.getByRole('columnheader', { name: /last asked/i })
      .or(page.locator('div:has-text("Last Asked")').first());
    this.channelsColumn = page.getByRole('columnheader', { name: /channels/i })
      .or(page.locator('div:has-text("Channels")').first());
    this.statusColumn = page.getByRole('columnheader', { name: /status/i })
      .or(page.locator('div:has-text("Status")').first());
    this.actionsColumn = page.getByRole('columnheader', { name: /actions/i })
      .or(page.locator('div:has-text("Actions")').first());
    this.answerColumn = page.getByRole('columnheader', { name: /answer/i })
      .or(page.locator('div:has-text("Answer")').first());

    // Action Buttons
    this.exportBtn = page.getByRole('button', { name: /^export$/i })
      .or(page.locator('button:has-text("Export")').first());
    this.reorderBtn = page.locator('button[class="h-full bg-gray-100 text-gray-700 border-2 border-brand-gray-200 p-4 text-base rounded-xl font-semibold transition-[colors,box-shadow] duration-200 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gray-100"]');
    this.saveBtn = page.getByRole('button', { name: /^save$/i })
      .or(page.locator('button:has-text("Save")').first());
    this.cancelBtn = page.getByRole('button', { name: /cancel/i })
      .or(page.locator('button:has-text("Cancel")'));
    this.addNewQuestionsBtn = page.getByRole('button', { name: /add new questions/i })
      .or(page.locator('button:has-text("Add New Questions")'));
    this.addSourceBtn = page.getByRole('button', { name: 'Add Source' });

    // Export Modal
    this.exportTableDataHeader = page.getByRole('heading', { name: /export table data/i })
      .or(page.locator('h3:has-text("Export Table Data")'));
    this.exportRangeDropdown = page.locator('div.relative.w-full button[type="button"]').last();
    this.csvBtn = page.getByRole('button', { name: /^csv$/i })
      .or(page.locator('button:has-text("CSV")'));
    this.xlsxBtn = page.getByRole('button', { name: /^xlsx$/i })
      .or(page.locator('button:has-text("XLSX")'));
    this.pdfBtn = page.getByRole('button', { name: /^pdf$/i })
      .or(page.locator('button:has-text("PDF")'));

    //  ADD QUESTION MODAL 
    this.addQuestionHeader = page.getByText(/what are commonly asked questions by customers?/i)
      .or(page.locator('h3:has-text("What are Commonly Asked Questions By Customers?")'));
    this.questionField = page.locator('#question')
      .or(page.getByLabel(/question/i));
    this.answerField = page.locator('#answer')
      .or(page.getByLabel(/answer/i));
    this.productsDropdown = page.locator('div.tour-target-faq-product-dropdown button')
      .or(page.getByRole('button', { name: /select product/i }));
    this.productOption = page.locator('tr.hover\\:bg-brand-gray-300 td:nth-child(1)');
    this.servicesDropdown = page.locator('div.tour-target-faq-service-dropdown button')
      .or(page.getByRole('button', { name: /select service/i }));
    this.serviceOption = page.locator('tr.hover\\:bg-brand-gray-300 td:nth-child(1)');
    this.saveAndCloseBtn = page.getByRole('button', { name: /save & close|save and close/i })
      .or(page.locator('button:has-text("Save & Close")'));

    //  IMPORT FILES 
    this.importFilesTab = page.getByRole('tab', { name: /import files/i })
      .or(page.locator('span:has-text("Import Files")'));
    this.batchImportsHeader = page.getByRole('heading', { name: /all batch imports/i })
      .or(page.locator('.h4'));
    
    // Import Files Table Columns
    this.idColumn = page.getByRole('columnheader', { name: /^id$/i })
      .or(page.locator('div:has-text("ID")').first());
    this.fileNameColumn = page.getByRole('columnheader', { name: /file name/i })
      .or(page.locator('div:has-text("File Name")').first());
    this.createdAtColumn = page.getByRole('columnheader', { name: /created at/i })
      .or(page.locator('div:has-text("Created At")').first());
    this.productCountColumn = page.getByRole('columnheader', { name: /product count/i })
      .or(page.locator('div:has-text("Product Count")').first());

    //  ADD SOURCE MODAL 
    this.addSourceHeader = page.getByRole('heading', { name: /train your ai/i })
      .or(page.locator('h3:has-text("Train your AI")'));
    this.createQandAOption = page.getByRole('button', { name: /create q&a|create q and a/i })
      .or(page.locator('h6:has-text("Create Q&A")').locator('..'));
    this.importProductFileOption = page.getByRole('button', { name: /import product file/i })
      .or(page.locator('h6:has-text("Import Product File")').locator('..'));

    // Import Product File Modal
    this.importProductFileHeader = page.getByRole('heading', { name: /import product file/i })
      .or(page.locator('h3:has-text("Import Product File")'));
    this.downloadTemplateBtn = page.getByRole('button', { name: /download.*template/i })
      .or(page.locator('button:has-text("Download CSV template")'));
    this.uploadFileInput = page.locator('input[type="file"]');
    this.importBtn = page.getByRole('button', { name: /^import$/i })
      .or(page.locator('button:has-text("Import")'));

    //  PLAYGROUND 
    this.playgroundHeader = page.getByRole('heading', { name: 'Test ReadyChatAI with your' })
      .or(page.locator('h4:has-text("Test ReadyChatAI with your knowledge")'));
    this.defaultWelcomeMessage = page.locator('.relative.p-3.rounded-lg')
      .or(page.getByText(/hi there.*help you/i));
    this.resetBtn = page.getByRole('button', { name: /reset/i })
      .or(page.locator('button:has-text("Reset")'));
    
    // Example Prompts
    this.promptLocationBtn = page.getByRole('button', { name: /where are you located/i })
      .or(page.locator('button:has-text("Where are you located?")'));
    this.promptBusinessHoursBtn = page.getByRole('button', { name: /business hours/i })
      .or(page.locator('button:has-text("What are your business hours?")'));
    this.promptProductsBtn = page.getByRole('button', { name: /show.*products/i })
      .or(page.locator('button:has-text("Show me your products")'));
    this.promptOrderBtn = page.getByRole('button', { name: /make an order/i })
      .or(page.locator('button:has-text("I want to make an order")'));
    
    // Chat Input
    this.chatInputField = page.getByPlaceholder(/type a reply/i)
      .or(page.locator('input[placeholder="Type a reply..."]'));
    this.emojiButton = page.locator('.ri-emotion-line')
      .or(page.getByRole('button', { name: /emoji/i }));
    this.emojiSmile = page.locator('span:has-text("😀")').first();
    this.sendMessageBtn = page.locator('.bg-brand-secondary-gradient.rounded-full')
      .or(page.getByRole('button', { name: /send/i }));
    this.sentMessage = page.locator('main').getByText(/i want to make an order/i);
    this.addMoreKnowledgeLink = page.getByRole('link', { name: /add more knowledge/i })
      .or(page.locator('p.text-blue-600 a'));

    //  CONFIGURE 
    // General Settings
    this.professionalInfoField = page.locator('textarea#responses\\.0\\.response')
      .or(page.locator('textarea[id="responses.0.response"]'));
    this.aiToneField = page.locator('textarea#responses\\.1\\.response')
      .or(page.locator('textarea[id="responses.1.response"]'));
    
    // Toggle Switches (using .nth() for consistent indexing)
    this.generalToggles = {
      toggle1: page.locator('.gap-2 > .flex > .relative > .w-12').nth(0),
      toggle2: page.locator('.gap-2 > .flex > .relative > .w-12').nth(1),
      toggle3: page.locator('.gap-2 > .flex > .relative > .w-12').nth(2),
      toggle4: page.locator('.gap-2 > .flex > .relative > .w-12').nth(3)
      // toggle5: page.locator('.gap-2 > .flex > .relative > .w-12').nth(4),
      // toggle6: page.locator('.gap-2 > .flex > .relative > .w-12').nth(5),
      // toggle7: page.locator('.gap-2 > .flex > .relative > .w-12').nth(6)
    };

    // AI Model Selection
    this.aiModel1Radio = page.locator('.space-x-4 > :nth-child(1) input[type="radio"]')
      .or(page.locator('.space-x-4 > :nth-child(1) .relative .absolute'));
    this.aiModel2Radio = page.locator('.space-x-4 > :nth-child(2) input[type="radio"]')
      .or(page.locator('.space-x-4 > :nth-child(2) .relative .absolute'));

    // Auto-reply Settings
    this.autoReplyYesBtn = page.getByRole('radio', { name: /yes/i });
    this.autoReplyNoBtn = page.getByRole('radio', { name: /no/i });

    //  SOCIAL MEDIA RULES 
    // Create Rule Modal
    this.createRuleMainBtn = page
      .getByRole('heading', { name: /social media auto-reply settings/i })
      .locator('..')
      .getByRole('button', { name: /create rule/i });
    this.platformDropdown = page.getByRole('button', { name: /select an option/i }).first();
    this.selectFacebookOption = page.getByRole('option', { name: /facebook/i });
    this.selectInstagramOption = page.getByRole('option', { name: /instagram/i });
    this.accountDropdown = page.getByRole('button', { name: /select an option/i }).last();
    this.selectFacebookAccountOption = page.getByRole('option').first(); // Dynamic based on available accounts
    this.selectInstagramAccountOption = page.getByRole('option').first(); // Dynamic based on available accounts
    this.continueBtn = page.getByRole('button', { name: /select platform|continue/i });
    this.nextBtn = page.getByRole('button', { name: /next/i });
    
    // Rule Configuration
    this.commentsToggle = page.getByRole('checkbox', { name: /comments/i });
    this.directMessagesToggle = page.getByRole('checkbox', { name: /direct messages/i });
    this.defaultReplyField = page.getByRole('textbox', { name: /default reply/i });
    this.keywordField = page.getByRole('textbox', { name: /keyword/i });
    this.addKeywordBtn = page.locator('button[class="h-14 mt-8 bg-brand-secondary text-white px-6 py-4 text-base rounded-xl font-semibold transition-[colors,box-shadow] duration-200 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gray-100"]');
    this.maxRepliesField = page.getByRole('spinbutton').nth(0);
    this.maxRepliesDayField = page.getByRole('spinbutton').nth(1);
    this.minLikesField = page.getByRole('spinbutton').nth(2);
    this.createRuleBtn = page.getByRole('button', { name: /create rule/i });
    this.modalCreateBtn =  page.locator('[data-testid="modal-backdrop"]').getByRole('button', { name: /create rule/i });
    this.saveChangesBtn = page.getByRole('button', { name: /save changes/i });

    // Facebook Rules Section
    this.facebookRulesSection = page.locator('h3:has-text("Facebook Rules")');
    this.facebookDeleteBtn = page.locator('button:has(svg.remixicon.text-brand-red-500)').first();
    
    // Instagram Rules Section
    this.instagramRulesSection = page.locator('h3:has-text("Instagram Rules")');
    this.instagramDeleteBtn = page.locator('button:has(svg.remixicon.text-brand-red-500)').nth(1);
  }

  //  NAVIGATION METHODS 

  /**
   * Navigates to AI Bot section
   */
  async navigateToAIBot() {
    await this.aiBotMenuItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForTimeout(5000);
    await this.aiBotMenuItem.click();
    
  }

  /**
   * Navigates to Data Sources page
   */
  async navigateToDataSources() {
    await this.navigateToAIBot();
    // await this.dataSourcesLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.dataSourcesLink.click();
  }

  /**
   * Navigates to Playground
   */
  async navigateToPlayground() {
    await this.navigateToAIBot();
    // await this.playgroundLink.waitFor({ state: 'visible', timeout: 10000 });
    // await this.page.waitForTimeout(500);
    await this.playgroundLink.click();
  }

  /**
   * Navigates to Configure page
   */
  async navigateToConfigure() {
    await this.navigateToAIBot();
    await this.configureLink.waitFor({ state: 'visible', timeout: 10000 });
    // await this.page.waitForTimeout(500);
    await this.configureLink.click();
  }

  //  DATA SOURCES METHODS 

  /**
   * Switches to specified tab in Data Sources
   * @param {string} tabName -  'all questions', 'unanswered'
   */
  

    async switchToTab(tabName) {
      const tabs = {
          unaswered: this.unansweredQuestionsTab,
          answered: this.answeredQuestionsTab
      };
      
      const tab = tabs[tabName.toLowerCase()];
      if (!tab) {
          throw new Error(`Unknown tab: ${tabName}. Use 'answered' or 'unanswered'`);
      }
      
      await tab.waitFor({ state: 'visible', timeout: 10000 });
      await tab.click();
      await this.page.waitForTimeout(1000); // Wait for content to load
      
      console.log(`✓ Switched to ${tabName} tab`);
  }

  /**
   * Adds a new FAQ question and answer
   * @param {string} question - The question text
   * @param {string} answer - The answer text
   */
  async addNewFAQ(question, answer) {
    await this.addNewQuestionsBtn.click();
    await this.addQuestionHeader.waitFor({ state: 'visible', timeout: 5000 });
    
    await this.questionField.fill(question);
    await this.answerField.fill(answer);
    
    await this.saveAndCloseBtn.click();
  }

  /**
   * Exports table data in specified format
   * @param {string} format - 'csv', 'xlsx', or 'pdf'
   */
  async exportTableData(format) {
    await this.exportBtn.click();
    await this.exportTableDataHeader.waitFor({ state: 'visible', timeout: 5000 });
    
    const formatMap = {
      csv: this.csvBtn,
      xlsx: this.xlsxBtn,
      pdf: this.pdfBtn
    };

    const button = formatMap[format.toLowerCase()];
    if (!button) {
      throw new Error(`Unknown format: ${format}`);
    }

    await button.click();
  }

  /**
   * Uploads a product file
   * @param {string} filePath - Path to the file to upload
   */
  async uploadProductFile(filePath) {
    await this.addSourceBtn.click();
    await this.addSourceHeader.waitFor({ state: 'visible', timeout: 5000 });
    
    await this.importProductFileOption.click();
    await this.importProductFileHeader.waitFor({ state: 'visible', timeout: 5000 });
    
    await this.page.setInputFiles(this.uploadFileInput, filePath);
    await this.importBtn.click();
  }

  //  PLAYGROUND METHODS 

  /**
   * Sends a message in playground
   * @param {string} message - Message text to send
   */
  async sendMessage(message) {
    await this.chatInputField.waitFor({ state: 'visible', timeout: 10000 });
    await this.chatInputField.fill(message);
    await this.sendMessageBtn.first().click();
  }

  /**
   * Clicks an example prompt
   * @param {number} promptNumber - Prompt number (1-4)
   */
  async clickExamplePrompt(promptNumber) {
    const prompts = [
      this.promptLocationBtn,
      this.promptBusinessHoursBtn,
      this.promptProductsBtn,
      this.promptOrderBtn
    ];

    if (promptNumber < 1 || promptNumber > 4) {
      throw new Error('Prompt number must be between 1 and 4');
    }

    await prompts[promptNumber - 1].click();
  }

  /**
   * Resets the playground conversation
   */
  async resetPlayground() {
    await this.resetBtn.click();
  }

  //  CONFIGURE METHODS 

  /**
   * Toggles all general settings
   */
  async toggleAllGeneralSettings() {
    for (const [key, toggle] of Object.entries(this.generalToggles)) {
      try {
        await toggle.waitFor({ state: 'visible', timeout: 3000 });
        await toggle.click();
      } catch (error) {
        console.log(`Toggle ${key} not found or not clickable`);
      }
    }
  }

  /**
   * Creates a social media auto-reply rule
   * @param {string} platform - 'facebook' or 'instagram'
   * @param {Object} ruleConfig - Rule configuration object
   */
  async createAutoReplyRule(platform, ruleConfig) {
    await this.createRuleMainBtn.click();
    
    // Select platform
    await this.platformDropdown.click();
    if (platform.toLowerCase() === 'facebook') {
      await this.selectFacebookOption.click();
    } else {
      await this.selectInstagramOption.click();
    }
    
    // Select account
    await this.accountDropdown.click();
    await this.page.locator('div[role="option"]').first().click();
    
    await this.continueBtn.click();
    await this.nextBtn.click();
    
    // Configure default reply and keywords
    await this.defaultReplyField.fill(ruleConfig.defaultReply || 'Please hold');
    if (ruleConfig.keywords) {
      for (const keyword of ruleConfig.keywords) {
        await this.keywordField.fill(keyword);
        await this.addKeywordBtn.click();
      }
    }
    
    await this.nextBtn.click();
    
    // Configure advanced settings
    if (ruleConfig.maxReplies) {
      await this.maxRepliesField.fill(ruleConfig.maxReplies.toString());
    }
    if (ruleConfig.maxRepliesDay) {
      await this.maxRepliesDayField.fill(ruleConfig.maxRepliesDay.toString());
    }
    if (ruleConfig.minLikes) {
      await this.minLikesField.fill(ruleConfig.minLikes.toString());
    }
    
    await this.createRuleBtn.last().click();
  }

  /**
   * Deletes existing Facebook rule if present
   */
  async deleteFacebookRuleIfExists() {
    try {
      await this.facebookRulesSection.waitFor({ state: 'visible', timeout: 5000 });
      await this.facebookDeleteBtn.click();
      await this.alert.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch (error) {
      console.log('No Facebook rule to delete');
      return false;
    }
  }

  /**
   * Deletes existing Instagram rule if present
   */
  async deleteInstagramRuleIfExists() {
    try {
      await this.instagramRulesSection.waitFor({ state: 'visible', timeout: 5000 });
      await this.instagramDeleteBtn.click();
      await this.alert.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch (error) {
      console.log('No Instagram rule to delete');
      return false;
    }
  }
}