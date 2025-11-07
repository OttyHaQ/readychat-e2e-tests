export class CheckoutQuestionsPage {
    constructor(page) {
        this.page = page;
        
        // Navigation
        this.ordersMenu = page.locator('a[href*="/orders"], button:has-text("Orders")');
        this.checkoutQuestionsLink = page.locator('a[href*="/checkout-questions"]');
        
        // Page Header
        this.pageTitle = page.getByTestId('page-title');
        
        // Table Column Headers
        this.columnHeaders = page.locator('thead th, [role="columnheader"]');
        this.questionColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /question/i }).first();
        this.reorderColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /reorder/i }).first();
        this.actionColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /action/i }).first();
        
        
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
        
        // Delete Confirmation
        this.confirmDeleteButton = page.locator('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")').last();
        this.cancelDeleteButton = page.locator('button:has-text("Cancel"), button:has-text("No")').last();
        
        // Success/Error Messages
        this.successMessage = page.locator('[role="alert"], .alert-success, .toast, [class*="success"]').first();
        this.errorMessage = page.locator('[role="alert"], .alert-error, [class*="error"]').first();
        
        // Drag and Drop / Reorder
        this.dragHandles = page.locator('[class*="drag"], [class*="handle"], [draggable="true"]');
        
        // Empty State
        this.emptyState = page.locator('text=/no questions|no data|empty/i').first();
    }

    /**
     * Navigate to Checkout Questions page
     */
    async navigateToCheckoutQuestions() {
        await this.checkoutQuestionsLink.click();
        await this.page.waitForURL(/checkout-questions/);
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
        await this.editQuestionButton.click({ timeout: 2000,force: true });

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
    async deleteQuestion(rowIndex = 0) {
        // Click delete button for specific row
        await this.deleteButtons.nth(rowIndex).click();
        
        // Wait for confirmation dialog
        await this.page.waitForTimeout(500);
        
        // Confirm deletion
        await this.confirmDeleteButton.click();
        
        // Wait for success message or row to disappear
        await this.page.waitForTimeout(1000);
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

    /**
     * Verify question exists in table
     */
    async verifyQuestionExists(questionText) {
        const question = this.page.locator(`tbody tr:has-text("${questionText}")`);
        await question.waitFor({ state: 'visible', timeout: 10000 });
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