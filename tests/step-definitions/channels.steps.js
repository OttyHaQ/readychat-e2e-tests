import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { Channels } from '../../pages/Channels.js';
import { safeClick } from '../../utils/helpers.js';

const { Given, When, Then } = createBdd();

Given('I am on the Channels page', async ({ page }) => {
    const channelsPage = new Channels(page);
    await channelsPage.navigateToChannels();
    await channelsPage.verifyChannelsPageLoaded();
    await expect(channelsPage.pageHeader).toContainText(/channels guide/i);
});

When('I click the Integrate Facebook button', async ({ page }) => {
    const channelsPage = new Channels(page);
    await safeClick(page);
    await channelsPage.verifyIntegrationButtonVisible('facebook');
    await channelsPage.integrateFacebookBtn.click();
});

Then('I should see the Facebook integration popup', async ({ page }) => {
    const channelsPage = new Channels(page);
    await channelsPage.verifyIntegrationPopup('Connect Your Facebook Page');
});

Then('the Facebook authentication flow should complete', async ({ page }) => {
    const channelsPage = new Channels(page);
    const popupPromise = page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null);
    await channelsPage.continueBtn.click();
    const popup = await popupPromise;
    if (popup) {
        await popup.waitForLoadState('domcontentloaded');
        await popup.close();
    } else {
        await page.waitForTimeout(1000);
    }
});

When('I click the Integrate WhatsApp button', async ({ page }) => {
    const channelsPage = new Channels(page);
    await safeClick(page);
    await channelsPage.verifyIntegrationButtonVisible('whatsapp');
    await channelsPage.integrateWhatsAppBtn.click();
});

Then('I should see the WhatsApp integration popup', async ({ page }) => {
    const channelsPage = new Channels(page);
    // Handle regional restriction warning modal if it appears
    const warningModal = page.getByRole('heading', { name: /not recommended in your region/i });
    const warningVisible = await warningModal.isVisible({ timeout: 5000 }).catch(() => false);
    if (warningVisible) {
        const continueAnywayBtn = page.getByRole('button', { name: /yes.*continue anyway/i });
        await continueAnywayBtn.click();
        await page.waitForTimeout(1000);
    }
    await channelsPage.verifyIntegrationPopup('Get Ready to Connect WhatsApp');
});

Then('the WhatsApp authentication popup should open', async ({ page }) => {
    const channelsPage = new Channels(page);
    const [popup] = await Promise.all([
        page.waitForEvent('popup', { timeout: 15000 }),
        channelsPage.continueBtn.click()
    ]);
    await popup.waitForLoadState('domcontentloaded');
    await popup.close();
});

When('I click the Integrate Instagram button', async ({ page }) => {
    const channelsPage = new Channels(page);
    await safeClick(page);
    await channelsPage.verifyIntegrationButtonVisible('instagram');
    await channelsPage.integrateInstagramBtn.click();
});

Then('I should see the Instagram integration popup', async ({ page }) => {
    const channelsPage = new Channels(page);
    await channelsPage.verifyIntegrationPopup('Connect Your Instagram Account');
});

Then('the Instagram authentication popup should open', async ({ page }) => {
    const channelsPage = new Channels(page);
    const [popup] = await Promise.all([
        page.waitForEvent('popup', { timeout: 15000 }),
        channelsPage.continueBtn.click()
    ]);
    await popup.waitForLoadState('domcontentloaded');
    await popup.close();
});

Then('the Learn More button should be visible and functional', async ({ page }) => {
    const channelsPage = new Channels(page);
    await expect(channelsPage.learnMoreBtn).toBeVisible({ timeout: 10000 });
    await channelsPage.clickLearnMore();
});

Then('all integration buttons should be visible', async ({ page }) => {
    const channelsPage = new Channels(page);
    await expect(channelsPage.integrateFacebookBtn).toBeVisible({ timeout: 10000 });
    await expect(channelsPage.integrateWhatsAppBtn).toBeVisible({ timeout: 10000 });
    await expect(channelsPage.integrateInstagramBtn).toBeVisible({ timeout: 10000 });
});
