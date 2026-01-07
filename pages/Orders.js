import { expect } from '@playwright/test';

export class Orders {
  constructor(page) {
    this.page = page;
    
    // ============ NAVIGATION ============
    this.orderManagementMenuItem = page.getByRole('link', { name: /order management/i })
      .or(page.getByText(/order management/i).first());
    this.ordersLink = page.getByRole('link', { name: /^orders$/i })
      .or(page.locator('a:has-text("Orders")'));
    this.checkoutQuestionsLink = page.getByRole('link', { name: /checkout questions/i })
      .or(page.locator('a:has-text("Checkout Questions")'));
    
    // ============ METRICS ============
    this.totalOrdersMetric = page.getByText(/total orders/i)
      .or(page.locator('span:has-text("Total Orders")'));
    this.completedOrdersMetric = page.getByText(/completed orders/i)
      .or(page.locator('span:has-text("Completed Orders")'));
    this.ordersInProgressMetric = page.getByText(/orders in progress/i)
      .or(page.locator('span:has-text("Orders in Progress")'));
    this.ordersCancelledMetric = page.getByText(/orders cancelled/i)
      .or(page.locator('span:has-text("Orders Cancelled")'));
    this.totalSalesMetric = page.getByText(/total sales/i)
      .or(page.locator('span:has-text("Total Sales")'));
    
    // ============ STATUS TABS ============
    this.allOrdersTab = page.getByRole('tab', { name: /all orders/i })
      .or(page.locator('span:has-text("All Orders")'));
    this.inProgressTab = page.getByRole('tab', { name: /in progress/i })
      .or(page.locator('div.flex span:has-text("In Progress")').first());
    this.draftTab = page.getByRole('tab', { name: /draft/i })
      .or(page.locator('span:has-text("Draft")'));
    this.confirmedTab = page.getByRole('tab', { name: /confirmed/i })
      .or(page.locator('span:has-text("Confirmed")'));
    this.shippingTab = page.getByRole('tab', { name: /shipping/i })
      .or(page.locator('span:has-text("Shipping")'));
    this.deliveredTab = page.getByRole('tab', { name: /delivered/i })
      .or(page.locator('span:has-text("Delivered")'));
    this.completedTab = page.getByRole('tab', { name: /completed/i })
      .or(page.locator('span:has-text("Completed")'));
    this.cancelledTab = page.getByRole('tab', { name: /cancelled/i })
      .or(page.locator('span:has-text("Cancelled")'));
    
    // ============ TABLE COLUMNS ============
    this.idColumn = page.getByRole('columnheader', { name: /^id$/i })
      .or(page.locator('div:has-text("ID")').first());
    this.productsColumn = page.getByRole('columnheader', { name: /products/i })
      .or(page.locator('div:has-text("Products")').first());
    this.customerColumn = page.getByRole('columnheader', { name: /customer/i })
      .or(page.locator('div:has-text("Customer")').first());
    this.createdColumn = page.getByRole('columnheader', { name: /created/i })
      .or(page.locator('div:has-text("Created")').first());
    this.quantityColumn = page.getByRole('columnheader', { name: /quantity/i })
      .or(page.locator('div:has-text("Quantity")').first());
    this.totalCostColumn = page.getByRole('columnheader', { name: /total cost/i })
      .or(page.locator('div:has-text("Total Cost")').first());
    this.channelsColumn = page.getByRole('columnheader', { name: /channels/i })
      .or(page.locator('div:has-text("Channels")').first());
    this.statusColumn = page.getByRole('columnheader', { name: /^status$/i })
      .or(page.locator('div:has-text("Status")').first());
    this.actionsColumn = page.getByRole('columnheader', { name: /actions/i })
      .or(page.locator('div:has-text("Actions")').first());
    
    // ============ REORDER COLUMNS ============
    this.reorderBtn = page.locator('button[class="h-full bg-gray-100 text-gray-700 border-2 border-brand-gray-200 p-4 text-base rounded-xl font-semibold transition-[colors,box-shadow] duration-200 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gray-100"]');
    this.idCheckbox = page.getByRole('checkbox', { name: /id/i })
      .or(page.locator('span:has-text("ID")').locator('..').locator('input[type="checkbox"]'));
    this.productsCheckbox = page.getByRole('checkbox', { name: /products/i })
      .or(page.locator('span:has-text("Products")').locator('..').locator('input[type="checkbox"]'));
    this.customerCheckbox = page.getByRole('checkbox', { name: /customer/i })
      .or(page.locator('span:has-text("Customer")').locator('..').locator('input[type="checkbox"]'));
    this.createdCheckbox = page.getByRole('checkbox', { name: /created/i })
      .or(page.locator('span:has-text("Created")').locator('..').locator('input[type="checkbox"]'));
    this.quantityCheckbox = page.getByRole('checkbox', { name: /quantity/i })
      .or(page.locator('span:has-text("Quantity")').locator('..').locator('input[type="checkbox"]'));
    this.totalCostCheckbox = page.getByRole('checkbox', { name: /total cost/i })
      .or(page.locator('span:has-text("Total Cost")').locator('..').locator('input[type="checkbox"]'));
    this.channelsCheckbox = page.getByRole('checkbox', { name: /channels/i })
      .or(page.locator('span:has-text("Channels")').locator('..').locator('input[type="checkbox"]'));
    this.statusCheckbox = page.getByRole('checkbox', { name: /status/i })
      .or(page.locator('span:has-text("Status")').locator('..').locator('input[type="checkbox"]'));
    this.actionsCheckbox = page.getByRole('checkbox', { name: /actions/i })
      .or(page.locator('span:has-text("Actions")').locator('..').locator('input[type="checkbox"]'));
    this.saveBtn = page.getByRole('button', { name: /^save$/i })
      .or(page.locator('button:has-text("Save")').first());
    this.cancelBtn = page.getByRole('button', { name: /cancel/i })
      .or(page.locator('button:has-text("Cancel")'));
    
    // ============ EXPORT ============
    this.exportBtn = page.getByRole('button', { name: /export/i })
      .or(page.locator('button:has-text("Export")'));
    this.csvBtn = page.getByRole('button', { name: /csv/i })
      .or(page.locator('button:has-text("CSV")'));
    this.xlsxBtn = page.getByRole('button', { name: /xlsx/i })
      .or(page.locator('button:has-text("XLSX")'));
    this.pdfBtn = page.getByRole('button', { name: /pdf/i })
      .or(page.locator('button:has-text("PDF")'));
    this.closeModalBtn = page.getByRole('button', { name: /close/i })
      .or(page.locator('button[aria-label="Close modal"]'));
    
    // ============ ORDER DETAILS & EDIT ============
    this.firstRow = page.locator('table tbody tr').first();
    this.orderPageTitle = page.getByRole('heading', { name: 'Order ID:' });
    this.customerDetailsHeader = page.getByRole('heading', { name: /customer details/i })
      .or(page.locator('h4:has-text("Customer Details")'));
    this.editOrderBtn = page.getByRole('button', { name: /edit order/i })
      .or(page.locator('button:has-text("Edit Order")'));
    this.editOrderTitle = page.getByRole('heading', { name: /edit order/i })
      .or(page.locator('.text-center.font-semibold.text-2xl'));
    this.notesField = page.locator('#notes')
      .or(page.getByLabel(/notes/i));
    this.selectProductDropdown = page.locator('button[class="w-full ps-4 pe-2 py-4 mt-2 text-left bg-white border border-brand-gray-100 rounded-xl shadow-sm focus:outline-none flex items-center justify-between"]')
      .or(page.getByText(/select.*product/i));
    this.productSearchField = page.getByPlaceholder(/search/i)
      .or(page.locator('input[placeholder="Search..."]'));
    this.quantityField = page.locator('input[id*="quantity"]').first()
      .or(page.locator('input[id="products[0].quantity"]'));
    this.saveChangesBtn = page.getByRole('button', { name: /save changes/i })
      .or(page.locator('button:has-text("Save changes")'));
    this.closeBtn = page.getByRole('button', { name: /^close$/i })
      .or(page.locator('button:has-text("Close")'));
    
    // ============ ORDER ACTIONS ============
    this.viewOrderDetailsOption = page.getByRole('option', { name: /view order details/i });
    this.cancelOrderOption = page.getByRole('option', { name: /cancel order/i });
    this.deleteOrderOption = page.getByRole('option', { name: /delete order/i });
    this.confirmBtn = page.getByRole('button', { name: /confirm/i })
      .or(page.locator('button:has-text("Confirm")'));
    
    // ============ STATUS DROPDOWN ============
    this.statusOptions = page.locator('[role="option"]');
    this.currentOption = page.locator('[role="option"]:has(svg)');
    
    // ============ ALERTS ============
    this.alert = page.locator('[role="alert"]')
      .or(page.locator('div[role="alert"]'));
    this.orderStatusHeader = page.locator('.h4')
      .or(page.getByRole('heading', { level: 4 }));
  }

