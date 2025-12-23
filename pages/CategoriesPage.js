export class CategoriesPage {
    constructor(page) {
        this.page = page;
        
        // Navigation
        this.productManagementMenu = page.getByRole('link', { name: /product management/i })
            .or(page.getByText(/product management/i).first());
        this.categoriesLink = page.getByRole('link', { name: /categories/i })
            .or(page.locator('a:has-text("Categories")'));
        
        // Page Header & Title
        this.pageTitle = page.locator('h1, h2').filter({ hasText: /categories/i }).first();
        
        // Metrics Cards
        this.metricsTitle = page.locator('text=/category metrics/i').first();
        this.totalCategoriesMetric = page.locator('text=/total categories/i').first();
        this.recentlyAddedMetric = page.locator('text=/recently added/i').first();
        this.trendingCategoriesMetric = page.locator('text=/trending categories/i').first();
        
        
        // Table Column Headers
        this.columnHeaders = page.locator('thead th, [role="columnheader"]');
        this.nameColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /name/i }).first();
        this.descriptionColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /description/i }).first();
        this.actionsColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /actions/i }).first();
        
        // Action Buttons
        this.addCategoryButton = page.locator('button:has-text("Add"), button:has-text("New Categories"), button:has-text("Create Category")').first();
        this.exportBtn = page.locator('button:has-text("Export")').first();
        this.reorderColumnsBtn = page.locator('button:has-text("Reorder"), [aria-label*="reorder" i]').first();
        
        // Export Modal
        this.exportModal = page.getByText("Export Table Data")
            .or (page.locator('heading:has-text("Export Table Data")'));
        this.csvBtn = page.locator('button:has-text("CSV")');
        this.xlsxBtn = page.locator('button:has-text("XLSX")');
        this.pdfBtn = page.locator('button:has-text("PDF")');
        this.closeModalBtn = page.locator('button[aria-label="Close modal"]');
        
        // Table Rows
        this.tableRows = page.locator('tbody tr, [role="row"]:not(:has(th))');
        this.firstTableRow = page.locator('tbody tr, [role="row"]:not(:has(th))').first();
        
        // Row Action Buttons
        this.actionsButton = page.locator('tbody tr button[aria-label*="actions" i], tbody tr td:last-child button').first();
        this.editButton = page.getByRole('Button', {name: 'Edit'})
            .or (page.locator('[role="option"]:has-text("Edit"), button:has-text("Edit")'));
        this.deleteButton = page.locator('[role="option"]:has-text("Delete"), button:has-text("Delete")');
        
        // Add/Edit Product Form Fields
        this.categoryNameInput = page.locator('#category_name');
        this.descriptionInput = page.locator('#description');
        this.uploadFileInput = page.locator('input[type="file"]');
        this.saveBtn = page.getByRole('button', { name: 'Save & Close', exact: true });
        this.updateBtn = page.getByRole('button', { name: 'Update & Close', exact: true });
        this.modal = page.locator('h6[class="flex items-center"]');
        
        
        // Delete Confirmation
        this.confirmDeleteButton = page.getByRole('button', { name: /confirm/i })
            .or (page.locator('button:has-text("Delete"), button:has-text("Confirm"), button:has-text("Yes")').last());
        this.cancelDeleteButton = page.getByRole('button', { name: /cancel/i })
        .or (page.locator('button:has-text("Cancel"), button:has-text("No")').last());
        
        // Reorder Columns Modal
        this.reorderModal = page.locator('[role="dialog"]').filter({ hasText: /reorder|column/i }).first();
        this.toggleAllCheckbox = page.locator('input[type="checkbox"]').first();
        this.saveColumnOrderBtn = page.locator('button:has-text("Save"), button:has-text("Apply")').first();
        
        // Drag and Drop
        this.dragHandles = page.locator('[class*="drag"], [class*="handle"], [draggable="true"]');
    }

    /**
     * Navigate to Products page
     */
    async navigateToCategories() {
        await this.productManagementMenu.click();
        await this.categoriesLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.categoriesLink.click();
    }

    /**
     * Get all column header texts
     */
    async getColumnHeaderTexts() {
        await this.columnHeaders.first().waitFor({ state: 'visible' });
        return await this.columnHeaders.allTextContents();
    }

    async verifyColumnHeaders(expectedHeaders = ['Name', 'Descripion', 'Actions']) {
        for (const header of expectedHeaders) {
            const headerLocator = this.page.locator('thead th, [role="columnheader"]')
                .filter({ hasText: new RegExp(header, 'i') });
            await headerLocator.first().waitFor({ state: 'visible', timeout: 10000 });
        }
    }

    /**
     * Export products in specified format
     */
    async exportProducts(format) {
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
     * Add a new product
     */
    async addNewCategory(categoryData) {
        
        // Click Add button
        await this.addCategoryButton.click();
        
        // Wait for form/modal
        await this.categoryNameInput.waitFor({state: 'visible', timeout: 10000});

        //Upload file
        const filePath = 'tests/fixtures/office_1.jpg';
        await this.uploadFileInput.setInputFiles(filePath);
        
        // Fill product name
        await this.categoryNameInput.fill(categoryData.name);

        // Fill description 
        await this.descriptionInput.fill(categoryData.description);
        
        // Save
        await this.saveBtn.click();
        
        // Wait for form to close
        await this.page.waitForTimeout(2000);
    }

    /**
     * Edit a Category
     */
    async editCategory(newCategoryData) {
        // Click actions button in first row
        const actionsButton = this.page.locator('tbody tr').first().locator('td').last().getByRole('button');
        await actionsButton.click();
        await this.page.waitForTimeout(500);

        // Click "View Category Details" option
        await this.page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            const option = options.find(el => el.textContent.includes('View Category Details'));
            if (option) option.click();
        });

        // Click "Edit"
        await this.editButton.click();

        // Wait for form/modal
        await this.page.waitForTimeout(1500);
        
        // Wait for form/modal
        await this.categoryNameInput.waitFor({state: 'visible', timeout: 10000});
        
        // Fill product name
        await this.categoryNameInput.clear();
        await this.categoryNameInput.fill(newCategoryData.name);

        // Fill description
    
        await this.descriptionInput.clear();
        await this.descriptionInput.fill(newCategoryData.description);

        // Save
        await this.updateBtn.click();
        
        // Wait for save to complete
        await this.page.waitForTimeout(2000);
    }

    /**
     * Delete a category
     */
    async deleteCategory() {
        // Click actions button in first row
        const actionsButton = this.page.locator('tbody tr').first().locator('td').last().getByRole('button');
        await actionsButton.click();
        await this.page.waitForTimeout(500);

        // Click "Delete" option
        await this.page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            const option = options.find(el => el.textContent.includes('Delete Category'));
            if (option) option.click();
        });

        // Wait for confirmation dialog
        await this.page.waitForTimeout(1000);
        
        // Confirm deletion
        await this.confirmDeleteButton.click();
        
        // Wait for deletion to complete
        await this.page.waitForTimeout(2000);
    }

    /**
     * Get cateory count
     */
    async getCategoryCount() {
        return await this.tableRows.count();
    }

    /**
     * Get category name from specific row
     */
    async getCategoryName(rowIndex = 0) {
        const row = this.tableRows.nth(rowIndex);
        const nameCell = row.locator('td').nth(1); // Usually second column after checkbox/number
        return await nameCell.textContent();
    }

    /**
     * Verify product exists in table
     */
    async verifyCategoryExists(categoryName) {
        const category = this.page.getByRole('row', { name: `${categoryName}` }).locator('span')
        await category.waitFor({ state: 'visible', timeout: 10000 });
    }

    /**
     * Open reorder columns modal
     */
    async openReorderColumns() {
        await this.reorderColumnsBtn.click();
        await this.reorderModal.waitFor({ state: 'visible', timeout: 5000 });
    }

    /**
     * Toggle all columns
     */
    async toggleAllColumns() {
        await this.toggleAllCheckbox.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * Save column order
     */
    async saveColumnOrder() {
        await this.saveColumnOrderBtn.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Reorder products by dragging
     */
    async reorderCategory(fromIndex, toIndex) {
        const fromHandle = this.dragHandles.nth(fromIndex);
        const toRow = this.tableRows.nth(toIndex);
        
        // Drag and drop
        await fromHandle.dragTo(toRow);
        
        // Wait for reorder to complete
        await this.page.waitForTimeout(1000);
    }

    /**
     * Sort by descending order (if sort button exists)
     */
    async sortByDescending() {
        try {
            // Click the Reorder column sort button (with SVG icon)
            const sortButton = this.page.locator('th:has-text("Name") button:has(svg)').first();
            
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

    /**
     * Wait for page to load
     */
    async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.pageTitle.waitFor({ state: 'visible', timeout: 10000 });
    }
}