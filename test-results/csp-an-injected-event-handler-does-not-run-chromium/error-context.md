# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: csp.spec.ts >> an injected event handler does not run
- Location: e2e/csp.spec.ts:71:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [aria-hidden] [ref=e3]: +
  - banner [ref=e4]:
    - link "CB//V1.0" [ref=e5] [cursor=pointer]:
      - /url: /
    - generic [ref=e6]: "[Statut] Portfolio en construction"
  - generic [aria-hidden] [ref=e7]: +
  - generic [ref=e10]: SECTOR 01 // CHANTIER
  - main [ref=e11]:
    - generic [ref=e12]:
      - generic [ref=e13]:
        - region [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: "[Identité]"
            - generic [ref=e17]: CB-2011-2026 // REV.04
          - heading "Bochard Camille." [level=1] [ref=e18]:
            - generic [ref=e19]: Bochard
            - generic [ref=e20]: Camille.
          - generic [ref=e21]: Développeur · Rang 3
        - region [ref=e22]:
          - generic [ref=e23]:
            - generic [ref=e24]: "[Statut]"
            - heading "Work in progress" [level=2] [ref=e25]: Work in progress_
            - paragraph [ref=e26]: Checkpoint atteint
            - generic [ref=e28]:
              - link [ref=e29] [cursor=pointer]:
                - /url: https://github.com/CamilleBochard
                - generic [ref=e30]:
                  - text: GitHub
                  - generic [aria-hidden] [ref=e31]: ▸
              - link [ref=e33] [cursor=pointer]:
                - /url: https://www.linkedin.com/in/camille-bochard
                - generic [ref=e34]:
                  - text: LinkedIn
                  - generic [aria-hidden] [ref=e35]: ▸
          - figure "ID.CB-01 Match 98 %" [ref=e38]:
            - img "Portrait de Camille Bochard" [ref=e40]
            - generic [ref=e49]:
              - generic [ref=e50]: ID.CB-01
              - generic [ref=e51]: Match 98 %
        - region "Contact" [ref=e52]:
          - generic [ref=e53]:
            - generic [ref=e54]: "[Contact]"
            - link "cam.bochard@gmail.com" [ref=e55] [cursor=pointer]:
              - /url: mailto:cam.bochard@gmail.com
      - region "Serveur" [ref=e56]:
        - generic [ref=e57]: "[Serveur]"
        - generic [ref=e58]:
          - generic [ref=e59]: SYS.MONITOR V0.1
          - generic [ref=e60]: Rafraîchi / 30 s
        - article [ref=e61]:
          - heading "vps.status" [level=2] [ref=e63]
          - generic [ref=e68]:
            - generic [ref=e69]:
              - paragraph [ref=e70]: "SYS.STATUS : EN ATTENTE"
              - generic [ref=e73]: Données indisponibles
            - region "Ressources" [ref=e74]:
              - generic [ref=e75]:
                - generic [ref=e76]: CPU
                - generic [ref=e98]: "--"
              - generic [ref=e99]:
                - generic [ref=e100]: Mémoire
                - generic [ref=e122]: "--"
              - generic [ref=e123]:
                - generic [ref=e124]: Disque
                - generic [ref=e146]: "--"
            - region "Historique CPU" [ref=e147]:
              - generic [ref=e148]:
                - generic [ref=e149]:
                  - generic [ref=e150]: Charge CPU · 30 dernières minutes
                  - generic [ref=e151]: max --
                - generic [ref=e152]: Aucune donnée pour l'instant
            - region "Services" [ref=e154]:
              - generic [ref=e155]:
                - generic [ref=e156]:
                  - term [ref=e157]: Site
                  - definition [ref=e158]: En attente
                - generic [ref=e160]:
                  - term [ref=e161]: Reverse proxy
                  - definition [ref=e162]: En attente
                - generic [ref=e164]:
                  - term [ref=e165]: Certificat HTTPS
                  - definition [ref=e166]: En attente
            - region "Déploiement" [ref=e168]:
              - generic [ref=e169]:
                - generic [ref=e170]:
                  - term [ref=e171]: Site en ligne depuis
                  - definition [ref=e172]: "--"
                - generic [ref=e173]:
                  - term [ref=e174]: Dernier déploiement
                  - definition [ref=e175]: "--"
                - generic [ref=e176]:
                  - term [ref=e177]: Commit
                  - definition [ref=e178]: "--"
          - generic [ref=e179]:
            - generic [ref=e180]: Données publiques
            - generic [ref=e181]: Aucune IP · version · hôte
        - generic [aria-hidden] [ref=e182]:
          - generic [ref=e183]: SECTOR 02 // SERVEUR
          - generic [ref=e185]: GRID 24 // SCALE 1:1
  - generic [ref=e188]: SECTOR 02 // CHANTIER
  - generic [aria-hidden] [ref=e189]: +
  - contentinfo [ref=e190]:
    - navigation "Contact" [ref=e191]:
      - link "GitHub" [ref=e192] [cursor=pointer]:
        - /url: https://github.com/CamilleBochard
      - link "LinkedIn" [ref=e193] [cursor=pointer]:
        - /url: https://www.linkedin.com/in/camille-bochard
      - link "cam.bochard@gmail.com" [ref=e194] [cursor=pointer]:
        - /url: mailto:cam.bochard@gmail.com
    - generic [ref=e195]: Page temporaire
  - generic [aria-hidden] [ref=e196]: +
```

# Test source

```ts
  1   | import { expect, test, type Page } from '@playwright/test';
  2   | 
  3   | // The Content Security Policy must do two things: let the real pages run
  4   | // untouched, and block what an attacker could inject into them.
  5   | 
  6   | const PAGE_PATHS = ['/', '/does-not-exist'];
  7   | 
  8   | interface Violation {
  9   |   directive: string;
  10  |   blockedUri: string;
  11  | }
  12  | 
  13  | // Records every CSP violation of the page. Registered before any page script,
  14  | // through the browser itself, so the CSP does not apply to it.
  15  | async function recordViolations(page: Page) {
  16  |   await page.addInitScript(() => {
  17  |     const violations: Violation[] = [];
  18  |     Object.assign(window, { cspViolations: violations });
  19  |     document.addEventListener('securitypolicyviolation', (event) => {
  20  |       violations.push({
  21  |         directive: event.effectiveDirective,
  22  |         blockedUri: event.blockedURI,
  23  |       });
  24  |     });
  25  |   });
  26  | }
  27  | 
  28  | async function readViolations(page: Page): Promise<Violation[]> {
  29  |   const violations = await page.evaluate(
  30  |     () => (window as unknown as { cspViolations: Violation[] }).cspViolations,
  31  |   );
  32  |   return violations;
  33  | }
  34  | 
  35  | // Serves the page with extra markup inserted at the start of <body>, keeping
  36  | // the real response headers: what a stored or reflected injection would
  37  | // produce.
  38  | async function injectIntoPage(page: Page, path: string, markup: string) {
  39  |   await page.route(path, async (route) => {
  40  |     const response = await route.fetch();
  41  |     const html = await response.text();
  42  |     const injectedHtml = html.replace('<body>', `<body>${markup}`);
  43  |     await route.fulfill({ response, body: injectedHtml });
  44  |   });
  45  | }
  46  | 
  47  | for (const path of PAGE_PATHS) {
  48  |   test(`${path}: the policy blocks nothing the site needs`, async ({ page }) => {
  49  |     await recordViolations(page);
  50  |     await page.goto(path);
  51  |     await page.waitForLoadState('networkidle');
  52  | 
  53  |     const violations = await readViolations(page);
  54  |     expect(violations).toEqual([]);
  55  |   });
  56  | }
  57  | 
  58  | test('an injected inline script does not run', async ({ page }) => {
  59  |   await recordViolations(page);
  60  |   await injectIntoPage(page, '/', '<script>window.injectedScriptRan = true</script>');
  61  |   await page.goto('/');
  62  | 
  63  |   const injectedScriptRan = await page.evaluate(() => 'injectedScriptRan' in window);
  64  |   expect(injectedScriptRan).toBe(false);
  65  | 
  66  |   const violations = await readViolations(page);
  67  |   const directives = violations.map((violation) => violation.directive);
  68  |   expect(directives).toContain('script-src-elem');
  69  | });
  70  | 
  71  | test('an injected event handler does not run', async ({ page }) => {
  72  |   await recordViolations(page);
  73  |   await injectIntoPage(
  74  |     page,
  75  |     '/',
  76  |     '<img src="/missing.png" alt="" onerror="window.injectedHandlerRan = true">',
  77  |   );
  78  |   await page.goto('/');
  79  |   await page.waitForLoadState('networkidle');
  80  | 
  81  |   const injectedHandlerRan = await page.evaluate(() => 'injectedHandlerRan' in window);
> 82  |   expect(injectedHandlerRan).toBe(false);
      |                              ^ Error: expect(received).toBe(expected) // Object.is equality
  83  | 
  84  |   const violations = await readViolations(page);
  85  |   const directives = violations.map((violation) => violation.directive);
  86  |   expect(directives).toContain('script-src-attr');
  87  | });
  88  | 
  89  | test('a script from another origin does not load', async ({ page }) => {
  90  |   await recordViolations(page);
  91  |   await injectIntoPage(page, '/', '<script src="https://example.com/payload.js"></script>');
  92  |   await page.goto('/');
  93  | 
  94  |   const violations = await readViolations(page);
  95  |   const blockedUris = violations.map((violation) => violation.blockedUri);
  96  |   expect(blockedUris).toContain('https://example.com/payload.js');
  97  | });
  98  | 
  99  | test('an injected style attribute is ignored', async ({ page }) => {
  100 |   await recordViolations(page);
  101 |   await injectIntoPage(page, '/', '<p id="injected-style" style="color: rgb(1, 2, 3)">x</p>');
  102 |   await page.goto('/');
  103 | 
  104 |   const color = await page
  105 |     .locator('#injected-style')
  106 |     .evaluate((element) => getComputedStyle(element).color);
  107 |   expect(color).not.toBe('rgb(1, 2, 3)');
  108 | 
  109 |   const violations = await readViolations(page);
  110 |   const directives = violations.map((violation) => violation.directive);
  111 |   expect(directives).toContain('style-src-attr');
  112 | });
  113 | 
```