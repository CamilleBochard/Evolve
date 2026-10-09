import { expect, test, type Page } from '@playwright/test';

// The Content Security Policy must do two things: let the real pages run
// untouched, and block what an attacker could inject into them.

const PAGE_PATHS = ['/', '/does-not-exist'];

interface Violation {
  directive: string;
  blockedUri: string;
}

// Records every CSP violation of the page. Registered before any page script,
// through the browser itself, so the CSP does not apply to it.
async function recordViolations(page: Page) {
  await page.addInitScript(() => {
    const violations: Violation[] = [];
    Object.assign(window, { cspViolations: violations });
    document.addEventListener('securitypolicyviolation', (event) => {
      violations.push({
        directive: event.effectiveDirective,
        blockedUri: event.blockedURI,
      });
    });
  });
}

async function readViolations(page: Page): Promise<Violation[]> {
  const violations = await page.evaluate(
    () => (window as unknown as { cspViolations: Violation[] }).cspViolations,
  );
  return violations;
}

// Serves the page with extra markup inserted at the start of <body>, keeping
// the real response headers: what a stored or reflected injection would
// produce.
async function injectIntoPage(page: Page, path: string, markup: string) {
  await page.route(path, async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    const injectedHtml = html.replace('<body>', `<body>${markup}`);
    await route.fulfill({ response, body: injectedHtml });
  });
}

for (const path of PAGE_PATHS) {
  test(`${path}: the policy blocks nothing the site needs`, async ({
    page,
  }) => {
    await recordViolations(page);
    await page.goto(path);
    await page.waitForLoadState('networkidle');

    const violations = await readViolations(page);
    expect(violations).toEqual([]);
  });
}

test('an injected inline script does not run', async ({ page }) => {
  await recordViolations(page);
  await injectIntoPage(
    page,
    '/',
    '<script>window.injectedScriptRan = true</script>',
  );
  await page.goto('/');

  const injectedScriptRan = await page.evaluate(
    () => 'injectedScriptRan' in window,
  );
  expect(injectedScriptRan).toBe(false);

  const violations = await readViolations(page);
  const directives = violations.map((violation) => violation.directive);
  expect(directives).toContain('script-src-elem');
});

test('an injected event handler does not run', async ({ page }) => {
  await recordViolations(page);
  await injectIntoPage(
    page,
    '/',
    '<img src="/missing.png" alt="" onerror="window.injectedHandlerRan = true">',
  );
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const injectedHandlerRan = await page.evaluate(
    () => 'injectedHandlerRan' in window,
  );
  expect(injectedHandlerRan).toBe(false);

  const violations = await readViolations(page);
  const directives = violations.map((violation) => violation.directive);
  expect(directives).toContain('script-src-attr');
});

test('a script from another origin does not load', async ({ page }) => {
  await recordViolations(page);
  await injectIntoPage(
    page,
    '/',
    '<script src="https://example.com/payload.js"></script>',
  );
  await page.goto('/');

  const violations = await readViolations(page);
  const blockedUris = violations.map((violation) => violation.blockedUri);
  expect(blockedUris).toContain('https://example.com/payload.js');
});

test('an injected style attribute is ignored', async ({ page }) => {
  await recordViolations(page);
  await injectIntoPage(
    page,
    '/',
    '<p id="injected-style" style="color: rgb(1, 2, 3)">x</p>',
  );
  await page.goto('/');

  const color = await page
    .locator('#injected-style')
    .evaluate((element) => getComputedStyle(element).color);
  expect(color).not.toBe('rgb(1, 2, 3)');

  const violations = await readViolations(page);
  const directives = violations.map((violation) => violation.directive);
  expect(directives).toContain('style-src-attr');
});
