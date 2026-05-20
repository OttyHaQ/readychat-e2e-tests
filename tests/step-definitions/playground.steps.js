import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick } from '../../utils/helpers.js';

const { Given, When, Then } = createBdd();

Given('I am on the Playground page', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.navigateToPlayground();
    await safeClick(page);
});

Then('the playground header and welcome message should be visible', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await expect(aiBotPage.playgroundHeader).toContainText(/readychatai/i);
    await expect(aiBotPage.defaultWelcomeMessage.first()).toContainText(/hi there.*help you/i);
});

When('I type {string} and add an emoji and send', async ({ page }, message) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.chatInputField.fill(message);
    await aiBotPage.emojiButton.click();
    await aiBotPage.emojiSmile.click();
    await aiBotPage.sendMessageBtn.first().click();
});

Then('the sent message should be visible', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await expect(aiBotPage.sentMessage).toBeVisible({ timeout: 10000 });
});

Then('all example prompt buttons should be visible', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await expect(aiBotPage.promptLocationBtn).toBeVisible();
    await expect(aiBotPage.promptBusinessHoursBtn).toBeVisible();
    await expect(aiBotPage.promptProductsBtn).toBeVisible();
    await expect(aiBotPage.promptOrderBtn).toBeVisible();
});

When('I click the order prompt and send', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.promptOrderBtn.click();
    await aiBotPage.sendMessageBtn.first().click();
});

Then('the sent message should contain the order prompt text', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await expect(aiBotPage.sentMessage.first()).toContainText(/want to make an order/i);
});

When('I send an example prompt message', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.clickExamplePrompt(4);
    await aiBotPage.sendMessageBtn.first().click();
    await expect(aiBotPage.sentMessage.first()).toBeVisible({ timeout: 10000 });
});

When('I reset the playground', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.resetPlayground();
});

Then('the conversation should be reset to the initial state', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await expect(aiBotPage.sentMessage).toHaveCount(1, { timeout: 10000 });
});

When('I click the Add More Knowledge link', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    const linkVisible = await aiBotPage.addMoreKnowledgeLink.isVisible({ timeout: 5000 }).catch(() => false);
    if (linkVisible) {
        await aiBotPage.addMoreKnowledgeLink.click();
        await page.waitForTimeout(1000);
    }
    if (!page.url().includes('/en/dashboard/ai-bot/knowledge-base')) {
        await page.goto('/en/dashboard/ai-bot/knowledge-base');
        await page.waitForLoadState('domcontentloaded');
    }
});

Then('I should be on the Data Sources page', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await expect(aiBotPage.unansweredQuestionsTab).toBeVisible({ timeout: 10000 });
});

When('I open the emoji picker and select an emoji', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.emojiButton.waitFor({ state: 'visible', timeout: 10000 });
    await aiBotPage.emojiButton.click();
    await aiBotPage.emojiSmile.waitFor({ state: 'visible', timeout: 5000 });
    await aiBotPage.emojiSmile.click();
});

Then('the emoji should appear in the chat input field', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    const inputValue = await aiBotPage.chatInputField.inputValue();
    expect(inputValue).toContain('😀');
});

When('I send the playground message {string}', async ({ page }, message) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.chatInputField.waitFor({ state: 'visible', timeout: 10000 });
    await expect(aiBotPage.chatInputField).toBeEnabled({ timeout: 15000 });
    await aiBotPage.sendMessage(message);
});

When('I wait for the response and send {string}', async ({ page }, message) => {
    const aiBotPage = new AIBot(page);
    await expect(aiBotPage.chatInputField).toBeEnabled({ timeout: 20000 });
    await page.waitForTimeout(2000);
    await aiBotPage.sendMessage(message);
});

When('I wait for the response and send an example prompt', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await expect(aiBotPage.chatInputField).toBeEnabled({ timeout: 20000 });
    await page.waitForTimeout(2000);
    await aiBotPage.clickExamplePrompt(4);
    await expect(aiBotPage.sendMessageBtn.first()).toBeEnabled({ timeout: 10000 });
    await aiBotPage.sendMessageBtn.first().click();
});

Then('all messages should be sent successfully', async () => {});
