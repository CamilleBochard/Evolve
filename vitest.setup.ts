import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Unmount rendered components after each test, so one test's DOM does not
// leak into the next.
afterEach(() => {
  cleanup();
});
