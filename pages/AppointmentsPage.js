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
        await this.appointmentsMenu.hover();
        await this.appointmentsMenu.click();
        await this.page.waitForURL(/appointments/);
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

                    // CRITICAL: Wait for dropdown to close
                    await this.page.waitForTimeout(500);
                    
                    // Verify dialog is closed
                    const dialog = this.page.locator('dialog[open], [role="dialog"]');
                    await dialog.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});

                    return optionText;
                } else {
                    console.warn(`⚠️ "${optionText}" not found, selecting first available option`);
                }
            }
            
            // Fall back to first option
            const options = await this.page.locator('[role="option"]').all();
            
            for (const option of options) {
                const text = await option.textContent();
                
                if (text?.trim() !== 'Add New Appointment Type') {
                    await option.click();
                    console.log(`✓ Selected: ${text?.trim()}`);

                    // CRITICAL: Wait for dropdown to close
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
    async selectDateWithAvailableSlots() {
        const maxAttempts = 10;
        let monthAttempts = 0;
        const maxMonthAttempts = 3;
        
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
                    // Select first time slot
                    await timeOptions.first().click();
                    console.log('✓ Selected time slot successfully');
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
     * Add a new appointment
     */
    async addNewAppointment(appointmentData) {

        await this.addAppointmentButton.click();
        await this.appointmentTitle.waitFor({state: 'visible', timeout: 10000});
        await this.appointmentTitle.fill(appointmentData.newTitle);
        await this.descriptionInput.fill(appointmentData.description);
            // Select dropdowns (with validation)
        
        if (appointmentData.status) {
            await this.selectFromDropdown(this.serviceSelect, appointmentData.service);
        }

        // Find a date with available time slots
        await this.selectDateWithAvailableSlots();
        
        if (appointmentData.status) {
            await this.selectFromDropdown(this.statusSelect, appointmentData.status);
        }
        
        
        if (appointmentData.time_slot) {
            await this.selectFromDropdown(this.selectTimeSlots);
        }

        if (appointmentData.customer) {
            await this.selectFromDropdown(this.customerSelect);
        }
        
        await this.createButton.click();
        await this.page.waitForTimeout(3000);
    }

   

    /**
     * Edit a product
     */

    async selectAction(actionName) {

        // Click actions button in first row
        const actionsButton = this.page.locator('tbody tr').first().locator('td').last().getByRole('button');
        await actionsButton.click();
        await this.page.waitForTimeout(500);

        // Click "View Product Details" option
        await this.page.evaluate((action) => {
            const options = Array.from(document.querySelectorAll('[role="option"]'));
            const option = options.find(el => el.textContent.includes(action));
            if (option) option.click();
        }, actionName);

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
            // 1. Wait for modal to appear (just verify it's visible)
            await this.page.getByRole('heading', { name: /Reschedule Appointment/i })
                .waitFor({ state: 'visible', timeout: 15000 });
            
            console.log('✓ Reschedule modal opened');
            
            // 2. Select date directly from page (modal is visible, calendar is on page)
            await this.selectNextAvailableDateFromPage(dateOffset);
            
            // 3. Wait for time slots to load
            await this.page.waitForTimeout(1500);
            
            // 4. Select time slot directly from page
            const selectedTime = await this.selectPreferredTimeSlotFromPage(preferredTimes);
            console.log(`✓ Selected time: ${selectedTime}`);
            
            // 5. Click Apply button (should be unique on page)
            const applyButton = this.page.getByRole('button', { name: /^apply$/i });
            await applyButton.click();
            console.log('✓ Clicked Apply');
            
            // 6. Wait for modal heading to disappear
            await this.page.getByRole('heading', { name: /Reschedule Appointment/i })
                .waitFor({ state: 'hidden', timeout: 5000 });
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
        // Wait for modal to be visible first
        await this.page.getByRole('heading', { name: /Reschedule Appointment/i })
            .waitFor({ state: 'visible', timeout: 10000 });
        
        console.log('✓ Reschedule modal visible');

        const cancelButton = this.page.getByRole('button', { name: /cancel/i });
        await cancelButton.click();
        
        await this.page.getByRole('heading', { name: /Reschedule Appointment/i })
            .waitFor({ state: 'visible', timeout: 10000 });
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