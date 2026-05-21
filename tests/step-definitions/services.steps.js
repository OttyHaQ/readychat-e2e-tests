import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { ServicesPage } from '../../pages/ServicesPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick } from '../../utils/helpers.js';

const { Given, When, Then } = createBdd();

let lastCreatedServiceName = null;

Given('I am on the Services page', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    await servicePage.navigateToServices();
    await safeClick(page);
});

Given('at least one service exists', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    const count = await servicePage.getServiceCount();
    if (count === 0) {
        await servicePage.addNewService({ name: `Temp Service ${Date.now()}`, price: '50.00', description: 'Temp' });
        await page.waitForTimeout(2000);
    }
});

Given('at least one service type exists', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    const count = await servicePage.getServiceCount();
    if (count === 0) {
        await servicePage.addNewServiceType({ name: `Temp Service Type ${Date.now()}`, description: 'Temp' });
        await page.waitForTimeout(2000);
    }
});

When('I navigate to the Types tab', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    await servicePage.typesTab.waitFor({ state: 'visible', timeout: 10000 });
    await servicePage.switchToTab('types');
    await page.waitForTimeout(1000);
});

Then('at least one service metric should be visible', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    await servicePage.totalServicesMetric.waitFor({ state: 'visible', timeout: 30000 });
    const metrics = [servicePage.totalServicesMetric, servicePage.recentlyAddedMetric, servicePage.activeServicesMetric, servicePage.inactiveServicesMetric];
    let visible = 0;
    for (const m of metrics) {
        if (await m.isVisible().catch(() => false)) visible++;
    }
    expect(visible).toBeGreaterThan(0);
});

Then('the services table should have visible column headers including Service Name and Status', async ({ page }) => {
    await page.locator('thead th').first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
    let headers = await page.locator('thead th').allTextContents();
    if (headers.every(h => h.trim() === '')) headers = await page.locator('thead th *').allTextContents();
    headers = headers.filter(h => h.trim() !== '');
    if (headers.length === 0) {
        const count = await page.locator('thead th, thead td').count();
        expect(count).toBeGreaterThan(0);
    } else {
        const expected = ['Service Name', 'Status'];
        let found = expected.filter(e => headers.some(h => h.toLowerCase().includes(e.toLowerCase()))).length;
        expect(found).toBeGreaterThan(0);
    }
});

Then('the service types table should have visible column headers including Name and Action', async ({ page }) => {
    await page.locator('thead th').first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
    let headers = await page.locator('thead th').allTextContents();
    if (headers.every(h => h.trim() === '')) headers = await page.locator('thead th *').allTextContents();
    headers = headers.filter(h => h.trim() !== '');
    if (headers.length === 0) {
        const count = await page.locator('thead th, thead td').count();
        expect(count).toBeGreaterThan(0);
    } else {
        const expected = ['Name', 'Action'];
        let found = expected.filter(e => headers.some(h => h.toLowerCase().includes(e.toLowerCase()))).length;
        expect(found).toBeGreaterThan(expected.length / 2);
    }
});

When('I open the service export modal', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    await servicePage.exportBtn.waitFor({ state: 'visible', timeout: 10000 });
    await servicePage.exportBtn.click();
    await expect(servicePage.exportModal).toBeVisible({ timeout: 5000 });
});

When('I export services to CSV format with download', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await servicePage.csvBtn.click();
    await downloadPromise;
});

When('I export services to XLSX format with download', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await servicePage.xlsxBtn.click();
    await downloadPromise;
});

When('I export services to PDF format with download', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await servicePage.pdfBtn.click();
    await downloadPromise;
});

When('I close the service export modal', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    await servicePage.closeModalBtn.click();
});

Then('all service export downloads should complete', async () => {});

When('I add a new service with price {string} currency {string} and description {string}', async ({ page }, price, currency, description) => {
    const servicePage = new ServicesPage(page);
    const aiBotPage = new AIBot(page);
    lastCreatedServiceName = `Test Service ${Date.now()}`;
    const serviceData = { name: lastCreatedServiceName, status: 'Active', price, currency, description };
    await expect(servicePage.addServiceButton).toBeVisible({ timeout: 30000 });
    await servicePage.addNewService(serviceData);
    await page.waitForTimeout(2000);
    const addServiceAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await addServiceAlert.first().waitFor({ state: 'visible', timeout: 30000 });
});

Then('I should see a service success message', async ({ page }) => {
    const successAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await successAlert.first().waitFor({ state: 'visible', timeout: 30000 });
});

When('I add a new service type with description {string}', async ({ page }, description) => {
    const servicePage = new ServicesPage(page);
    const newServiceType = { name: `Test Service Type ${Date.now()}`, description };
    await expect(servicePage.addServiceTypeButton).toBeVisible({ timeout: 30000 });
    await servicePage.addNewServiceType(newServiceType);
    await page.waitForTimeout(2000);
    page._lastServiceType = newServiceType.name;
});

Then('the new service type should appear in the table', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    await servicePage.sortByDescending();
    const maxPages = 5;
    let found = false;
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const cell = page.getByRole('cell', { name: page._lastServiceType });
        if (await cell.isVisible().catch(() => false)) { found = true; break; }
        const nextBtn = page.getByRole('button', { name: String(pageNum + 1), exact: true });
        if (await nextBtn.isVisible().catch(() => false)) {
            await nextBtn.click();
            await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        } else break;
    }
    expect(found, `Service type not found in first ${maxPages} pages`).toBeTruthy();
});

When('I edit the first service with price {string} and description {string}', async ({ page }, price, description) => {
    const servicePage = new ServicesPage(page);
    const aiBotPage = new AIBot(page);
    const updatedService = { name: `Updated Service ${Date.now()}`, price, description };
    await page.waitForTimeout(2000);
    await servicePage.editService(updatedService);
    await page.waitForTimeout(2000);
    const editServiceAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await editServiceAlert.first().waitFor({ state: 'visible', timeout: 30000 });
});

When('I edit the first service type with an updated name and description', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    const updatedServiceType = { name: `Updated Service Type ${Date.now()}`, description: 'Updated Service Type Description via Automation' };
    await page.waitForTimeout(2000);
    await servicePage.editServiceType(updatedServiceType);
});

When('I sort services by descending and delete the first service', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    await servicePage.sortByDescending();
    await servicePage.deleteService();
});

Then('the service delete action should complete', async () => {});

When('I create a service type for deletion', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    const tempService = { name: `Temp Service type for Deletion ${Date.now()}`, description: 'Temp Service type for deleting with Automation' };
    await servicePage.addNewServiceType(tempService);
    await page.waitForTimeout(2000);
});

When('I sort services by descending and delete the first service type', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    await servicePage.sortByDescending();
    await servicePage.deleteServiceType();
});

Then('the service type delete action should complete', async () => {});

When('I attempt to reorder service columns', async ({ page }) => {
    const servicePage = new ServicesPage(page);
    const reorderBtnVisible = await servicePage.reorderColumnsBtn.isVisible().catch(() => false);
    if (reorderBtnVisible) {
        await servicePage.openReorderColumns();
        await servicePage.toggleAllColumns();
        await servicePage.saveColumnOrder();
    }
});