  // ============ NAVIGATION METHODS ============

  /**
   * Navigates to Order Management section
   */
  async navigateToOrderManagement() {
    await this.orderManagementMenuItem.waitFor({ state: 'visible', timeout: 10000 });
    await this.orderManagementMenuItem.click();
  }

  /**
   * Navigates to Orders page
   */
  async navigateToOrders() {
    await this.navigateToOrderManagement();
    await this.ordersLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.ordersLink.click();
  }

  /**
   * Switches to a specific order status tab
   * @param {string} status - 'all', 'in_progress', 'draft', 'confirmed', 'shipping', 'delivered', 'completed', 'cancelled'
   */
  async switchToStatusTab(status) {
    const displayNames = {
      all: 'All Orders',
      in_progress: 'In Progress',
      draft: 'Draft',
      confirmed: 'Confirmed',
      shipping: 'Shipping',
      delivered: 'Delivered',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    
    const tabName = displayNames[status.toLowerCase()];
    if (!tabName) throw new Error(`Unknown status: ${status}`);
    
    // Click tab using JavaScript for reliability
    await this.page.evaluate((name) => {
      const elements = Array.from(document.querySelectorAll('*'));
      const tab = elements.find(el => 
        el.textContent.trim() === name && 
        (el.role === 'tab' || el.classList.contains('cursor-pointer'))
      );
      if (tab) tab.click();
    }, tabName);
    
    await this.page.waitForTimeout(2500);
  }

  
  // ============ ORDER ACTIONS ============

  /**
   * Opens the actions menu for the first order in the table
   */
  async openFirstOrderActions() {
    const actionsButton = this.firstRow.locator('td').last().getByRole('button');
    await actionsButton.waitFor({ state: 'visible', timeout: 10000 });
    await actionsButton.click();
  }

  /**
 * Clicks an option from the actions dropdown menu
 * @param {string} optionText - Text of the option to click (e.g., "View Order Details", "Cancel Order", "Delete Order")
 * @private
 */
  async _clickDropdownOption(optionText) {
    let currentPage = 1;
    let foundOption = false;
    
    while (!foundOption) {
        // Recalculate row count for current page
        const maxRowsPerPage = await this.page.locator('tbody tr').count();

        for (let rowIndex = 0; rowIndex < maxRowsPerPage; rowIndex++) {
            const row = this.page.locator('tbody tr').nth(rowIndex);
            const actionsButton = row.locator('td').last().getByRole('button');
            
            const buttonCount = await actionsButton.count();
            if (buttonCount === 0) break;
            
            await actionsButton.waitFor({ state: 'visible', timeout: 10000 });
            await actionsButton.click();
            await this.page.waitForTimeout(500); // Allow UI to render
            
            // Try to find the option with a more flexible approach
            // Look for any clickable element containing the option text
            const optionLocator = this.page.getByText(optionText, { exact: false });
            const optionExists = await optionLocator.count() > 0;
            
            if (optionExists) {
                await optionLocator.first().click();
                foundOption = true;
                break;
            }
            
            // Close any open menu/popover
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(300);
        }
        
        if (foundOption) break;
        
        // Pagination
        const nextPageButton = this.page.getByRole('button', { name: String(currentPage + 1), exact: true });
        const isNextPageEnabled = await nextPageButton.isEnabled().catch(() => false);
        
        if (isNextPageEnabled) {
            await nextPageButton.click();
            await this.page.waitForTimeout(1000);
            currentPage++;
        } else {
            throw new Error(`"${optionText}" not found in any row across ${currentPage} page(s)`);
        }
    }
  }


/**
 * Views order details
 */
  async viewOrderDetails() {
    let currentPage = 1;
    let foundValidOrder = false;
    
    while (!foundValidOrder) {
        await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        const maxRowsPerPage = await this.page.locator('tbody tr').count();
        console.log(`📄 Page ${currentPage}: Found ${maxRowsPerPage} rows`);
        
        for (let rowIndex = 0; rowIndex < maxRowsPerPage; rowIndex++) {
            const row = this.page.locator('tbody tr').nth(rowIndex);
            
            // Check if row exists
            const rowExists = await row.count() > 0;
            if (!rowExists) break;
            
            // Get the status of the current row
            const statusCell = row.locator('td').nth(7); // Adjust index if needed
            const statusButton = statusCell.getByRole('button');
            const statusText = await statusButton.textContent();
            const normalizedStatus = statusText.trim().toLowerCase();
            
            // Skip if status is "Cancelled" or "Completed"
            if (normalizedStatus === 'cancelled' || normalizedStatus === 'completed') {
                console.log(`⚠️ Row ${rowIndex + 1}: Skipping ${statusText.trim()} order`);
                continue; // Move to next row
            }
            
            // Found a valid order - click its actions button
            console.log(`✓ Row ${rowIndex + 1}: Found valid order with status ${statusText.trim()}`);
            const actionsButton = row.locator('td').last().getByRole('button');
            await actionsButton.waitFor({ state: 'visible', timeout: 10000 });
            await actionsButton.click();
            await this.page.waitForTimeout(500);
            
            // Click "View Order Details"
            const clicked = await this.page.evaluate(() => {
                const options = Array.from(document.querySelectorAll('[role="option"]'));
                const option = options.find(el => el.textContent.includes('View Order Details'));
                if (option) {
                    option.click();
                    return true;
                }
                return false;
            });
            
            if (clicked) {
                foundValidOrder = true;
                break;
            }
            
            // Close dropdown if click failed
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(300);
        }
        
        if (foundValidOrder) break;
        
        // Try to go to next page
        const nextPageButton = this.page.getByRole('button', { name: String(currentPage + 1), exact: true});
        const buttonExists = await nextPageButton.count() > 0;
        
        if (buttonExists) {
            console.log(`📄 Moving to page ${currentPage + 1}...`);
            await nextPageButton.click();
            await this.page.waitForTimeout(1000);
            currentPage++;
        } else {
            throw new Error(`No valid orders found across ${currentPage} page(s). All orders are either Cancelled or Completed.`);
        }
    }
    
    await this.orderPageTitle.waitFor({ state: 'visible', timeout: 10000 });
  }

/**
 * Cancels an order
 */
  async cancelOrder() {
    await this._clickDropdownOption('Cancel Order');
    await this.confirmBtn.first().waitFor({ state: 'visible', timeout: 20000 });
    await this.confirmBtn.first().click({ force: true });
  }

/**
 * Deletes an order (only available for Cancelled orders)
 */
  async deleteOrder() {
    await this._clickDropdownOption('Delete Order');
    await this.confirmBtn.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.confirmBtn.first().click({ force: true });
  }

  /**
   * Edits an order with new details
   * @param {Object} orderData - Order data to update
   */
  async editOrder(orderData = {}) {
    await this.editOrderBtn.click();
    await this.editOrderTitle.waitFor({ state: 'visible', timeout: 10000 });

    await this.page.locator('form[class="space-y-4 p-4 sm:p-6"]').waitFor({ state: 'attached', timeout: 10000 });
    
    if (orderData.notes) {
      await this.notesField.fill(orderData.notes);
    }
    
    if (orderData.quantity) {
      await this.quantityField.clear();
      await this.quantityField.fill(orderData.quantity.toString());
    }
    
    if (orderData.products) {
      // Wait for any overlay or modal animation to finish
      await this.page.waitForSelector('form.space-y-4', { state: 'hidden', timeout: 10000 }).catch(() => {});
      
      // Ensure dropdown is visible and stable
      const dropdown = this.selectProductDropdown.first();
      await dropdown.scrollIntoViewIfNeeded();
      await expect(dropdown).toBeVisible();
      await expect(dropdown).toBeEnabled();

      // Perform a forced click as a last resort if overlapping elements persist
      await dropdown.click({ force: true });

      // Wait for the table to load
      const table = this.page.getByRole('table');
      await table.waitFor({ state: 'visible' });

      // Click the first data row (skip the header)
      const firstRow = table.getByRole('row').nth(1);
      await firstRow.click();


      await this.saveBtn.click();
    }

    
    await this.saveChangesBtn.click();
  }

  // ============ STATUS MANAGEMENT ============

  /**
   * Changes the status of the first order in the table
   * Automatically progresses to the next available status
   */
async changeOrderStatus() {
  const changeableStatuses = ['in progress', 'draft', 'confirmed', 'shipping', 'delivered'];
  const maxPagesToCheck = 5;

  for (let currentPage = 1; currentPage <= maxPagesToCheck; currentPage++) {
    console.log(`\n🔍 Checking page ${currentPage}...`);
    
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    const rows = this.page.locator('table tbody tr');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const statusCell = row.locator('td:nth-child(8) button');
      
      // Get status text
      const statusText = (await statusCell.innerText()).trim().toLowerCase();
      console.log(`   Row ${i + 1}: Status = "${statusText}"`);

      if (changeableStatuses.includes(statusText)) {
        console.log(`✅ Found changeable order at row ${i + 1}`);
        
        // IMPORTANT: Scroll row into view first
        await row.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        
        // Ensure status cell is visible and ready
        await statusCell.waitFor({ state: 'visible', timeout: 5000 });
        
        // Click the status button
        await statusCell.click({ force: true }); // Use force in case of overlay
        
        // Wait for dropdown to appear with multiple selectors
        const dropdownAppeared = await Promise.race([
          this.statusOptions.first().waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true),
          this.page.waitForSelector('[role="option"]', { state: 'visible', timeout: 5000 })
            .then(() => true),
          this.page.waitForSelector('[role="listbox"]', { state: 'visible', timeout: 5000 })
            .then(() => true),
          this.page.waitForTimeout(5000).then(() => false)
        ]).catch(() => false);

        if (!dropdownAppeared) {
          console.warn(`⚠️ Dropdown did not appear for row ${i + 1}, trying next row`);
          continue; // Try next row instead of failing
        }

        // Get all available status options
        const allOptions = await this.statusOptions.allTextContents();
        console.log(`📝 Available options:`, allOptions);
        
        // Filter out Completed, Cancelled, AND the current status
        const validOptions = allOptions
          .map(opt => opt.trim())
          .filter(opt => {
            const optLower = opt.toLowerCase();
            return optLower !== 'completed' && 
                   optLower !== 'cancelled' && 
                   optLower !== statusText;
          });

        console.log(`✅ Valid options:`, validOptions);

        if (validOptions.length === 0) {
          console.warn(`⚠️ No valid options for "${statusText}"`);
          await statusCell.press('Escape').catch(() => {});
          continue;
        }

        // Select the first valid option
        const nextStatus = this.page.getByRole('option', { 
          name: new RegExp(`^${validOptions[0]}$`, 'i') 
        });
        
        await nextStatus.waitFor({ state: 'visible', timeout: 5000 });
        // Add delay for dropdown to stabilize
        await this.page.waitForTimeout(500);  
        
        // Use force click to bypass actionability checks
        await nextStatus.click({ force: true });
        
        console.log(`✓ Changed from "${statusText}" to "${validOptions[0]}" (page ${currentPage}, row ${i+1})`);
        return true; // Success!
      }
    }

    // Go to next page

    

    console.log(`⏭️ Checking next page...`);

    const nextPageButton = this.page.getByRole('button', { name: String(currentPage + 1) });
    
    if (await nextPageButton.isVisible().catch(() => false)) {
      await nextPageButton.click();
      await this.page.waitForTimeout(1500);
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    } else {
      console.log(`⚠️ No more pages available`);
      break;
    }
  }

