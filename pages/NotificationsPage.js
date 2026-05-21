export class NotificationsPage {
  constructor(page) {
    this.page = page;

    // Notification bell / icon
    this.notificationBell = page.getByRole('button', { name: /notification/i })
      .or(page.locator('[aria-label*="notification"], [data-testid*="notification"]')).first();
    this.notificationBadge = page.locator('[class*="badge"], [class*="count"]').first();

    // In-app notification center
    this.notificationCenter = page.getByRole('dialog', { name: /notification/i })
      .or(page.locator('[class*="notification-panel"], [class*="notification-center"]')).first();
    this.notificationItems = page.locator('[class*="notification-item"], [data-testid*="notification-item"]');
    this.markAllReadBtn = page.getByRole('button', { name: /mark all.*read|read all/i });
    this.clearAllBtn = page.getByRole('button', { name: /clear all|dismiss all/i });

    // Notification history / list
    this.historySection = page.getByText(/notification history|all notifications/i).first();
    this.tableRows = page.locator('tbody tr');

    // Email notification settings
    this.emailTriggerSection = page.getByText(/email.*notification|email.*trigger/i).first();
    this.newMessageEmailToggle = page.getByLabel(/new message/i)
      .or(page.locator('input[type="checkbox"]').nth(0));
    this.newOrderEmailToggle = page.getByLabel(/new order/i)
      .or(page.locator('input[type="checkbox"]').nth(1));
    this.appointmentEmailToggle = page.getByLabel(/appointment/i)
      .or(page.locator('input[type="checkbox"]').nth(2));

    // SMS notification settings
    this.smsTriggerSection = page.getByText(/sms.*notification|sms.*trigger/i).first();

    // Save button
    this.saveBtn = page.getByRole('button', { name: /save|update/i }).last();

    // Alerts
    this.successAlert = page.locator('[role="alert"]').filter({ hasText: /success|updated|saved/i });
  }

  async navigateToSettings() {
    const candidates = [
      '/en/dashboard/notifications',
      '/en/dashboard/settings/notifications',
      '/configure/notifications',
    ];
    for (const url of candidates) {
      await this.page.goto(url);
      await this.page.waitForLoadState('domcontentloaded');
      const current = this.page.url();
      if (!current.includes('404') && !current.includes('not-found') && !current.includes('error')) {
        return;
      }
    }
  }

  async openNotificationCenter() {
    const bellVisible = await this.notificationBell.isVisible({ timeout: 5000 }).catch(() => false);
    if (!bellVisible) return false;
    await this.notificationBell.click();
    await this.page.waitForTimeout(1000);
    return true;
  }

  async getNotificationCount() {
    return await this.notificationItems.count();
  }

  async markAllAsRead() {
    const visible = await this.markAllReadBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (!visible) return false;
    await this.markAllReadBtn.click();
    await this.page.waitForTimeout(1000);
    return true;
  }
}
