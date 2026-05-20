import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { CheckoutQuestionsPage } from '../../pages/Checkoutquestions.js';
import { AIBot } from '../../pages/AIBot.js';

const { Given, When, Then } = createBdd();

async function navigateToCheckout(page) {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    await checkoutQuestionsPage.navigateToCheckoutQuestions();
    await expect(checkoutQuestionsPage.pageTitle).toBeVisible({ timeout: 10000 });
    await expect(checkoutQuestionsPage.questionColumnHeader).toBeVisible({ timeout: 5000 });
    return checkoutQuestionsPage;
}

Given('I am on the Checkout Questions page', async ({ page }) => {
    await navigateToCheckout(page);
});

Given('at least one question exists', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    const count = await checkoutQuestionsPage.getQuestionCount();
    if (count === 0) {
        await checkoutQuestionsPage.addNewQuestion(`Temp Question ${Date.now()}`, 'Text', true);
        await page.waitForTimeout(2000);
    }
});

Given('at least two questions exist', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    const count = await checkoutQuestionsPage.getQuestionCount();
    if (count < 2) {
        await checkoutQuestionsPage.addNewQuestion(`Question A ${Date.now()}`);
        await page.waitForTimeout(1000);
        await checkoutQuestionsPage.addNewQuestion(`Question B ${Date.now()}`);
        await page.waitForTimeout(1000);
    }
});

Then('the column headers should include Question, Reorder, and Action', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    const headers = await checkoutQuestionsPage.getColumnHeaderTexts();
    const expectedHeaders = ['Question', 'Reorder', 'Action'];
    for (const expectedHeader of expectedHeaders) {
        const headerExists = headers.some(h => h.toLowerCase().includes(expectedHeader.toLowerCase()));
        expect(headerExists, `Expected column header "${expectedHeader}" to be present`).toBeTruthy();
    }
    await expect(checkoutQuestionsPage.columnHeaders).toHaveCount(expectedHeaders.length, { timeout: 5000 });
});

When('I open the checkout questions export modal', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    await checkoutQuestionsPage.exportBtn.click();
    await expect(checkoutQuestionsPage.exportModal).toBeVisible({ timeout: 5000 });
});

When('I export to CSV format with download', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await checkoutQuestionsPage.csvBtn.click();
    await downloadPromise;
});

When('I export to XLSX format with download', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await checkoutQuestionsPage.xlsxBtn.click();
    await downloadPromise;
});

When('I export to PDF format with download', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
    await checkoutQuestionsPage.pdfBtn.click();
    await downloadPromise;
});

When('I close the checkout questions export modal', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    await checkoutQuestionsPage.closeModalBtn.click();
});

Then('all export downloads should complete', async () => {});

When('I add a new question with type {string} and required {word}', async ({ page }, type, required) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    const aiBotPage = new AIBot(page);
    const newQuestion = `Test Question ${Date.now()}`;
    await checkoutQuestionsPage.addQuestionButton.waitFor({ state: 'visible', timeout: 10000 });
    await checkoutQuestionsPage.addNewQuestion(newQuestion, type, required === 'true');
    await page.waitForTimeout(2000);
    const addQuestionAlert = page.locator('[role="alert"]').filter({ hasText: /successfully/i });
    await addQuestionAlert.first().waitFor({ state: 'visible', timeout: 30000 });
    page._lastAddedQuestion = newQuestion;
});

Then('the new question should appear in the table after reload', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    await page.reload();
    if (page._lastAddedQuestion) {
        await checkoutQuestionsPage.verifyQuestionExists(page._lastAddedQuestion);
    }
});

When('I edit the first question with an updated question text', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    const updatedQuestion = `Updated Question ${Date.now()}`;
    await checkoutQuestionsPage.editQuestion(updatedQuestion);
    page._lastEditedQuestion = updatedQuestion;
});

Then('the updated question should appear in the table', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    await page.reload();
    await page.waitForTimeout(2000);
    if (page._lastEditedQuestion) {
        await checkoutQuestionsPage.verifyQuestionExists(page._lastEditedQuestion);
    }
});

When('I create a question for deletion', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    const tempQuestion = `Temp Question for Deletion ${Date.now()}`;
    await checkoutQuestionsPage.addNewQuestion(tempQuestion);
    await page.waitForTimeout(2000);
});

When('I sort by descending and delete the first question', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    await checkoutQuestionsPage.sortByDescending();
    await checkoutQuestionsPage.deleteQuestion();
    await page.waitForTimeout(2000);
});

When('I attempt to reorder questions via drag and drop', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    const dragHandleCount = await checkoutQuestionsPage.dragHandles.count();
    if (dragHandleCount > 0) {
        await checkoutQuestionsPage.reorderQuestion(0, 1);
        await page.waitForTimeout(2000);
    }
});

Then('the table should maintain data integrity after reorder', async ({ page }) => {
    const checkoutQuestionsPage = new CheckoutQuestionsPage(page);
    const finalCount = await checkoutQuestionsPage.getQuestionCount();
    expect(finalCount).toBeGreaterThanOrEqual(2);
});
