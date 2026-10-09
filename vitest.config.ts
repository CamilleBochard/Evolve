/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig applies Astro's Vite config to the tests (plugins, aliases,
// astro:* virtual modules), so tested code is compiled as in the site.
//
// Two projects, split by test file extension:
// - *.test.ts: pure logic, run in Node;
// - *.test.tsx: React components, run in a simulated DOM (jsdom).
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
