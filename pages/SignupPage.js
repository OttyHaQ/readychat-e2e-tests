import { safeClick } from "../utils/helpers";

export class SignUpPage {
  constructor(page) {
    this.page = page;
    this.usernameField = page.locator('#username');
    this.passwordField = page.locator('#password');
    this.password = 'Nsisong03@@';
    this.confirmPasswordField = page.locator('#confirmPassword');
    this.emailField = page.locator('#email');
    this.privacyPolicy = page.locator('.text-sm.font-semibold');
    this.getStartedBtn = page.locator('.bg-brand-secondary.text-white');
    this.facebookBtn = page.locator('.text-nowrap');
    this.googleBtn = page.locator('div.mt-6 > .grid > .w-full');
    this.signIn = page.locator('a[class="font-bold text-primary underline hover:text-secondary"]')
    this.public_inbox = page.locator('.inbox-link');
    this.search = page.locator('#inbox_field');
    this.go = page.locator('.primary-btn');
    this.verification_email = page.locator('xpath=//td[normalize-space()="support@readychatai.com"]');
    this.frame = page.frameLocator('#html_msg_body');
    this.confirmBtn = this.frame.locator('xpath=//a[normalize-space()="Confirm Email"]');
    this.verification_link = page.locator('a:has-text("Confirm Email")');
    this.denyBtn = page.locator('#CybotCookiebotDialogBodyButtonDecline');

  }

  getUsername(){
    const randomString = Math.random().toString(36).substring(2, 7);
    return `Test_User_${randomString}`;
  }

  async fillSignUpForm(username, password, email) {
    await safeClick(this.denyBtn);
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.confirmPasswordField.fill(password);
    await this.emailField.fill(email);
    await this.privacyPolicy.click();
    await this.getStartedBtn.click();
  }

  async verifyEmail(username) {
    await this.public_inbox.click();
    await this.search.fill(username);
    await this.go.click();
    await this.verification_email.last().click();
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.confirmBtn.click()
    ]);
    // await this.confirmBtn.click()
    await this.page.waitForTimeout(5000);
    await popup.close(); 
  }
};
