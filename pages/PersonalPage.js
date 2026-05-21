import fs from 'fs';
import path from 'path';

export class PersonalPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.settingsMenuItem = page.getByRole('link', { name: /settings|profile|personal/i })
      .or(page.getByRole('menuitem', { name: /settings|profile/i })).first();
    this.personalTab = page.getByRole('tab', { name: /personal|profile/i });

    // Personal details
    this.firstNameInput = page.getByLabel(/first name/i)
      .or(page.getByPlaceholder(/first name/i)).first();
    this.lastNameInput = page.getByLabel(/last name/i)
      .or(page.getByPlaceholder(/last name/i)).first();
    this.emailInput = page.getByLabel(/email/i).first()
      .or(page.getByPlaceholder(/email/i).first());
    this.phoneInput = page.getByLabel(/phone/i)
      .or(page.getByPlaceholder(/phone/i)).first();
    this.updatePersonalBtn = page.getByRole('button', { name: /update|save|submit/i }).first();

    // Password change
    this.currentPasswordInput = page.getByLabel(/current password/i)
      .or(page.getByPlaceholder(/current password/i)).first();
    this.newPasswordInput = page.getByLabel(/new password/i)
      .or(page.getByPlaceholder(/new password/i)).first();
    this.confirmPasswordInput = page.getByLabel(/confirm.*password/i)
      .or(page.getByPlaceholder(/confirm.*password/i)).first();
    this.changePasswordBtn = page.getByRole('button', { name: /change password|update password/i });

    // Logo / branding upload
    this.logoUploadInput = page.locator('input[type="file"]').first();
    this.logoPreview = page.locator('img[alt*="logo"], img[alt*="profile"], img[class*="logo"]').first();
    this.uploadLogoBtn = page.getByRole('button', { name: /upload.*logo|change.*logo|update.*logo/i });

    // Notification preferences
    this.notificationsSection = page.getByText(/notification preferences|notification settings/i).first();
    this.emailNotifToggle = page.getByLabel(/email notifications?/i)
      .or(page.locator('input[type="checkbox"]').nth(0));
    this.smsNotifToggle = page.getByLabel(/sms notifications?/i)
      .or(page.locator('input[type="checkbox"]').nth(1));
    this.pushNotifToggle = page.getByLabel(/push notifications?/i)
      .or(page.locator('input[type="checkbox"]').nth(2));
    this.saveNotifBtn = page.getByRole('button', { name: /save|update/i }).last();

    // Security settings
    this.securitySection = page.getByText(/security/i).first();
    this.twoFactorToggle = page.getByLabel(/two.factor|2fa/i);
    this.securityTab = page.getByRole('tab', { name: /security/i });

    // Billing / subscription
    this.billingSection = page.getByText(/billing|subscription|plan/i).first();
    this.billingTab = page.getByRole('tab', { name: /billing|subscription/i });
    this.currentPlanText = page.getByText(/current plan|subscription plan/i).first();
    this.upgradePlanBtn = page.getByRole('button', { name: /upgrade|manage.*plan|change.*plan/i });

    // Alerts
    this.successAlert = page.locator('[role="alert"]').filter({ hasText: /success|updated|saved/i });
    this.errorAlert = page.locator('[role="alert"]').filter({ hasText: /error|failed/i });
  }

  async navigate() {
    await this.page.goto('/en/dashboard/settings/personal');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async updatePersonalDetails(data = {}) {
    if (data.firstName) {
      const visible = await this.firstNameInput.isVisible({ timeout: 3000 }).catch(() => false);
      if (visible) {
        await this.firstNameInput.clear();
        await this.firstNameInput.fill(data.firstName);
      }
    }
    if (data.lastName) {
      const visible = await this.lastNameInput.isVisible({ timeout: 3000 }).catch(() => false);
      if (visible) {
        await this.lastNameInput.clear();
        await this.lastNameInput.fill(data.lastName);
      }
    }
    const btnVisible = await this.updatePersonalBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (btnVisible) {
      await this.updatePersonalBtn.click();
      await this.page.waitForTimeout(2000);
    }
  }

  async changePassword(currentPassword, newPassword) {
    const currentVisible = await this.currentPasswordInput.isVisible({ timeout: 5000 }).catch(() => false);
    if (!currentVisible) return false;
    await this.currentPasswordInput.fill(currentPassword);
    await this.newPasswordInput.fill(newPassword);
    const confirmVisible = await this.confirmPasswordInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (confirmVisible) await this.confirmPasswordInput.fill(newPassword);
    const btnVisible = await this.changePasswordBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (btnVisible) {
      await this.changePasswordBtn.click();
      await this.page.waitForTimeout(2000);
      // Persist new password so test account stays accessible
      const credPath = path.join(process.cwd(), 'tests', 'test-password.json');
      fs.writeFileSync(credPath, JSON.stringify({ password: newPassword, changedAt: new Date().toISOString() }));
      return true;
    }
    return false;
  }

  async uploadLogo(filePath) {
    const inputVisible = await this.logoUploadInput.isVisible({ timeout: 5000 }).catch(() => false);
    if (!inputVisible) {
      const btnVisible = await this.uploadLogoBtn.isVisible({ timeout: 3000 }).catch(() => false);
      if (!btnVisible) return false;
      await this.uploadLogoBtn.click();
      await this.page.waitForTimeout(500);
    }
    await this.logoUploadInput.setInputFiles(filePath);
    await this.page.waitForTimeout(2000);
    return true;
  }
}
