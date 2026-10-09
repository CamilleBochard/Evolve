// @ts-check
import { createRequire } from 'node:module';

import eslintJs from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

// eslint-plugin-astro loads eslint-plugin-jsx-a11y-x with require(). An ESM
// `import` of the same plugin here empties its accessibility rules for
// .astro files (seen with eslint-plugin-astro 3.2.1 and
// eslint-plugin-jsx-a11y-x 0.2.0), so it is loaded the same way.
const requireFromConfig = createRequire(import.meta.url);
const jsxA11yModule = requireFromConfig('eslint-plugin-jsx-a11y-x');
const jsxA11y = jsxA11yModule.default;

export default defineConfig([
  globalIgnores(['dist/', '.astro/', 'maquettes/', 'inspi_portfolio/']),

  // JavaScript and TypeScript base, for every file.
  eslintJs.configs.recommended,
  typescriptEslint.configs.recommended,

  // Astro components, with accessibility rules adapted to their syntax.
  eslintPluginAstro.configs.recommended,
  eslintPluginAstro.configs['jsx-a11y-recommended'],

  // React islands: hooks rules and JSX accessibility.
  {
    files: ['**/*.{jsx,tsx}'],
    extends: [reactHooks.configs.flat.recommended, jsxA11y.configs.recommended],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Config files run by Node.
  {
    files: ['*.config.{js,mjs,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
