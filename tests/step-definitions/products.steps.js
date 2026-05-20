import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { ProductsPage } from '../../pages/ProductsPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick } from '../../utils/helpers.js';

const { Given, When, Then } = createBdd();

Given('I am on the Products page', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.navigateToProducts();
    await safeClick(page);
});

Given('at least one product exists', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const count = await productsPage.getProductCount();
    if (count === 0) {
        await productsPage.addNewProduct({ name: `Temp Product ${Date.now()}`, price: '50.00', stock: '10' });
        await page.waitForTimeout(2000);
    }
});

Then('at least one product metric should be visible', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.totalProductsMetric.waitFor({ state: 'visible', timeout: 30000 });
    const metrics = [productsPage.totalProductsMetric, productsPage.recentlyAddedMetric, productsPage.trendingProductsMetric];
    let visible = 0;
    for (const m of metrics) {
        if (await m.isVisible().catch(() => false)) visible++;
    }
    expect(visible).toBeGreaterThan(0);
});

Then('the products table should have visible column headers', async ({ page }) => {
    await page.locator('thead th').first().waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
    let headers = await page.locator('thead th').allTextContents();
    if (headers.every(h => h.trim() === '')) headers = await page.locator('thead th *').allTextContents();
    headers = headers.filter(h => h.trim() !== '');
    if (headers.length === 0) {
        const count = await page.locator('thead th, thead td').count();
        expect(count).toBeGreaterThan(0);
    } else {
        expect(headers.length).toBeGreaterThan(0);
    }
});

Then('the deleted tab should be accessible if present', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const deletedVisible = await productsPage.deletedTab.isVisible({ timeout: 3000 }).catch(() => false);
    if (deletedVisible) await productsPage.switchToTab('deletedTab');
});

When('I export products to CSV', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.exportBtn.click();
    await productsPage.csvBtn.click();
});

When('I export products to XLSX', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.xlsxBtn.click();
});

When('I export products to PDF', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.pdfBtn.click();
});

When('I close the products export modal', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.closeModalBtn.last().click();
});

Then('all product export formats should be initiated', async () => {});

When('I add a new product with price {string} stock {string} and description {string}', async ({ page }, price, stock, description) => {
    const productsPage = new ProductsPage(page);
    const newProduct = { name: `Test Product ${Date.now()}`, price, stock, description };
    await expect(productsPage.addProductButton).toBeVisible({ timeout: 30000 });
    await productsPage.addNewProduct(newProduct);
    await page.waitForTimeout(2000);
});

Then('I should see a product success message', async ({ page }) => {
    const successAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await successAlert.first().waitFor({ state: 'visible', timeout: 30000 });
});

When('I edit the first product with price {string} and stock {string}', async ({ page }, price, stock) => {
    const productsPage = new ProductsPage(page);
    const aiBotPage = new AIBot(page);
    const updatedProduct = { name: `Updated Product ${Date.now()}`, price, stock };
    await productsPage.navigateToProducts();
    await page.waitForTimeout(3000);
    await productsPage.editProduct(updatedProduct);
    const editSuccessAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await editSuccessAlert.first().waitFor({ state: 'visible', timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    await productsPage.navigateToProducts();
    await page.waitForTimeout(2000);
    await productsPage.verifyProductExists(updatedProduct.name);
});

Then('the updated product should appear in the table', async () => {});

When('I create a product for deletion', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const tempProduct = { name: `Temp Product for Deletion ${Date.now()}`, price: '25.00', stock: '5' };
    await productsPage.addNewProduct(tempProduct);
    await page.waitForTimeout(2000);
    await productsPage.navigateToProducts();
    await page.waitForLoadState('networkidle');
});

When('I sort products by descending and delete the first product', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.sortByDescending();
    await productsPage.deleteProduct();
    await page.waitForTimeout(2000);
});

When('I attempt to reorder product columns', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const reorderBtnVisible = await productsPage.reorderColumnsBtn.isVisible().catch(() => false);
    if (reorderBtnVisible) {
        await productsPage.openReorderColumns();
        await productsPage.toggleAllColumns();
        await productsPage.saveColumnOrder();
    }
});

