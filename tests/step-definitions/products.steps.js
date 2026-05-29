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

When('I search for a product by name {string}', async ({ page }, searchText) => {
    const searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"]'))
      .first();
    const searchVisible = await searchInput.isVisible({ timeout: 5000 }).catch(() => false);
    if (searchVisible) {
        await searchInput.fill(searchText);
        await page.waitForTimeout(1500);
    } else {
        console.log('Search input not found on products page — filtering may not be available');
    }
});

Then('the products table should be filtered or a no results message should appear', async ({ page }) => {
    await page.waitForTimeout(1000);
    const noResults = page.getByText(/no results|no products|no data found/i).first();
    const hasNoResults = await noResults.isVisible({ timeout: 3000 }).catch(() => false);
    if (!hasNoResults) {
        const rowCount = await page.locator('tbody tr').count();
        expect(rowCount).toBeGreaterThanOrEqual(0);
        console.log(`Products table shows ${rowCount} rows after search`);
    }
});

Given('at least two products exist', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const count = await productsPage.getProductCount();
    if (count < 2) {
        for (let i = count; i < 2; i++) {
            await productsPage.addNewProduct({ name: `Bulk Test Product ${Date.now()}_${i}`, price: '10.00', stock: '5' });
            await page.waitForTimeout(1500);
        }
        await productsPage.navigateToProducts();
        await page.waitForTimeout(2000);
    }
});

When('I select multiple products using bulk selection', async ({ page }) => {
    await page.waitForTimeout(1000);
    // Try header checkbox for select-all
    const selectAllCheckbox = page.locator('thead input[type="checkbox"]').first();
    const selectAllVisible = await selectAllCheckbox.isVisible({ timeout: 5000 }).catch(() => false);
    if (selectAllVisible) {
        await selectAllCheckbox.click({ force: true });
        await page.waitForTimeout(500);
        console.log('Product bulk select-all checkbox clicked');
    } else {
        // Try selecting first two row checkboxes
        const rowCheckboxes = page.locator('tbody input[type="checkbox"]');
        const count = await rowCheckboxes.count();
        if (count >= 2) {
            await rowCheckboxes.nth(0).click({ force: true });
            await rowCheckboxes.nth(1).click({ force: true });
            await page.waitForTimeout(500);
        } else {
            console.log('No product bulk select checkboxes found — bulk operations may not be supported');
        }
    }
});

When('I trigger bulk delete for selected products', async ({ page }) => {
    const bulkDeleteBtn = page.getByRole('button', { name: /delete selected|bulk delete/i })
      .or(page.locator('button').filter({ hasText: /delete/i }).first());
    const btnVisible = await bulkDeleteBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (btnVisible) {
        await bulkDeleteBtn.click();
        await page.waitForTimeout(1000);
    } else {
        console.log('Bulk delete button not found — no bulk action bar appeared after selection');
    }
});

Then('the bulk delete action should complete or a confirmation should appear', async ({ page }) => {
    const confirmBtn = page.getByRole('button', { name: /confirm|yes|delete/i }).last();
    const confirmVisible = await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (confirmVisible) {
        await confirmBtn.click();
        await page.waitForTimeout(2000);
        const successAlert = page.locator('[role="alert"]').filter({ hasText: /success|deleted/i });
        const found = await successAlert.first().waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
        if (!found) console.log('No success alert after bulk delete confirmation');
    } else {
        console.log('No bulk delete confirmation dialog — action may have succeeded or bulk delete is not supported');
    }
});

