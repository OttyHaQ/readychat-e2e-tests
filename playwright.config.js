import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';
import { TIMEOUTS, BROWSER } from './utils/constants.js';

const environment = process.env.env || 'qa';

dotenv.config({ path: `.env.${environment}` });

if (!process.env.BASE_URL) {
    throw new Error(`BASE_URL is not defined. Check your .env.${environment} file`);
}

const testDir = defineBddConfig({
    features: 'tests/features/**/*.feature',
    steps: 'tests/step-definitions/**/*.steps.js',
});

export default defineConfig({
    testDir,

    workers: process.env.CI ? 1 : 4,

    timeout: TIMEOUTS.TEST_DEFAULT,
    expect: {
        timeout: process.env.CI ? TIMEOUTS.EXPECT_CI : TIMEOUTS.EXPECT_DEFAULT,
    },

    retries: process.env.CI ? 2 : 2,

    fullyParallel: true,

    use: {
        headless: process.env.CI ? true : true,
        baseURL: process.env.BASE_URL,
        actionTimeout: process.env.CI ? TIMEOUTS.ELEMENT_ACTION_CI : TIMEOUTS.ELEMENT_ACTION,
        navigationTimeout: process.env.CI ? TIMEOUTS.NAVIGATION_SLOW : TIMEOUTS.NAVIGATION,

        viewport: process.env.CI ? { width: BROWSER.VIEWPORT_WIDTH, height: BROWSER.VIEWPORT_HEIGHT } : null,
        userAgent: BROWSER.USER_AGENT,

        launchOptions: {
            args: process.env.CI ? [
                '--disable-blink-features=AutomationControlled',
                '--disable-dev-shm-usage',
                '--no-sandbox',
            ] : ['--start-maximized'],
        },

        extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9',
        },
    },

    projects: [
        // Project 1: Signup - runs FIRST, creates user, saves to test-credentials.json
        {
            name: 'signup',
            grep: /@signup/,
            use: {
                ...devices['Desktop Chrome'],
                contextOptions: {
                    javaScriptEnabled: true,
                },
            },
        },
        // Project 2: Signin & Channels - use credentials from test-credentials.json
        {
            name: 'new-user-tests',
            grep: /@new-user-test/,
            use: {
                ...devices['Desktop Chrome'],
                contextOptions: {
                    javaScriptEnabled: true,
                },
            },
            dependencies: ['signup'],
        },
        // Project 3: All other tests - use environment credentials from .env files
        {
            name: 'env-user-tests',
            grepInvert: /@signup|@new-user-test/,
            use: {
                ...devices['Desktop Chrome'],
                contextOptions: {
                    javaScriptEnabled: true,
                },
            },
            dependencies: ['signup'],
        },
    ],

    reporter: [
        ['html', { open: !process.env.CI ? 'always' : 'never' }],
        ['list'],
    ],
});
