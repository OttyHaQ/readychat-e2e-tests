import { test, expect } from '@playwright/test';
import { fullUrl, expectTextContains } from '../../utils/helpers.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { SignUpPage } from '../../pages/SignupPage.js';
import { SignInPage } from '../../pages/SigninPage.js';
import { OnboardingPage } from '../../pages/OnboardingPage.js';
import { DashboardPage } from '../../pages/DashboardPage.js';
import fs from "fs";

test.describe('User Signup Flow', () => {
  test('Signup and onboarding', async ({ page }) => {
    const landingPage = new LandingPage(page);
    const signupPage = new SignUpPage(page);
    const signinPage = new SignInPage(page);
    const onboardingPage = new OnboardingPage(page);
    const dashboardPage = new DashboardPage(page);

    const username = signupPage.getUsername();
    const email = `${username}@mailinator.com`;
    const password = "P@ssword01";
   

    await page.goto('/');
    // SignUp
    await landingPage.clickGetStarted();
    await signupPage.fillSignUpForm(username, password, email);
    await page.waitForURL(fullUrl('en/auth/email-sent'));
    await page.waitForURL(fullUrl('en/auth/login'));
    
    fs.writeFileSync(
      "tests/test-credentials.json",
      JSON.stringify({ username, email, password }, null, 2)
    );


    //Verify email
    await page.goto('https://www.mailinator.com/')
    await signupPage.verifyEmail(username);
    // await page.waitForTimeout(15000);

    //SignIn
    
    await page.goto(fullUrl('en/auth/login'));
    await signinPage.fillSignInForm(username, password);
    
    // Onboarding Survey
    await page.waitForTimeout(5000);
    await expect(page).toHaveURL(fullUrl('en/onboarding'));
    await expectTextContains(onboardingPage.configAccount, 'Configure your account', { timeout: 15000 });
    await onboardingPage.completePersonalDetails(username);
    await onboardingPage.completeBusinessInfo(username, email);
    await expectTextContains(onboardingPage.text, 'Set up your business tone');
    await onboardingPage.completeBotSettings();
    await expectTextContains(onboardingPage.text, 'Configure your business hours');
    await onboardingPage.completeBusinessSchedule();

    // Final validation and logout
    await expect(dashboardPage.title).toHaveText('Dashboard', {timeout: 20000});
    await dashboardPage.signOut();
    
  });
})