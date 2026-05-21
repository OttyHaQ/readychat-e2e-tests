export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByText('Dashboard', { exact: true }).first();
    this.profileBtn = page.locator('.relative.w-full > [aria-expanded="false"] > .ps-4');
    this.logOutBtn = page.getByText('Log out');
    this.signOutBtn = page.getByRole('button', { name: 'Sign out' });

    // Metrics cards
    this.totalSalesMetric = page.getByText(/total sales/i).first();
    this.totalOrdersMetric = page.getByText(/total orders/i).first();
    this.messageCountMetric = page.getByText(/total messages|message count/i).first();
    this.metricsCards = page.locator('[class*="card"], [class*="metric"], [class*="stat"]');
    this.anyMetricCard = page.locator('[class*="card"]').first()
      .or(page.locator('[class*="metric"]').first())
      .or(page.locator('[class*="stat"]').first());

    // Unanswered questions section
    this.unansweredQuestionsSection = page.getByText(/unanswered questions/i).first();
    this.unansweredQuestionsTable = page.locator('table').first();

    // Orders table / activity section
    this.recentOrdersSection = page.getByText(/recent orders|latest orders/i).first();
    this.reorderColumnsBtn = page.getByRole('button', { name: /reorder/i }).first();
    this.exportBtn = page.getByRole('button', { name: /export/i }).first();
    this.addNewUserBtn = page.getByRole('button', { name: /add.*user|new.*user|invite/i });
    this.tableRows = page.locator('tbody tr');

    // Navigation shortcuts
    this.viewAllOrdersLink = page.getByRole('link', { name: /view all orders|see all/i });
  }

  async navigate() {
    await this.page.goto('/en/dashboard');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async signOut() {
    const profileButton = this.page.getByRole('button', { name: /Profile Picture/i });
    await profileButton.waitFor({ state: 'visible', timeout: 10000 });
    await profileButton.click();
    await this.page.waitForTimeout(1000);
    const logoutOption = this.page.getByRole('option', { name: 'Log out' });
    await logoutOption.waitFor({ state: 'visible', timeout: 5000 });
    await logoutOption.click();
    await this.signOutBtn.click();
  }
};
