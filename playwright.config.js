import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.ENV}` });

export default defineConfig({
    testDir: './tests/specs',
    timeout: 1120000,
    expect: {
        timeout: 30000,
    },
    use: {
        headless: false,
        baseURL: process.env.BASE_URL,
        actionTimeout: 150000, 
        navigationTimeout: 150000,
        viewport: null,              // disables the default viewport
        launchOptions: {
            args: ['--start-maximized'],
            // slowMo: 1000
        }
    },
    reporter: [
        ['html', { open: 'always' }],
        ['list'],
    ],
});
