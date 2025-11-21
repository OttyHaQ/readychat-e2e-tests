export class LandingPage {
  constructor(page) {
    this.page = page;
    this.getStarted = page.getByRole('link', { name: 'Get Started For Free' }).getByRole('button');
    this.login = page.locator('a[href*="/auth/login"]');
  }

  async clickGetStarted() {
    await this.getStarted.click();
  }

  async clickLogin() {
    await this.login.click();
  }
};
