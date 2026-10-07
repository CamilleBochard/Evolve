/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig applique la configuration Vite d'Astro aux tests (plugins,
// alias, modules virtuels astro:*), pour que le code testé soit compilé
// comme dans le site.
const config = getViteConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
});

export default config;
