import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick, expectTextContains } from '../../utils/helpers.js';
import credentials from '../test-credentials.json' assert { type: 'json' };
import { DashboardPage } from '../../pages/DashboardPage.js';



test.describe('User Signin', () => {
  test('Valid Sign in', async ({ page }) => {

    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);
    const dashboardPage = new DashboardPage(page);
    const aiBotPage = new AIBot(page);

    await page.goto('/');
    await landingPage.login.click();
    await safeClick(signInPage.denyBtn);
    await signInPage.fillSignInForm(credentials.username, credentials.password);
    await expectTextContains(aiBotPage.alert,'Authentication successful. You will be redirected shortly...');
    await expectTextContains(dashboardPage.title, 'Dashboard');
  })

  test('Invalid Sign in', async ({ page }) => {
    
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);
    const aiBotPage = new AIBot(page);

    await page.goto('/');
    await landingPage.login.click();
    await signInPage.fillSignInForm('username', 'password');
    await expectTextContains(aiBotPage.alert, 'Login failed. Please check your credentials and try again');
  });
});