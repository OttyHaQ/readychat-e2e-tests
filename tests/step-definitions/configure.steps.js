import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick } from '../../utils/helpers.js';

const { Given, When, Then } = createBdd();

Given('I am on the Configure page', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.navigateToConfigure();
    await safeClick(page);
});

When('I update the professional info to {string}', async ({ page }, text) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.professionalInfoField.waitFor({ state: 'visible', timeout: 10000 });
    await aiBotPage.professionalInfoField.clear();
    await aiBotPage.professionalInfoField.fill(text);
});

When('I update the AI tone to {string}', async ({ page }, text) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.aiToneField.clear();
    await aiBotPage.aiToneField.fill(text);
});

When('I toggle all general settings', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.toggleAllGeneralSettings();
});

When('I save the configuration', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await aiBotPage.saveBtn.click();
});

Then('the professional info field should be visible', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await expect(aiBotPage.professionalInfoField).toBeVisible({ timeout: 10000 });
});

Then('the AI tone field should be visible', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await expect(aiBotPage.aiToneField).toBeVisible();
});

Then('the save button should be visible', async ({ page }) => {
    const aiBotPage = new AIBot(page);
    await expect(aiBotPage.saveBtn).toBeVisible();
});
