import { expect } from '@playwright/test';

export class SignInPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('h4[class="text-2xl text-center sm:text-3xl font-bold mb-1"]')
    this.usernameField = page.locator('#username');
    this.username = 'Otty_Testhub_11'
    this.passwordField = page.locator('#password');
    this.password = 'Nsisong03@@';
    this.checkbox = page.locator('div[class="w-6 h-6 border-2 rounded-md transition-[colors,box-shadow] duration-200 border-black bg-white hover:border-purple-600 peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-grey-100"]');
    this.signInBtn = page.locator('xpath=//button[normalize-space()="Sign in"]');
    this.forgotPassword = page.locator('a[href="/en/auth/forgot-password"]');
    this.facebookBtn = page.locator('xpath=//button[normalize-space()="Continue with Facebook"]');
    this.googleBtn = page.locator('xpath=//button[normalize-space()="Continue with Google"]');
    this.createAccountBtn = page.locator('a[class="font-bold text-primary underline hover:text-secondary"]');
    this.alert = page.locator('xpath=//div[contains(text(),"Login failed. Please try again later.")]');
    this.denyBtn = page.locator('#CybotCookiebotDialogBodyButtonDecline');
  }

  async fillSignInForm(username, password) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.signInBtn.click();
  }
};