  console.warn('⚠️ No changeable orders found');
  return false;
}


  // ============ EXPORT METHODS ============

  /**
   * Exports orders in the specified format
   * @param {string} format - 'csv', 'xlsx', or 'pdf'
   */
  async exportOrders(format) {
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

  // ============ COLUMN MANAGEMENT ============

  /**
   * Toggles all column checkboxes
   */
  async toggleAllColumns() {
  const columnNames = ['ID', 'Products', 'Customer', 'Created', 'Quantity', 'Total Cost', 'Channels', 'Status', 'Actions'];

  for (const name of columnNames) {
    try {
      // Click the visible label/wrapper, not the hidden checkbox
      const columnToggle = this.page.locator(`label:has-text("${name}")`).first();
      await columnToggle.waitFor({ state: 'visible', timeout: 5000 });
      await columnToggle.click({ force: true, timeout: 5000 });
      
      // Brief wait for toggle animation
      await this.page.waitForTimeout(200);
    } catch (error) {
      console.warn(`⚠️ Could not toggle ${name} column: ${error.message}`);
    }
  }
}

  /**
   * Opens reorder columns modal
   */
  async openReorderColumns() {
    await this.reorderBtn.click();
  }

  /**
   * Saves column reordering
   */
  async saveColumnOrder() {
    await this.saveBtn.click();
  }

  // ============ VERIFICATION METHODS ============

  /**
   * Verifies all metrics are visible
   * @returns {Promise<boolean>}
   */
  async verifyMetricsVisible() {
    try {
      await expect(this.totalOrdersMetric).toBeVisible();
      await expect(this.completedOrdersMetric).toBeVisible();
      await expect(this.ordersInProgressMetric).toBeVisible();
      await expect(this.ordersCancelledMetric).toBeVisible();
      await expect(this.totalSalesMetric).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verifies all table columns are present
   * @returns {Promise<boolean>}
   */
  async verifyTableColumns() {
    try {
      await expect(this.idColumn).toBeVisible();
      await expect(this.productsColumn).toBeVisible();
      await expect(this.customerColumn).toBeVisible();
      await expect(this.createdColumn).toBeVisible();
      await expect(this.quantityColumn).toBeVisible();
      await expect(this.totalCostColumn).toBeVisible();
      await expect(this.channelsColumn).toBeVisible();
      await expect(this.statusColumn).toBeVisible();
      await expect(this.actionsColumn).toBeVisible();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets the count of orders in the table
   * @returns {Promise<number>}
   */
  async getOrderCount() {
    return await this.page.locator('table tbody tr').count();
  }

  /**
   * Searches for orders
   * @param {string} searchText - Text to search for
   */
  async searchOrders(searchText) {
    await this.productSearchField.waitFor({ state: 'visible', timeout: 10000 });
    await this.productSearchField.fill(searchText);
  }
}