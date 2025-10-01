import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage';
import { LandingPage } from '../../pages/LandingPage';
import { AIBot } from '../../pages/AIBot';
import { safeClick, expectTextContains } from '../../utils/helpers';



test.describe.serial('Playground', () => {

    test.beforeEach(async ({ page }) => {
        
        const landingPage = new LandingPage(page);
        const signInPage = new SignInPage(page);
        
        // Sign In
        await page.goto('/');
        await landingPage.login.click();
        await safeClick(signInPage.denyBtn);
        await signInPage.fillSignInForm(process.env.USER_NAME, process.env.PASSWORD);
    });


    test('Send Message', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.playground.click();

        await expectTextContains(aiBotPage.playgroundheader, 'ReadyChatAI');
        await expectTextContains(aiBotPage.defaulttext, 'Hi there! How may I help you?');
        await aiBotPage.inputField.fill('I want to place an order');
        await aiBotPage.emojiButton.click();
        await aiBotPage.emoji.click();
        await aiBotPage.sendBtn.click();
        await expect(aiBotPage.sentMessage).toContainText('I want to make an order');

    });


    test('Example Prompts', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.playground.click();

        await expect(aiBotPage.prompt_1).toBeVisible();
        await expect(aiBotPage.prompt_2).toBeVisible();
        await expect(aiBotPage.prompt_3).toBeVisible();
        await expect(aiBotPage.prompt_4).toBeVisible();
        await aiBotPage.prompt_1.click();
        await aiBotPage.sendBtn.click();
        await expect(aiBotPage.sentMessage).toContainText('I want to make an order'); 

    });

    test('Reset Playground', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.playground.click();

        await aiBotPage.prompt_1.click();
        await aiBotPage.sendBtn.click();
        await expect(aiBotPage.sentMessage).toBeVisible();
        await aiBotPage.resetBtn.click();
        await expect(aiBotPage.sentMessage).toHaveCount(1);

    });


    test('Add More Knowledge Link', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.playground.click();

        await aiBotPage.addMoreLink.click();
        await expect(aiBotPage.addSourceBtn).toBeVisible();
        
    });

});