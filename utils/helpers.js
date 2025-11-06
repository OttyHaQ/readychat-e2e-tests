import { expect } from '@playwright/test';

export function fullUrl(path) {
  return `${process.env.BASE_URL}${path}`;
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
