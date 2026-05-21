export class UserManagementPage {
  constructor(page) {
    this.page = page;

    // Navigation
    this.userManagementMenuItem = page.getByRole('link', { name: /user management|team|users/i })
      .or(page.getByRole('menuitem', { name: /user management|team|users/i }))
      .or(page.getByText(/user management/i).first());

    // Page header
    this.pageHeader = page.getByRole('heading', { name: /user|team/i }).first();

    // User table
    this.tableRows = page.locator('tbody tr');
    this.firstTableRow = page.locator('tbody tr').first();

    // Invite / Add user
    this.addUserBtn = page.getByRole('button', { name: /add.*user|invite.*user|new.*user|add member/i })
      .or(page.getByRole('button', { name: /invite/i }));
    this.emailInput = page.getByLabel(/email/i).first()
      .or(page.getByPlaceholder(/email/i).first());
    this.roleSelect = page.getByRole('combobox', { name: /role/i })
      .or(page.getByLabel(/role/i)).first();
    this.sendInviteBtn = page.getByRole('button', { name: /send invite|invite|add/i }).last();
    this.cancelBtn = page.getByRole('button', { name: /cancel/i }).first();

    // Roles / Permissions
    this.rolesTab = page.getByRole('tab', { name: /roles?|permissions?/i })
      .or(page.getByText(/roles?/i).first());
    this.permissionsSection = page.getByText(/permissions/i).first();
    this.roleOptions = page.getByRole('option');

    // Working hours / availability
    this.workingHoursSection = page.getByText(/working hours|availability|schedule/i).first();
    this.workingHoursTab = page.getByRole('tab', { name: /working hours|availability/i });

    // User actions
    this.editUserBtn = page.getByRole('button', { name: /edit/i }).first();
    this.deleteUserBtn = page.getByRole('button', { name: /delete|remove/i }).first();
    this.confirmDeleteBtn = page.getByRole('button', { name: /confirm|yes|delete|remove/i }).last();
    this.actionMenuBtn = page.locator('[aria-haspopup="menu"], [data-testid*="action"]').first();

    // Column headers
    this.nameColumn = page.getByRole('columnheader', { name: /name/i });
    this.emailColumn = page.getByRole('columnheader', { name: /email/i });
    this.roleColumn = page.getByRole('columnheader', { name: /role/i });
    this.statusColumn = page.getByRole('columnheader', { name: /status/i });

    // Success / error messages
    this.successAlert = page.locator('[role="alert"]').filter({ hasText: /success|invited|added|updated/i });
    this.errorAlert = page.locator('[role="alert"]').filter({ hasText: /error|failed/i });
  }

  async navigate() {
    await this.page.goto('/en/dashboard/settings/user-management');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getUserCount() {
    return await this.tableRows.count();
  }

  async inviteUser(email, role) {
    const btnVisible = await this.addUserBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (!btnVisible) return false;
    await this.addUserBtn.click();
    await this.page.waitForTimeout(1000);
    const emailVisible = await this.emailInput.isVisible({ timeout: 3000 }).catch(() => false);
    if (emailVisible) await this.emailInput.fill(email);
    if (role) {
      const roleVisible = await this.roleSelect.isVisible({ timeout: 3000 }).catch(() => false);
      if (roleVisible) {
        await this.roleSelect.click();
        const option = this.page.getByRole('option', { name: new RegExp(role, 'i') });
        const optionVisible = await option.isVisible({ timeout: 3000 }).catch(() => false);
        if (optionVisible) await option.click();
      }
    }
    // Try the broad pattern first, then fall back to any submit-style button in the modal
    const sendVisible = await this.sendInviteBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (sendVisible) {
      await this.sendInviteBtn.click();
    } else {
      const fallback = this.page.locator('[role="dialog"] button, [role="alertdialog"] button')
        .filter({ hasText: /save|submit|send|create|confirm|ok/i }).last();
      const fallbackVisible = await fallback.isVisible({ timeout: 3000 }).catch(() => false);
      if (fallbackVisible) {
        await fallback.click();
      } else {
        console.log('Invite submit button not found — modal may use a different label');
        return false;
      }
    }
    await this.page.waitForTimeout(2000);
    return true;
  }

  async assignRole(rowIndex, role) {
    const row = this.tableRows.nth(rowIndex);
    const rowVisible = await row.isVisible({ timeout: 5000 }).catch(() => false);
    if (!rowVisible) return false;
    const editBtn = row.getByRole('button', { name: /edit/i });
    const editVisible = await editBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (!editVisible) return false;
    await editBtn.click();
    await this.page.waitForTimeout(1000);
    const roleVisible = await this.roleSelect.isVisible({ timeout: 3000 }).catch(() => false);
    if (roleVisible) {
      await this.roleSelect.click();
      const option = this.page.getByRole('option', { name: new RegExp(role, 'i') });
      const optionVisible = await option.isVisible({ timeout: 3000 }).catch(() => false);
      if (optionVisible) await option.click();
    }
    await this.sendInviteBtn.click();
    await this.page.waitForTimeout(2000);
    return true;
  }

  async deleteFirstUser() {
    const rowCount = await this.tableRows.count();
    if (rowCount === 0) return false;
    const deleteVisible = await this.deleteUserBtn.isVisible({ timeout: 5000 }).catch(() => false);
    if (!deleteVisible) {
      await this.firstTableRow.locator('button, [role="button"]').last().click();
      await this.page.waitForTimeout(500);
    } else {
      await this.deleteUserBtn.click();
    }
    await this.page.waitForTimeout(500);
    const confirmVisible = await this.confirmDeleteBtn.isVisible({ timeout: 3000 }).catch(() => false);
    if (confirmVisible) await this.confirmDeleteBtn.click();
    await this.page.waitForTimeout(2000);
    return true;
  }
}
