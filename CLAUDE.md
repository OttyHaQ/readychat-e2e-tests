# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Running Tests
```bash
npm test                        # Run all tests (uses qa env by default)
npm run test:smoke              # Smoke tests only (@smoke tag)
npm run test:critical           # Critical tests only (@critical tag)
npm run test:regression         # Full regression suite (@regression tag)

# Run a specific spec file
npx playwright test tests/specs/8_orders.spec.js

# Run with a specific environment
env=prod npx playwright test
env=dev npx playwright test

# Run with grep pattern
npx playwright test --grep "Should cancel an order"

# Run in headed mode (for local debugging)
npx playwright test --headed

# Run in UI mode (interactive test runner)
npx playwright test --ui

# Show last HTML report
npx playwright show-report

# Run MCP server (for AI tool integrations)
npm run mcp-server
```

### Setup
```bash
npm ci
npx playwright install --with-deps chromium
```

Environment files (`.env.dev`, `.env.qa`, `.env.prod`) must exist with at minimum `BASE_URL`, `USER_NAME`, and `PASSWORD` variables.

## Architecture

### Project Type
Playwright end-to-end test automation suite for the ReadyChatAI web application. All code is ESM (`"type": "module"`).

### Test Execution Order (Critical)
Tests are split into three Playwright **projects** with explicit dependencies in `playwright.config.js`:
1. **`signup`** — runs `1_signup.spec.js` first; creates a new user, saves credentials to `tests/test-credentials.json`
2. **`new-user-tests`** — runs `2_signin.spec.js` and `3_channels.spec.js` using credentials from `test-credentials.json`; depends on `signup`
3. **`env-user-tests`** — runs all other specs using `.env.*` credentials; depends on `signup`

Never run `2_signin.spec.js` or `3_channels.spec.js` in isolation without first running the signup project, as they rely on the generated credentials file.

### Directory Structure
- `tests/specs/` — Test specs numbered by execution order (`1_signup.spec.js` → `15_businessInfo.spec.js`)
- `tests/fixtures/auth.fixture.js` — Extends Playwright's `test` with `authenticatedPage` and `credentials` fixtures (auto-login before each test)
- `tests/fixtures/` — Static files: `office_1.jpg`, `curtains.csv`, `1mb.pdf` used in upload tests
- `tests/test-credentials.json` — Generated at runtime by the signup test; **do not commit**
- `pages/` — Page Object Model classes (one per app page/section)
- `utils/constants.js` — Centralized timeout, retry, worker, and browser constants
- `utils/helpers.js` — Shared utilities: `navigateWithRetry`, `safeClick` (cookie banner dismissal), `expectTextContains`, `fullUrl`
- `mcp-server.js` — MCP server exposing Playwright tools (`run_tests`, `list_tests`, `read_test`, etc.) to AI assistants

### Page Object Pattern
Every page in `pages/` follows the same structure:
- Constructor defines all locators as `this.*` properties
- Methods perform multi-step interactions (e.g., `addNewProduct()`, `editCategory()`)
- Locators use `.or()` chaining to handle UI variations and multiple selector strategies

### Credentials Resolution (Auth Fixture)
`tests/fixtures/auth.fixture.js` resolves credentials in priority order:
1. `USER_NAME` / `PASSWORD` environment variables
2. `tests/test-credentials.json` (created by signup test)
3. Hardcoded fallback (for local dev only)

### CI/CD
- `.github/workflows/playwright.yml` runs on push/PR to main/develop, manual dispatch (with environment selection), and daily at 13:00 UTC
- Environments (`dev`/`qa`/`prod`) are injected as GitHub Secrets (`ENV_DEV`, `ENV_QA`, `ENV_PROD`)
- CI uses 1 worker; local uses 4 workers (configured in `playwright.config.js`)
- HTML report is deployed to GitHub Pages after every run on `main`

### Test Tags
- `@smoke` — Critical user flows
- `@critical` — Business-critical features
- `@regression` — Full suite
- `@integration` — Integration tests

### Timeout Constants
All timeouts come from `utils/constants.js`. Key values:
- `TIMEOUTS.ELEMENT_VISIBLE` — 10s (element visibility checks)
- `TIMEOUTS.NAVIGATION` — 30s (local), `TIMEOUTS.NAVIGATION_SLOW` — 150s (CI)
- `TIMEOUTS.TEST_DEFAULT` — 120s per test
- Avoid `page.waitForTimeout()` except where explicitly necessary; prefer event-driven waits
