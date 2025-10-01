import { expect } from '@playwright/test';

export class Orders {
  constructor(page) {
    this.page = page;
    this.order_mgt = page.locator('xpath=//div[contains(text(),"Order Management")]');

    // ORDERS
    this.orders = page.locator('xpath=//a[normalize-space()="Orders"]');

    // Order metrics
    this.total_orders = page.locator('xpath=//span[normalize-space()="Total Orders"]');
    this.completed_orders = page.locator('xpath=//span[normalize-space()="Completed Orders"]');
    this.orders_in_progess = page.locator('xpath=//span[normalize-space()="Orders in Progress"]');
    this.orders_cancelled = page.locator('xpath=//span[normalize-space()="Orders Cancelled"]');
    this.total_sales = page.locator('xpath=//span[normalize-space()="Total Sales"]');

    // Order Status Buttons
    this.all_orders = page.locator('xpath=//span[normalize-space()="All Orders"]');
    this.in_progress = page.locator('div[class="flex gap-1 overflow-x-auto scrollbar-hide"] div:nth-child(1) span:nth-child(1)');
    this.draft = page.locator('xpath=//span[normalize-space()="Draft"]');
    this.confirmed = page.locator('xpath=//span[normalize-space()="Confirmed"]');
    this.shipping = page.locator('xpath=//span[normalize-space()="Shipping"]');
    this.delivered = page.locator('xpath=//span[normalize-space()="Delivered"]');
    this.completed = page.locator('xpath=//span[normalize-space()="Completed"]');
    this.cancelled = page.locator('xpath=//span[normalize-space()="Cancelled"]');

    // Order status
    this.order_status = page.locator('.h4');

    // Order Table columns
    this.id = page.locator('xpath=//div[normalize-space()="ID"]');
    this.products = page.locator('xpath=//div[normalize-space()="Products"]');
    this.customer = page.locator('xpath=//div[normalize-space()="Customer"]');
    this.created = page.locator('xpath=//div[normalize-space()="Created"]');
    this.quantity = page.locator('xpath=//div[normalize-space()="Quantity"]');
    this.total_cost = page.locator('xpath=//div[normalize-space()="Total Cost"]');
    this.channels = page.locator('//div[@class="flex justify-start gap-1 items-center"][normalize-space()="Channels"]');
    this.status = page.locator('xpath=//div[normalize-space()="Status"]');
    this.actions = page.locator('xpath=//div[normalize-space()="Actions"]');

    // Reorder Columns
    this.reorder_btn = page.locator('button[class="h-full bg-gray-100 text-gray-700 border-2 border-brand-gray-200 p-4 text-base rounded-xl font-semibold transition-[colors,box-shadow] duration-200 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gray-100"]');
    this.id_checkbox = page.locator('xpath=//span[contains(text(),"ID")]');
    this.products_checkbox = page.locator('xpath=//span[contains(text(),"Products")]');
    this.customer_checkbox = page.locator('xpath=//span[contains(text(),"Customer")]')
    this.created_checkbox = page.locator('xpath=//span[contains(text(),"Created")]');
    this.quantity_checkbox = page.locator('xpath=//span[contains(text(),"Quantity")]');
    this.total_checkbox = page.locator('xpath=//span[contains(text(),"Total Cost")]');
    this.channels_checkbox = page.locator('xpath=//span[contains(text(),"Channels")]');
    this.status_checkbox = page.locator('xpath=//span[contains(text(),"Status")]');
    this.actions_checkbox = page.locator('xpath=//span[contains(text(),"Actions")]');
    this.save_btn = page.locator('xpath=//button[normalize-space()="Save"]');
    this.cancel_btn = page.locator('xpath=//button[normalize-space()="Cancel"]');

    // Export
    this.export_btn = page.locator('xpath=//button[normalize-space()="Export"]');
    this.csv_btn = page.locator('xpath=//button[normalize-space()="CSV"]');
    this.xlsx_btn = page.locator('xpath=//button[normalize-space()="XLSX"]');
    this.pdf_btn = page.locator('xpath=//button[normalize-space()="PDF"]');
    this.close_modal = page.locator('button[aria-label="Close modal"]');

    // Change Order Status
    this.status_dropdown = page.locator('xpath=//body[1]/main[1]/div[1]/div[2]/main[1]/div[1]/section[1]/div[4]/div[1]/div[1]/div[2]/div[1]/table[1]/tbody[1]/tr[1]/td[8]/div[1]/div[1]/button[1]');
    this.status_options = page.locator('[role="option"]');
    this.tick = page.locator('xpath=//div[@id=":rha:"]//div[3]//*[name()="svg"]');
    this.current_option = page.locator('[role="option"]:has(svg)');
    

    // View/Edit Order Details
    this.first_row = page.locator('table >> tbody >> tr').first()
    this.actions_btn = page.locator('body > main:nth-child(2) > div:nth-child(1) > div:nth-child(2) > main:nth-child(2) > div:nth-child(1) > section:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(9) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)');
    this.order_page_title = page.locator('div[class="flex items-center gap-3"] h5');
    this.customer_details = page.locator('xpath=//h4[normalize-space()="Customer Details"]');
    this.edit_order_btn = page.locator('xpath=//button[normalize-space()="Edit Order"]');
    this.edit_order_title = page.locator('.text-center.font-semibold.text-2xl');
    this.notes_field = page.locator('#notes');
    this.select_product_dropdown = page.locator('button[class="w-full ps-4 pe-2 py-4 mt-2 text-left bg-white border border-brand-gray-100 rounded-xl shadow-sm focus:outline-none flex items-center justify-between"]');
    this.options = page.locator('[role="option"]');
    this.product_1 = page.getByRole('row', { name: /Banana/ });
    this.product_2 = page.getByRole('row', { name: /iPhone 6/ });
    this.remove_product = page.locator('');
    this.quantity_field = page.locator('input[id="products[0].quantity"]');
    this.search = page.locator('input[placeholder="Search..."]');
    this.save_changes = page.locator('xpath=//button[normalize-space()="Save changes"]');
    this.close = page.locator('xpath=//button[normalize-space()="Close"]');
    this.alert = page.locator('xpath=//div[contains(text(),"Order updated successfully.")]')
    

    // Cancel Order
    this.cancel_order = page.getByRole('option', { name: 'Cancel Order' });
    this.confirm_btn = page.locator('xpath=//button[normalize-space()="Confirm"]');
    

    // Delete Order
    this.delete_order = page.getByRole('option', { name: 'Delete Order' });

    // alert
    this.alert = page.locator('xpath=(//div[contains(text(),"Order status updated successfully.")])[1]');

    // CHECKOUT QUESTIONS
    this.checkout_qstns = page.locator('xpath=//a[normalize-space()="Checkout Questions"]');


  };


  get view_order_details() {
    return this.page.getByRole('option', { name: 'View Order Details' });
  }


  async changeOrderStatus() {

    await this.status_dropdown.click();

    await expect(this.status_options.first()).toBeVisible();

    await expect(this.current_option).toBeVisible();

    const options = await this.status_options.allTextContents();

    const currentStatus = await this.current_option.innerText();

    if((currentStatus !== 'Completed') && (currentStatus !== "Cancelled") ) {
        const currentIndex = options.findIndex(o => o.includes(currentStatus.trim()));
        const nextIndex = (currentIndex + 1) % options.length;
        const nextStatus = options[nextIndex];
        // console.log('Current Status:', currentStatus, 'Next Status:', nextStatus);
        await this.page.locator(`[role="option"]:has-text("${nextStatus}")`).click();
    }
    else {
        console.log('Cannot change Status for orders in Complete or Cancelled state');
    };
  };
  
};