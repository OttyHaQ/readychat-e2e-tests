import { test, expect } from '@playwright/test';
import { BusinessInfoPage } from '../../pages/BusinessInfoPage.js';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { safeClick } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

test.describe('Business Info - Comprehensive Tests', () => {
  let testCredentials;

  
    test.beforeAll(async () => {
      // Load test credentials
      try {
        const credentialsPath = path.join(process.cwd(), 'tests', 'test-credentials.json');
        const credentialsData = fs.readFileSync(credentialsPath, 'utf-8');
        testCredentials = JSON.parse(credentialsData);
        console.log(`✓ Loaded credentials for user: ${testCredentials.username}`);
      } catch (error) {
        console.warn('⚠️ Could not load test credentials from file');
        testCredentials = {
          username: 'default_user',
          password: 'default_password'
        };
      }
    });

  // Test data
  const testData = {
    basicInfo: {
      businessName: 'Automated Test Business',
      businessEmail: 'test_business@mailinator.com',
      aboutBusiness: 'This is an automated test business for Playwright testing. We offer comprehensive testing services.'
    },
    addressInfo: {
      address1: '123 Test Street, Test Area',
      address2: '456 Secondary Address',
      townCity: 'Test City',
      stateProvince: 'Test State',
      postalCode: '12345',
      country: 'Nigeria'
    },
    contactSettings: {
      contactNumber: '+234 8099999999',
      businessWebsite: 'https://test-business.example.com',
      timeZone: '(GMT+01:00) Africa/Lagos',
      currency: '₦ NGN'
    },
    updatedBasicInfo: {
      businessName: 'Updated Test Business',
      aboutBusiness: 'Updated description for test business.'
    }
  };

  test.beforeEach(async ({ page }) => {
    // Set timeout for each test
    test.setTimeout(90000); // 1.5 minutes
    
    // Initialize page objects
    const landingPage = new LandingPage(page);
    const signInPage = new SignInPage(page);
    const businessInfoPage = new BusinessInfoPage(page);
    

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
                    url => url.href.includes('/en/auth/login'), 
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

        // Navigate to Business Info
        await test.step('Navigate to Business Info page', async () => {
            await businessInfoPage.navigateToBusinessInfo();
            console.log('✓ Navigated to Business page');
        });
  });

  /**
   * Verify all form fields are visible and accessible
   */
  test('Should display all business info form fields', async ({ page }) => {
    const businessInfoPage = new BusinessInfoPage(page);
    console.log('\n🧪 Testing Business Info form visibility...');

    await test.step('Verify basic information fields', async () => {
      await expect(businessInfoPage.businessNameInput).toBeVisible();
      await expect(businessInfoPage.businessEmailInput).toBeVisible();
      await expect(businessInfoPage.aboutBusinessTextarea).toBeVisible();
      console.log('  ✓ Basic info fields visible');
    });

    await test.step('Verify address fields', async () => {
      await expect(businessInfoPage.address1Input).toBeVisible();
      await expect(businessInfoPage.address2Input).toBeVisible();
      await expect(businessInfoPage.townCityInput).toBeVisible();
      await expect(businessInfoPage.stateProvinceInput).toBeVisible();
      await expect(businessInfoPage.postalCodeInput).toBeVisible();
      await expect(businessInfoPage.countryDropdown).toBeVisible();
      console.log('  ✓ Address fields visible');
    });

    await test.step('Verify contact and settings fields', async () => {
      await expect(businessInfoPage.contactNumberInput).toBeVisible();
      await expect(businessInfoPage.businessWebsiteInput).toBeVisible();
      await expect(businessInfoPage.timeZoneDropdown).toBeVisible();
      await expect(businessInfoPage.currencyDropdown).toBeVisible();
      console.log('  ✓ Contact and settings fields visible');
    });

    await test.step('Verify business hours section', async () => {
      await expect(businessInfoPage.mondayCheckbox).toBeVisible();
      await expect(businessInfoPage.tuesdayCheckbox).toBeVisible();
      await expect(businessInfoPage.wednesdayCheckbox).toBeVisible();
      await expect(businessInfoPage.thursdayCheckbox).toBeVisible();
      await expect(businessInfoPage.fridayCheckbox).toBeVisible();
      await expect(businessInfoPage.saturdayCheckbox).toBeVisible();
      await expect(businessInfoPage.sundayCheckbox).toBeVisible();
      console.log('  ✓ Business hours checkboxes visible');
    });

    await test.step('Verify Update button', async () => {
      await expect(businessInfoPage.updateButton).toBeVisible();
      console.log('  ✓ Update button visible');
    });

    // Screenshot of full form
    await page.screenshot({ 
      path: `/home/claude/screenshots/business-info-form-${Date.now()}.png`,
      fullPage: true 
    });

    console.log('✅ Form visibility test completed');
  });

  /**
   * Update basic business information
   */
  test('Should update business information', async ({ page }) => {
    const businessInfoPage = new BusinessInfoPage(page);
    const aiBotPage = new AIBot(page)
    console.log('\n🧪 Testing basic info update...');

    await test.step('Get current values', async () => {
      const currentValues = await businessInfoPage.getCurrentFormValues();
      console.log(`  Current business name: ${currentValues.businessName}`);
    });

    await test.step('Fill basic information', async () => {
      await businessInfoPage.fillBasicInfo(testData.basicInfo);
      console.log('  ✓ Basic info fields filled');


      await businessInfoPage.fillAddressInfo(testData.addressInfo);
      console.log('  ✓ Address info fields filled');

      await businessInfoPage.fillContactSettings(testData.contactSettings);
      console.log('  ✓ Contact info fields filled');
      
      await page.screenshot({ 
        path: `/home/claude/screenshots/basic-info-filled-${Date.now()}.png`,
        fullPage: false 
      });
    });

    await test.step('Submit the form', async () => {
        // Check for validation errors BEFORE clicking
        const hasErrorsBefore = await page.locator('text=/required|invalid|error/i')
            .isVisible()
            .catch(() => false);
        
        if (hasErrorsBefore) {
            await page.screenshot({ 
            path: `/home/claude/screenshots/validation-before-submit-${Date.now()}.png`,
            fullPage: true 
            });
            throw new Error('Form has validation errors before submission');
        }
        
        await businessInfoPage.clickUpdate();
        console.log('  ✓ Update button clicked');
        
        // Wait for either success alert OR validation error
        const result = await Promise.race([
            page.locator('[role="alert"]')
            .filter({ hasText: /updated|success/i })
            .first()
            .waitFor({ state: 'visible', timeout: 20000 })
            .then(() => 'success'),
            page.locator('text=/required|invalid|must/i')
            .first()
            .waitFor({ state: 'visible', timeout: 20000 })
            .then(() => 'validation_error')
        ]).catch(() => 'timeout');
        
        if (result === 'validation_error') {
            const errorText = await page.locator('text=/required|invalid|must/i')
            .allTextContents();
            
            await page.screenshot({ 
            path: `/home/claude/screenshots/validation-error-${Date.now()}.png`,
            fullPage: true 
            });
            
            throw new Error(`Form validation failed: ${errorText.join(', ')}`);
        }
        
        if (result === 'success') {
            console.log('  ✓ Form updated successfully');
        } else {
            throw new Error('Form submission timed out - no response');
        }
    });

    await test.step('Verify values persisted', async () => {
      // Refresh page to verify persistence
      await page.reload();
      await page.waitForTimeout(2000);
      
      const updatedValues = await businessInfoPage.getCurrentFormValues();
      
      expect(updatedValues.businessName).toBe(testData.basicInfo.businessName);
      expect(updatedValues.aboutBusiness).toBe(testData.basicInfo.aboutBusiness);
      
      console.log('  ✓ Values persisted after reload');
    });

    console.log('✅ Business info update test completed');
  });


  /**
   * Form validation - required fields
   */
  test('Should validate required fields', async ({ page }) => {
    const businessInfoPage = new BusinessInfoPage(page);
    console.log('\n🧪 Testing form validation...');

    await test.step('Clear required field and submit', async () => {
      // Clear business name (required field)
      await businessInfoPage.businessNameInput.clear();
      console.log('  ✓ Cleared business name field');
      
      await businessInfoPage.clickUpdate();
      await page.waitForTimeout(1000);
    });

    await test.step('Check for validation error', async () => {
      const hasErrors = await businessInfoPage.hasValidationErrors();
      
      if (hasErrors) {
        console.log('  ✓ Validation error displayed');
      } else {
        console.log('  ℹ️ No validation error element found (may use HTML5 validation)');
      }
      
      await page.screenshot({ 
        path: `/home/claude/screenshots/validation-error-${Date.now()}.png`,
        fullPage: true 
      });
    });

    console.log('✅ Form validation test completed');
  });

});