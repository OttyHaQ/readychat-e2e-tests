import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.ENV}` });

export default defineConfig({
    testDir: './tests/specs',
    timeout: 1120000,
    expect: {
    timeout: 12000,
    },
    use: {
        headless: false,
        baseURL: process.env.BASE_URL,
        actionTimeout: 120000, 
        navigationTimeout: 120000, 
        reporter: [['html', { open: 'never' }]],
        viewport: null,              // disables the default viewport
        launchOptions: {
            args: ['--start-maximized'],
            // slowMo: 1000
        }
    },
    reporter:[
        ['html', {open: 'always'}],
        ['list'],
    ],
});

