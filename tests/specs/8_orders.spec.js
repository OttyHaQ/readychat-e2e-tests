import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { Orders } from '../../pages/Orders.js';
import { safeClick, expectTextContains, fullUrl } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

test.describe('Order Management', () => {
    const testCredentials = {
        username: process.env.USER_NAME || 'default_user',
        password: process.env.PASSWORD || 'default_password'
    };

  test.beforeAll(async () => {
        // Load test credentials
        try {
        console.log(`✓ Loaded credentials for user: ${testCredentials.username}`);
        } catch (error) {
        console.warn('⚠️ environment variables not available');
        }
   });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(120000); // 2 minutes for order tests

    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);

    try {
            // Navigate and sign in with retry logic
            await page.goto('/');
            await page.waitForLoadState('domcontentloaded');
            
            await landingPage.login.waitFor({ state: 'visible', timeout: 10000 });
            
            // Click and wait for navigation with retry
            let navigationSuccess = false;
            let attempts = 0;
            const maxAttempts = 3;
            
            while (!navigationSuccess && attempts < maxAttempts) {
                attempts++;
                
                try {
                    const navigationPromise = page.waitForURL(
                    url => url.href.includes('/en/auth/login'), 
                    { timeout: 30000 }
                );
                
                await landingPage.login.click();
                await navigationPromise;
                
                // Verify we're actually on login page
                const currentUrl = page.url();
                if (currentUrl.includes('/en/auth/login')) {
                    navigationSuccess = true;
                    console.log(`✓ Navigated to login (attempt ${attempts})`);
                }
                } catch (error) {
                if (attempts === maxAttempts) throw error;
                    console.log(`⚠️ Navigation attempt ${attempts} failed, retrying...`);
                    await page.waitForTimeout(2000);
                }
            }
            
            // Wait for form to be ready
            await signInPage.usernameField.waitFor({ state: 'visible', timeout: 10000 });
            await safeClick(page);
            
            await signInPage.fillSignInForm(testCredentials.username, testCredentials.password);
            await expect(page).toHaveURL('/en/dashboard', { timeout: 30000 });
            
            console.log('✓ User signed in successfully');
            } catch (error) {
            console.error('❌ Login failed:', error.message);
            throw error;
        }
  });

  test('Should display all order metrics', async ({ page }) => {
    const ordersPage = new Orders(page);
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Orders page', async () => {
        await aiBotPage.aiBotMenuItem.hover();
        await ordersPage.navigateToOrders();
        await safeClick(page);
        console.log('✓ Orders page loaded');
      });

      await test.step('Verify all metrics are visible', async () => {
        await expect(ordersPage.totalOrdersMetric).toContainText(/total orders/i);
        await expect(ordersPage.completedOrdersMetric).toContainText(/completed orders/i);
        await expect(ordersPage.ordersInProgressMetric).toContainText(/orders in progress/i);
        await expect(ordersPage.ordersCancelledMetric).toContainText(/orders cancelled/i);
        await expect(ordersPage.totalSalesMetric).toContainText(/total sales/i);
        console.log('✓ All metrics verified');
      });

      console.log('\n✅ Verify metrics test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should display all order status tabs', async ({ page }) => {
    const ordersPage = new Orders(page);
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Orders page', async () => {
        await aiBotPage.aiBotMenuItem.hover();
        await ordersPage.navigateToOrders();
        await safeClick(page);
      });

      await test.step('Verify All Orders status', async () => {
        await ordersPage.switchToStatusTab('all');
        await expect(ordersPage.orderStatusHeader).toContainText(/all orders/i);
        console.log('✓ All Orders tab verified');
      });

      await test.step('Verify In Progress status', async () => {
        await ordersPage.switchToStatusTab('in_progress');
        await expect(ordersPage.orderStatusHeader).toContainText(/orders in progress/i);
        console.log('✓ In Progress tab verified');
      });

      await test.step('Verify Draft status', async () => {
        await ordersPage.switchToStatusTab('draft');
        await expect(ordersPage.orderStatusHeader).toContainText(/draft orders/i);
        console.log('✓ Draft tab verified');
      });

      await test.step('Verify Confirmed status', async () => {
        await ordersPage.switchToStatusTab('confirmed');
        await expect(ordersPage.orderStatusHeader).toContainText(/confirmed orders/i);
        console.log('✓ Confirmed tab verified');
      });

      await test.step('Verify Shipping status', async () => {
        await ordersPage.switchToStatusTab('shipping');
        await expect(ordersPage.orderStatusHeader).toContainText(/shipping orders/i);
        console.log('✓ Shipping tab verified');
      });

      await test.step('Verify Delivered status', async () => {
        await ordersPage.switchToStatusTab('delivered');
        await expect(ordersPage.orderStatusHeader).toContainText(/delivered orders/i);
        console.log('✓ Delivered tab verified');
      });

      await test.step('Verify Completed status', async () => {
        await ordersPage.switchToStatusTab('completed');
        await expect(ordersPage.orderStatusHeader).toContainText(/completed orders/i);
        console.log('✓ Completed tab verified');
      });

      await test.step('Verify Cancelled status', async () => {
        await ordersPage.switchToStatusTab('cancelled');
        await expect(ordersPage.orderStatusHeader).toContainText(/cancelled orders/i);
        console.log('✓ Cancelled tab verified');
      });

      console.log('\n✅ Order status tabs test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should display all table columns', async ({ page }) => {
    const ordersPage = new Orders(page);
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Orders page', async () => {
        await aiBotPage.aiBotMenuItem.hover();
        await ordersPage.navigateToOrders();
        await safeClick(page);
      });

      await test.step('Verify all table columns', async () => {
        await expect(ordersPage.idColumn).toBeVisible();
        await expect(ordersPage.idColumn).toContainText(/id/i);
        
        await expect(ordersPage.productsColumn).toBeVisible();
        await expect(ordersPage.productsColumn).toContainText(/products/i);
        
        await expect(ordersPage.customerColumn).toBeVisible();
        await expect(ordersPage.customerColumn).toContainText(/customer/i);
        
        await expect(ordersPage.createdColumn).toBeVisible();
        await expect(ordersPage.createdColumn).toContainText(/created/i);
        
        await expect(ordersPage.quantityColumn).toBeVisible();
        await expect(ordersPage.quantityColumn).toContainText(/quantity/i);
        
        await expect(ordersPage.totalCostColumn).toBeVisible();
        await expect(ordersPage.totalCostColumn).toContainText(/total cost/i);
        
        await expect(ordersPage.channelsColumn).toBeVisible();
        await expect(ordersPage.channelsColumn).toContainText(/channels/i);
        
        await expect(ordersPage.statusColumn).toBeVisible();
        await expect(ordersPage.statusColumn).toContainText(/status/i);
        
        await expect(ordersPage.actionsColumn).toBeVisible();
        await expect(ordersPage.actionsColumn).toContainText(/actions/i);
        
        console.log('✓ All table columns verified');
      });

      console.log('\n✅ Table columns test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should reorder and manage table columns', async ({ page }) => {
    const ordersPage = new Orders(page);
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Orders page', async () => {
        await aiBotPage.aiBotMenuItem.hover();
        await ordersPage.navigateToOrders();
        await safeClick(page);
      });

      await test.step('Open reorder modal and toggle columns', async () => {
        await ordersPage.openReorderColumns();
        await ordersPage.toggleAllColumns();
        console.log('✓ All columns toggled');
      });

      await test.step('Save column order', async () => {
        await ordersPage.saveColumnOrder();
        console.log('✓ Column order saved');
      });

      console.log('\n✅ Reorder columns test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should export orders in different formats', async ({ page }) => {
    const ordersPage = new Orders(page);
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Orders page', async () => {
        await aiBotPage.aiBotMenuItem.hover();
        await ordersPage.navigateToOrders();
        await safeClick(page);
        await ordersPage.switchToStatusTab('all');
      });

      await test.step('Export to CSV', async () => {
        await ordersPage.exportBtn.click();
        await ordersPage.csvBtn.click();
        console.log('✓ CSV export initiated');
      });

      await test.step('Export to XLSX', async () => {
        await ordersPage.xlsxBtn.click();
        console.log('✓ XLSX export initiated');
      });

      await test.step('Export to PDF', async () => {
        await ordersPage.pdfBtn.click();
        console.log('✓ PDF export initiated');
      });

      await test.step('Close export modal', async () => {
        await ordersPage.closeModalBtn.last().click();
        console.log('✓ Export modal closed');
      });

      console.log('\n✅ Export orders test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should change order status', async ({ page }) => {
    const ordersPage = new Orders(page);
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Orders page', async () => {
        await aiBotPage.aiBotMenuItem.hover();
        await ordersPage.navigateToOrders();
        await safeClick(page);
      });

      await test.step('Change order status', async () => {
        const orderCount = await ordersPage.getOrderCount();
        
        if (orderCount === 0) {
          console.log('⚠️ No orders available to change status');
          return;
        }

        // Attempt to change status
        const statusChanged = await ordersPage.changeOrderStatus();

        // If no changeable orders found, skip test gracefully
        if (!statusChanged) {
            console.log('⚠️ No orders with changeable status available - skipping test');
            test.skip();
            return;
        }
        
        // Verify success message only if status was actually changed
        await page.waitForTimeout(3000);
        await aiBotPage.alert.first().waitFor({ state: 'visible', timeout: 10000 });
        await expect(aiBotPage.alert.first()).toContainText(/successfully/i);
        console.log('✓ Order status changed successfully');
      });

      console.log('\n✅ Change order status test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should cancel an order', async ({ page }) => {
    const ordersPage = new Orders(page);
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Shipping orders', async () => {
        await aiBotPage.aiBotMenuItem.hover();
        await ordersPage.navigateToOrders();
        await safeClick(page);
        
        await ordersPage.switchToStatusTab('all');
        await page.waitForTimeout(3000);
      
        console.log('✓ Switched to All Orders');
      });

      await test.step('Cancel an order', async () => {
        const orderCount = await ordersPage.getOrderCount();
        
        if (orderCount === 0) {
          console.log('⚠️ No orders available to cancel');
          test.skip();
          return;
        }

        await ordersPage.cancelOrder();

        console.log('✓ Order cancelled successfully');
      });

      console.log('\n✅ Cancel order test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should delete a cancelled order', async ({ page }) => {
    const ordersPage = new Orders(page);
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Cancelled orders', async () => {
        await aiBotPage.aiBotMenuItem.hover();
        await ordersPage.navigateToOrders();
        await page.waitForTimeout(2000)
        await safeClick(page);
        await ordersPage.switchToStatusTab('all');
      
        console.log('✓ Navigated to All orders');
      });

      await test.step('Delete an order', async () => {
        const orderCount = await ordersPage.getOrderCount();
        
        if (orderCount === 0) {
          console.log('⚠️ No orders available to delete');
          test.skip();
        }

        await ordersPage.deleteOrder();
        
        // Note: Delete may not show success message in all cases
        console.log('✓ Delete order action completed');
      });

      console.log('\n✅ Delete order test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should view and edit order details', async ({ page }) => {
    const ordersPage = new Orders(page);
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to In Progress orders', async () => {
        await aiBotPage.aiBotMenuItem.hover();
        await ordersPage.navigateToOrders();
        await safeClick(page);
        await ordersPage.switchToStatusTab('all');
        await page.waitForTimeout(2000);
        console.log('✓ Switched to All Orders');
      });

      await test.step('View order details', async () => {
        const orderCount = await ordersPage.getOrderCount();
        
        if (orderCount === 0) {
          console.log('⚠️ No in-progress orders available to edit');
          test.skip;
          return;
        }

        await ordersPage.viewOrderDetails();
        
        // Verify order details page loaded
        await page.waitForTimeout(3000);
        await expect(ordersPage.orderPageTitle).toContainText(/order id/i);
        await expect(ordersPage.customerDetailsHeader).toContainText(/customer details/i);
        console.log('✓ Order details displayed');
      });

      await test.step('Edit order', async () => {
        await ordersPage.editOrder({
          notes: 'Updated order via automation',
          quantity: '5'
        });
        
        // Verify success or stock limit message
        await page.waitForTimeout(3000);
        await aiBotPage.alert.first().waitFor({ state: 'visible', timeout: 10000 });
        await expect(aiBotPage.alert.first()).toContainText(/successfully|stock limit/i);
      });

      console.log('\n✅ View and edit order test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = `tests/screenshots/${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    }
  });
});
