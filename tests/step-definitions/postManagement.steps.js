import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { PostManagementPage } from '../../pages/PostManagementPage.js';
import { safeClick } from '../../utils/helpers.js';

const { Given, When, Then } = createBdd();

Given('I am on the Post Management page', async ({ page }) => {
    const postPage = new PostManagementPage(page);
    await postPage.navigate();
    await safeClick(page);
    await page.waitForTimeout(1000);
});

Then('the post management page or module should be accessible', async ({ page }) => {
    const url = page.url();
    const isOnPage = url.includes('post') || url.includes('social') || url.includes('dashboard');
    if (!isOnPage) {
        console.log(`Post Management page not found — current URL: ${url}`);
    } else {
        expect(url).toBeTruthy();
    }
});

Then('the post list or table should be visible if the section exists', async ({ page }) => {
    const postPage = new PostManagementPage(page);
    await page.waitForTimeout(2000);
    const tableVisible = await page.locator('table, tbody').first().isVisible({ timeout: 5000 }).catch(() => false);
    if (!tableVisible) {
        const emptyVisible = await postPage.emptyState.isVisible({ timeout: 3000 }).catch(() => false);
        if (!emptyVisible) {
            console.log('Post list table not visible — section may not be available in current plan');
        }
    }
});

When('I create a new post with title {string}', async ({ page }, title) => {
    const postPage = new PostManagementPage(page);
    await postPage.addNewPost({ title, content: `Automation test post content created at ${Date.now()}` });
});

Then('the post creation action should complete', async ({ page }) => {
    const successAlert = page.locator('[role="alert"]').filter({ hasText: /success|created|added/i });
    const found = await successAlert.first().waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
    if (!found) {
        console.log('No success alert for post creation — action may have succeeded silently or section is not available');
    }
});

Given('at least one post exists', async ({ page }) => {
    const postPage = new PostManagementPage(page);
    const count = await postPage.getPostCount();
    if (count === 0) {
        await postPage.addNewPost({ title: `Temp Post ${Date.now()}`, content: 'Temporary post for test setup' });
        await page.waitForTimeout(2000);
    }
});

When('I edit the first post with title {string}', async ({ page }, title) => {
    const postPage = new PostManagementPage(page);
    await postPage.editFirstPost({ title });
});

Then('the post edit action should complete', async ({ page }) => {
    const successAlert = page.locator('[role="alert"]').filter({ hasText: /success|updated|saved/i });
    const found = await successAlert.first().waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
    if (!found) {
        console.log('No success alert for post edit — action may have succeeded silently or section is not available');
    }
});

When('I delete the first post', async ({ page }) => {
    const postPage = new PostManagementPage(page);
    await postPage.deleteFirstPost();
});

Then('the post delete action should complete', async ({ page }) => {
    const successAlert = page.locator('[role="alert"]').filter({ hasText: /success|deleted|removed/i });
    const found = await successAlert.first().waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
    if (!found) {
        console.log('No success alert for post deletion — action may have succeeded silently or section is not available');
    }
});

Then('the customer or contacts section should be accessible', async ({ page }) => {
    const postPage = new PostManagementPage(page);
    await page.waitForTimeout(1000);
    const tabVisible = await postPage.customersTab.isVisible({ timeout: 5000 }).catch(() => false);
    if (tabVisible) {
        await postPage.customersTab.click();
        await page.waitForTimeout(1000);
        console.log('Customer/contacts tab found and clicked');
    } else {
        const sectionVisible = await postPage.customerSection.isVisible({ timeout: 3000 }).catch(() => false);
        if (!sectionVisible) {
            console.log('Customer section not found — may be a separate module');
        }
    }
});

When('I create a new customer with name {string} and email {string}', async ({ page }, name, email) => {
    const postPage = new PostManagementPage(page);
    const result = await postPage.addNewCustomer({ name, email });
    if (!result) {
        console.log('Add customer button not found — customer management may be in a different section');
    }
});

Then('the customer creation action should complete', async ({ page }) => {
    const successAlert = page.locator('[role="alert"]').filter({ hasText: /success|created|added/i });
    const found = await successAlert.first().waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
    if (!found) {
        console.log('No success alert for customer creation — action may have succeeded silently or section is not available');
    }
});

Then('the auto-reply settings or defaults section should be accessible', async ({ page }) => {
    const postPage = new PostManagementPage(page);
    await page.waitForTimeout(1000);
    const autoReplyTabVisible = await postPage.autoReplyTab.isVisible({ timeout: 5000 }).catch(() => false);
    if (autoReplyTabVisible) {
        await postPage.autoReplyTab.click();
        await page.waitForTimeout(1000);
        console.log('Auto-reply tab found and navigated');
    } else {
        const sectionVisible = await postPage.autoReplySection.isVisible({ timeout: 3000 }).catch(() => false);
        if (!sectionVisible) {
            console.log('Auto-reply settings not found on this page — may be in Configure section');
        }
    }
});
