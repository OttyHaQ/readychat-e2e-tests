import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.env}` });

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
        viewport: process.env.CI ? { width: 1280, height: 720 } : null,              // disables the default viewport
        launchOptions: {
            args: process.env.CI ? [] : ['--start-maximized'],
            // slowMo: 1000
        }
    },
    reporter: [
        ['html', { open: process.env.CI ? 'never' : 'always' }],
        ['list'],
    ],
});
