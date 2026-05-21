export class WebsiteWidgetPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.websiteWidgetMenuItem = page.getByRole('link', { name: /website widget|widget/i })
      .or(page.getByRole('menuitem', { name: /website widget|widget/i }))
      .or(page.getByText(/website widget/i).first());

    // Page header
    this.pageHeader = page.getByRole('heading', { name: /website widget|widget/i }).first();

    // Widget settings
    this.widgetNameInput = page.getByLabel(/widget name|name/i).first()
      .or(page.getByPlaceholder(/widget name/i)).first();
    this.widgetColorInput = page.getByLabel(/color|primary color/i).first()
      .or(page.getByPlaceholder(/color/i)).first();
    this.widgetPositionSelect = page.getByLabel(/position/i).first()
      .or(page.getByRole('combobox', { name: /position/i })).first();
    this.greetingMessageInput = page.getByLabel(/greeting|welcome message/i).first()
      .or(page.getByPlaceholder(/greeting|welcome/i)).first();

    // Widget toggle
    this.widgetEnabledToggle = page.getByLabel(/enable widget|widget enabled/i)
      .or(page.locator('input[type="checkbox"]').first());

    // Embed code
    this.embedCodeSection = page.getByText(/embed code|install script|script tag/i).first();
    this.embedCodeBlock = page.locator('code, pre, textarea[readonly]').first();
    this.copyCodeBtn = page.getByRole('button', { name: /copy|copy code|copy script/i });

    // Save / update
    this.saveBtn = page.getByRole('button', { name: /save|update|apply/i }).last();

    // Preview
    this.previewSection = page.getByText(/preview/i).first();

    // Alerts
    this.successAlert = page.locator('[role="alert"]').filter({ hasText: /success|updated|saved/i });
  }

  async navigate() {
    await this.page.goto('/en/dashboard/ai-bot/configure/website-widget');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isOnWidgetPage() {
    return this.page.url().includes('website-widget');
  }

  async getEmbedCode() {
    const visible = await this.embedCodeBlock.isVisible({ timeout: 5000 }).catch(() => false);
    if (!visible) return null;
    return await this.embedCodeBlock.textContent();
  }

  async copyEmbedCode() {
    const visible = await this.copyCodeBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (!visible) return false;
    await this.copyCodeBtn.click();
    await this.page.waitForTimeout(500);
    return true;
  }

  async updateWidgetSettings(data = {}) {
    if (data.name) {
      const visible = await this.widgetNameInput.isVisible({ timeout: 3000 }).catch(() => false);
      if (visible) {
        await this.widgetNameInput.clear();
        await this.widgetNameInput.fill(data.name);
      }
    }
    if (data.greeting) {
      const visible = await this.greetingMessageInput.isVisible({ timeout: 3000 }).catch(() => false);
      if (visible) {
        await this.greetingMessageInput.clear();
        await this.greetingMessageInput.fill(data.greeting);
      }
    }
    const saveVisible = await this.saveBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (saveVisible) {
      await this.saveBtn.click();
      await this.page.waitForTimeout(2000);
      return true;
    }
    return false;
  }
}
