import { expect } from '@playwright/test';

export function fullUrl(path) {
  return `${process.env.BASE_URL}${path}`;
}


export async function safeClick(locator, options = {}) {
  try {
      await locator.waitFor({ state: 'visible', timeout: options.timeout ?? 5000 });
      await locator.click(options);
      return true; // clicked
  } catch {
  
  }
  return false; // not clicked
}

/**
 * Assert that a locator's text contains the expected string,
 * ignoring case and trimming whitespace.
 *
 * @param {Locator} locator - Playwright locator
 * @param {string} expected - Expected text to contain
 */
export async function expectTextContains(locator, expected) {
  const text = (await locator.textContent() || '').trim().toLowerCase();
  
  if (Array.isArray(expected)) {
    const lowered = expected.map(e => String(e).toLowerCase());
    expect(lowered.some(e => text.includes(e))).toBeTruthy();
  } else {
    expect(text).toContain(String(expected).toLowerCase());
  }
}
