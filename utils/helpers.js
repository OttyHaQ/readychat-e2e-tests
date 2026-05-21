import { expect } from '@playwright/test';
import { TIMEOUTS, RETRIES } from './constants.js';

export function fullUrl(path) {
  return `${process.env.BASE_URL}${path}`;
}

/**
 * Navigate with retry logic to handle flaky navigations
 * @param {Page} page - Playwright page object
 * @param {string} urlPattern - URL pattern to wait for
 * @param {Function} clickAction - Async function that performs the click action
 * @param {number} maxAttempts - Maximum retry attempts (default: 3)
 * @returns {Promise<void>}
 */
export async function navigateWithRetry(page, urlPattern, clickAction, maxAttempts = RETRIES.NAVIGATION_ATTEMPTS) {
  let navigationSuccess = false;
  let attempts = 0;

  while (!navigationSuccess && attempts < maxAttempts) {
    attempts++;

    try {
      const navigationPromise = page.waitForURL(
        url => typeof urlPattern === 'string'
          ? url.href.includes(urlPattern)
          : urlPattern(url),
        { timeout: TIMEOUTS.NAVIGATION_RETRY }
      );

      await clickAction();
      await navigationPromise;

      // Verify navigation
      const currentUrl = page.url();
      const urlToCheck = typeof urlPattern === 'string' ? urlPattern : 'expected URL';
      if (typeof urlPattern === 'string' ? currentUrl.includes(urlPattern) : true) {
        navigationSuccess = true;
        console.log(`✓ Navigation successful (attempt ${attempts})`);
      }
    } catch (error) {
      if (attempts === maxAttempts) {
        throw new Error(`Failed to navigate after ${maxAttempts} attempts: ${error.message}`);
      }
      console.log(`⚠️ Navigation attempt ${attempts} failed, retrying...`);
      await page.waitForTimeout(TIMEOUTS.DELAY_RETRY);
    }
  }
}


export async function safeClick(page) {
  const denyBtn = page.locator('button:has-text("Deny"), #CybotCookiebotDialogBodyButtonDecline');
  const cookieDialog = page.locator('#CybotCookiebotDialog');

  if (await cookieDialog.isVisible({ timeout: 5000 }).catch(() => false)) {
    if (await denyBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await denyBtn.click();
      console.log('Cookie banner dismissed.');
    }
  }
}

/**
 * Assert that a locator's text contains the expected string,
 * ignoring case and trimming whitespace.
 *
 * @param {Locator} locator - Playwright locator
 * @param {string} expected - Expected text to contain
 */
export async function expectTextContains(locator, expected) {
  try {
    await locator.waitFor({ state: 'attached', timeout: 10000 });
    await locator.waitFor({ state: 'visible', timeout: 10000 });

    const text = (await locator.textContent() || '').trim().toLowerCase();

    if (Array.isArray(expected)) {
      const lowered = expected.map(e => String(e).toLowerCase());
      expect(lowered.some(e => text.includes(e))).toBeTruthy();
    } else {
      expect(text).toContain(String(expected).toLowerCase());
    }

  } catch (err) {
    throw new Error(`Expected alert message not found within timeout. Details: ${err.message}`);
  }
}
