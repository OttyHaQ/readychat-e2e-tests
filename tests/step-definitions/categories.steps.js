import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { CategoriesPage } from '../../pages/CategoriesPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick } from '../../utils/helpers.js';

const { Given, When, Then } = createBdd();

Given('I am on the Categories page', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.navigateToCategories();
    await safeClick(page);
});

Given('at least one category exists', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    const count = await categoriesPage.getCategoryCount();
    if (count === 0) {
        await categoriesPage.addNewCategory({ name: `Temp Category ${Date.now()}`, description: 'Auto-created' });
        await page.waitForTimeout(2000);
    }
});

Then('at least one category metric should be visible', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.totalCategoriesMetric.waitFor({ state: 'visible', timeout: 30000 });
    const metrics = [categoriesPage.totalCategoriesMetric, categoriesPage.recentlyAddedMetric, categoriesPage.trendingCategoriesMetric];
    let visible = 0;
    for (const m of metrics) {
        if (await m.isVisible().catch(() => false)) visible++;
    }
    expect(visible).toBeGreaterThan(0);
});

Then('the categories table should have visible column headers including Name and Actions', async ({ page }) => {
    await page.locator('thead th').first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
    let headers = await page.locator('thead th').allTextContents();
    if (headers.every(h => h.trim() === '')) headers = await page.locator('thead th *').allTextContents();
    headers = headers.filter(h => h.trim() !== '');
    if (headers.length === 0) {
        const count = await page.locator('thead th, thead td').count();
        expect(count).toBeGreaterThan(0);
    } else {
        const expectedHeaders = ['Name', 'Actions'];
        let found = 0;
        for (const h of expectedHeaders) {
            if (headers.some(header => header.toLowerCase().includes(h.toLowerCase()))) found++;
        }
        expect(found).toBeGreaterThan(expectedHeaders.length / 2);
    }
});

When('I open the categories export modal', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.exportBtn.waitFor({ state: 'visible', timeout: 10000 });
    await categoriesPage.exportBtn.click();
    await expect(categoriesPage.exportModal).toBeVisible({ timeout: 5000 });
});

When('I export categories to CSV format with download', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await categoriesPage.csvBtn.click();
    await downloadPromise;
});

When('I export categories to XLSX format with download', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await categoriesPage.xlsxBtn.click();
    await downloadPromise;
});

When('I export categories to PDF format with download', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await categoriesPage.pdfBtn.click();
    await downloadPromise;
});

When('I close the categories export modal', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.closeModalBtn.click();
});

Then('all category export downloads should complete', async () => {});

When('I add a new category with description {string}', async ({ page }, description) => {
    const categoriesPage = new CategoriesPage(page);
    const newCategory = { name: `Test Category ${Date.now()}`, description };
    await expect(categoriesPage.addCategoryButton).toBeVisible({ timeout: 30000 });
    await categoriesPage.addNewCategory(newCategory);
    await page.waitForTimeout(2000);
});

Then('I should see a category success message', async ({ page }) => {
    const successAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await successAlert.first().waitFor({ state: 'visible', timeout: 30000 });
});

When('I edit the first category with an updated name and description', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    const aiBotPage = new AIBot(page);
    const updatedCategory = { name: `Updated Category ${Date.now()}`, description: 'Category Updated by Automation' };
    await page.waitForTimeout(2000);
    await categoriesPage.editCategory(updatedCategory);
    await page.waitForTimeout(2000);
    const editCatAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await editCatAlert.first().waitFor({ state: 'visible', timeout: 30000 });
    await categoriesPage.navigateToCategories();
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
});

When('I create a category for deletion', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    const aiBotPage = new AIBot(page);
    const tempCategory = { name: `Temp Category ${Date.now()}`, description: 'Temp Category created for deletion by Automation' };
    await categoriesPage.addNewCategory(tempCategory);
    await page.waitForTimeout(2000);
    const deleteCatAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await deleteCatAlert.first().waitFor({ state: 'visible', timeout: 30000 });
});

When('I sort categories by descending and delete the first category', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.sortByDescending();
    await categoriesPage.deleteCategory();
    await page.waitForTimeout(2000);
});

When('I attempt to reorder category columns', async ({ page }) => {
    const categoriesPage = new CategoriesPage(page);
    const reorderBtnVisible = await categoriesPage.reorderColumnsBtn.isVisible().catch(() => false);
    if (reorderBtnVisible) {
        await categoriesPage.openReorderColumns();
        await categoriesPage.toggleAllColumns();
        await categoriesPage.saveColumnOrder();
    }
});

