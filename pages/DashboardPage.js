export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByText('Dashboard', { exact: true }).first();
    this.profileBtn = page.locator('.relative.w-full > [aria-expanded="false"] > .ps-4');
    this.logOutBtn = page.getByText('Log out');
    this.signOutBtn = page.getByRole('button', { name: 'Sign out' });
  }

  async signOut() {
    // First, click the profile button to open dropdown
    const profileButton = this.page.getByRole('button', { 
        name: /Profile Picture/i 
    });
    await profileButton.waitFor({ state: 'visible', timeout: 10000 });
    await profileButton.click();
    
    // Wait for dropdown to appear
    await this.page.waitForTimeout(1000);
    
    // Now click logout option
    const logoutOption = this.page.getByRole('option', { name: 'Log out' });
    await logoutOption.waitFor({ state: 'visible', timeout: 5000 });
    await logoutOption.click();
    await this.signOutBtn.click();
  }
};
