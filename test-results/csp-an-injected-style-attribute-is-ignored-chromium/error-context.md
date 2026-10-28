# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: csp.spec.ts >> an injected style attribute is ignored
- Location: e2e/csp.spec.ts:99:1

# Error details

```
Error: expect(received).not.toBe(expected) // Object.is equality

Expected: not "rgb(1, 2, 3)"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - paragraph [ref=e2]: x
  - generic [ref=e3]:
    - generic [aria-hidden] [ref=e4]: +
    - banner [ref=e5]:
      - link "CB//V1.0" [ref=e6] [cursor=pointer]:
        - /url: /
      - generic [ref=e7]: "[Statut] Portfolio en construction"
    - generic [aria-hidden] [ref=e8]: +
    - generic [ref=e11]: SECTOR 01 // CHANTIER
    - main [ref=e12]:
      - generic [ref=e13]:
        - generic [ref=e14]:
          - region [ref=e15]:
            - generic [ref=e16]:
              - generic [ref=e17]: "[Identité]"
              - generic [ref=e18]: CB-2011-2026 // REV.04
            - heading "Bochard Camille." [level=1] [ref=e19]:
              - generic [ref=e20]: Bochard
              - generic [ref=e21]: Camille.
            - generic [ref=e22]: Développeur · Rang 3
          - region [ref=e23]:
            - generic [ref=e24]:
              - generic [ref=e25]: "[Statut]"
              - heading "Work in progress" [level=2] [ref=e26]: Work in progress_
              - paragraph [ref=e27]: Checkpoint atteint
              - generic [ref=e29]:
                - link [ref=e30] [cursor=pointer]:
                  - /url: https://github.com/CamilleBochard
                  - generic [ref=e31]:
                    - text: GitHub
                    - generic [aria-hidden] [ref=e32]: ▸
                - link [ref=e34] [cursor=pointer]:
                  - /url: https://www.linkedin.com/in/camille-bochard
                  - generic [ref=e35]:
                    - text: LinkedIn
                    - generic [aria-hidden] [ref=e36]: ▸
            - figure "ID.CB-01 Match 98 %" [ref=e39]:
              - img "Portrait de Camille Bochard" [ref=e41]
              - generic [ref=e50]:
                - generic [ref=e51]: ID.CB-01
                - generic [ref=e52]: Match 98 %
          - region "Contact" [ref=e53]:
            - generic [ref=e54]:
              - generic [ref=e55]: "[Contact]"
              - link "cam.bochard@gmail.com" [ref=e56] [cursor=pointer]:
                - /url: mailto:cam.bochard@gmail.com
        - region "Serveur" [ref=e57]:
          - generic [ref=e58]: "[Serveur]"
          - generic [ref=e59]:
            - generic [ref=e60]: SYS.MONITOR V0.1
            - generic [ref=e61]: Rafraîchi / 30 s
          - article [ref=e62]:
            - heading "vps.status" [level=2] [ref=e64]
            - generic [ref=e69]:
              - generic [ref=e70]:
                - paragraph [ref=e71]: "SYS.STATUS : EN ATTENTE"
                - generic [ref=e74]: Données indisponibles
              - region "Ressources" [ref=e75]:
                - generic [ref=e76]:
                  - generic [ref=e77]: CPU
                  - generic [ref=e99]: "--"
                - generic [ref=e100]:
                  - generic [ref=e101]: Mémoire
                  - generic [ref=e123]: "--"
                - generic [ref=e124]:
                  - generic [ref=e125]: Disque
                  - generic [ref=e147]: "--"
              - region "Historique CPU" [ref=e148]:
                - generic [ref=e149]:
                  - generic [ref=e150]:
                    - generic [ref=e151]: Charge CPU · 30 dernières minutes
                    - generic [ref=e152]: max --
                  - generic [ref=e153]: Aucune donnée pour l'instant
              - region "Services" [ref=e155]:
                - generic [ref=e156]:
                  - generic [ref=e157]:
                    - term [ref=e158]: Site
                    - definition [ref=e159]: En attente
                  - generic [ref=e161]:
                    - term [ref=e162]: Reverse proxy
                    - definition [ref=e163]: En attente
                  - generic [ref=e165]:
                    - term [ref=e166]: Certificat HTTPS
                    - definition [ref=e167]: En attente
              - region "Déploiement" [ref=e169]:
                - generic [ref=e170]:
                  - generic [ref=e171]:
                    - term [ref=e172]: Site en ligne depuis
                    - definition [ref=e173]: "--"
                  - generic [ref=e174]:
                    - term [ref=e175]: Dernier déploiement
                    - definition [ref=e176]: "--"
                  - generic [ref=e177]:
                    - term [ref=e178]: Commit
                    - definition [ref=e179]: "--"
            - generic [ref=e180]:
              - generic [ref=e181]: Données publiques
              - generic [ref=e182]: Aucune IP · version · hôte
          - generic [aria-hidden] [ref=e183]:
            - generic [ref=e184]: SECTOR 02 // SERVEUR
            - generic [ref=e186]: GRID 24 // SCALE 1:1
    - generic [ref=e189]: SECTOR 02 // CHANTIER
    - generic [aria-hidden] [ref=e190]: +
    - contentinfo [ref=e191]:
      - navigation "Contact" [ref=e192]:
        - link "GitHub" [ref=e193] [cursor=pointer]:
          - /url: https://github.com/CamilleBochard
        - link "LinkedIn" [ref=e194] [cursor=pointer]:
          - /url: https://www.linkedin.com/in/camille-bochard
        - link "cam.bochard@gmail.com" [ref=e195] [cursor=pointer]:
          - /url: mailto:cam.bochard@gmail.com
      - generic [ref=e196]: Page temporaire
    - generic [aria-hidden] [ref=e197]: +
```

# Test source

```ts
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
  82  |   expect(injectedHandlerRan).toBe(false);
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
> 107 |   expect(color).not.toBe('rgb(1, 2, 3)');
      |                     ^ Error: expect(received).not.toBe(expected) // Object.is equality
  108 | 
  109 |   const violations = await readViolations(page);
  110 |   const directives = violations.map((violation) => violation.directive);
  111 |   expect(directives).toContain('style-src-attr');
  112 | });
  113 | 
```