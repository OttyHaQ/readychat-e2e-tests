export class Channels {
  constructor(page) {
    this.page = page;
    this.menu = page.locator('button[class="xl:hidden rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"] svg');
    this.channels = page.locator('xpath=//div[contains(text(),"Channels")]');
    this.header = page.locator('//h1[normalize-space()="Channels Guide"]');
    this.learn_more = page.locator('xpath=//button[normalize-space()="Learn More"]');
    this.int_FaceBook_Btn = page.locator('xpath=//button[normalize-space()="Integrate Facebook"]');
    this.int_WhatsApp_Btn = page.locator('xpath=//button[normalize-space()="Integrate WhatsApp"]');
    this.int_Instagram_Btn = page.locator('xpath=//button[normalize-space()="Integrate Instagram"]');
    this.add_account_Btn = page.locator('xpath=//button[normalize-space()="Add Another Account"]');
    this.test_hub = page.locator('xpath=//h6[normalize-space()="Test Hub"]');
    this.show_more = page.locator('.cursor-pointer.text-2xl.mt-1');
    this.logout_Btn = page.locator('xpath=//button[normalize-space()="Logout"]');
    this.popup_header = page.locator('xpath=//div[contains(@class,"text-center text-lg sm:text-xl font-bold mt-2")]');
    this.toggle = page.locator('xpath=//div[contains(@class,"peer-focus:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-brand-gray-100")]')
    this.continue_Btn = page.locator('xpath=//button[normalize-space()="Continue"]');
    this.fb_email_field = '#email';
    this.fb_email = 'otila4eva@yahoo.com';
    this.fb_password_field = '#pass';
    this.fb_pass = 'Nsisong03@@'
    this.fb_login_btn = 'xpath=//button[@type="submit"]';
    this.fb_radio_Btn = 'xpath=input[value="false"]';
    this.fb_continue_Btn = 'xpath=//div[contains(text(),"Continue")]';
    this.fb_save_Btn = 'xpath=//div[contains(text(),"Save")]';
    this.fb_got_it_Btn = '.x8t9es0.x1fvot60.xxio538.x1heor9g.xuxw1ft.x6ikm8r.x10wlt62.xlyipyv.x1h4wwuj.x1pd3egz.xeuugli';


  }
}