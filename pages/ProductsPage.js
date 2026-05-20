export class ProductsPage {
    constructor(page) {
        this.page = page;
        
        // Navigation
        this.productManagementMenu = page.getByRole('link', { name: /product management/i })
            .or(page.getByText(/product management/i).first());
        this.productsLink = page.getByRole('link', { name: 'Products', exact: true })
            .or(page.locator('[role="menuitem"]:has-text("Products"), a:has-text("Products")').first());
        
        // Page Header & Title
        this.pageTitle = page.locator('h1, h2').filter({ hasText: /products/i }).first();
        
        // Metrics Cards
        this.metricsTitle = page.locator('text=/product metrics/i').first();
        this.totalProductsMetric = page.locator('text=/total products/i').first();
        this.recentlyAddedMetric = page.locator('text=/recently added/i').first();
        this.trendingProductsMetric = page.locator('text=/trending products/i').first();
        
        // Status Tabs
        this.productsTab = page.locator('button:has-text("Products"), [role="tab"]:has-text("Products")').first();
        this.deletedTab = page.locator('button:has-text("Deleted"), [role="tab"]:has-text("Deleted")').first();
        
        // Table Column Headers
        this.columnHeaders = page.locator('thead th, [role="columnheader"]');
        this.nameColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /name|product/i }).first();
        this.categoryColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /category/i }).first();
        this.priceColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /price/i }).first();
        this.stockColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /stock|quantity/i }).first();
        this.statusColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /status/i }).first();
        this.actionsColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /actions/i }).first();
        
        // Action Buttons
        this.addProductButton = page.locator('button:has-text("Add"), button:has-text("New Product"), button:has-text("Create Product")').first();
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
        this.productNameInput = page.locator('#productName');
        this.categorySelect = page.locator('[class*="product-category-field"] [class*="flex-1"]').first()
            .or(page.getByText(/select a category/i).first());
        this.category = page.getByText('Electronics');
        this.priceInput = page.locator('input[placeholder="0.00"]');
        this.stockInput = page.locator('#stock');
        this.descriptionInput = page.locator('#description');
        this.availabilityDropdown = page.getByText('Select Availability')
            .or (page.getByText('Available')).or (page.getByText('Unavailable'));
        this.available = page.getByRole('option', { name: 'Available', exact: true }).locator('span');
        this.unavailable = page.getByRole('option', { name: 'Unavailable', exact: true }).locator('span');
        this.stockDropdown = page.getByText('Unlimited')
            .or (page.getByText('Limited'));
        this.limited = page.getByRole('option', { name: 'Limited', exact: true }).locator('span');
        this.unlimited = page.getByRole('option', { name: 'Unlimited', exact: true }).locator('span');
        this.uploadFileInput = page.locator('input[type="file"]');
        this.editQuestionBtn = page.getByRole('button', { name: /edit question/i });
        this.addCheckoutQuestionBtn = page.getByRole('button', { name: /add/i }).first();
        this.addFaqBtn = page.getByRole('button', { name: /add/i }).last();
        this.saveBtn = page.getByRole('button', { name: 'Save', exact: true });
        this.saveQuestionBtn = page.getByRole('button', { name: /save question/i });
        this.saveFaQBtn = page.getByRole('button', { name: /save faq/i });
        this.checkOutQstnModal = page.getByText('Add New Question');
        this.questionField = page.locator('#question')
            .or(page.getByLabel(/question/i));
        this.faqModal = page.getByText('Add New FAQ');
        this.answerField = page.locator('#answer')
            .or(page.getByLabel(/answer/i));

        // Form Buttons
        this.addButton = page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("Save")').first();
        this.updateButton = page.locator('button:has-text("Update"), button:has-text("Save")').first();
        this.cancelButton = page.locator('button:has-text("Cancel")').first();
        
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
    async navigateToProducts() {
        const link = this.page.getByRole('link', { name: 'Products', exact: true }).first()
            .or(this.page.locator('[role="menuitem"]:has-text("Products"), a:has-text("Products")').first());
        const directVisible = await link.isVisible({ timeout: 3000 }).catch(() => false);
        if (directVisible) {
            await link.click();
        } else {
            await this.productManagementMenu.waitFor({ state: 'visible', timeout: 10000 });
            await this.productManagementMenu.click();
            await this.productsLink.first().waitFor({ state: 'visible', timeout: 10000 });
            await this.productsLink.first().click();
        }
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Get all column header texts
     */
    async getColumnHeaderTexts() {
        await this.columnHeaders.first().waitFor({ state: 'visible' });
        return await this.columnHeaders.allTextContents();
    }

    async verifyColumnHeaders(expectedHeaders = ['ID', 'Products', 'Category', 'Price', 'Quantity', 'Availability','Actions']) {
        for (const header of expectedHeaders) {
            const headerLocator = this.page.locator('thead th, [role="columnheader"]')
                .filter({ hasText: new RegExp(header, 'i') });
            await headerLocator.first().waitFor({ state: 'visible', timeout: 10000 });
        }
    }

    /**
     * Switch to specific status tab
     */
    async switchToTab(tabName) {
        const tabMap = {
            'products': this.productsTab,
            'deleted': this.deletedTab
        };
        
        const tab = tabMap[tabName.toLowerCase()];
        if (tab) {
            await tab.click();
            await this.page.waitForTimeout(5000);
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



    async addCheckoutQuestion() {
        const questionText = `Temp question ${Date.now()}`;
        const btnVisible = await this.addCheckoutQuestionBtn.isVisible({ timeout: 5000 }).catch(() => false);
        if (!btnVisible) return;
        await this.addCheckoutQuestionBtn.click();
        await this.checkOutQstnModal.waitFor({ state: 'visible', timeout: 10000 });
        await this.questionField.fill(questionText);
        await this.saveQuestionBtn.click();
        await this.checkOutQstnModal.waitFor({ state: 'hidden', timeout: 10000 });
    }

    async addNewFAQ() {
        const question = `Temp question ${Date.now()}`;
        const answer = `Temp answer ${Date.now()}`;
        const btnVisible = await this.addFaqBtn.isVisible({ timeout: 5000 }).catch(() => false);
        if (!btnVisible) return;
        await this.addFaqBtn.click();
        await this.faqModal.waitFor({ state: 'visible', timeout: 5000 });
        await this.questionField.fill(question);
        await this.answerField.fill(answer);
        await this.saveFaQBtn.click();
        await this.faqModal.waitFor({ state: 'hidden', timeout: 10000 });
    }

    /**
     * Add a new product
     */
    async addNewProduct(productData) {
        await this.addProductButton.click();
        await this.productNameInput.fill(productData.name);
        
        // Always select category (required field)
        await this.categorySelect.click();
        await this.page.waitForTimeout(500);
        
        // Get first real category (exclude "Add New Category")
        const firstCategory = this.page
            .getByRole('option')
            .filter({ hasNotText: /add new category/i })
            .first();
        await firstCategory.click();
        
        // Fill description
        if (productData.description) {
            await this.descriptionInput.fill(productData.description);
        }
        
        // Fill price
        await this.priceInput.fill(productData.price);
        
        // Select availability (REQUIRED)
        await this.availabilityDropdown.click();
        await this.available.click(); // or appropriate option
        
        // Set stock to Limited and fill quantity (NEW - matches editProduct pattern)
        await this.stockDropdown.click();
        await this.limited.click(); // This reveals the stock input field
        await this.stockInput.fill(productData.stock);
        
        await this.addCheckoutQuestion().catch(() => {});
        await this.addNewFAQ().catch(() => {});

        await this.saveBtn.click();
    }
    /**
     * Edit a product
     */
    async editProduct(newProductData) {
        // Click actions button in first row
        const actionsButton = this.page.locator('tbody tr').first().locator('td').last().getByRole('button');
        await actionsButton.click();
        await this.page.waitForTimeout(500);

        // Click "View Product Details" option
        await this.page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            const option = options.find(el => el.textContent.includes('View Product Details'));
            if (option) option.click();
        });

        // Click "Edit Product" button (more specific than generic editButton locator)
        await this.page.waitForLoadState('domcontentloaded');
        const editProductBtn = this.page.getByRole('button', { name: /edit product/i }).first()
            .or(this.page.locator('button:has-text("Edit Product")').first());
        await editProductBtn.click();

        // Wait for form/modal
        await this.page.waitForTimeout(1500);

        // Wait for form/modal
        await this.productNameInput.waitFor({state: 'visible', timeout: 15000});
        
        // Fill product name
        await this.productNameInput.clear();
        await this.productNameInput.fill(newProductData.name);

        // Select category if exists
        // Always select category (required field)
        await this.categorySelect.click();
        await this.page.waitForTimeout(500);

       const firstCategory = this.page
            .getByRole('option')
            .filter({ hasNotText: /add new category/i })
            .first();
        await firstCategory.click();

        // Fill description if exists
        if (newProductData.description && await this.descriptionInput.isVisible().catch(() => false)) {
            await this.descriptionInput.clear();
            await this.descriptionInput.fill(newProductData.description);
        }
        
        // Fill price
        if (newProductData.price) {
            await this.priceInput.clear();
            await this.priceInput.fill(newProductData.price.toString());
        }

        // Fill Availability
        await this.availabilityDropdown.click();
        await this.available.click();
        
        // Fill stock
        await this.stockDropdown.click();
        await this.limited.click();
        await this.stockInput.clear();
        await this.stockInput.fill(newProductData.stock.toString());
     
        // Save
        await this.saveBtn.click();
    }

    /**
     * Delete a product
     */
    async deleteProduct() {
        // Click actions button in first row
        const actionsButton = this.page.locator('tbody tr').first().locator('td').last().getByRole('button');
        await actionsButton.click();
        await this.page.waitForTimeout(500);

        // Click "Delete" option
        await this.page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            const option = options.find(el => el.textContent.includes('Delete Product'));
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
     * Get product count
     */
    async getProductCount() {
        return await this.tableRows.count();
    }

    /**
     * Get product name from specific row
     */
    async getProductName(rowIndex = 0) {
        const row = this.tableRows.nth(rowIndex);
        const nameCell = row.locator('td').nth(1); // Usually second column after checkbox/number
        return await nameCell.textContent();
    }

    /**
     * Verify product exists in table
     */
    async verifyProductExists(productName) {
        const product = this.page.getByText(`${productName}`);
        await product.waitFor({ state: 'visible', timeout: 10000 });
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
    async reorderProduct(fromIndex, toIndex) {
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
            const sortButton = this.page.locator('th:has-text("ID") button:has(svg)').first();
            
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