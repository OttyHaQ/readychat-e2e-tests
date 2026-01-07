import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick, expectTextContains, fullUrl } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

test.describe('Data Sources Management', () => {

    const testCredentials = {
        username: process.env.USER_NAME || 'default_user',
        password: process.env.PASSWORD || 'default_password'
    };
  
    test.beforeEach(async ({ page }) => {
      // Set timeout for each test
      test.setTimeout(90000); // 1.5 minutes
      
      // Initialize page objects
      const landingPage = new LandingPage(page);
      const signInPage = new SignInPage(page);
  
      try {
            // Navigate and sign in with retry logic
            await page.goto('/');
            await page.waitForLoadState('domcontentloaded');
            
            await landingPage.login.waitFor({ state: 'visible', timeout: 10000 });
            
            // Click and wait for navigation with retry
            let navigationSuccess = false;
            let attempts = 0;
            const maxAttempts = 3;
            
            while (!navigationSuccess && attempts < maxAttempts) {
                attempts++;
                
                try {
                    const navigationPromise = page.waitForURL(
                    url => url.href.includes('/auth/login'), 
                    { timeout: 30000 }
                );
                
                await landingPage.login.click();
                await navigationPromise;
                
                // Verify we're actually on login page
                const currentUrl = page.url();
                if (currentUrl.includes('/en/auth/login')) {
                    navigationSuccess = true;
                    console.log(`✓ Navigated to login (attempt ${attempts})`);
                }
                } catch (error) {
                if (attempts === maxAttempts) throw error;
                    console.log(`⚠️ Navigation attempt ${attempts} failed, retrying...`);
                    await page.waitForTimeout(2000);
                }
            }
            
            // Wait for form to be ready
            await signInPage.usernameField.waitFor({ state: 'visible', timeout: 10000 });
            await safeClick(page);
            
            await signInPage.fillSignInForm(testCredentials.username, testCredentials.password);
            await expect(page).toHaveURL('/en/dashboard', { timeout: 30000 });
            
            console.log('✓ User signed in successfully');
            } catch (error) {
            console.error('❌ Login failed:', error.message);
            throw error;
        }
    });

  test('Should display unanswered questions table with all columns', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Data Sources', async () => {
        await aiBotPage.navigateToDataSources();
        console.log('✓ Data Sources page loaded');
      });

      await test.step('Verify unanswered tab elements', async () => {
        // await expect(aiBotPage.answeredQuestionsTab).toBeVisible();
        await expect(aiBotPage.answeredQuestionsTab).toBeVisible();
        console.log('✓ Unanswered Questions tab visible');
      });

      await test.step('Verify Export button', async () => {
        await expect(aiBotPage.exportBtn).toBeVisible();
        console.log('✓ Export button visible');
      });

      await test.step('Verify table columns', async () => {
        await expect(aiBotPage.questionColumn).toBeVisible();
        await expect(aiBotPage.lastAskedColumn).toBeVisible();
        await expect(aiBotPage.channelsColumn.last()).toBeVisible();
        await expect(aiBotPage.statusColumn).toBeVisible();
        await expect(aiBotPage.actionsColumn).toBeVisible();
        console.log('✓ Unanswered table columns visible');
      });

      console.log('\n✅ Unanswered questions table test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should display Answered questions table with correct columns', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Data Sources', async () => {
        await aiBotPage.navigateToDataSources();
      });

       await test.step('Verify answered tab elements', async () => {
        await expect(aiBotPage.answeredQuestionsTab).toBeVisible({ timeout: 10000 });
        console.log('✓ Answered Questions tab visible');
      });

      await test.step('Switch to Answered Questions tab', async () => {
        // await aiBotPage.switchToTab('answered');
        await aiBotPage.switchToTab('answered');
        console.log('✓ Switched to Aanswered Questions tab');
      });

      await test.step('Verify Answered Questions elements', async () => {
        await expect(aiBotPage.exportBtn).toBeVisible();
        await expect(aiBotPage.addNewQuestionsBtn).toBeVisible();
        await expect(aiBotPage.questionColumn).toBeVisible();
        await expect(aiBotPage.actionsColumn).toBeVisible();
        await expect(aiBotPage.answerColumn).toBeVisible();
        console.log('✓ Answered Questions table verified');
      });

      console.log('\n✅ Answered questions table test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should open export modal and display format options', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Data Sources', async () => {
        await aiBotPage.navigateToDataSources();
      });

      await test.step('Open export modal', async () => {
        await aiBotPage.exportBtn.click();
        await expect(aiBotPage.exportTableDataHeader).toContainText(/export table data/i);
        console.log('✓ Export modal opened');
      });

      await test.step('Verify export options', async () => {
        await safeClick(page);
        
        // Verify export range dropdown
        await aiBotPage.exportRangeDropdown.click();
        await aiBotPage.exportRangeDropdown.click(); // Close dropdown
        
        // Verify format buttons
        await expect(aiBotPage.csvBtn).toBeVisible();
        await expect(aiBotPage.xlsxBtn).toBeVisible();
        await expect(aiBotPage.pdfBtn).toBeVisible();
        console.log('✓ All export format options visible');
      });

      console.log('\n✅ Export modal test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should reorder table columns', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to Data Sources', async () => {
        await aiBotPage.navigateToDataSources();
      });

      await test.step('Test reorder functionality', async () => {
        await safeClick(page);
        
        // Click reorder button
        await aiBotPage.reorderBtn.waitFor({ state: 'visible', timeout: 10000 });
        await aiBotPage.reorderBtn.click();
        
        // Save reorder
        await aiBotPage.saveBtn.click();
        console.log('✓ Reorder saved');
        
        // Test cancel reorder
        await aiBotPage.reorderBtn.click();
        await aiBotPage.cancelBtn.click();
        console.log('✓ Reorder cancelled');
      });

      console.log('\n✅ Reorder table test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  test('Should add a new question', async ({ page }) => {
    const aiBotPage = new AIBot(page);

    try {
      await test.step('Navigate to All Questions', async () => {
        await aiBotPage.navigateToDataSources();
        await safeClick(page);
        // await aiBotPage.answeredQuestionsTab.click()
        await aiBotPage.answeredQuestionsTab.click()
        console.log('✓ Switched to answered tab');
  
        // Verify button is ready
        await expect(aiBotPage.addNewQuestionsBtn).toBeEnabled({timeout:10000});
      });

      await test.step('Open add question modal', async () => {
        await aiBotPage.addNewQuestionsBtn.click();
        await aiBotPage.addQuestionHeader.waitFor({state: 'visible', timeout: 10000});
        await expect(aiBotPage.addQuestionHeader).toContainText(/what are commonly asked questions by customers?/i);
        console.log('✓ Add question modal opened');
      });

      await test.step('Fill and submit question', async () => {
        await aiBotPage.questionField.fill(`Test Question ${Date.now()}`);
        await aiBotPage.answerField.fill(`Test Answer ${Date.now()}`);
        
        await aiBotPage.saveAndCloseBtn.click();
        
        // Wait for success or duplicate message
        await page.waitForTimeout(3000);
        await aiBotPage.alertMessage.waitFor({ state: 'visible', timeout: 10000 });
        const alertText = await aiBotPage.alertMessage.textContent();
        
        await expect(aiBotPage.alert.first()).toContainText(/faq added successfully|already exists/i);
        console.log(`✓ Alert received: ${alertText}`);
      });

      console.log('\n✅ Add new question test passed!');
    } catch (error) {
      console.error('\n❌ Test failed:', error.message);
      throw error;
    }
  });

  // test('Should confirm the Add Source button works', async ({ page }) => {
  //   const aiBotPage = new AIBot(page);

  //   try {
  //     await test.step('Navigate to Data Sources', async () => {
  //       await aiBotPage.navigateToDataSources();
  //     });

  //     await test.step('Open Add Source modal', async () => {
  //       await aiBotPage.addSourceBtn.click();
  //       await expect(aiBotPage.addSourceHeader).toContainText(/train your ai/i);
  //       console.log('✓ Add Source modal opened');
  //     });

  //     await test.step('Select Create Q&A option', async () => {
  //       await safeClick(page);
  //       await aiBotPage.createQandAOption.click();
  //       await expect(aiBotPage.addQuestionHeader).toContainText(/add question and answer/i);
  //       console.log('✓ Create Q&A selected');
  //     });

  //     console.log('\n✅ Add Source button test passed!');
  //   } catch (error) {
  //     console.error('\n❌ Test failed:', error.message);
  //     throw error;
  //   }
  // });

  // test('Should import product file successfully', async ({ page }) => {
  //   const aiBotPage = new AIBot(page);

  //   try {
  //     await test.step('Navigate to Data Sources', async () => {
  //       await aiBotPage.navigateToDataSources();
  //       await safeClick(page);
  //     });

  //     await test.step('Open import product file modal', async () => {
  //       await aiBotPage.addSourceBtn.click();
  //       await expect(aiBotPage.addSourceHeader).toContainText(/train your ai/i);
        
  //       await aiBotPage.importProductFileOption.click();
  //       await expect(aiBotPage.importProductFileHeader).toContainText(/import product file/i);
  //       console.log('✓ Import modal opened');
  //     });

  //     await test.step('Download template and upload file', async () => {
  //       await aiBotPage.downloadTemplateBtn.click();
  //       console.log('✓ Template download initiated');
        
  //       // Upload file
  //       const filePath = 'tests/fixtures/1mb.pdf';
  //       await aiBotPage.uploadFileInput.setInputFiles(filePath);
        
  //       await aiBotPage.importBtn.click();
  //       await page.waitForTimeout(3000);
        
  //       // Wait for success message
  //       await aiBotPage.alertMessage.first().waitFor({ state: 'visible', timeout: 15000 });
  //       await expect(aiBotPage.alertMessage.first()).toContainText(/file imported successfully/i);
  //       console.log('✓ File imported successfully');
  //     });

  //     console.log('\n✅ Import product file test passed!');
  //   } catch (error) {
  //     console.error('\n❌ Test failed:', error.message);
  //     throw error;
  //   }
  // });

  // test('Should display import files table with all columns', async ({ page }) => {
  //   const aiBotPage = new AIBot(page);

  //   try {
  //     await test.step('Navigate to Data Sources', async () => {
  //       await aiBotPage.navigateToDataSources();
  //       await safeClick(page);
  //     });

  //     await test.step('Switch to Import Files tab', async () => {
  //       await aiBotPage.switchToTab('import');
  //       await expect(aiBotPage.batchImportsHeader).toContainText(/all batch imports/i);
  //       console.log('✓ Import Files tab loaded');
  //     });

  //     await test.step('Verify table columns', async () => {
  //       await expect(aiBotPage.idColumn).toBeVisible();
  //       await expect(aiBotPage.fileNameColumn).toBeVisible();
  //       await expect(aiBotPage.createdAtColumn).toBeVisible();
  //       await expect(aiBotPage.productCountColumn).toBeVisible();
  //       await expect(aiBotPage.statusColumn).toBeVisible();
  //       await expect(aiBotPage.actionsColumn).toBeVisible();
  //       console.log('✓ All import table columns visible');
  //     });

  //     console.log('\n✅ Import files table test passed!');
  //   } catch (error) {
  //     console.error('\n❌ Test failed:', error.message);
  //     throw error;
  //   }
  // });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = `tests/screenshots/${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    }
  });
});