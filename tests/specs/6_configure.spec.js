import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage';
import { LandingPage } from '../../pages/LandingPage';
import { AIBot } from '../../pages/AIBot';
import { safeClick, expectTextContains } from '../../utils/helpers.js';



test.describe.serial('Configure', () => {

    test.beforeEach(async ({ page }) => {
        
        const landingPage = new LandingPage(page);
        const signInPage = new SignInPage(page);
        
        // Sign In
        await page.goto('/');
        await landingPage.login.click();
        await safeClick(signInPage.denyBtn);
        await signInPage.fillSignInForm(process.env.USER_NAME, process.env.PASSWORD);
    });


    test('General', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.configure.click();

        await aiBotPage.professionalInfoField.clear();
        await aiBotPage.professionalInfoField.fill('Welcome to Testhub! How can we help you today?');
        // await page.setInputFiles(aiBotPage.uploadFileBtn, 'tests/fixtures/curtains.csv');
        await aiBotPage.aiTone.clear();
        await aiBotPage.aiTone.fill('Customer-friendly and professional');
        await aiBotPage.generalToggle1.dblclick();
        await aiBotPage.generalToggle2.dblclick();
        await aiBotPage.generalToggle3.dblclick();
        await aiBotPage.generalToggle4.dblclick();
        await aiBotPage.generalToggle5.dblclick();
        await aiBotPage.generalToggle6.dblclick();
        await aiBotPage.generalToggle7.dblclick();
        await aiBotPage.aiModelBtn1.click();
        await aiBotPage.aiModelBtn2.click();
        await aiBotPage.saveBtn.click();
        await expectTextContains(aiBotPage.alert, 'successfully')

    });


    test('Turn on/Turn off Auto-reply', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.configure.click();

        await aiBotPage.noBtn.click();
        await expectTextContains(aiBotPage.alert, 'successfully');

        await aiBotPage.yesBtn.click();
        await expectTextContains(aiBotPage.alert, 'successfully');

    });


    test('Add Facebook Rule', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.configure.click();

        await page.waitForTimeout(5000);
        const count = await aiBotPage.facebookRules.count();
        if (count > 0 ) {
            const text = await aiBotPage.facebookRules.textContent();
            if (text?.includes('Facebook Rules')) {
                await aiBotPage.fbDeleteBtn.click();
                await expect(aiBotPage.alert).toContainText('successfully');
            }
        }
        else {
            console.log('Facebook Rules not set')
        }
        
        await aiBotPage.createRuleBtnMain.click();
        await aiBotPage.platformDropdown.click();
        await aiBotPage.selectFB.click();
        await aiBotPage.accountDropdown.click();
        await aiBotPage.selectFBAccount.click();
        await aiBotPage.continueBtn.click();
        // // await expect(aiBotPage.modal).toBeVisible();
        
        // await expect(aiBotPage.commentsToggle).toBeVisible();
        // await aiBotPage.commentsToggle.check()
       
        // await expect(aiBotPage.dmToggle).toBeVisible();
        //  await aiBotPage.dmToggle.check();

        await aiBotPage.nextBtn.click();
        await aiBotPage.defaultReplyField.fill('Please hold, while we process');
        await aiBotPage.keywordField.fill('Order');
        await aiBotPage.addBtn.click();
        await aiBotPage.nextBtn.click();
        await expect(aiBotPage.maxRepliesField).toBeVisible();
        await aiBotPage.maxRepliesField.fill('15');

        await aiBotPage.maxRepliesDayField.fill('55');
        await aiBotPage.minLikesField.fill('1');

        await aiBotPage.createRuleBtn.click();
        await expectTextContains(aiBotPage.alert, 'successfully');

    });


    test.only('Add Instagram Rule', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.configure.click();

        await page.waitForTimeout(5000);
        const count = await aiBotPage.instagramRules.count();
        if (count > 0 ) {
            const text = await aiBotPage.instagramRules.textContent();
            if (text?.includes('Instagram Rules')) {
                await aiBotPage.igDeleteBtn.click();
                await expect(aiBotPage.alert).toContainText('successfully');
            }
        }
        else {
            console.log('Instagram Rules not set')
        }
        
        await aiBotPage.createRuleBtnMain.click();
        await aiBotPage.platformDropdown.click();
        await aiBotPage.selectIG.click();
        await aiBotPage.accountDropdown.click();
        await aiBotPage.selectIGAccount.click();
        await aiBotPage.continueBtn.click();
        // // await expect(aiBotPage.modal).toBeVisible();
        
        // await expect(aiBotPage.commentsToggle).toBeVisible();
        // await aiBotPage.commentsToggle.check()

        await aiBotPage.nextBtn.click();
        await aiBotPage.defaultReplyField.fill('Please hold, while we process');
        await aiBotPage.keywordField.fill('Order');
        await aiBotPage.addBtn.click();
        await aiBotPage.nextBtn.click();
        await expect(aiBotPage.maxRepliesField).toBeVisible();
        await aiBotPage.maxRepliesField.fill('15');

        await aiBotPage.maxRepliesDayField.fill('55');
        await aiBotPage.minLikesField.fill('1');

        await aiBotPage.createRuleBtn.click();
        await expectTextContains(aiBotPage.alert, 'successfully');

    });

});