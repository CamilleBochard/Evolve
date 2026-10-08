/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig applique la configuration Vite d'Astro aux tests (plugins,
// alias, modules virtuels astro:*), pour que le code testé soit compilé
// comme dans le site.
//
// Deux projets, séparés par l'extension du fichier de test :
// - *.test.ts : logique pure, exécutée dans Node ;
// - *.test.tsx : composants React, exécutés dans un DOM simulé (jsdom).
const config = getViteConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'components',
          include: ['src/**/*.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
});

export default config;
