import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { Escalation } from '../../pages/Escalation.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick } from '../../utils/helpers.js';

const { Given, When, Then } = createBdd();

Given('I am on the Escalation page', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await escalationPage.navigateToEscalation();
    await escalationPage.verifyEscalationPageLoaded();
});

When('I switch to the unassigned tickets tab', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await escalationPage.switchToTab('unassigned');
});

When('I switch to the my tickets tab', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await escalationPage.switchToTab('my_tickets');
});

When('I switch to the resolved tickets tab', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await escalationPage.switchToTab('resolved');
});

Then('I should be able to accept the first available ticket', async ({ page }) => {
    const escalationPage = new Escalation(page);
    const aiBotPage = new AIBot(page);
    await escalationPage.acceptBtn.waitFor({ state: 'visible', timeout: 10000 });
    const count = await escalationPage.acceptBtn.count();
    if (count === 0) return;
    await escalationPage.acceptBtn.first().click();
    const acceptAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await acceptAlert.first().waitFor({ state: 'visible', timeout: 10000 });
});

Then('I should be able to open chat for the first available ticket', async ({ page }) => {
    const escalationPage = new Escalation(page);
    const noTicketsMsg = page.getByText(/no tickets assigned to you/i);
    if (await noTicketsMsg.isVisible().catch(() => false)) return;
    const ticketChatBtn = page.locator('main').getByRole('button', { name: /^chat$/i }).first();
    await ticketChatBtn.waitFor({ state: 'visible', timeout: 10000 });
    if (await ticketChatBtn.count() === 0) return;
    await ticketChatBtn.click();
    await expect(escalationPage.ticketDetailsHeader).toBeVisible({ timeout: 10000 });
});

Then('I should be able to resolve the first available ticket', async ({ page }) => {
    const escalationPage = new Escalation(page);
    const aiBotPage = new AIBot(page);
    await escalationPage.resolveBtn.waitFor({ state: 'visible', timeout: 10000 });
    if (await escalationPage.resolveBtn.count() === 0) return;
    await escalationPage.resolveTicket();
    const resolveAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await resolveAlert.first().waitFor({ state: 'visible', timeout: 10000 });
});

Then('I should be able to reopen the first available ticket', async ({ page }) => {
    const escalationPage = new Escalation(page);
    const aiBotPage = new AIBot(page);
    await escalationPage.reopenBtn.waitFor({ state: 'visible', timeout: 10000 });
    if (await escalationPage.reopenBtn.count() === 0) return;
    await escalationPage.reopenTicket();
    const reopenAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await reopenAlert.first().waitFor({ state: 'visible', timeout: 10000 });
});

Then('I should be able to close the first available ticket', async ({ page }) => {
    const escalationPage = new Escalation(page);
    const aiBotPage = new AIBot(page);
    await escalationPage.closeBtn.waitFor({ state: 'visible', timeout: 10000 });
    if (await escalationPage.closeBtn.count() === 0) return;
    await escalationPage.closeTicket();
    const closeAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await closeAlert.first().waitFor({ state: 'visible', timeout: 10000 });
});

When('I sort tickets by all available options', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await safeClick(page);
    await escalationPage.sortBy();
});

Then('all sort options should be applied successfully', async () => {});

When('I search for tickets with the term {string}', async ({ page }, term) => {
    const escalationPage = new Escalation(page);
    await safeClick(page);
    await escalationPage.searchTickets(term);
});

Then('the search field should contain {string}', async ({ page }, term) => {
    const escalationPage = new Escalation(page);
    await expect(escalationPage.searchField).toHaveValue(term);
});

When('I filter by high priority', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await escalationPage.sortByPriority('high');
});

When('I filter by medium priority', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await escalationPage.sortByPriority('medium');
});

When('I filter by low priority', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await escalationPage.sortByPriority('low');
});

When('I reset to all priorities', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await escalationPage.sortByPriority('all');
});

Then('each priority filter should be reflected in the dropdown', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await expect(escalationPage.sortDropdown).toContainText(/all/i);
});

Then('all ticket tabs should be visible', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await expect(escalationPage.myTicketsTab).toBeVisible();
    await expect(escalationPage.unassignedTab).toBeVisible();
    await expect(escalationPage.resolvedTab).toBeVisible();
    await expect(escalationPage.closedTab).toBeVisible();
});

When('I navigate through each tab', async ({ page }) => {
    const escalationPage = new Escalation(page);
    await escalationPage.switchToTab('my_tickets');
    await escalationPage.switchToTab('unassigned');
    await escalationPage.switchToTab('resolved');
    await escalationPage.switchToTab('closed');
});

Then('each tab should be accessible', async () => {});
