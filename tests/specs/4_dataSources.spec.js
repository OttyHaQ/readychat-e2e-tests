import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage';
import { LandingPage } from '../../pages/LandingPage';
import { AIBot } from '../../pages/AIBot';
import { safeClick, expectTextContains } from '../../utils/helpers';
import credentials from '../test-credentials.json' assert { type: 'json' };



test.describe.serial('Data Sources', () => {

    test.beforeEach(async ({ page }) => {
        
        const landingPage = new LandingPage(page);
        const signInPage = new SignInPage(page);
        
        // Sign In
        await page.goto('/');
        await landingPage.login.click();
        await safeClick(signInPage.denyBtn);
        await signInPage.fillSignInForm(process.env.USER_NAME, process.env.PASSWORD);
    });

    test('Q and A: Unanswered Questions', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.dataSources.click();

        await expect(aiBotPage.QnA).toBeVisible();
        await expect(aiBotPage.importFiles).toBeVisible();
        await expect(aiBotPage.allQstns).toBeVisible();
        await expect(aiBotPage.unansweredQstns).toBeVisible();
        await expect(aiBotPage.exportBtn).toBeVisible();
        await expect(aiBotPage.exportBtn).toBeVisible();
        await expect(aiBotPage.addSourceBtn).toBeVisible();
        await expect(aiBotPage.questionColumn).toBeVisible();
        await expect(aiBotPage.productsColumn).toBeVisible();
        await expect(aiBotPage.serviceColumn).toBeVisible();
        await expect(aiBotPage.lastAskedColumn).toBeVisible();
        await expect(aiBotPage.channelsColumn.last()).toBeVisible();
        await expect(aiBotPage.statusColumn).toBeVisible();
        await expect(aiBotPage.actionsColumn).toBeVisible();

    });

    test('Q and A: All Questions', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.dataSources.click();

        await aiBotPage.allQstns.click();
        await expect(aiBotPage.exportBtn).toBeVisible();
        await expect(aiBotPage.addNewQstnsBtn).toBeVisible();
        await expect(aiBotPage.questionColumn).toBeVisible();
        await expect(aiBotPage.productsColumn).toBeVisible();
        await expect(aiBotPage.serviceColumn).toBeVisible();
        await expect(aiBotPage.actionsColumn).toBeVisible();
        await expect(aiBotPage.answerColumn).toBeVisible();

    });


    test('Export Table Data', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.dataSources.click();

        await aiBotPage.exportBtn.click();
        await expectTextContains(aiBotPage.exportTableData, 'Export Table Data');
        await aiBotPage.exportRangeDropdown.click();
        await aiBotPage.exportRangeDropdown.click();
        await aiBotPage.csvBtn.click();
        await aiBotPage.xlsxBtn.click();
        await aiBotPage.pdfBtn.click();
    });

    test('Reorder Table', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.dataSources.click();

        await aiBotPage.reorderBtn.click();
        await aiBotPage.saveBtn.click();
        await aiBotPage.reorderBtn.click();
        await aiBotPage.cancelBtn.click();

    });

    test('Add New Questions - All Questions route', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.dataSources.click();
        await aiBotPage.allQstns.click();
        await aiBotPage.addNewQstnsBtn.click();
        await expectTextContains(aiBotPage.addQstnsAndAnswers, 'Add Question and Answer');
        await aiBotPage.questionField.fill(credentials.username);
        await aiBotPage.answerField.fill(credentials.username);
        await aiBotPage.productsDropdown.click();
        await aiBotPage.product.first().click();
        await aiBotPage.servicesDropdown.click();
        await aiBotPage.service.first().click();
        await aiBotPage.saveAndColseBtn.click();
        await expectTextContains(aiBotPage.alert, ['FAQ added successfully.', 'A FAQ with this question already exists.']);

    });


    test('Add New Questions - Add Source Route', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.dataSources.click();
        await aiBotPage.addSourceBtn.click();
        await expectTextContains(aiBotPage.addSourceHeader, 'Train your AI');
        await aiBotPage.createQandA.click();
        await expectTextContains(aiBotPage.addQstnsAndAnswers, 'Add Question and Answer');
        await aiBotPage.questionField.fill(credentials.username);
        await aiBotPage.answerField.fill(credentials.username);
        await aiBotPage.productsDropdown.click();
        await aiBotPage.product.first().click();
        await aiBotPage.servicesDropdown.click();
        await aiBotPage.service.first().click();
        await aiBotPage.saveAndColseBtn.click();
        await expectTextContains(aiBotPage.alert.first(), ['FAQ added successfully.', 'A FAQ with this question already exists.']);
    });


    test('Import Product File', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.dataSources.click();
        await aiBotPage.addSourceBtn.click();
        await expectTextContains(aiBotPage.addSourceHeader, 'Train your AI');
        await aiBotPage.importProductFile.click();
        await expectTextContains(aiBotPage.importFilesHeader, 'Import Product File');
        await aiBotPage.downloadTemplateBtn.click()
        await page.setInputFiles(aiBotPage.uploadFileBtn, 'tests/fixtures/1mb.pdf')
        await aiBotPage.importBtn.click();
        await expectTextContains(aiBotPage.alert.first(), 'File imported successfully.');

    });

    test('Import Files Table', async ({ page }) => {

        const aiBotPage = new AIBot(page);

        await aiBotPage.AIbot.click();
        await aiBotPage.dataSources.click();

        await aiBotPage.importFiles.click();
        await expectTextContains(aiBotPage.batchHeader, 'All Batch Imports');
        await expect(aiBotPage.idColumn).toBeVisible();
        await expect(aiBotPage.fileNameColumn).toBeVisible();
        await expect(aiBotPage.createdAtColumn).toBeVisible();
        await expect(aiBotPage.productCountColumn).toBeVisible();
        await expect(aiBotPage.statusColumn).toBeVisible();
        await expect(aiBotPage.actionsColumn).toBeVisible();

    });

});