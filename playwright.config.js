import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.env}` });

if (!process.env.BASE_URL) {
    throw new Error(`BASE_URL is not defined. Check your .env.${process.env.env} file`);
}

export default defineConfig({
    testDir: './tests/specs',
    timeout: 1120000,
    expect: {
        timeout: 30000,
    },
    use: {
        headless: process.env.CI ? true : false,
        baseURL: process.env.BASE_URL,
        actionTimeout: 150000, 
        navigationTimeout: 150000,

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
        ['html', { open: process.env.CI ? 'never' : 'always' }],
        ['list'],
    ],
});

