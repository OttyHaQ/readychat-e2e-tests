import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { LandingPage } from '../../pages/LandingPage.js';
import { SignUpPage } from '../../pages/SignupPage.js';
import { OnboardingPage } from '../../pages/OnboardingPage.js';
import { safeClick, expectTextContains, fullUrl } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

const { Given, When, Then, And } = createBdd();

let testCredentials = {};

Given('I am on the landing page', async ({ page }) => {
    await page.goto('/');
    const landingPage = new LandingPage(page);
    await landingPage.getStarted.waitFor({ state: 'visible', timeout: 10000 });
});

When('I navigate to the signup page', async ({ page }) => {
    const landingPage = new LandingPage(page);
    await safeClick(page);
    await landingPage.clickGetStarted();
    await page.waitForURL('**/en/auth/signup', { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
});

When('I fill and submit the signup form with generated credentials', async ({ page }) => {
    const signupPage = new SignUpPage(page);
    const username = signupPage.generateUsername();
    const email = signupPage.generateEmail(username);
    const password = 'P@ssword01';
    // Save email as username since the signup form is now email-based
    testCredentials = { username: email, email, password };

    await signupPage.fillSignUpForm(email, password);
    await page.waitForTimeout(5000);
    await expect(page).toHaveURL(fullUrl('en/onboarding'), { timeout: 30000 });
});

When('I save test credentials to file', async () => {
    const credentialsPath = path.join(process.cwd(), 'tests', 'test-credentials.json');
    const credentialsDir = path.dirname(credentialsPath);
    if (!fs.existsSync(credentialsDir)) fs.mkdirSync(credentialsDir, { recursive: true });
    fs.writeFileSync(credentialsPath, JSON.stringify(testCredentials, null, 2));
});

When('I complete the personal details step', async ({ page }) => {
    const onboardingPage = new OnboardingPage(page);
    await expect(onboardingPage.configAccountHeading).toContainText(/configure your account/i, { timeout: 10000 });
    await onboardingPage.completePersonalDetails(testCredentials.username);
});

When('I complete the business information step', async ({ page }) => {
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.waitForStepHeading('business information');
    await onboardingPage.completeBusinessInfo(testCredentials.username, testCredentials.email);
});

When('I complete the bot settings step', async ({ page }) => {
    const onboardingPage = new OnboardingPage(page);
    await expectTextContains(onboardingPage.pageHeading, 'Set up your business tone', { timeout: 10000 });
    await onboardingPage.completeBotSettings();
});

When('I complete the business schedule step', async ({ page }) => {
    const onboardingPage = new OnboardingPage(page);
    await expectTextContains(onboardingPage.pageHeading, 'Configure your business hours', { timeout: 10000 });
    await onboardingPage.completeBusinessSchedule();
});

When('I click the Go Now button', async ({ page }) => {
    const onboardingPage = new OnboardingPage(page);
    await onboardingPage.goNowBtn.waitFor({ state: 'visible', timeout: 30000 });
    await onboardingPage.goNowBtn.click();
});

