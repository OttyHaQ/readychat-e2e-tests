export class ServicesPage {
    constructor(page) {
        this.page = page;
        
        // Navigation
        this.serviceManagementMenu = page.getByRole('complementary').getByRole('link', { name: /service management/i });
        
        // Page Header & Title
        this.pageTitle = page.locator('h1, h2').filter({ hasText: /service management/i }).first();
        
        // Metrics Cards
        this.metricsTitle = page.locator('text=/services metrics/i').first();
        this.totalServicesMetric = page.locator('text=/total services/i').first();
        this.recentlyAddedMetric = page.locator('text=/recently added/i').first();
        this.activeServicesMetric = page.locator('text=/active services/i').first();
        this.inactiveServicesMetric = page.locator('text=/inactive services/i').first();
        
        // Status Tabs
        this.servicesTab =  page.getByText('Services', {exact: true})
            .or (page.locator('[cursor=pointer]').filter({ hasText: /^Services$/i }));
        this.typesTab = page.getByText('Types', {exact: true})
            .or (page.locator('[cursor=pointer]').filter({ hasText: /^Types$/i }));
        
        // Table Column Headers
        this.columnHeaders = page.locator('thead th, [role="columnheader"]');
        this.serviceNameColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /service name/i }).first();
        this.nameColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /name/i }).first();
        this.serviceTypeColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /service type/i }).first();
        this.priceColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /price/i }).first();
        this.descriptionColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /description/i }).first();
        this.serviceProvidersColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /service provider/i }).first();
        this.statusColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /status/i }).first();
        this.actionsColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /actions/i }).first();
        
        // Action Buttons
        this.addServiceButton = page.locator('button:has-text("Add"), button:has-text("New Service"), button:has-text("Create Service")').first();
        this.addServiceTypeButton = page.locator('button:has-text("Add"), button:has-text("New Service"), button:has-text("Create Service")').first();
        this.exportBtn = page.getByRole('button', {name: 'Export', timeout: 10000})
            .or (page.locator('button:has-text("Export")').first());
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
        this.editButton = page.getByRole('Button', {name: 'Edit Service'})
            .or (page.locator('[role="option"]:has-text("Edit Service"), button:has-text("Edit Service Type")'));
        this.deleteButton = page.locator('[role="option"]:has-text("Delete"), button:has-text("Delete")');
        
        // Add/Edit Product Form Fields
        this.serviceNameInput = page.locator('#name');
        this.typeName = page.locator('#type_name')
        this.serviceSelect = page.getByLabel('Service Type')
            .or (page.getByText('Select a service type'));
        this.selectStatus = page.getByLabel('Status')
            .or (page.getByText('Inactive'));
        this.serviceType = page.getByText('Maintenance');
        this.status = page.getByText('Active');
        this.priceInput = page.getByLabel('Price')
            .or (page.locator('input[placeholder="0.00"]'));
        this.descriptionInput = page.locator('#description');
        this.selectProvider = page.getByLabel('Price')
            .or (page.getByText('Select a service provider'));
        this.provider = page.getByRole('option', { name: 'OttyHaQ Testhub_11', exact: true });
        
        //  BUSINESS SCHEDULE STEP 
        this.serviceHoursToggle = page.locator('.gap-2 > .flex > .relative > .w-12');
        
        // Day Selection Checkboxes
        this.days = {
            monday: page.getByText(/monday/i).or(page.locator('p:has-text("Monday")')),
            tuesday: page.getByText(/tuesday/i).or(page.locator('p:has-text("Tuesday")')),
            wednesday: page.getByText(/wednesday/i).or(page.locator('p:has-text("Wednesday")')),
            thursday: page.getByText(/thursday/i).or(page.locator('p:has-text("Thursday")')),
            friday: page.getByText(/friday/i).or(page.locator('p:has-text("Friday")')),
            saturday: page.getByText(/saturday/i).or(page.locator('p:has-text("Saturday")')),
            sunday: page.getByText(/sunday/i).or(page.locator('p:has-text("Sunday")'))
        };

        // Scheduling limits

        this.advanceHours = page.locator('#hours_limit_before_booking_appointment');
        this.advanceDays = page.locator('#beforehand_book_days_limit');
        this.cancelRestriction = page.locator('#hour_limit_before_cancel_appointment');
        this.appointmentSlot = page.locator('#appointment_slots_per_hour');
        this.maxAppointments = page.locator('#maximum_weekly_appointments');
        page.getByLabel(/how long would you like/i)
            .locator('button')
            .first();
        this.minutesInput = page.getByLabel(/how long would you like/i)
            .locator('button')
            .nth(1);
        this.hour = {
            0o1: page.getByRole('option', { name: '01' }),
            0o2: page.getByRole('option', { name: '02' }),
            0o3: page.getByRole('option', { name: '03' }),
            0o4: page.getByRole('option', { name: '04' }),
            0o5: page.getByRole('option', { name: '05' }),
            0o6: page.getByRole('option', { name: '06' }),
            0o7: page.getByRole('option', { name: '07' })
        };

        this.minute = {
            first: page.getByRole('option', { name: '01' }),
            fifteen: page.getByRole('option', { name: '02' }),
            thirty: page.getByRole('option', { name: '03' }),
            fortyFive: page.getByRole('option', { name: '04' })
        };

        this.editQuestionBtn = page.getByRole('button', { name: /edit question/i });
        this.addCheckoutQuestionBtn = page.getByRole('button', { name: /add/i }).first();
        this.addFaqBtn = page.getByRole('button', { name: /add/i }).last();
        this.saveBtn = page.getByRole('button', { name: 'Save', exact: true });
        this.createBtn = page.getByRole('button', { name: 'Create', exact: true });
        this.updateBtn = page.getByRole('button', { name: 'Update', exact: true });
        this.saveQuestionBtn = page.getByRole('button', { name: /save question/i });
        this.saveFaQBtn = page.getByRole('button', { name: /save faq/i });
        this.modal = page.locator('label[for="question"]');
        this.questionField = page.locator('#question')
            .or(page.getByLabel(/question/i));
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
    async navigateToServices() {
        await this.page.goto('/en/dashboard/service-management');
        await this.page.waitForLoadState('domcontentloaded');
        
        // Wait for the page content to load
        await this.addServiceButton.waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Get all column header texts
     */
    async getColumnHeaderTexts() {
        await this.columnHeaders.first().waitFor({ state: 'visible' });
        return await this.columnHeaders.allTextContents();
    }

    async verifyColumnHeaders(expectedHeaders = ['Name', 'Servive Name', 'Service Type', 'Description', 'Service Providers', 'Price', 'Status','Actions']) {
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



    async addCheckoutQuestion(questionText, type = 'Text') {
        // Click Add button
        await this.addCheckoutQuestionBtn.click();
        
        // Wait for modal to appear
        await this.modal.waitFor({ state: 'visible', timeout: 10000 });
        
        // Fill in question
        await this.questionField.fill(questionText);
        
        // Save
        await this.saveQuestionBtn.click();
        
        // Wait for modal to close
        await this.modal.waitFor({ state: 'hidden', timeout: 10000 });
    }

     // Add FAQ
    async addNewFAQ(question, answer) {
    await this.addFaqBtn.click();
    await this.modal.waitFor({ state: 'visible', timeout: 5000 });
    
    await this.questionField.fill(question);
    await this.answerField.fill(answer);
    
    await this.saveFaQBtn.click();
  }

  // Select all days
    async selectAllDays() {
    for (const [dayName, dayLocator] of Object.entries(this.days)) {
      try {
        await dayLocator.waitFor({ state: 'visible', timeout: 3000 });
        await dayLocator.click();
      } catch (error) {
        console.log(`Day ${dayName} not found or not clickable`);
      }
    }
  }


    /**
     * Selects an option from a custom dropdown (button-based)
     * @param {Locator} dropdownButton - The button that triggers the dropdown
     * @param {string} optionText - The text of the option to select
     */
    async selectFromDropdown(dropdownButton, optionText = null) {
        try {
            await dropdownButton.waitFor({ state: 'visible', timeout: 5000 });
            await dropdownButton.click();
            
            await this.page.waitForSelector('[role="option"]', { 
                state: 'visible', 
                timeout: 10000 
            });
            
            // If specific option requested, try to find it
            if (optionText) {
                const option = this.page.getByRole('option', { name: optionText });
                const isVisible = await option.first().isVisible().catch(() => false);
                
                if (isVisible) {
                    await option.first().click();
                    console.log(`✓ Selected: ${optionText}`);
                    return optionText;
                } else {
                    console.warn(`⚠️ "${optionText}" not found, selecting first available option`);
                }
            }
            
            // Fall back to first option
            const options = await this.page.locator('[role="option"]').all();
            
            for (const option of options) {
                const text = await option.textContent();
                
                if (text?.trim() !== 'Add New Service Type') {
                    await option.click();
                    console.log(`✓ Selected: ${text?.trim()}`);
                    return text?.trim();
                }
            }
            
            throw new Error('No valid options found');
            
        } catch (error) {
            console.error(`❌ Failed to select dropdown option: ${error.message}`);
            throw error;
        }
    }

        /**
     * Switch between Services and Types tabs
     * @param {string} tabName - 'services' or 'types'
     */
    async switchToTab(tabName) {
        const tabs = {
            services: this.servicesTab,
            types: this.typesTab
        };
        
        const tab = tabs[tabName.toLowerCase()];
        if (!tab) {
            throw new Error(`Unknown tab: ${tabName}. Use 'services' or 'types'`);
        }
        
        await tab.waitFor({ state: 'visible', timeout: 10000 });
        await tab.click();
        await this.page.waitForTimeout(1000); // Wait for content to load
        
        console.log(`✓ Switched to ${tabName} tab`);
    }

    /**
     * Sets service duration (hours and minutes)
     * @param {string} hours - Hour value (e.g., '01', '02')
     * @param {string} minutes - Minute value (e.g., '00', '15', '30', '45')
     */
    async setServiceDuration(hours, minutes) {
        try {
            // Scroll to duration section
            await this.page.locator('text=How long would you like your appointments').scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);
            
            // Set hours - find the duration container more reliably
            if (hours) {
                // Look for the text, then find the next sibling that contains buttons
                const hourButton = this.page
                    .locator('text=How long would you like')
                    .locator('xpath=following-sibling::*')
                    .locator('button')
                    .first();
                
                await hourButton.waitFor({ state: 'visible', timeout: 5000 });
                await hourButton.click();
                await this.page.waitForTimeout(500);
                
                const hourOption = this.page.getByRole('option', { name: hours });
                await hourOption.first().waitFor({ state: 'visible', timeout: 3000 });
                await hourOption.first().click();
                await this.page.waitForTimeout(500);
                console.log(`✓ Set duration hours: ${hours}`);
            }
            
            // Set minutes - query fresh after hours changed
            if (minutes) {
                const minuteButton = this.page
                    .locator('text=How long would you like')
                    .locator('xpath=following-sibling::*')
                    .locator('button')
                    .nth(1);
                
                await minuteButton.waitFor({ state: 'visible', timeout: 5000 });
                await minuteButton.click();
                await this.page.waitForTimeout(500);
                
                const minuteOption = this.page.getByRole('option', { name: minutes });
                await minuteOption.first().waitFor({ state: 'visible', timeout: 3000 });
                await minuteOption.first().click();
                await this.page.waitForTimeout(300);
                console.log(`✓ Set duration minutes: ${minutes}`);
            }
        } catch (error) {
            console.log(`⚠️ Could not set duration: ${error.message}`);
        }
    }

    /**
     * Add a new service
     */
    async addNewService(serviceData) {
        const newQuestion = `Test Question ${Date.now()}`;
        const newAnswer = `Test Answer ${Date.now()}`;
        
        await this.addServiceButton.click();
        await this.serviceNameInput.waitFor({state: 'visible', timeout: 10000});
        await this.serviceNameInput.fill(serviceData.name);

        // Select dropdowns (with validation)
        
        await this.selectFromDropdown(this.serviceSelect);
        
        
        if (serviceData.status) {
            await this.selectFromDropdown(this.selectStatus, serviceData.status);
        }
        
        await this.priceInput.fill(serviceData.price.toString());
        
        if (serviceData.description) {
            await this.descriptionInput.fill(serviceData.description);
        }
        
        if (serviceData.provider) {
            await this.selectFromDropdown(this.selectProvider, serviceData.provider);
        }

        // Scheduling limits
        await this.advanceHours.fill('2');
        await this.advanceDays.fill('2');
        await this.cancelRestriction.fill('2');
        await this.appointmentSlot.fill('1');
        await this.maxAppointments.fill('10');
        
        // Duration - Use dedicated method
        await this.setServiceDuration('01', '30');

        // Questions
        try {
            await this.addCheckoutQuestion(newQuestion);
            console.log('✓ Service Question Added');
        } catch (error) {
            console.log('⚠️ Could not add checkout question:', error.message);
        }

        try {
            await this.addNewFAQ(newQuestion, newAnswer);
            console.log('✓ Service FAQ Added');
        } catch (error) {
            console.log('⚠️ Could not add FAQ:', error.message);
        }
        
        await this.saveBtn.click();
        await this.page.waitForTimeout(3000);
    }

    async addNewServiceType(serviceTypeData) {
        const newType = `Test Question ${Date.now()}`;
        const newDescription = `Test Answer ${Date.now()}`;
        // Click Add button
        await this.addServiceTypeButton.click();
        
        // Wait for form/modal
        await this.typeName.waitFor({state: 'visible', timeout: 10000});
        
        // Fill service type name
        await this.typeName.fill(serviceTypeData.name);

        // Fill description
        await this.descriptionInput.fill(serviceTypeData.description);
        
        // Create
        await this.createBtn.click();
        
        // Wait for form to close
        await this.page.waitForTimeout(2000);
    }

    /**
     * Edit a product
     */

    async editService(newServiceData) {
        const newQuestion = `Test Question ${Date.now()}`;
        const newAnswer = `Test Answer ${Date.now()}`;

        // Click actions button in first row
        const actionsButton = this.page.locator('tbody tr').first().locator('td').last().getByRole('button');
        await actionsButton.click();
        await this.page.waitForTimeout(500);

        // Click "View Product Details" option
        await this.page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            const option = options.find(el => el.textContent.includes('View'));
            if (option) option.click();
        });

        await this.editButton.waitFor({ state: 'visible', timeout: 10000 });

        // Click "Edit"
        await this.editButton.click();
        
        // Wait for form/modal
        await this.serviceNameInput.waitFor({state: 'visible', timeout: 10000});

            const serviceTypeButton = this.page
                .getByRole('button', { name: /service type/i })
                .or(this.page.locator('button:has-text("Select a service type")'))
                .first();
            
            let currentServiceType = null;
            let hasServiceType = false;
            
            try {
                await serviceTypeButton.waitFor({ state: 'visible', timeout: 5000 });
                currentServiceType = await serviceTypeButton.textContent();
                hasServiceType = currentServiceType && !currentServiceType.includes('Select a service type');
                console.log('📋 Current service type:', currentServiceType);
            } catch (error) {
                console.log('⚠️ Could not capture current service type:', error.message);
            }
        
        // Fill product name
        await this.serviceNameInput.clear();
        await this.serviceNameInput.fill(newServiceData.name);

         if (!newServiceData.serviceType && !hasServiceType) {
            console.log('⚠️ No service type set, selecting first available option');
            try {
                await serviceTypeButton.click();
                await this.page.waitForTimeout(500);
                
                // Select first non-"Add New" option
                const options = await this.page.locator('[role="option"]').all();
                for (const option of options) {
                    const text = await option.textContent();
                    if (text && !text.includes('Add New')) {
                        await option.click();
                        console.log(`✓ Auto-selected service type: ${text.trim()}`);
                        break;
                    }
                }
            } catch (error) {
                console.log('⚠️ Could not auto-select service type:', error.message);
            }
        }

        if (newServiceData.status) {
            await this.selectFromDropdown(this.selectStatus, newServiceData.status);
        }
        
        // Update price if provided
        if (newServiceData.price) {
            await this.priceInput.clear();
            await this.priceInput.fill(newServiceData.price);
        }
        
        if (newServiceData.description) {
            await this.descriptionInput.clear();
            await this.descriptionInput.fill(newServiceData.description);
        }
        
        if (newServiceData.provider) {
            await this.selectFromDropdown(this.selectProvider, newServiceData.provider);
        }

        // Scheduling limits
        await this.advanceDays.clear();
        await this.advanceHours.fill('3');
        await this.cancelRestriction.clear();
        await this.cancelRestriction.fill('3');
        await this.appointmentSlot.clear()
        await this.appointmentSlot.fill('2');
        await this.maxAppointments.clear();
        await this.maxAppointments.fill('5');
        
        // Duration - Use dedicated method
        await this.setServiceDuration('02', '00');

        // Questions
        try {
            await this.addCheckoutQuestion(newQuestion);
            console.log('✓ Service Question Added');
        } catch (error) {
            console.log('⚠️ Could not add checkout question:', error.message);
        }

        try {
            await this.addNewFAQ(newQuestion, newAnswer);
            console.log('✓ Service FAQ Added');
        } catch (error) {
            console.log('⚠️ Could not add FAQ:', error.message);
        }
        
        await this.saveBtn.click();
        await this.page.waitForTimeout(3000);
    }


    async editServiceType(serviceTypeData) {
        
        // Click actions button in first row
        const actionsButton = this.page.locator('tbody tr').first().locator('td').last().getByRole('button');
        await actionsButton.click();
        await this.page.waitForTimeout(1000);

        // Click "View Product Details" option
        await this.page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            const option = options.find(el => el.textContent.includes('Modify Type'));
            if (option) option.click();
        });

        await this.page.waitForTimeout(2000);

        // Wait for form/modal
        await this.typeName.waitFor({state: 'visible', timeout: 10000});
        
        // Fill service type name
        await this.typeName.clear();
        await this.typeName.fill(serviceTypeData.name);

        // Fill description
        await this.descriptionInput.clear();
        await this.descriptionInput.fill(serviceTypeData.description);
        
        // Create
        await this.updateBtn.click();
        
        // Wait for form to close
        await this.page.waitForTimeout(2000);
    }


    /**
     * Delete a product
     */
    async deleteService() {
        // Click actions button in first row
        const actionsButton = this.page.locator('tbody tr').first().locator('td').last().getByRole('button');
        await actionsButton.click();
        await this.page.waitForTimeout(500);

        // Click "Delete" option
        await this.page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            const option = options.find(el => el.textContent.includes('Delete'));
            if (option) option.click();
        });

        // Wait for confirmation dialog
        await this.page.waitForTimeout(1000);
        
        // Confirm deletion
        await this.confirmDeleteButton.click();
        
        // Wait for deletion to complete
        await this.page.waitForTimeout(2000);
    }

    async deleteServiceType() {
        // Click actions button in first row
        const actionsButton = this.page.locator('tbody tr').first().locator('td').last().getByRole('button');
        await actionsButton.click();
        await this.page.waitForTimeout(500);

        // Click "Delete" option
        await this.page.evaluate(() => {
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            const option = options.find(el => el.textContent.includes('Delete Type'));
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
    async getServiceCount() {
        return await this.tableRows.count();
    }

    /**
     * Get product name from specific row
     */
    async getServiceName(rowIndex = 0) {
        const row = this.tableRows.nth(rowIndex);
        const nameCell = row.locator('td').nth(1); // Usually second column after checkbox/number
        return await nameCell.textContent();
    }

    /**
     * Verify service/service type exists in table
     */
    async verifyServiceExists(serviceName) {
        // Look specifically in table cells to be more semantic
        const service = this.page
            .getByRole('cell', { name: serviceName })
            .first();
        
        await service.waitFor({ state: 'visible', timeout: 10000 });
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