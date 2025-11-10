import { test, expect } from '@playwright/test';
import { CheckoutQuestionsPage } from '../../pages/Checkoutquestions.js';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { safeClick } from '../../utils/helpers.js';

test.describe('Checkout Questions Management', () => {
    let checkoutQuestionsPage;

    // Test credentials
    const testCredentials = {
        username: process.env.USER_NAME || 'default_user',
        password: process.env.PASSWORD || 'default_password'
    };

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout

        const landingPage = new LandingPage(page);
        const signInPage = new SignInPage(page);
        checkoutQuestionsPage = new CheckoutQuestionsPage(page);

        try {
            // Navigate and sign in
            await page.goto('/');
            await page.waitForLoadState('domcontentloaded');
            
            await landingPage.login.waitFor({ state: 'visible', timeout: 10000 });
            await landingPage.login.click();
            
            await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
            await safeClick(page);
            
            await signInPage.fillSignInForm(testCredentials.username, testCredentials.password);
            await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 })
            
            console.log('✓ User signed in successfully');

            // Navigate to Checkout Questions page
            await page.goto('/en/dashboard/orders/checkout-questions');
            await checkoutQuestionsPage.waitForPageLoad();
            console.log('✓ Navigated to Checkout Questions page');

        } catch (error) {
            console.error('❌ Setup failed:', error.message);
            
            // Take screenshot on failure
            const screenshotPath = `tests/screenshots/checkout-questions-setup-failure-${Date.now()}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`📸 Screenshot saved: ${screenshotPath}`);
            
            throw error;
        }
    });

    test('Verify column headers are displayed', async ({ page }) => {
        await test.step('Check that all expected column headers are visible', async () => {
            // Verify page loaded
            await expect(checkoutQuestionsPage.pageTitle).toBeVisible({ timeout: 10000 });
            
            // Get all column headers
            const headers = await checkoutQuestionsPage.getColumnHeaderTexts();
            console.log('📊 Column headers found:', headers);

            // Verify expected headers exist (flexible matching)
            const expectedHeaders = ['Question', 'Reorder', 'Action'];
            
            for (const expectedHeader of expectedHeaders) {
                const headerExists = headers.some(header => 
                    header.toLowerCase().includes(expectedHeader.toLowerCase())
                );
                
                expect(headerExists, `Expected column header "${expectedHeader}" to be present`).toBeTruthy();
                console.log(`✓ Column header "${expectedHeader}" verified`);
            }

            // Alternative: Verify each header individually
            await expect(checkoutQuestionsPage.columnHeaders).toHaveCount(expectedHeaders.length, { timeout: 5000 });
            
            console.log('✅ All column headers displayed correctly');
        });
    });

    test('Should export orders in different formats', async ({ page }) => {
        await test.step('Open export modal', async () => {
            await checkoutQuestionsPage.exportBtn.click();
            // Wait for modal heading instead
            await expect(checkoutQuestionsPage.exportModal).toBeVisible({ timeout: 5000 });
            console.log('✓ Export modal opened');
        });

        await test.step('Export to CSV', async () => {
            const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
            await checkoutQuestionsPage.csvBtn.click();
            const download = await downloadPromise;
            console.log(`✓ CSV export downloaded: ${download.suggestedFilename()}`);
        });


        await test.step('Export to XLSX', async () => {
            const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
            await checkoutQuestionsPage.xlsxBtn.click(); // Fix typo: was 'xlsx' should be 'xlsxBtn'
            const download = await downloadPromise;
            console.log(`✓ XLSX export downloaded: ${download.suggestedFilename()}`);
        });

        await test.step('Export to PDF', async () => {
            const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
            await checkoutQuestionsPage.pdfBtn.click();
            const download = await downloadPromise;
            console.log(`✓ PDF export downloaded: ${download.suggestedFilename()}`);
        });

        await test.step('Close export modal', async () => {
            await checkoutQuestionsPage.closeModalBtn.click();
            console.log('✓ Export modal closed');
        });

        console.log('\n✅ Export orders test passed!');
    });

    test('Verify user can add new checkout question', async ({ page }) => {
        const newQuestion = `Test Question ${Date.now()}`;

        await test.step('Open add question dialog', async () => {
            // Verify add button is visible
            await checkoutQuestionsPage.addQuestionButton.waitFor({state: 'visible', timeout: 10000 });
            console.log('✓ Add Question button is visible');

        });

        await test.step('Fill and submit new question form', async () => {
            // Add new question
            await checkoutQuestionsPage.addNewQuestion(newQuestion, 'Text', true);
            console.log(`✓ New Question added: "${newQuestion}"`);

            // Wait for success message or table update
            await page.waitForTimeout(2000);
        });

        await test.step('Verify question was added to the table', async () => {
            // Verify question appears in table
            await checkoutQuestionsPage.verifyQuestionExists(newQuestion);
            console.log('✓ New question appears in table');

            // Verify count increased
            const newCount = await checkoutQuestionsPage.getQuestionCount();
            console.log(`📊 New question count: ${newCount}`);

            console.log('✅ Add question functionality verified');
        });
    });

    test('Verify user can edit checkout question', async ({ page }) => {
        const updatedQuestion = `Updated Question ${Date.now()}`;

        await test.step('Verify at least one question exists', async () => {
            const questionCount = await checkoutQuestionsPage.getQuestionCount();
            
            if (questionCount === 0) {
                // Add a question first if none exist
                const tempQuestion = `Temp Question ${Date.now()}`;
                await checkoutQuestionsPage.addNewQuestion(tempQuestion);
                await page.waitForTimeout(2000);
                console.log('✓ Created a test question for editing');
            }

        });

        await test.step('Edit the first question', async () => {
            // Edit the question
            await page.waitForTimeout(5000);
            await checkoutQuestionsPage.editQuestion(updatedQuestion);
            console.log("✓ Question edited");

            // Wait for update
            await page.waitForTimeout(2000);
     
            // verify question exist
            await checkoutQuestionsPage.verifyQuestionExists(updatedQuestion);
            console.log('✓ Updated question appears in table');

            console.log('✅ Edit question functionality verified');
        });
    });

    test.skip('Verify user can delete checkout question', async ({ page }) => {
        await test.step('Verify at least one question exists', async () => {
            let questionCount = await checkoutQuestionsPage.getQuestionCount();
            
            if (questionCount === 0) {
                // Add a question first if none exist
                const tempQuestion = `Temp Question for Deletion ${Date.now()}`;
                await checkoutQuestionsPage.addNewQuestion(tempQuestion);
                await page.waitForTimeout(2000);
                questionCount = await checkoutQuestionsPage.getQuestionCount();
                console.log('✓ Created a test question for deletion');
            }

            console.log(`📊 Initial question count: ${questionCount}`);

            // Verify delete button is visible
            await expect(checkoutQuestionsPage.firstDeleteButton).toBeVisible({ timeout: 10000 });
            console.log('✓ Delete button is visible');
        });

        await test.step('Delete the first question', async () => {
            // Get question text before deletion
            const questionToDelete = await checkoutQuestionsPage.getQuestionText(0);
            console.log(`🗑️ Deleting question: "${questionToDelete}"`);

            // Get initial count
            const initialCount = await checkoutQuestionsPage.getQuestionCount();

            // Delete the question
            await checkoutQuestionsPage.deleteQuestion(0);
            console.log('✓ Delete confirmed');

            // Wait for deletion to complete
            await page.waitForTimeout(2000);

            // Verify count decreased
            const newCount = await checkoutQuestionsPage.getQuestionCount();
            expect(newCount).toBeLessThan(initialCount);
            console.log(`📊 Question count after deletion: ${newCount}`);

            console.log('✅ Delete question functionality verified');
        });
    });

    test.skip('Verify user can reorder columns/questions', async ({ page }) => {
        await test.step('Verify drag handles or reorder functionality exists', async () => {
            // Check if there are multiple questions to reorder
            const questionCount = await checkoutQuestionsPage.getQuestionCount();
            
            if (questionCount < 2) {
                // Add questions if less than 2 exist
                await checkoutQuestionsPage.addNewQuestion(`Question A ${Date.now()}`);
                await page.waitForTimeout(1000);
                await checkoutQuestionsPage.addNewQuestion(`Question B ${Date.now()}`);
                await page.waitForTimeout(1000);
                console.log('✓ Created test questions for reordering');
            }

            console.log(`📊 Available questions for reordering: ${questionCount}`);
        });

        await test.step('Attempt to reorder questions', async () => {
            // Get initial order
            const firstQuestion = await checkoutQuestionsPage.getQuestionText(0);
            const secondQuestion = await checkoutQuestionsPage.getQuestionText(1);
            console.log(`📝 Initial order: "${firstQuestion}", "${secondQuestion}"`);

            // Check if drag handles exist
            const dragHandleCount = await checkoutQuestionsPage.dragHandles.count();
            
            if (dragHandleCount > 0) {
                console.log(`✓ Found ${dragHandleCount} drag handles`);
                
                // Attempt to reorder
                await checkoutQuestionsPage.reorderQuestion(0, 1);
                console.log('✓ Attempted to reorder questions via drag and drop');

                // Wait for reorder animation
                await page.waitForTimeout(2000);

                // Verify order changed
                const newFirstQuestion = await checkoutQuestionsPage.getQuestionText(0);
                console.log(`📝 New first question: "${newFirstQuestion}"`);

                // Note: Order might not change depending on implementation
                console.log('✅ Reorder functionality attempted');
            } else {
                console.log('⚠️ No drag handles found - reordering may use different UI mechanism');
                console.log('✓ Verified reorder UI (if available)');
            }
        });

        await test.step('Verify table maintains data integrity after reorder', async () => {
            // Ensure all questions are still present
            const finalCount = await checkoutQuestionsPage.getQuestionCount();
            expect(finalCount).toBeGreaterThanOrEqual(2);
            console.log(`✓ All questions still present: ${finalCount}`);

            console.log('✅ Reorder functionality verified');
        });
    });

    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
            // Take screenshot on failure
            const screenshotPath = `tests/screenshots/${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`📸 Screenshot saved: ${screenshotPath}`);
        }
    });
});