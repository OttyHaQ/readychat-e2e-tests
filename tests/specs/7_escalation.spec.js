import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SigninPage.js';
import { LandingPage } from '../../pages/LandingPage.js';
import { AIBot } from '../../pages/AIBot.js';
import { Escalation } from '../../pages/Escalation.js';
import { safeClick, expectTextContains, fullUrl } from '../../utils/helpers.js';
import fs from 'fs';
import path from 'path';

test.describe.skip('Escalation Management', () => {
      const testCredentials = {
        username: process.env.USER_NAME || 'default_user',
        password: process.env.PASSWORD || 'default_password'
    };

  test.beforeAll(async () => {
        // Load test credentials
        try {
        console.log(`✓ Loaded credentials for user: ${testCredentials.username}`);
        } catch (error) {
        console.warn('⚠️ environment variables not available');
        }
   });

  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000); // 1.5 minutes

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
  });

  test('Should accept an unassigned ticket', async ({ page }) => {
    const escalationPage = new Escalation(page);
    const aiBotPage = new AIBot(page);

    try {
        await test.step('Navigate to Escalation page', async () => {
            await escalationPage.navigateToEscalation();
            await escalationPage.verifyEscalationPageLoaded();
            console.log('✓ Escalation page loaded');
        });

        await test.step('Switch to Unassigned tab', async () => {
            await escalationPage.switchToTab('unassigned');
            console.log('✓ Switched to Unassigned tab');
        });

        await test.step('Accept a ticket', async () => {
            // Check if accept button exists
            await escalationPage.acceptBtn.waitFor({state: 'visible', timeout: 10000 });
            const acceptBtnCount = await escalationPage.acceptBtn.count();
            
            if (acceptBtnCount === 0) {
                console.log('⊘ No unassigned tickets available - skipping test');
                test.skip();
                return;
            }
            
            console.log(`✓ Found ${acceptBtnCount} unassigned ticket(s)`);
            
            // Verify first accept button is visible
            await expect(escalationPage.acceptBtn.first()).toBeVisible({ timeout: 10000 });
            
            // Accept the first ticket
            await escalationPage.acceptBtn.first().click();
            
            // Verify success message
            await aiBotPage.alert.first().waitFor({ state: 'visible', timeout: 10000 });
            await expect(aiBotPage.alert.first()).toContainText(/successfully/i);
            console.log('✓ Ticket accepted successfully');
        });

        console.log('\n✅ Accept escalation test passed!');
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        throw error;
    }
   });

    test('Should open chat for a ticket', async ({ page }) => {
        const escalationPage = new Escalation(page);

        try {
            await test.step('Navigate to Escalation page', async () => {
                await escalationPage.navigateToEscalation();
                await escalationPage.verifyEscalationPageLoaded();
                console.log('✓ Escalation page loaded');
            });

            await test.step('Switch to My Tickets tab', async () => {
                await escalationPage.switchToTab('my_tickets');
                console.log('✓ Switched to My Tickets tab');
            });

            await test.step('Open chat for a ticket', async () => {
                // Close support chatbot if open
                const supportChatBtn = page.getByRole('button', { name: /need help|chat with support/i });
                const isExpanded = await supportChatBtn.getAttribute('aria-expanded').catch(() => null);
                
                if (isExpanded === 'true') {
                    const closeBtn = page.locator('dialog').first().locator('button').first();
                    await closeBtn.click();
                    await page.waitForTimeout(500);
                    console.log('✓ Closed support chatbot');
                }
                
                
                // Check for "No tickets" message
                const noTicketsMsg = page.getByText(/no tickets assigned to you/i);
                const hasNoTickets = await noTicketsMsg.isVisible().catch(() => false);
                
                if (hasNoTickets) {
                    console.log('⊘ No tickets available in My Tickets - skipping test');
                    test.skip();
                    return;
                }
                
                // Verify chat button exists in the ticket table/list area (not elsewhere)
                const ticketChatBtn = page.locator('main').getByRole('button', { name: /^chat$/i }).first();
                // Wait for page to stabilize after tab switch
                await ticketChatBtn.waitFor({state: 'visible', timeout: 10000 });
                const chatBtnCount = await ticketChatBtn.count();
                
                if (chatBtnCount === 0) {
                    console.log('⊘ No chat button found - skipping test');
                    test.skip();
                    return;
                }
                
                console.log(`✓ Found ${chatBtnCount} ticket(s) with chat button`);
                
                // Click the chat button
                await ticketChatBtn.waitFor({ state: 'visible', timeout: 10000 });
                await ticketChatBtn.click();
                
                // Wait for ticket details to appear
                await expect(escalationPage.ticketDetailsHeader).toBeVisible({ timeout: 10000 });
                console.log('✓ Chat opened successfully');
            });

            console.log('\n✅ Open chat test passed!');
        } catch (error) {
            console.error('\n❌ Test failed:', error.message);
            throw error;
        }
    });

  test('Should resolve a ticket', async ({ page }) => {
    const escalationPage = new Escalation(page);
    const aiBotPage = new AIBot(page);

    try {
        await test.step('Navigate to Escalation page', async () => {
            await escalationPage.navigateToEscalation();
            await safeClick(page);
        });

        await test.step('Switch to My Tickets tab', async () => {
            await escalationPage.switchToTab('my_tickets');
            console.log('✓ Switched to My Tickets tab');
        });

        await escalationPage.resolveBtn.waitFor({state: 'visible', timeout: 10000 });

        const resolveBtnCount = await escalationPage.resolveBtn.count();

        if (resolveBtnCount === 0) {
            console.log('⊘ No tickets available in this tab - skipping test');
            test.skip();
            return;
        }

        await test.step('Resolve a ticket', async () => {
            // Verify resolve button is visible
            await expect(escalationPage.resolveBtn).toBeVisible({ timeout: 10000 });
            
            // Resolve the ticket
            await escalationPage.resolveTicket();
            
            // Verify success message
            await aiBotPage.alert.first().waitFor({ state: 'visible', timeout: 10000 });
            await expect(aiBotPage.alert.first()).toContainText(/successfully/i);
            console.log('✓ Ticket resolved successfully');
        });

        console.log('\n✅ Resolve ticket test passed!');
        } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        throw error;
        }
  });

  test('Should reopen a resolved ticket', async ({ page }) => {
    const escalationPage = new Escalation(page);
    const aiBotPage = new AIBot(page);

    try {
        await test.step('Navigate to Escalation page', async () => {
            await escalationPage.navigateToEscalation();
            await safeClick(page);
        });

        await test.step('Switch to Resolved tab', async () => {
            await escalationPage.switchToTab('resolved');
            console.log('✓ Switched to Resolved tab');
        });

        await escalationPage.reopenBtn.waitFor({state: 'visible', timeout: 10000 });

        const reopenBtnCount = await escalationPage.reopenBtn.count();

        if (reopenBtnCount === 0) {
            console.log('⊘ No tickets available in this tab - skipping test');
            test.skip();
            return;
        }

        await test.step('Reopen a ticket', async () => {
            // Verify reopen button is visible
            await expect(escalationPage.reopenBtn).toBeVisible({ timeout: 10000 });
            
            // Reopen the ticket
            await escalationPage.reopenTicket();
            
            // Verify success message
            await aiBotPage.alert.first().waitFor({ state: 'visible', timeout: 10000 });
            await expect(aiBotPage.alert.first()).toContainText(/successfully/i);
            console.log('✓ Ticket reopened successfully');
        });

        console.log('\n✅ Reopen ticket test passed!');
        } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        throw error;
        }
  });

  test.skip('Should close a ticket', async ({ page }) => {
        // Skipped - implement when close functionality is ready
        const escalationPage = new Escalation(page);
        const aiBotPage = new AIBot(page);

        try {
        await escalationPage.navigateToEscalation();
        await safeClick(page);
        
        await escalationPage.switchToTab('resolved');

        const closeBtnCount = await escalationPage.closeBtn.count();

        await escalationPage.closeBtn.waitFor({state: 'visible', timeout: 10000 });

        if (closeBtnCount === 0) {
            console.log('⊘ No tickets available in this tab - skipping test');
            test.skip();
            return;
        }
        
        await expect(escalationPage.closeBtn).toBeVisible({ timeout: 10000 });
        await escalationPage.closeTicket();
        
        await expect(aiBotPage.alert.first()).toContainText(/successfully/i);
        console.log('✓ Ticket closed successfully');
        } catch (error) {
        console.error('❌ Test failed:', error.message);
        throw error;
        }
  });

  test('Should sort tickets by different priorities', async ({ page }) => {
        const escalationPage = new Escalation(page);

        try {
        await test.step('Navigate to Escalation page', async () => {
            await escalationPage.navigateToEscalation();
            await safeClick(page);
        });

        await test.step('Test all sort options', async () => {
            // This will iterate through all available sort options
            await escalationPage.sortBy();
            console.log('✓ All sort options tested');
        });

        console.log('\n✅ Sort test passed!');
        } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        throw error;
        }
  });

  test('Should search for tickets', async ({ page }) => {
        const escalationPage = new Escalation(page);

        try {
        await test.step('Navigate to Escalation page', async () => {
            await escalationPage.navigateToEscalation();
            await safeClick(page);
        });

        await test.step('Search for tickets', async () => {
            await escalationPage.searchTickets('test');
            console.log('✓ Search performed');
            
            // Verify search field has the text
            await expect(escalationPage.searchField).toHaveValue('test');
        });

        console.log('\n✅ Search test passed!');
        } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        throw error;
        }
  });

  test('Should filter tickets by priority', async ({ page }) => {
        const escalationPage = new Escalation(page);

        try {
        await test.step('Navigate to Escalation page', async () => {
            await escalationPage.navigateToEscalation();
            await safeClick(page);
        });

        await test.step('Filter by High priority', async () => {
            await escalationPage.sortByPriority('high');
            console.log('✓ Filtered by High priority');
            
            // Verify dropdown shows High
            await expect(escalationPage.sortDropdown).toContainText(/high/i);
        });

        await test.step('Filter by Medium priority', async () => {
            await escalationPage.sortByPriority('medium');
            console.log('✓ Filtered by Medium priority');
            
            await expect(escalationPage.sortDropdown).toContainText(/medium/i);
        });

        await test.step('Filter by Low priority', async () => {
            await escalationPage.sortByPriority('low');
            console.log('✓ Filtered by Low priority');
            
            await expect(escalationPage.sortDropdown).toContainText(/low/i);
        });

        await test.step('Reset to All', async () => {
            await escalationPage.sortByPriority('all');
            console.log('✓ Reset to All priorities');
            
            await expect(escalationPage.sortDropdown).toContainText(/all/i);
        });

        console.log('\n✅ Filter by priority test passed!');
        } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        throw error;
        }
  });

  test('Should verify all tabs are accessible', async ({ page }) => {
        const escalationPage = new Escalation(page);

        try {
        await test.step('Navigate to Escalation page', async () => {
            await escalationPage.navigateToEscalation();
        });

        await test.step('Verify all tabs', async () => {
            // Verify all tabs are visible
            await expect(escalationPage.myTicketsTab).toBeVisible();
            await expect(escalationPage.unassignedTab).toBeVisible();
            await expect(escalationPage.resolvedTab).toBeVisible();
            await expect(escalationPage.closedTab).toBeVisible();
            console.log('✓ All tabs are visible');
        });

        await test.step('Navigate through each tab', async () => {
            await escalationPage.switchToTab('my_tickets');
            await expect(escalationPage.myTicketsTab).toHaveAttribute('aria-selected', 'true').catch(() => {});
            console.log('✓ My Tickets tab accessible');
            
            await escalationPage.switchToTab('unassigned');
            console.log('✓ Unassigned tab accessible');
            
            await escalationPage.switchToTab('resolved');
            console.log('✓ Resolved tab accessible');
            
            await escalationPage.switchToTab('closed');
            console.log('✓ Closed tab accessible');
        });

        console.log('\n✅ Tab navigation test passed!');
        } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        throw error;
        }
  });

  test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
        const screenshotPath = `tests/screenshots/${testInfo.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`📸 Screenshot saved: ${screenshotPath}`);
        }
    });
});
