import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage';
import { LandingPage } from '../../pages/LandingPage';
import { AIBot } from '../../pages/AIBot';
import { Escalation } from '../../pages/Escalation';
import { safeClick, expectTextContains } from '../../utils/helpers.js';



test.describe.serial('Escalation', () => {

    test.beforeEach(async ({ page }) => {
        
        const landingPage = new LandingPage(page);
        const signInPage = new SignInPage(page);
        
        // Sign In
        await page.goto('/');
        await landingPage.login.click();
        await safeClick(signInPage.denyBtn);
        await signInPage.fillSignInForm(process.env.USER_NAME, process.env.PASSWORD);
    });


    test('Accept Escalation', async ({ page }) => {

        const escalationPage = new Escalation(page);
        const aiBotPage = new AIBot(page);

        await escalationPage.escalation.click();
        await escalationPage.unassigned.click();
        await expect(escalationPage.acceptBtn).toBeVisible();
        await escalationPage.acceptBtn.click();
        await expectTextContains(aiBotPage.alert, 'successfully'); 

    });

    test('Chat', async ({ page }) => {

        const escalationPage = new Escalation(page);
        const aiBotPage = new AIBot(page);

        await escalationPage.escalation.click();
        await escalationPage.my_tickets.click();
        await expect(escalationPage.chatBtn).toBeVisible();
        await escalationPage.chatBtn.click();
        await expectTextContains(escalationPage.chatTitle, 'TICKET DETAILS');

    });

    test('Resolve Ticket', async ({ page }) => {

        const escalationPage = new Escalation(page);
        const aiBotPage = new AIBot(page);

        page.waitForTimeout(3000);
        await escalationPage.escalation.click();
        await escalationPage.my_tickets.click();
        await expect(escalationPage.resolveBtn).toBeVisible();
        await escalationPage.resolveBtn.click();
        await expectTextContains(aiBotPage.alert, 'successfully');

    });

    test('Reopen Ticket', async ({ page }) => {

        const escalationPage = new Escalation(page);
        const aiBotPage = new AIBot(page);

        page.waitForTimeout(3000);
        await escalationPage.escalation.click();
        await escalationPage.resolved.click();
        await expect(escalationPage.reopenBtn).toBeVisible();
        await escalationPage.reopenBtn.click();
        await expectTextContains(aiBotPage.alert, 'successfully');

    });

    test.skip('Close Ticket', async ({ page }) => {

        const escalationPage = new Escalation(page);
        const aiBotPage = new AIBot(page);

        await escalationPage.escalation.click();
        await escalationPage.resolved.click();
        await expect(escalationPage.closeBtn).toBeVisible();
        await escalationPage.closeBtn.click();
        await expectTextContains(aiBotPage.alert, 'successfully');

    });

    test('Sort', async ({ page }) => {

        const escalationPage = new Escalation(page);
        // const aiBotPage = new AIBot(page);

        await escalationPage.escalation.click();
        await escalationPage.sortBy();

    });


});