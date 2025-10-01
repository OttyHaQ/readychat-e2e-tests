export class LandingPage {
  constructor(page) {
    this.page = page;
    this.getStarted = page.locator('a[class="border border-white px-4 py-2 rounded-xl font-semibold hover:border-purple-200 hover:text-purple-200 transition duration-300"]');
    this.login = page.locator('a[class="hover:text-purple-200 ml-2 mr-4"]');
  }

  async clickGetStarted() {
    await this.getStarted.click();
  }

  async clickLogin() {
    await this.login.click();
  }
};
