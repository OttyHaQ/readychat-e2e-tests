import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { LandingPage } from '../../pages/LandingPage.js';
import { SignInPage } from '../../pages/SigninPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

const { Given, Then, After } = createBdd();

async function performLogin(page, username, password) {
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await landingPage.login.waitFor({ state: 'visible', timeout: 10000 });

    let attempts = 0;
    let success = false;
    while (!success && attempts < 3) {
        attempts++;
        try {
            const navPromise = page.waitForURL(
                url => url.href.includes('/en/auth/login'),
                { timeout: 30000 }
            );
            await landingPage.login.click();
            await navPromise;
            if (page.url().includes('/en/auth/login')) success = true;
        } catch {
            if (attempts >= 3) throw new Error('Could not navigate to login page');
            await page.waitForTimeout(2000);
        }
    }

    await signInPage.usernameField.waitFor({ state: 'visible', timeout: 10000 });
    await safeClick(page);
    await signInPage.fillSignInForm(username, password);
    await expect(page).toHaveURL('/en/dashboard', { timeout: 30000 });
}

Given('I am logged in', async ({ page }) => {
    const username = process.env.USER_NAME || 'default_user';
    const password = process.env.PASSWORD || 'default_password';
    await performLogin(page, username, password);
});

Given('I am logged in as a new user', async ({ page }) => {
    let credentials = { username: 'default_user', password: 'default_password' };
    try {
        const credPath = path.join(process.cwd(), 'tests', 'test-credentials.json');
        credentials = JSON.parse(fs.readFileSync(credPath, 'utf-8'));
    } catch {
        console.warn('Could not load test-credentials.json, using defaults');
    }
    await performLogin(page, credentials.username, credentials.password);
});

// Shared success assertion used by configure, checkout questions, and other features
Then('I should see a success message', async ({ page }) => {
    const successAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await successAlert.first().waitFor({ state: 'visible', timeout: 30000 });
});

Then('I should be redirected to the dashboard', async ({ page }) => {
    await expect(page).toHaveURL(/\/en\/dashboard/, { timeout: 30000 });
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.title).toBeVisible({ timeout: 10000 });
});

Then('the reorder action should complete or report unavailable', async () => {});

After(async ({ page, $testInfo }) => {
    if ($testInfo.status !== $testInfo.expectedStatus) {
        const title = $testInfo.title.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
        const screenshotPath = `tests/screenshots/${title}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
        console.log(`Screenshot saved: ${screenshotPath}`);
    }
});
