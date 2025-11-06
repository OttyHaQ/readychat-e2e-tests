export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: 'Dashboard', level: 2 });
    this.profileBtn = page.locator('.relative.w-full > [aria-expanded="false"] > .ps-4');
    this.logOutBtn = page.locator('.overflow-hidden > :nth-child(3) > :nth-child(2)');
    this.signOutBtn = page.locator('xpath=//button[normalize-space()="Sign Out"]');
  }

  async signOut() {
    await this.profileBtn.waitFor({ state: 'visible'});
    await this.profileBtn.click();
    await this.logOutBtn.click();
    await this.signOutBtn.waitFor({ state: 'visible'})
    await this.signOutBtn.click();
  }
};
