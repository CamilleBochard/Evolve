// @ts-check
import { createRequire } from 'node:module';

import eslintJs from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

// eslint-plugin-astro charge eslint-plugin-jsx-a11y-x avec require(). Un
// `import` ESM du même plugin ici vide ses règles d'accessibilité pour les
// fichiers .astro (constaté avec eslint-plugin-astro 3.2.1 et
// eslint-plugin-jsx-a11y-x 0.2.0). On le charge donc de la même façon.
const require = createRequire(import.meta.url);
const jsxA11yModule = require('eslint-plugin-jsx-a11y-x');
const jsxA11y = jsxA11yModule.default;

export default defineConfig([
  globalIgnores(['dist/', '.astro/', 'maquettes/', 'inspi_portfolio/']),

  // Base JavaScript et TypeScript, pour tous les fichiers.
  eslintJs.configs.recommended,
  typescriptEslint.configs.recommended,

  // Composants Astro, avec les règles d'accessibilité adaptées à leur syntaxe.
  eslintPluginAstro.configs.recommended,
  eslintPluginAstro.configs['jsx-a11y-recommended'],

  // Islands React : règles des hooks et accessibilité du JSX.
  {
    files: ['**/*.{jsx,tsx}'],
    extends: [reactHooks.configs.flat.recommended, jsxA11y.configs.recommended],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // Fichiers de configuration exécutés par Node.
  {
    files: ['*.config.{js,mjs,ts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
]);
