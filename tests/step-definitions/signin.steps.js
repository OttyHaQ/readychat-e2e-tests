import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { LandingPage } from '../../pages/LandingPage.js';
import { SignInPage } from '../../pages/SigninPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick } from '../../utils/helpers.js';

const { Given, When, Then } = createBdd();

Given('I am on the sign in page directly', async ({ page }) => {
    await page.goto('en/auth/login');
});

When('I navigate to the sign in page', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await landingPage.login.waitFor({ state: 'visible', timeout: 10000 });
    await safeClick(page);
    await landingPage.login.click();
    await expect(page).toHaveURL('/en/auth/login', { timeout: 10000 });
});

When('I sign in with valid credentials', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await safeClick(page);
    const username = process.env.USER_NAME || 'default_user';
    const password = process.env.PASSWORD || 'default_password';
    await signInPage.fillSignInForm(username, password);
});

When('I sign in with credentials {string} and {string}', async ({ page }, username, password) => {
    const signInPage = new SignInPage(page);
    await safeClick(page);
    await signInPage.fillSignInForm(username, password);
});

When('I submit the sign in form with username {string} and password {string}', async ({ page }, username, password) => {
    const signInPage = new SignInPage(page);
    await signInPage.fillSignInForm(username, password);
});

When('I click the forgot password link', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.navigateToForgotPassword();
});

When('I click the create account link', async ({ page }) => {
    const signInPage = new SignInPage(page);
    await signInPage.navigateToSignup();
});

Then('I should see a successful authentication message', async ({ page }) => {
    const successAlert = page.locator('[role="alert"]').filter({ hasText: /successful/i });
    await successAlert.first().waitFor({ state: 'visible', timeout: 10000 });
});

Then('I should see a login error message', async ({ page }) => {
    const errorAlert = page.getByText(/login failed|invalid credentials|check your credentials/i);
    await expect(errorAlert).toBeVisible({ timeout: 10000 });
});

Then('I should remain on the sign in page', async ({ page }) => {
    await expect(page).toHaveURL(/auth\/login/, { timeout: 5000 });
    const signInPage = new SignInPage(page);
    await expect(signInPage.signInBtn).toBeVisible();
});

Then('I should be on the forgot password page', async ({ page }) => {
    await expect(page).toHaveURL(/forgot-password/, { timeout: 10000 });
});

Then('I should be on the signup page', async ({ page }) => {
    await expect(page).toHaveURL('en/auth/signup', { timeout: 10000 });
});

Then('I should see a username required error', async ({ page }) => {
    await expect(page.getByText(/username is required/i)).toBeVisible({ timeout: 5000 });
});

Then('I should see a password required error', async ({ page }) => {
    await expect(page.getByText(/password is required/i)).toBeVisible({ timeout: 5000 });
});
