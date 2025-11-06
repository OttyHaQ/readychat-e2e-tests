export class LandingPage {
  constructor(page) {
    this.page = page;
    this.getStarted = page.getByRole('button', { name: 'Get Started' });
    this.login = page.locator('a[href*="/auth/login"]');
  }

  async clickGetStarted() {
    await this.getStarted.click();
  }

  async clickLogin() {
    await this.login.click();
  }
};
