export class OnboardingPage {
        constructor(page) {
        this.page = page;

        // Personal Details
        this.configAccount = page.locator('.text-3xl.font-bold.text-gray-800.mb-4');
        this.getStartedBtn = page.locator('xpath=//button[normalize-space()="Get Started"]');
        this.firstNameField = page.locator('#first_name');
        this.lastNameField = page.locator('#last_name');
        this.timeZoneField = page.locator('div[class="relative w-full"] span[class="flex-1 "]');
        this.timeZoneOption = page.locator('div[class="overflow-hidden"] div:nth-child(1) span:nth-child(1)');
        this.nextBtn = page.locator('xpath=//button[normalize-space()="Next"]');

        // Business info
        this.text = page.locator('.text-3xl.font-bold.text-gray-800.mb-4');
        this.logOutBtn = page.locator('.gap-4 > .bg-secondary');
        this.businessNameField = page.locator('#business_name');
        this.businessEmailField = page.locator('#business_email');
        this.aboutBusinessField = page.locator('#general_info');
        this.addressField = page.locator('#address1');
        this.address ='20 Church Street';
        this.townField = page.locator('#city');
        this.town = 'Ikoyi';
        this.stateField = page.locator('#state');
        this.state = 'Lagos';
        this.postalCodeField = page.locator('#zipcode');
        this.postalCode = '12345';
        this.countryFlagField = page.locator('.react-international-phone-flag-emoji.react-international-phone-country-selector-button__flag-emoji');
        this.countryFlag = page.locator('');
        this.countryField = page.locator('div:nth-child(1) form:nth-child(1) div:nth-child(1) div:nth-child(3) div:nth-child(3) div:nth-child(2) div:nth-child(2) button:nth-child(1) div:nth-child(1) span:nth-child(1)');
        this.searchField = page.locator('input[placeholder="Search..."]');
        this.searchText = 'Nigeria';
        this.option = page.locator('div[role="option"] span');
        this.contactNumberField = page.locator('.react-international-phone-input');
        this.contactNumber = '07030000000';
        this.currencyField = page.locator('xpath=//span[normalize-space()="$ USD"]');
        this.currencySearch = page.locator('xpath=//input[@placeholder="Search..."]')
        this.currency = 'usd'

        // Bot Settings
        this.introField = page.locator('textarea[id="responses.0.response"]');
        this.intro = 'Hello there, welcome to my page';
        this.addFile = page.locator('button:has(.remixicon.text-secondary.mr-2)');
        this.toneField = page.locator('textarea[id="responses.1.response"]');
        this.tone = 'friendly';
        this.generalToggle1 = page.locator(':nth-child(3) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle2 = page.locator(':nth-child(4) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle3 = page.locator(':nth-child(5) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle4 = page.locator(':nth-child(6) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle5 = page.locator(':nth-child(7) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle6 = page.locator(':nth-child(8) > .gap-2 > .flex > .relative > .w-12');
        this.generalToggle7 = page.locator(':nth-child(9) > .gap-2 > .flex > .relative > .w-12');
        this.aiModelBtn1 = page.locator('.space-x-4 > :nth-child(1) > .relative > .absolute');
        this.aiModelBtn2 = page.locator('.space-x-4 > :nth-child(2) > .relative > .absolute');

        // Business Schedule
        this.timeZoneField2 = page.locator('.relative.w-full > .ps-4 > .gap-2 > .flex-1');
        this.timeZoneText = 'West';
        this.monday = page.locator('xpath=//p[normalize-space()="Monday"]');
        this.tuesday = page.locator('xpath=//p[normalize-space()="Tuesday"]');
        this.wednesday = page.locator('xpath=//p[normalize-space()="Wednesday"]');
        this.thursday = page.locator('xpath=//p[normalize-space()="Thursday"]');
        this.friday = page.locator('xpath=//p[normalize-space()="Friday"]');
        this.saturday = page.locator('xpath=//p[normalize-space()="Saturday"]');
        this.sunday = page.locator('xpath=//p[normalize-space()="Sunday"]');
        this.submitBtn = page.locator('xpath=//button[normalize-space()="Submit"]');
    
    }

  async completePersonalDetails(name) {
        await this.getStartedBtn.click();
        await this.firstNameField.fill(name);
        await this.lastNameField.fill(name);
        await this.timeZoneField.click();
        await this.timeZoneOption.click();
        await this.nextBtn.click();
    }

 
   async completeBusinessInfo(name, email) {
        await this.getStartedBtn.click();
        await this.businessNameField.fill(name);
        await this.businessEmailField.fill(email);
        await this.addressField.fill(this.address);
        await this.townField.fill(this.town);
        await this.stateField.fill(this.state);
        await this.postalCodeField.fill(this.postalCode);
        await this.countryField.click();
        await this.searchField.fill(this.searchText);
        await this.option.click();
        await this.contactNumberField.fill(this.contactNumber);
        await this.contactNumberField.dispatchEvent('input');
        await this.currencyField.waitFor({ state: 'visible'});
        await this.currencyField.click();
        await this.page.waitForTimeout(3000);
        await this.currencySearch.waitFor({ state: 'visible'});
        await this.currencySearch.scrollIntoViewIfNeeded();
        await this.currencySearch.fill(this.currency);
        await this.option.click();
        await this.nextBtn.click();
        
    }

    async completeBotSettings() {
        await this.getStartedBtn.click();
        await this.page.waitForSelector('textarea[id="responses.0.response"]', { state: 'visible' });
        await this.introField.fill(this.intro);
        // await this.addFile.click();
        // await this.addFile.setInputFiles('tests/fixtures/1mb.pdf');
        await this.toneField.fill(this.tone);
        await this.generalToggle1.click();
        await this.generalToggle2.click();
        await this.generalToggle3.click();
        await this.generalToggle4.click();
        await this.generalToggle5.click();
        await this.generalToggle6.click();
        await this.generalToggle7.click();
        await this.aiModelBtn1.click();
        await this.aiModelBtn2.click();
        await this.nextBtn.waitFor({ state: 'visible'});
        await this.nextBtn.click();
        
    }

    async completeBusinessSchedule() {
        await this.getStartedBtn.waitFor({ state: 'visible'});
        await this.getStartedBtn.click();
        await this.timeZoneField2.waitFor({ state: 'visible'});
        await this.timeZoneField2.click();
        await this.searchField.fill(this.timeZoneText);
        await this.option.first().click();
        await this.monday.click();
        await this.tuesday.click();
        await this.wednesday.click();
        await this.thursday.click();
        await this.friday.click();
        await this.saturday.click();
        await this.sunday.click();
        await this.submitBtn.click();
    }   
};
