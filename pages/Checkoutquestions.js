export class CheckoutQuestionsPage {
    constructor(page) {
        this.page = page;
        
        // Navigation
        this.orderManagementMenuItem = page.getByRole('link', { name: /order management/i })
            .or(page.getByText(/order management/i).first());
        this.checkoutQuestionsLink = page.getByRole('link', { name: /checkout questions/i })
            .or(page.locator('a:has-text("Checkout Questions")'));
        
        
        // Page Header
        this.pageTitle = page.getByTestId('page-title');
        
        // Table Column Headers
        this.columnHeaders = page.locator('thead th, [role="columnheader"]');
        this.questionColumnHeader = page.getByRole('cell', { name: /^question$/i });
        this.reorderColumnHeader = page.getByRole('cell', { name: /^reorder$/i });
        this.actionColumnHeader = page.getByRole('cell', { name: /^action$/i });
        
        
        // Action Buttons
        // In CheckoutQuestionsPage.js constructor:

        // Export main button
        this.exportBtn = page.locator('button:has-text("Export")').first();

        // Export format options (these appear after clicking export)
        this.exportModal = page.getByText("Export Table Data");
        this.exportModalHeading = page.getByText("Export Table Data");
        this.csvBtn = page.locator('button:has-text("CSV")')
        this.xlsxBtn = page.locator('button:has-text("XLSX")')
        this.pdfBtn = page.locator('button:has-text("PDF")')
        this.closeModalBtn = page.getByRole('button', { name: 'Close modal' })
            .or(page.locator('button[aria-label="Close modal"]'));

        // Table Rows
        this.tableRows = page.locator('tbody tr, [role="row"]:not(:has(th))');
        this.firstTableRow = page.locator('tbody tr, [role="row"]:not(:has(th))').first();
        
        // Row Actions (Edit, Delete)
        this.editButtons = page.locator('button:has-text("Edit"), [aria-label*="edit" i], [title*="edit" i]');
        this.deleteButtons = page.locator('button:has-text("Delete"), [aria-label*="delete" i], [title*="delete" i]');
        this.firstEditButton = this.editButtons.first();
        this.firstDeleteButton = this.deleteButtons.first();
        
        // Modal/Dialog
        this.modal = page.locator('label[for="question"]');
        this.modalTitle = page.locator('[role="dialog"] h2, [role="dialog"] h3, .modal h2, .modal h3').first();
        this.closeModalButton = page.locator('[role="dialog"] button:has-text("Close"), [role="dialog"] button[aria-label="Close"]').first();
        
        // Form Fields (Add/Edit Question)
        this.questionInput = page.locator('input[name="question"], input[placeholder*="question" i], textarea[name="question"]').first();
        this.questionTypeSelect = page.locator('select[name="type"], select[name="questionType"], [role="combobox"]').first();
        this.statusToggle = page.locator('input[type="checkbox"][name*="status"], input[type="checkbox"][name*="active"]').first();
        this.addButton = page.getByTestId('modal-backdrop').getByRole('button', { name: 'Add' });
        this.updateButton = page.getByRole('button', {name: 'Update'});
        this.cancelButton = page.locator('button:has-text("Cancel")').first();
        this.addQuestionButton = page.getByRole('button', {name: 'Add New Store Question'});
        this.editQuestionButton = page.getByText('Edit Question');
        this.deleteQuestionButton = page.getByText('Delete Question');
        
        
        // Delete Confirmation
        this.confirmDeleteButton = page.getByRole('button', { name: /confirm/i })
            .or(page.locator('button:has-text("Confirm")'));
        this.cancelDeleteButton = page.getByRole('button', { name: /cancel/i })
            .or(page.locator('button:has-text("Cancel")'));
        
        // Success/Error Messages
        this.successMessage = page.locator('[role="alert"], .alert-success, .toast, [class*="success"]').first();
        this.errorMessage = page.locator('[role="alert"], .alert-error, [class*="error"]').first();
        
        // Drag and Drop / Reorder
        this.dragHandles = page.locator('[class*="drag"], [class*="handle"], [draggable="true"]');
        
        // Empty State
        this.emptyState = page.locator('text=/no questions|no data|empty/i').first();
    }

     async navigateToOrderManagement() {
    await this.orderManagementMenuItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.orderManagementMenuItem.click();
  }


    /**
     * Navigate to Checkout Questions page
     */
    async navigateToCheckoutQuestions() {
        // Direct navigation - more reliable than menu clicks
        await this.page.goto('/en/dashboard/orders/checkout-questions');
        await this.page.waitForLoadState('domcontentloaded');
        
        // Wait for page to be ready
        await this.pageTitle.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Verify all column headers are displayed
     */
    async verifyColumnHeaders(expectedHeaders = ['Question', 'Reorder', 'Action']) {
        for (const header of expectedHeaders) {
            const headerLocator = this.page.locator('thead th, [role="columnheader"]')
                .filter({ hasText: new RegExp(header, 'i') });
            await headerLocator.first().waitFor({ state: 'visible', timeout: 10000 });
        }
    }

    /**
     * Get all column header texts
     */
    async getColumnHeaderTexts() {
        await this.columnHeaders.first().waitFor({ state: 'visible' });
        return await this.columnHeaders.allTextContents();
    }

    /**
     * Click export button and handle download
     */
    async exportQuestions(format) {
    await this.exportBtn.click();
    
    const formatMap = {
      csv: this.csvBtn,
      xlsx: this.xlsxBtn,
      pdf: this.pdfBtn
    };

    const button = formatMap[format.toLowerCase()];
    if (!button) {
      throw new Error(`Unknown format: ${format}. Use 'csv', 'xlsx', or 'pdf'`);
    }

    await button.click();
  }

    /**
     * Add a new checkout question
     */
    async addNewQuestion(questionText, type = 'Text', isActive = true) {
        // Click Add button
        await this.addQuestionButton.click();
        
        // Wait for modal to appear
        await this.modal.waitFor({ state: 'visible', timeout: 5000 });
        
        // Fill in question
        await this.questionInput.fill(questionText);
        
        // Select type if dropdown exists
        if (await this.questionTypeSelect.isVisible().catch(() => false)) {
            await this.questionTypeSelect.selectOption({ label: type });
        }
        
        // Save
        await this.addButton.click();
        
        // Wait for modal to close
        await this.modal.waitFor({ state: 'hidden', timeout: 5000 });
    }

    /**
     * Edit an existing question
     */
    /**
 * Edit an existing question
 */
    async editQuestion(newQuestionText) {
        // Click the actions button
        const row = this.page.locator('tbody tr').first();
        const actionsButton = row.locator('td').last().getByRole('button');
        await actionsButton.hover();
        await actionsButton.click();
        await this.page.waitForTimeout(5000);

        // Click "Edit Question" from dropdown
        await this.editQuestionButton.click({ timeout: 10000,force: true });

        // Wait for modal and verify it's the edit modal
        await this.modal.waitFor({ state: 'visible', timeout: 10000 });
        
        // Fill in the new question
        await this.questionInput.fill(newQuestionText);
        
        // Click Save/Update
        await this.updateButton.click();
        
        // Wait for success or modal close
        await this.modal.waitFor({ state: 'hidden', timeout: 5000 });
    }

    /**
     * Delete a question
     */
    async deleteQuestion() {
        // Click the actions button
        const row = this.page.locator('tbody tr').first();
        const actionsButton = row.locator('td').last().getByRole('button');
        await actionsButton.click();
       
        await this.deleteQuestionButton.waitFor({ state: 'visible', timeout: 5000 });

        // Click "Delete Question" from dropdown
        await this.deleteQuestionButton.click(({ timeout: 10000 }));

         // Wait for confirmation dialog and confirm
        await this.confirmDeleteButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.confirmDeleteButton.click();
        
    }

    /**
     * Get question text from specific row
     */
    async getQuestionText(rowIndex = 0) {
        const row = this.tableRows.nth(rowIndex);
        return await row.locator('td').first().textContent();
    }

    /**
     * Get total number of questions in table
     */
    async getQuestionCount() {
        return await this.tableRows.count();
    }

    /**
     * Reorder question by dragging (if drag-and-drop is available)
     */
    async reorderQuestion(fromIndex, toIndex) {
        const fromHandle = this.dragHandles.nth(fromIndex);
        const toRow = this.tableRows.nth(toIndex);
        
        // Drag and drop
        await fromHandle.dragTo(toRow);
        
        // Wait for reorder to complete
        await this.page.waitForTimeout(1000);
    }

    // Main method - use this one
    async verifyQuestionExists(questionText) {
        console.log(`🔍 Searching for question: "${questionText}"`);
        
        // Wait for table to update after sorting
        await this.page.waitForTimeout(1500);
        await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        
        // Now check first page (most recent items should be on top)
        console.log(`📄 Checking sorted table...`);
        
        // Wait for table to be stable
        await this.page.waitForSelector('tbody tr', { state: 'visible', timeout: 5000 });
        
        // Check if question exists on current page
        const question = this.page.locator(`tbody tr:has-text("${questionText}")`);
        const questionCount = await question.count();
        
        if (questionCount > 0) {
            await question.first().waitFor({ state: 'visible', timeout: 5000 });
            console.log(`✓ Question found after sorting`);
            return true;
        }
        
        // If not found on first page after sorting, search through all pages
        console.log(`⚠️ Question not on first page, searching all pages...`);
        return await this.searchAllPages(questionText);
    }

    // Helper: Sort by descending
    async sortByDescending() {
        try {
            // Click the Reorder column sort button (with SVG icon)
            const sortButton = this.page.locator('th:has-text("Reorder") button:has(svg)').first();
            
            const sortButtonExists = await sortButton.count() > 0;
            
            if (sortButtonExists) {
                await sortButton.click();
                console.log('✓ Clicked sort dropdown');
                
                // Wait for dropdown menu
                await this.page.waitForTimeout(500);
                
                // Click "Sort Descending"
                const sortDescending = this.page.getByText('Sort Descending', { exact: true });
                await sortDescending.waitFor({ state: 'visible', timeout: 5000 });
                await sortDescending.click();
                
                console.log('✓ Selected "Sort Descending"');
                await this.page.waitForTimeout(1000);
            } else {
                console.log('⚠️ Sort button not found, skipping sort');
            }
        } catch (error) {
            console.log(`⚠️ Could not sort: ${error.message}`);
        }
    }

    // Helper: Search all pages (fallback)
    async searchAllPages(questionText) {
        let currentPage = 1;
        const maxPages = 50;
        
        while (currentPage <= maxPages) {
            console.log(`📄 Checking page ${currentPage}...`);
            
            // Check current page
            const rows = await this.page.locator('tbody tr').all();
            for (const row of rows) {
                const rowText = await row.textContent();
                if (rowText.toLowerCase().includes(questionText.toLowerCase())) {
                    console.log(`✓ Question found on page ${currentPage}`);
                    return true;
                }
            }
            
            // Try to navigate to next page - use page number button
            const nextPageNumber = currentPage + 1;
            const nextPageButton = this.page.getByRole('button', { name: String(nextPageNumber), exact: true });
            
            if (await nextPageButton.isVisible().catch(() => false)) {
                await nextPageButton.click();
                await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
                currentPage++;
            } else {
                // No more pages
                break;
            }
        }
        
        throw new Error(`Question "${questionText}" not found after checking ${currentPage} page(s)`);
    }

    // Helper: Get next page button
    async getNextPageButton() {
        const selectors = [
            'button[aria-label*="next page" i]',
            'button:has-text("Next")',
            'nav button:last-of-type'
        ];
        
        for (const selector of selectors) {
            const button = this.page.locator(selector).first();
            if (await button.count() > 0) return button;
        }
        return null;
    }

    // Helper: Check if can navigate next
    async canNavigateNext(nextButton) {
        const isVisible = await nextButton.isVisible().catch(() => false);
        const isDisabled = await nextButton.isDisabled().catch(() => true);
        return isVisible && !isDisabled;
    }

    /**
     * Verify success message appears
     */
    async verifySuccessMessage(expectedMessage) {
        await this.successMessage.waitFor({ state: 'visible', timeout: 10000 });
        if (expectedMessage) {
            const message = await this.successMessage.textContent();
            return message.toLowerCase().includes(expectedMessage.toLowerCase());
        }
        return true;
    }

    /**
     * Wait for page to load completely
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.pageTitle.waitFor({ state: 'visible', timeout: 10000 });
    }
}