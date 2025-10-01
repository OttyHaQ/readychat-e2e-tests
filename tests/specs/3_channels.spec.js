import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { Channels } from '../../pages/Channels.js';
import { expectTextContains, safeClick } from '../../utils/helpers.js';
import credentials from '../test-credentials.json' assert { type: 'json' };


test.describe.serial('Channels Integration', () => {

    test.beforeEach(async ({ page }) => {
        
        const landingPage = new LandingPage(page);
        const signInPage = new SignInPage(page);

        await page.goto('/');
        await landingPage.login.click();
        await safeClick(signInPage.denyBtn);
        await signInPage.fillSignInForm(credentials.username, credentials.password);
    });

    test('Integrate FaceBook', async ({ page }) => {

        const channelsPage = new Channels(page);

        await channelsPage.channels.click();
        await expectTextContains(channelsPage.header, 'Channels Guide');
        await expectTextContains(channelsPage.learn_more, 'Learn More');
        await channelsPage.int_FaceBook_Btn.click();
        await expectTextContains(channelsPage.popup_header, 'Connect Your Facebook Page');
        const [newPage] = await Promise.all([
            page.waitForEvent('popup'),
            channelsPage.continue_Btn.click(),
        ]);
        await newPage.close(); 

    });


    test('Integrate WhatsApp', async ({ page }) => {

        const channelsPage = new Channels(page);

        await channelsPage.channels.click();
        await expectTextContains(channelsPage.header, 'Channels Guide');
        await expectTextContains(channelsPage.learn_more, 'Learn More');
        await channelsPage.int_WhatsApp_Btn.click();
        await expectTextContains(channelsPage.popup_header, 'Get Ready to Connect WhatsApp');
        const [popup] = await Promise.all([
            page.waitForEvent('popup'),
            channelsPage.continue_Btn.click(),
        ]);
        await popup.close(); 
    });


    test('Integrate Instagram', async ({ page }) => {

        const channelsPage = new Channels(page);

        await channelsPage.channels.click();
        await expectTextContains(channelsPage.header, 'Channels Guide');
        await expectTextContains(channelsPage.learn_more, 'Learn More');
        await channelsPage.int_Instagram_Btn.click();
        await expectTextContains(channelsPage.popup_header, 'Connect Your Instagram Account');
        const [popup] = await Promise.all([
            page.waitForEvent('popup'),
            channelsPage.continue_Btn.click(),
        ]);
        await popup.close(); 
    });

});