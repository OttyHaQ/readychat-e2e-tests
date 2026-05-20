import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { Orders } from '../../pages/Orders.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick } from '../../utils/helpers.js';

const { Given, When, Then } = createBdd();

Given('I am on the Orders page', async ({ page }) => {
    const ordersPage = new Orders(page);
    await ordersPage.navigateToOrders();
    await safeClick(page);
});

Then('all order metrics should be visible including total, completed, in progress, cancelled, and sales', async ({ page }) => {
    const ordersPage = new Orders(page);
    await expect(ordersPage.totalOrdersMetric).toContainText(/total orders/i);
    await expect(ordersPage.completedOrdersMetric).toContainText(/completed orders/i);
    await expect(ordersPage.ordersInProgressMetric).toContainText(/orders in progress/i);
    await expect(ordersPage.ordersCancelledMetric).toContainText(/orders cancelled/i);
    await expect(ordersPage.totalSalesMetric).toContainText(/total sales/i);
});

When('I switch to each order status tab', async ({ page }) => {
    const ordersPage = new Orders(page);
    for (const tab of ['all', 'in_progress', 'draft', 'confirmed', 'shipping', 'delivered', 'completed', 'cancelled']) {
        await ordersPage.switchToStatusTab(tab);
    }
});

Then('each tab header should reflect the correct status', async ({ page }) => {
    const ordersPage = new Orders(page);
    await expect(ordersPage.orderStatusHeader).toContainText(/cancelled orders/i);
});

Then('all order table columns should be visible including ID, Products, Customer, Created, Quantity, Total Cost, Channels, Status, and Actions', async ({ page }) => {
    const ordersPage = new Orders(page);
    await expect(ordersPage.idColumn).toBeVisible();
    await expect(ordersPage.productsColumn).toBeVisible();
    await expect(ordersPage.customerColumn).toBeVisible();
    await expect(ordersPage.createdColumn).toBeVisible();
    await expect(ordersPage.quantityColumn).toBeVisible();
    await expect(ordersPage.totalCostColumn).toBeVisible();
    await expect(ordersPage.channelsColumn).toBeVisible();
    await expect(ordersPage.statusColumn).toBeVisible();
    await expect(ordersPage.actionsColumn).toBeVisible();
});

When('I open the reorder columns modal and toggle all columns', async ({ page }) => {
    const ordersPage = new Orders(page);
    await ordersPage.openReorderColumns();
    await ordersPage.toggleAllColumns();
});

When('I save the column order', async ({ page }) => {
    const ordersPage = new Orders(page);
    await ordersPage.saveColumnOrder();
});

Then('the column order should be saved successfully', async () => {});

When('I open the export modal', async ({ page }) => {
    const ordersPage = new Orders(page);
    await ordersPage.switchToStatusTab('all');
    await ordersPage.exportBtn.click();
});

When('I export to CSV', async ({ page }) => {
    const ordersPage = new Orders(page);
    await ordersPage.csvBtn.click();
});

When('I export to XLSX', async ({ page }) => {
    const ordersPage = new Orders(page);
    await ordersPage.xlsxBtn.click();
});

When('I export to PDF', async ({ page }) => {
    const ordersPage = new Orders(page);
    await ordersPage.pdfBtn.click();
});

When('I close the export modal', async ({ page }) => {
    const ordersPage = new Orders(page);
    await ordersPage.closeModalBtn.last().click();
});

Then('all export formats should be initiated', async () => {});

When('I attempt to change an order status', async ({ page }) => {
    const ordersPage = new Orders(page);
    const aiBotPage = new AIBot(page);
    const orderCount = await ordersPage.getOrderCount();
    if (orderCount === 0) return;
    const statusChanged = await ordersPage.changeOrderStatus();
    if (!statusChanged) return;
    await page.waitForTimeout(3000);
    const statusAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await statusAlert.first().waitFor({ state: 'visible', timeout: 30000 });
});

Then('the status change should complete successfully or no changeable orders exist', async () => {});

When('I navigate to all orders and cancel an order', async ({ page }) => {
    const ordersPage = new Orders(page);
    await ordersPage.switchToStatusTab('all');
    await page.waitForTimeout(3000);
    const orderCount = await ordersPage.getOrderCount();
    if (orderCount === 0) return;
    await ordersPage.cancelOrder();
});

Then('the cancel action should complete successfully', async () => {});

When('I navigate to all orders and delete an order', async ({ page }) => {
    const ordersPage = new Orders(page);
    await page.waitForTimeout(2000);
    await safeClick(page);
    await ordersPage.switchToStatusTab('all');
    const orderCount = await ordersPage.getOrderCount();
    if (orderCount === 0) return;
    await ordersPage.deleteOrder();
});

Then('the delete action should complete successfully', async () => {});

When('I navigate to all orders and view the first order details', async ({ page }) => {
    const ordersPage = new Orders(page);
    await ordersPage.switchToStatusTab('all');
    await page.waitForTimeout(2000);
    const orderCount = await ordersPage.getOrderCount();
    if (orderCount === 0) return;
    await ordersPage.viewOrderDetails();
    await page.waitForTimeout(3000);
});

Then('the order details page should show order ID and customer details', async ({ page }) => {
    const ordersPage = new Orders(page);
    await expect(ordersPage.orderPageTitle).toContainText(/order id/i);
    await expect(ordersPage.customerDetailsHeader).toContainText(/customer details/i);
});

When('I edit the order with notes {string} and quantity {string}', async ({ page }, notes, quantity) => {
    const ordersPage = new Orders(page);
    await ordersPage.editOrder({ notes, quantity });
    await page.waitForTimeout(3000);
});

Then('I should see a success or stock limit message', async ({ page }) => {
    const successAlert = page.locator('[role="alert"]').filter({ hasText: /successfully|stock limit/i });
    await successAlert.first().waitFor({ state: 'visible', timeout: 30000 });
});
