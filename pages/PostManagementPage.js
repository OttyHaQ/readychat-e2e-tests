export class PostManagementPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.postManagementMenuItem = page.getByRole('link', { name: /post management/i })
      .or(page.getByRole('menuitem', { name: /post management/i }))
      .or(page.getByText(/post management/i).first());

    // Page header
    this.pageHeader = page.getByRole('heading', { name: /post/i }).first();

    // Post table
    this.tableRows = page.locator('tbody tr');
    this.firstTableRow = page.locator('tbody tr').first();
    this.emptyState = page.getByText(/no posts|no data/i).first();

    // Post action buttons
    this.addPostBtn = page.getByRole('button', { name: /add.*post|new.*post|create.*post/i })
      .or(page.getByRole('button', { name: /add new/i }).first());
    this.exportBtn = page.getByRole('button', { name: /export/i }).first();

    // Post form fields
    this.postTitleInput = page.getByLabel(/title/i)
      .or(page.getByPlaceholder(/title/i)).first();
    this.postContentInput = page.getByLabel(/content|message|body/i)
      .or(page.getByPlaceholder(/content|message|body/i)).first();
    this.postStatusSelect = page.getByRole('combobox', { name: /status/i }).first();
    this.savePostBtn = page.getByRole('button', { name: /save|create|submit/i }).last();
    this.cancelPostBtn = page.getByRole('button', { name: /cancel/i }).first();

    // Row actions
    this.editBtn = page.getByRole('button', { name: /edit/i }).first();
    this.deleteBtn = page.getByRole('button', { name: /delete/i }).first();
    this.confirmDeleteBtn = page.getByRole('button', { name: /confirm|yes|delete/i }).last();
    this.actionMenuBtn = page.locator('[data-testid*="action"], button[aria-haspopup="menu"]').first();

    // Customer management
    this.customersTab = page.getByRole('tab', { name: /customer/i })
      .or(page.getByRole('button', { name: /customer/i }).first());
    this.customerSection = page.getByText(/customer/i).first();
    this.addCustomerBtn = page.getByRole('button', { name: /add.*customer|new.*customer|invite.*customer/i });
    this.customerNameInput = page.getByLabel(/name/i).first()
      .or(page.getByPlaceholder(/name/i).first());
    this.customerEmailInput = page.getByLabel(/email/i).first()
      .or(page.getByPlaceholder(/email/i).first());
    this.saveCustomerBtn = page.getByRole('button', { name: /save|create|submit/i }).last();

    // Auto-reply settings
    this.autoReplyTab = page.getByRole('tab', { name: /auto.reply|settings/i })
      .or(page.getByText(/auto.reply/i).first());
    this.autoReplyToggle = page.locator('input[type="checkbox"]').first();
    this.defaultReplyInput = page.getByLabel(/default reply|reply message/i)
      .or(page.getByPlaceholder(/default reply|reply message/i)).first();
    this.saveSettingsBtn = page.getByRole('button', { name: /save settings|update/i });
  }

  async navigate() {
    await this.page.goto('/en/dashboard/post-management');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getPostCount() {
    return await this.tableRows.count();
  }

  async addNewPost(data = {}) {
    const isVisible = await this.addPostBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (!isVisible) return;
    await this.addPostBtn.click();
    await this.page.waitForTimeout(1000);
    if (data.title) {
      const titleVisible = await this.postTitleInput.isVisible({ timeout: 3000 }).catch(() => false);
      if (titleVisible) await this.postTitleInput.fill(data.title);
    }
    if (data.content) {
      const contentVisible = await this.postContentInput.isVisible({ timeout: 3000 }).catch(() => false);
      if (contentVisible) await this.postContentInput.fill(data.content);
    }
    await this.savePostBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async editFirstPost(data = {}) {
    const rowCount = await this.tableRows.count();
    if (rowCount === 0) return false;
    const editVisible = await this.editBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (!editVisible) {
      await this.firstTableRow.locator('button, [role="button"]').last().click();
      await this.page.waitForTimeout(500);
    } else {
      await this.editBtn.click();
    }
    await this.page.waitForTimeout(1000);
    if (data.title) {
      const titleVisible = await this.postTitleInput.isVisible({ timeout: 3000 }).catch(() => false);
      if (titleVisible) {
        await this.postTitleInput.clear();
        await this.postTitleInput.fill(data.title);
      }
    }
    await this.savePostBtn.click();
    await this.page.waitForTimeout(2000);
    return true;
  }

  async deleteFirstPost() {
    const rowCount = await this.tableRows.count();
    if (rowCount === 0) return false;
    const deleteVisible = await this.deleteBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (!deleteVisible) {
      await this.firstTableRow.locator('button, [role="button"]').last().click();
      await this.page.waitForTimeout(500);
    } else {
      await this.deleteBtn.click();
    }
    await this.page.waitForTimeout(500);
    const confirmVisible = await this.confirmDeleteBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (confirmVisible) await this.confirmDeleteBtn.click();
    await this.page.waitForTimeout(2000);
    return true;
  }

  async addNewCustomer(data = {}) {
    const btnVisible = await this.addCustomerBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (!btnVisible) return false;
    await this.addCustomerBtn.click();
    await this.page.waitForTimeout(1000);
    if (data.name) {
      const nameVisible = await this.customerNameInput.isVisible({ timeout: 3000 }).catch(() => false);
      if (nameVisible) await this.customerNameInput.fill(data.name);
    }
    if (data.email) {
      const emailVisible = await this.customerEmailInput.isVisible({ timeout: 3000 }).catch(() => false);
      if (emailVisible) await this.customerEmailInput.fill(data.email);
    }
    await this.saveCustomerBtn.click();
    await this.page.waitForTimeout(2000);
    return true;
  }
}
