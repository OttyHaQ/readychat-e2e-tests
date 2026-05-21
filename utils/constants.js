/**
 * Constants - Centralized configuration for timeouts, delays, and magic numbers
 * This prevents hardcoded values scattered throughout the codebase
 */

/**
 * Timeout configurations (in milliseconds)
 */
export const TIMEOUTS = {
  // Test-level timeouts
  TEST_DEFAULT: 120000,          // 2 minutes - default test timeout
  TEST_EXTENDED: 180000,          // 3 minutes - for complex flows
  TEST_SHORT: 60000,              // 1 minute - for simple tests

  // Navigation timeouts
  NAVIGATION: 30000,              // 30 seconds - page navigation
  NAVIGATION_SLOW: 150000,        // 2.5 minutes - slow navigation (CI)
  NAVIGATION_RETRY: 30000,        // 30 seconds - navigation retry attempts

  // Element interaction timeouts
  ELEMENT_VISIBLE: 10000,         // 10 seconds - element visibility
  ELEMENT_ATTACHED: 10000,        // 10 seconds - element attached to DOM
  ELEMENT_ACTION: 100000,         // 100 seconds - element action (click, fill)
  ELEMENT_ACTION_CI: 150000,      // 150 seconds - element action in CI

  // Expect/Assertion timeouts
  EXPECT_DEFAULT: 20000,          // 20 seconds - default expect timeout
  EXPECT_CI: 30000,               // 30 seconds - expect timeout in CI

  // Short timeouts
  SHORT: 5000,                    // 5 seconds - short wait
  VERY_SHORT: 3000,               // 3 seconds - very short wait
  QUICK: 2000,                    // 2 seconds - quick check

  // Delays (avoid using these unless absolutely necessary)
  DELAY_COOKIE_DISMISS: 500,      // Cookie banner dismiss delay
  DELAY_FORM_SUBMISSION: 500,     // Form field fill delay
  DELAY_RETRY: 2000,              // Delay between retry attempts
};

/**
 * Retry configurations
 */
export const RETRIES = {
  CI: 2,                          // Number of retries in CI
  LOCAL: 2,                       // Number of retries locally
  NAVIGATION_ATTEMPTS: 3,         // Max navigation retry attempts
};

/**
 * Worker/Parallel execution configurations
 */
export const WORKERS = {
  CI: 1,                          // Workers in CI (set to 1 for stability, increase for speed)
  LOCAL: 4,                       // Workers locally for parallel execution
};

/**
 * Test data constants
 */
export const TEST_DATA = {
  DEFAULT_PASSWORD: 'P@ssword01',
  EMAIL_DOMAIN: '@mailinator.com',
};

/**
 * Browser configurations
 */
export const BROWSER = {
  VIEWPORT_WIDTH: 1920,
  VIEWPORT_HEIGHT: 1080,
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
};

/**
 * Report configurations
 */
export const REPORT = {
  RETENTION_DAYS: 30,
};

/**
 * Helper function to get timeout based on environment
 * @param {number} localTimeout - Timeout for local environment
 * @param {number} ciTimeout - Timeout for CI environment
 * @returns {number} Appropriate timeout based on environment
 */
export function getTimeout(localTimeout, ciTimeout) {
  return process.env.CI ? ciTimeout : localTimeout;
}

/**
 * Helper function to get worker count based on environment
 * @returns {number} Number of workers
 */
export function getWorkers() {
  return process.env.CI ? WORKERS.CI : WORKERS.LOCAL;
}

/**
 * Helper function to get retry count based on environment
 * @returns {number} Number of retries
 */
export function getRetries() {
  return process.env.CI ? RETRIES.CI : RETRIES.LOCAL;
}
