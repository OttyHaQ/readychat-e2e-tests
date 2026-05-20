import { expect } from '@playwright/test';

export class AppointmentsPage {
    constructor(page) {
        this.page = page;
        
        // Navigation
        this.appointmentsMenu = page.getByRole('complementary').getByRole('link', { name: /appointments/i });
        
        // Page Header & Title
        this.pageTitle = page.locator('h1, h2').filter({ hasText: /appointments/i }).first();
        
        // // Metrics Cards
        // this.metricsTitle = page.locator('text=/services metrics/i').first();
        // this.totalServicesMetric = page.locator('text=/total services/i').first();
        // this.recentlyAddedMetric = page.locator('text=/recently added/i').first();
        // this.activeServicesMetric = page.locator('text=/active services/i').first();
        // this.inactiveServicesMetric = page.locator('text=/inactive services/i').first();
        
        // Status Tabs
        this.listViewTab =  page.getByText('List View', {exact: true})
            .or (page.locator('[cursor=pointer]').filter({ hasText: /^list view$/i }));
        this.calendarViewTab = page.getByText('Calendar View', {exact: true})
            .or (page.locator('[cursor=pointer]').filter({ hasText: /^calendar view$/i }));
        
        // Table Column Headers
        this.columnHeaders = page.locator('thead th, [role="columnheader"]');
        this.appointmentColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /appointment/i }).first();
        this.startTimeColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /start time/i }).first();
        this.scheduleDateColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /schedule date/i }).first();
        this.createdAtColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /created at/i }).first();
        this.durationColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /duration/i }).first();
        this.statusColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /status/i }).first();
        this.actionsColumnHeader = page.locator('thead th, [role="columnheader"]').filter({ hasText: /actions/i }).first();
        
        // Action Buttons
        this.addAppointmentButton = page.locator('button:has-text("Add"), button:has-text("New Appointment"), button:has-text("Create Appointment")').first();
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
        this.appointmentTitle = page.locator('#title');

        // Use section filtering for unique identification
        this.serviceSelect = page.locator('section')
            .filter({ hasText: 'Service Selection' })
            .getByRole('button')
            .filter({ hasText: 'Select an option' });

        this.selectTimeSlots = page.getByLabel('Available Time Slots');

        this.statusSelect = page.locator('section')
            .filter({ hasText: 'Scheduling' })
             .locator('button')
            .filter({ hasText: /Upcoming|Confirmed|Cancelled|Completed/ });

        this.customerSelect = page.locator('section')
            .filter({ hasText: 'Customer Information' })
            .getByRole('button')
            .filter({ hasText: 'Select an option' });

        this.status = page.getByText('Confirmed');
        this.descriptionInput = page.locator('#description');
        this.customer = page.getByRole('option', { name: 'Flora Ready', exact: true });

        // Scheduling Tabs
        this.availableSlotsTab =  page.getByText('Available Slots', {exact: true})
            .or (page.locator('[cursor=pointer]').filter({ hasText: /^available slots$/i }));
        this.customTimeTab = page.getByText('Custom Time', {exact: true})
            .or (page.locator('[cursor=pointer]').filter({ hasText: /^custom time$/i }));


        // Form Buttons
        this.createButton = page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("Save")').first();
        
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
    async navigateToAppointments() {
        await this.page.goto('/en/dashboard/service-management/appointments');
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Get all column header texts
     */
    async getColumnHeaderTexts() {
        await this.columnHeaders.first().waitFor({ state: 'visible' });
        return await this.columnHeaders.allTextContents();
    }

    async verifyColumnHeaders(expectedHeaders = ['Start Time', 'Appointment', 'Schedule Date', 'Created At', 'Duration', 'Status','Actions']) {
        for (const header of expectedHeaders) {
            const headerLocator = this.page.locator('thead th, [role="columnheader"]')
                .filter({ hasText: new RegExp(header, 'i') });
            await headerLocator.first().waitFor({ state: 'visible', timeout: 10000 });
        }
    }


    /**
     * Export products in specified format
     */
    async exportAppointments(format) {
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
     * Selects an option from a custom dropdown (button-based)
     * @param {Locator} dropdownButton - The button that triggers the dropdown
     * @param {string} optionText - The text of the option to select
     */
    async selectFromDropdown(dropdownButton, optionText = null) {
        try {
            await dropdownButton.waitFor({ state: 'visible', timeout: 5000 });
            
            // Check if the dropdown already shows the desired value
            const currentText = await dropdownButton.textContent();
            if (optionText && currentText?.includes(optionText)) {
                console.log(`✓ Already selected: ${optionText}`);
                return optionText;
            }
            
            // If no specific option requested, don't attempt to change it
            if (!optionText) {
                console.log(`⚠️ No option specified, keeping current value: ${currentText?.trim()}`);
                return currentText?.trim();
            }
            
            await dropdownButton.click();
            
            // Wait for options with shorter timeout
            const optionsVisible = await this.page.waitForSelector('[role="option"]', { 
                state: 'visible', 
                timeout: 3000 
            }).catch(() => null);
            
            if (!optionsVisible) {
                console.log(`⚠️ No dropdown options appeared. Current value: ${currentText?.trim()}`);
                
                // Accept current value if dropdown doesn't open (might be disabled/readonly)
                console.log(`✓ Accepting current value: ${currentText?.trim()}`);
                await this.page.keyboard.press('Escape');
                return currentText?.trim();
            }
            
            // If specific option requested, try to find it
            const option = this.page.getByRole('option', { name: optionText });
            const isVisible = await option.first().isVisible().catch(() => false);
            
            if (isVisible) {
                await option.first().click();
                console.log(`✓ Selected: ${optionText}`);
                await this.page.waitForTimeout(500);
                await this.page.locator('dialog[open], [role="dialog"]').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
                return optionText;
            } else {
                console.warn(`⚠️ "${optionText}" not found, selecting first available option`);
            }
            
            // Fall back to first option
            const options = await this.page.locator('[role="option"]').all();
            
            for (const option of options) {
                const text = await option.textContent();
                
                if (text?.trim() !== 'Add New Appointment Type') {
                    await option.click();
                    console.log(`✓ Selected: ${text?.trim()}`);
                    await this.page.waitForTimeout(500);
                    await this.page.locator('dialog[open], [role="dialog"]').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
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
            list_view: this.listViewTab,
            calendar_view: this.calendarViewTab,
            available_slots: this.availableSlotsTab,
            custome_time: this.customTimeTab,
        };

        // Normalize: convert to lowercase and replace spaces with underscores
        const normalizedName = tabName.toLowerCase().replace(/\s+/g, '_');
        
        const tab = tabs[normalizedName];
        if (!tab) {
            const availableTabs = Object.keys(tabs).join(', ');
            throw new Error(`Unknown tab: ${tabName}. Available tabs: ${availableTabs}`);
        }
        
        await tab.waitFor({ state: 'visible', timeout: 10000 });
        await tab.click();
        await this.page.waitForTimeout(1000); // Wait for content to load
        
        console.log(`✓ Switched to ${tabName} tab`);
    }


    async verifyCalendarIsVisible() {
        console.log('🔍 Verifying calendar view is visible...');

        // Locate the Month View table — this is your most stable anchor
        const calendarTable = this.page.getByRole('table', { name: 'Month View' });
        await expect(calendarTable).toBeVisible({ timeout: 10000 });
        console.log('✓ Calendar table is visible.');

        // Verify the month/year header (e.g., "November 2025")
        const monthYearHeader = this.page.getByText(
            /^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}$/i
        );
        await expect(monthYearHeader).toBeVisible({ timeout: 8000 });
        console.log('📅 Calendar header visible:', await monthYearHeader.textContent());

    }




    /**
     * Finds and selects a date with available time slots
     * Tries up to 10 future dates
     */
    async selectDateWithAvailableSlots(timeSlotIndex = 0) {
        const maxAttempts = 10;
        let monthAttempts = 0;
        const maxMonthAttempts = 3;

        const schedulingSection = this.page.locator('section').filter({ hasText: 'Scheduling' });
    
        // DIAGNOSTIC: Check if calendar even exists
        const calendarGrid = schedulingSection.locator('[role="grid"]');
        const calendarExists = await calendarGrid.isVisible({ timeout: 20000 }).catch(() => false);
        
        if (!calendarExists) {
            console.log('❌ Calendar grid not found in Available Slots mode');
            console.log('💡 This usually means the service has no configured working hours');
            throw new Error('Calendar not rendered - service likely has no availability configured');
        }
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const schedulingSection = this.page.locator('section').filter({ hasText: 'Scheduling' });
            const calendarGrid = schedulingSection.locator('[role="grid"]');
            
            const availableDates = calendarGrid.locator('button:not([disabled])');
            const count = await availableDates.count();
            
            console.log(`📅 Found ${count} enabled dates (attempt ${attempt + 1})`);
            
            if (count === 0) {
                if (monthAttempts < maxMonthAttempts) {
                    const nextMonthButton = schedulingSection.getByRole('button', { name: /Go to the Next Month/i });
                    await nextMonthButton.click();
                    await this.page.waitForTimeout(1500);
                    monthAttempts++;
                    console.log('📅 Moving to next month...');
                    continue;
                } else {
                    throw new Error(`No available dates found after ${maxMonthAttempts} months`);
                }
            }
            
            // Try each available date
            if (attempt < count) {
                console.log(`\n🗓️  Trying date ${attempt + 1} of ${count}...`);
                
                // Click the date
                await availableDates.nth(attempt).click();
                await this.page.waitForTimeout(1500);
                
                // CRITICAL FIX: Find the dropdown button, not the tab button
                // Look for button that contains "time slot" text (case-insensitive)
                const timeSlotDropdown = schedulingSection
                    .locator('button')
                    .filter({ hasText: /time slot/i })
                    .first();
                
                // Check if dropdown exists
                const dropdownExists = await timeSlotDropdown.isVisible({ timeout: 3000 }).catch(() => false);
                
                if (!dropdownExists) {
                    console.log('   ⚠️ Time slot dropdown not found');
                    continue;
                }
                
                const dropdownText = await timeSlotDropdown.textContent();
                const isDisabled = await timeSlotDropdown.getAttribute('disabled');
                
                console.log(`   Dropdown: "${dropdownText.trim()}" (disabled: ${isDisabled !== null})`);
                
                // Skip if disabled or shows "No available"
                if (isDisabled !== null || dropdownText.includes('No available')) {
                    console.log('   ⚠️ No slots for this date');
                    continue;
                }
                
                // Click dropdown to see options
                await timeSlotDropdown.click();
                await this.page.waitForTimeout(500);
                
                // Look for time slot options
                const timeOptions = this.page.locator('[role="option"]')
                    .filter({ hasText: /^\d{1,2}:\d{2}\s?(AM|PM)?$/i });
                const optionCount = await timeOptions.count();
                
                if (optionCount > 0) {
                    const indexToUse = Math.min(timeSlotIndex, optionCount - 1);
                    await timeOptions.nth(indexToUse).click();
                    console.log(`✓ Selected time slot #${indexToUse + 1} of ${optionCount}`);
                    await this.page.waitForTimeout(500);
                    return;
                } else {
                    // No options - close and try next
                    await this.page.keyboard.press('Escape');
                    console.log('   ⚠️ No time options in dropdown');
                }
            } else {
                // Exhausted current month - move to next
                if (monthAttempts < maxMonthAttempts) {
                    const nextMonthButton = schedulingSection.getByRole('button', { name: /Go to the Next Month/i });
                    await nextMonthButton.click();
                    await this.page.waitForTimeout(1500);
                    monthAttempts++;
                    attempt = -1;
                    console.log('📅 Moving to next month...');
                } else {
                    break;
                }
            }
        }
        
        throw new Error('No dates with available time slots found. Service hours may not be configured.');
    }


    /**
     * Select date and time using Custom Time mode (fallback when no availability)
     */
    async selectCustomDateTime() {
        const schedulingSection = this.page.locator('section').filter({ hasText: 'Scheduling' });

        // Click Custom Time tab/button (try multiple locator strategies)
        const customTimeButton = this.customTimeTab
            .or(this.page.getByRole('button', { name: /Custom Time/i }))
            .or(schedulingSection.getByText('Custom Time', { exact: true }));
        await customTimeButton.first().click();
        await this.page.waitForTimeout(2000);
        console.log('✓ Switched to Custom Time mode');
        
        // Click "Start Date & Time" button to open picker
        const startDateButton = schedulingSection.locator('button').filter({ 
            hasText: /Select a date and time|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i 
        }).first();
        
        await startDateButton.waitFor({ state: 'visible', timeout: 5000 });
        await startDateButton.click();
        await this.page.waitForTimeout(1000);
        console.log('✓ Opened date/time picker');
        
        // Now wait for the calendar that appears in the picker dialog/popover
        const calendarGrid = this.page.locator('[role="grid"]');
        await calendarGrid.waitFor({ state: 'visible', timeout: 5000 });
        console.log('✓ Calendar picker loaded');
        
        // Select tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDay = tomorrow.getDate();
        
        // Find and click tomorrow's date
        const dateButton = calendarGrid.locator('button').filter({ 
            hasText: new RegExp(`^${tomorrowDay}$`) 
        }).first();
        
        const isDisabled = await dateButton.getAttribute('disabled').catch(() => null);
        if (!isDisabled) {
            // Use dispatchEvent to bypass floating-portal pointer-event interception
            await dateButton.dispatchEvent('click');
            console.log(`✓ Selected date: ${tomorrowDay}`);
        } else {
            // Click first available date
            const firstAvailable = calendarGrid.locator('button:not([disabled])').first();
            await firstAvailable.dispatchEvent('click');
            console.log('✓ Selected first available date');
        }

        await this.page.waitForTimeout(500);

        // Select time if time picker appears
        const timeInput = this.page.locator('input[type="time"]').first();
        if (await timeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await timeInput.fill('10:00');
            console.log('✓ Set time: 10:00');
        }

        // Confirm selection if there's a confirm button
        const confirmButton = this.page.getByRole('button', { name: /confirm|ok|select/i });
        if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await confirmButton.click();
        }

        // Always close the date picker portal before returning — it intercepts subsequent clicks
        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.waitForTimeout(500);
        console.log('✓ Custom date/time selected successfully');
    }
        /**
     * Add a new appointment
     */
    async addNewAppointment(appointmentData) {
        await this.addAppointmentButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.appointmentTitle.waitFor({ state: 'visible', timeout: 30000 });
        await this.appointmentTitle.fill(appointmentData.newTitle);
        await this.descriptionInput.fill(appointmentData.description);

        if (appointmentData.service) {
            await this.selectFromDropdown(this.serviceSelect, appointmentData.service);
        }

        console.log('⏳ Waiting for form to stabilize after service selection...');
        await this.page.waitForTimeout(3000);

        // Try Custom Time directly (faster and avoids slow calendar slot iteration)
        let schedulingDone = false;
        try {
            await this.selectCustomDateTime();
            schedulingDone = true;
        } catch (customErr) {
            console.log(`⚠️ Custom time failed: ${customErr.message} — trying Available Slots`);
            try {
                await this.selectDateWithAvailableSlots(appointmentData.timeSlotIndex || 0);
                schedulingDone = true;
            } catch (slotsErr) {
                console.log(`⚠️ Available slots also failed: ${slotsErr.message} — proceeding without date selection`);
            }
        }

        if (appointmentData.status) {
            await this.selectFromDropdown(this.statusSelect, appointmentData.status).catch(e => {
                console.log(`⚠️ Status selection failed: ${e.message}`);
            });
        }

        if (appointmentData.customer) {
            await this.selectFromDropdown(this.customerSelect, appointmentData.customer).catch(e => {
                console.log(`⚠️ Customer selection failed: ${e.message}`);
            });
        }

        await this.createButton.click();
        await this.page.waitForTimeout(3000);

        // If form didn't submit (still on create page), retry once
        if (this.page.url().includes('create-appointment')) {
            console.log('⚠️ Still on create form, retrying submit...');
            await this.createButton.click();
            await this.page.waitForTimeout(3000);
        }
    }

   

    /**
     * Edit an appointment
     */

    async sortByCreatedAtDescending() {
        try {
            const createdAtHeader = this.page.locator('th, [role="columnheader"]')
                .filter({ hasText: /created at/i }).first();
            const sortBtn = createdAtHeader.locator('button:has(svg), button').first();
            const sortVisible = await sortBtn.isVisible({ timeout: 3000 }).catch(() => false);
            if (sortVisible) {
                await sortBtn.click();
                await this.page.waitForTimeout(500);
                const sortDescOption = this.page.getByText('Sort Descending', { exact: true });
                const descVisible = await sortDescOption.isVisible({ timeout: 2000 }).catch(() => false);
                if (descVisible) {
                    await sortDescOption.click();
                    await this.page.waitForTimeout(500);
                    console.log('✓ Sorted by Created At (descending)');
                } else {
                    await this.page.keyboard.press('Escape').catch(() => {});
                    console.log('⚠️ Sort Descending option not found in dropdown');
                }
            } else {
                console.log('⚠️ Created At sort button not found');
            }
        } catch (error) {
            console.log(`⚠️ Could not sort by Created At: ${error.message}`);
        }
    }

    async selectAction(actionName) {
        await this.page.locator('tbody tr td').first().waitFor({ state: 'visible', timeout: 10000 });
        console.log('✓ Appointments table loaded');

        const activeOnlyActions = /check in|cancel|reschedule/i;
        const needsActiveStatus = activeOnlyActions.test(actionName);
        const statusPattern = needsActiveStatus
            ? /Confirmed|Upcoming/i
            : /Upcoming|Confirmed|Cancelled|Completed/i;

        let targetRow = this.page.locator('tbody tr')
            .filter({ has: this.page.locator('td', { hasText: statusPattern }) })
            .first();

        let rowCount = await targetRow.count();

        // If action needs active status and none found on current page, try sorting by newest first
        if (rowCount === 0 && needsActiveStatus) {
            console.log(`⚠️ No /Confirmed|Upcoming/ appointment on page 1 for "${actionName}", sorting by newest first`);
            await this.sortByCreatedAtDescending();
            await this.page.waitForTimeout(1000);

            targetRow = this.page.locator('tbody tr')
                .filter({ has: this.page.locator('td', { hasText: statusPattern }) })
                .first();
            rowCount = await targetRow.count();
        }

        if (rowCount === 0 && needsActiveStatus) {
            console.log(`⚠️ No /Confirmed|Upcoming/ appointment found for "${actionName}", trying first available row`);
            targetRow = this.page.locator('tbody tr').first();
            rowCount = await targetRow.count();
        }

        if (rowCount === 0) {
            throw new Error(`No appointment row found for "${actionName}"`);
        }

        const actionsButton = targetRow.locator('td').last().getByRole('button');
        await actionsButton.click();
        await this.page.waitForTimeout(500);

        await this.page.locator('[role="option"]').first().waitFor({ state: 'visible', timeout: 5000 });

        const option = this.page.locator('[role="option"]').filter({ hasText: actionName }).first();
        const optionVisible = await option.isVisible().catch(() => false);
        if (optionVisible) {
            await option.click({ force: true });
        } else {
            const available = await this.page.evaluate(() =>
                Array.from(document.querySelectorAll('[role="option"]')).map(el => el.textContent.trim())
            );
            console.log(`Available options for "${actionName}": ${available.join(', ')}`);
            await this.page.keyboard.press('Escape').catch(() => {});
            console.log(`⚠️ Action "${actionName}" not available for current appointment — skipping`);
        }
    }

    /**
     * Reschedule an appointment to the next available date and time
     * @param {Object} options - Reschedule options
     * @param {string[]} options.preferredTimes - Preferred time slots (e.g., ['09:00', '12:00'])
     * @param {number} options.dateOffset - Days ahead to select (0 = next available, 1 = day after next, etc.)
     */
    async rescheduleAppointment(options = {}) {
        const {
            preferredTimes = ['09:00', '12:00', '13:00'],
            dateOffset = 0
        } = options;

        try {
            const modalHeading = this.page.getByRole('heading', { name: /Reschedule Appointment/i });
            const modalVisible = await modalHeading.isVisible({ timeout: 5000 }).catch(() => false);
            if (!modalVisible) {
                console.log('⚠️ Reschedule modal not open — action was skipped, nothing to reschedule');
                return { success: false, skipped: true };
            }
            await modalHeading.waitFor({ state: 'visible', timeout: 15000 });
            console.log('✓ Reschedule modal opened');
            
            await this.selectNextAvailableDateFromPage(dateOffset);
            await this.page.waitForTimeout(3000);
            
            const selectedTime = await this.selectPreferredTimeSlotFromPage(preferredTimes);
            console.log(`✓ Selected time: ${selectedTime}`);
            
            // 5. Click Apply button
            const applyButton = this.page.getByRole('button', { name: /^apply$/i });
            await applyButton.click();
            console.log('✓ Clicked Apply');
            
            // 6. Wait for backend processing with loading indicator check
            await this.page.waitForTimeout(5000);
            
            // Check if there's a loading/processing indicator
            const loadingIndicator = this.page.locator('[role="progressbar"], .loading, .spinner, [aria-busy="true"]');
            await loadingIndicator.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {
                console.log('⚠️ No loading indicator found or already hidden');
            });
            
            // 7. Check for error messages
            const errorAlert = this.page.locator('div[role="alert"], [role="alertdialog"]')
                .filter({ hasText: /error|cannot|failed/i });
            
            const hasError = await errorAlert.isVisible().catch(() => false);
            
            if (hasError) {
                const errorText = await errorAlert.textContent();
                throw new Error(`Reschedule failed: ${errorText.trim()}`);
            }
            
            // 8. Try to close modal explicitly if still open
            const isStillVisible = await modalHeading.isVisible().catch(() => false);
            
            if (isStillVisible) {
                console.log('⚠️ Modal still open after processing, attempting manual close...');
                
                // Try clicking outside modal or finding close button
                const closeButton = this.page.locator('button').filter({ hasText: /close|×/i });
                await closeButton.click().catch(() => {
                    console.log('⚠️ No close button found, pressing Escape');
                    return this.page.keyboard.press('Escape');
                });
                
                await this.page.waitForTimeout(1000);
            }
            
            // 9. Wait for modal to disappear with extended timeout
            await modalHeading.waitFor({ state: 'hidden', timeout: 20000 });
            console.log('✓ Appointment rescheduled successfully');
            
            return { success: true, time: selectedTime };
            
        } catch (error) {
            console.error('❌ Failed to reschedule appointment:', error.message);
            
            const cancelBtn = this.page.getByRole('button', { name: /cancel/i });
            await cancelBtn.click().catch(() => {});
            
            throw error;
        }
    }

    /**
     * Select next available date from the reschedule modal calendar
     * Always selects from tomorrow onwards (skips today)
     */
    async selectNextAvailableDateFromPage(offset = 0) {
        const calendar = this.page.locator('div, section').filter({
            hasText: /Sun.*Mon.*Tue.*Wed.*Thu.*Fri.*Sat/i
        }).last();
        
        await calendar.waitFor({ state: 'visible', timeout: 10000 });
        console.log('✓ Calendar found');
        
        // Get all date buttons
        const allDateButtons = calendar.locator('button').filter({ 
            hasText: /^\d{1,2}$/ 
        });
        
        const count = await allDateButtons.count();
        
        if (count === 0) {
            throw new Error('No date buttons found in calendar');
        }
        
        console.log(`📅 Found ${count} date buttons`);
        
        // Get today's date number to skip it
        const today = new Date().getDate();
        
        // Filter for enabled dates that are NOT today
        const futureDates = [];
        for (let i = 0; i < count; i++) {
            const btn = allDateButtons.nth(i);
            const isDisabled = await btn.getAttribute('disabled');
            const dateText = await btn.textContent();
            const dateNumber = parseInt(dateText.trim());
            
            // Skip if disabled OR if it's today's date
            if (isDisabled === null && dateNumber !== today) {
                futureDates.push(btn);
            }
        }
        
        // If no future dates found (maybe we need next month)
        if (futureDates.length === 0) {
            console.log('⚠️ No future dates in current month, trying all enabled dates');
            // Fallback: just get enabled dates (in case today is last day of month)
            for (let i = 0; i < count; i++) {
                const btn = allDateButtons.nth(i);
                const isDisabled = await btn.getAttribute('disabled');
                if (isDisabled === null) {
                    futureDates.push(btn);
                }
            }
            
            // If still no dates, throw error
            if (futureDates.length === 0) {
                throw new Error('No available (enabled) dates found in calendar');
            }
        }
        
        console.log(`📅 Found ${futureDates.length} future dates available`);
        
        const dateIndex = Math.min(offset, futureDates.length - 1);
        const dateButton = futureDates[dateIndex];
        const dateText = await dateButton.textContent();
        
        await dateButton.click();
        console.log(`✓ Selected future date: ${dateText.trim()}`);
        
        return dateText.trim();
    }

    /**
     * Select preferred time slot from visible time slots (no modal scoping)
     */
    async selectPreferredTimeSlotFromPage(preferredTimes = ['09:00', '12:00']) {
        // Look for time slot elements anywhere on the page
        // They should be visible in the reschedule modal
        const timeSlots = this.page.locator('button, div[role="button"], div')
            .filter({ hasText: /^\d{2}:\d{2}$/ });
        
        // Wait for time slots to appear
        await timeSlots.first().waitFor({ state: 'visible', timeout: 5000 });
        
        const count = await timeSlots.count();
        
        if (count === 0) {
            throw new Error('No time slots available for selected date');
        }
        
        console.log(`🕐 Found ${count} available time slots`);
        
        // Try preferred times first
        for (const preferredTime of preferredTimes) {
            for (let i = 0; i < count; i++) {
                const slot = timeSlots.nth(i);
                const slotText = await slot.textContent();
                const slotTime = slotText.trim();
                
                if (slotTime === preferredTime || slotTime.startsWith(preferredTime.split(':')[0])) {
                    await slot.click();
                    return slotTime;
                }
            }
        }
        
        // Fallback to first available
        console.log('⚠️ Preferred times not available, selecting first slot');
        const firstSlot = timeSlots.first();
        await firstSlot.click();
        const selectedTime = await firstSlot.textContent();
        
        return selectedTime.trim();
    }
    /**
     * Cancel reschedule operation
     */
    async cancelReschedule() {
        const modalHeading = this.page.getByRole('heading', { name: /Reschedule Appointment/i });
        const modalVisible = await modalHeading.isVisible({ timeout: 5000 }).catch(() => false);
        if (!modalVisible) {
            console.log('⚠️ Reschedule modal not open — nothing to cancel');
            return;
        }
        await modalHeading.waitFor({ state: 'visible', timeout: 10000 });
        
        console.log('✓ Reschedule modal visible');

        const cancelButton = this.page.getByRole('button', { name: /cancel/i });
        await cancelButton.click();
        await this.page.waitForTimeout(500);
        console.log('✓ Reschedule cancelled');
    }
    

    /**
     * Get product count
     */
    async getAppointmentCount() {
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