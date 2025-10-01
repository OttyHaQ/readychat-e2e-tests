import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage';
import { LandingPage } from '../../pages/LandingPage';
import { AIBot } from '../../pages/AIBot';
import { Orders } from '../../pages/Orders';
import { fullUrl, safeClick, expectTextContains } from '../../utils/helpers';




test.describe.serial('Orders', () => {

    test.beforeEach(async ({ page }) => {
        
        const landingPage = new LandingPage(page);
        const signInPage = new SignInPage(page);
        
        // Sign In
        await page.goto(fullUrl('/en/auth/login'));
        // await landingPage.login.click();
        await safeClick(signInPage.denyBtn);
        await signInPage.fillSignInForm(process.env.USER_NAME, process.env.PASSWORD);
    });


    test('Verify Metrics', async ({ page }) => {

        const orderPage = new Orders(page);
        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.hover();
        await orderPage.order_mgt.click();
        await orderPage.orders.click();
        await expectTextContains(orderPage.total_orders, 'Total Orders');
        await expectTextContains(orderPage.completed_orders, 'Completed Orders');
        await expectTextContains(orderPage.orders_in_progess, 'Orders in Progress');
        await expectTextContains(orderPage.orders_cancelled, 'Orders Cancelled');
        await expectTextContains(orderPage.total_sales, 'Total Sales');

    });

    test('Verify that All Order Statuses Are Present', async ({ page }) => {

        const orderPage = new Orders(page);
        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.hover();
        await orderPage.order_mgt.click();
        await orderPage.orders.click();
        await orderPage.all_orders.click();
        await expectTextContains(orderPage.order_status, 'All Orders');
        await orderPage.in_progress.click();
        await expectTextContains(orderPage.order_status, 'Orders In Progress');
        await orderPage.draft.click();
        await expectTextContains(orderPage.order_status, 'Draft Orders');
        await orderPage.confirmed.click();
        await expectTextContains(orderPage.order_status, 'Confirmed Orders');
        await orderPage.shipping.click();
        await expectTextContains(orderPage.order_status, 'Shipping Orders');
        await orderPage.delivered.click();
        await expectTextContains(orderPage.order_status, 'Delivered Orders');
        await orderPage.completed.click();
        await expectTextContains(orderPage.order_status, 'Completed Orders');
        await orderPage.cancelled.click();
        await expectTextContains(orderPage.order_status, 'Cancelled Orders');  

    });


    test('Verify Table Columns', async ({ page }) => {

        const orderPage = new Orders(page);
        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.hover();
        await orderPage.order_mgt.click();
        await orderPage.orders.click();
        await expect(orderPage.id).toBeVisible();
        await expectTextContains(orderPage.id, 'ID');
        await expect(orderPage.products).toBeVisible();
        await expectTextContains(orderPage.products, 'Products');
        await expect(orderPage.customer).toBeVisible();
        await expectTextContains(orderPage.customer, 'Customer');
        await expect(orderPage.created).toBeVisible();
        await expectTextContains(orderPage.created, 'Created');
        await expect(orderPage.quantity).toBeVisible();
        await expectTextContains(orderPage.quantity, 'Quantity');
        await expect(orderPage.total_cost).toBeVisible();
        await expectTextContains(orderPage.total_cost, 'Total Cost');
        await expect(orderPage.channels).toBeVisible();
        await expectTextContains(orderPage.channels, 'Channels');
        await expect(orderPage.status).toBeVisible();
        await expectTextContains(orderPage.status, 'Status');
        await expect(orderPage.actions).toBeVisible();
        await expectTextContains(orderPage.actions, 'Actions');    

    });

    test('Reorder and Manage Columns', async ({ page }) =>{
        
        const orderPage = new Orders(page);
        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.hover();
        await orderPage.order_mgt.click();
        await orderPage.orders.click();
        await orderPage.reorder_btn.click();
        await orderPage.id_checkbox.dblclick();
        await orderPage.products_checkbox.dblclick();
        await orderPage.customer_checkbox.dblclick();
        await orderPage.quantity_checkbox.dblclick();
        await orderPage.total_checkbox.dblclick();
        await orderPage.channels_checkbox.dblclick();
        await orderPage.status_checkbox.dblclick();
        await orderPage.actions_checkbox.dblclick();
        await orderPage.created_checkbox.dblclick();
        await orderPage.save_btn.click();
    });

    test('Export Orders', async ({ page }) =>{
        
        const orderPage = new Orders(page);
        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.hover();
        await orderPage.order_mgt.click();
        await orderPage.orders.click();
        await orderPage.all_orders.click();
        await orderPage.export_btn.click();
        await orderPage.csv_btn.click();
        await orderPage.xlsx_btn.click();
        await orderPage.pdf_btn.click();
        await orderPage.close_modal.click();
       
    });

    test('Change Order Status', async ({ page }) =>{
        
        const orderPage = new Orders(page);
        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.hover();
        await orderPage.order_mgt.click();
        await orderPage.orders.click();
        // await orderPage.in_progress.click();

        await page.waitForTimeout(3000);

        await orderPage.changeOrderStatus();

        await expectTextContains(aiBotPage.alert, 'successfully');
       
    });


    test('Cancel Order', async ({ page }) =>{
        
        const orderPage = new Orders(page);
        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.hover();
        await orderPage.order_mgt.click();
        await orderPage.orders.click();
        await orderPage.shipping.click();

        await orderPage.first_row.locator('td').last().getByRole('button').click();
        // await page.getByRole('option', { name: 'Cancel Order' }).click();
        const cancelOption = page.getByRole('option', { name: 'Cancel Order' });
        await expect(cancelOption).toBeVisible();
        await cancelOption.click();
        await orderPage.confirm_btn.click();

        await expectTextContains(aiBotPage.alert, 'successfully');
       
    });

    test('Delete Order', async ({ page }) =>{
        
        const orderPage = new Orders(page);
        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.hover();
        await orderPage.order_mgt.click();
        await orderPage.orders.click();
        await orderPage.cancelled.click();

        await orderPage.first_row.locator('td').last().getByRole('button').click();
        // await page.getByRole('option', { name: 'Delete Order' }).click();
        await orderPage.delete_order.click();
        await orderPage.confirm_btn.click();

        // await expectTextContains(aiBotPage.alert, 'successfully');
       
    });


    test('View and Edit Order', async ({ page }) =>{
        
        const orderPage = new Orders(page);
        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.hover();
        await orderPage.order_mgt.click();
        await orderPage.orders.click();
        await orderPage.in_progress.click();

        await orderPage.first_row.locator('td').last().getByRole('button').click();
        await page.getByRole('option', { name: 'View Order Details' }).click();
        

        await expectTextContains(orderPage.order_page_title, 'Order ID');
        await expectTextContains(orderPage.customer_details, 'Customer Details');

        await orderPage.edit_order_btn.click();
        await expectTextContains(orderPage.edit_order_title, 'Edit Order');
        await orderPage.notes_field.fill('New Order');
        await orderPage.select_product_dropdown.click();
        await expect(page.getByRole('dialog')).toBeVisible();
        await orderPage.product_1.getByText('Banana').click();
        await orderPage.product_2.getByText('iphone 6').click();
        await orderPage.save_btn.click();
        // await orderPage.remove_product.click();
        await orderPage.quantity_field.clear();
        await orderPage.quantity_field.fill('5');
        await orderPage.save_changes.click();

        await expectTextContains(aiBotPage.alert, ['successfully', 'one or more products have reached their stock limit']);

    });

});