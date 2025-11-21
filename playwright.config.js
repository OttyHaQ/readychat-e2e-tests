import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Define env with fallback
const environment = process.env.env || 'qa';

dotenv.config({ path: `.env.${environment}` });

if (!process.env.BASE_URL) {
    throw new Error(`BASE_URL is not defined. Check your .env.${environment} file`);
}

export default defineConfig({
    testDir: './tests/specs',
    workers: process.env.CI ? undefined : undefined,
    timeout: process.env.CI ? 1120000 : 1120000,
    expect: {
        timeout: process.env.CI ? 30000 : 20000,
    },

    retries: process.env.CI ? 3 : 1,

    use: {
        headless: process.env.CI ? true : true,
        // @ts-ignore
        baseURL: process.env.BASE_URL,
        actionTimeout: process.env.CI ? 150000 : 100000, 
        navigationTimeout: process.env.CI ? 150000 : 100000,

        // Anti-bot detection settings
        viewport: process.env.CI ? { width: 1920, height: 1080 } : null, // disables the default viewport
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',              
        
        launchOptions: {
            args: process.env.CI ? [
                '--disable-blink-features=AutomationControlled',  // Hide automation
                '--disable-dev-shm-usage',
                '--no-sandbox',
            ] : ['--start-maximized'],
        },

        // Add realistic browser behavior
        extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        },
    },
    // Use Chromium with specific settings to avoid detection
    projects: [
        {
            name: 'chromium',
            use: { 
                ...devices['Desktop Chrome'],

                // Override some automation flags
                contextOptions: {
                    javaScriptEnabled: true,
                }
            },
        },
    ],

    reporter: [
        ['html', { open: !process.env.CI ? 'always' : 'never' }],
        ['list'],
    ],
});