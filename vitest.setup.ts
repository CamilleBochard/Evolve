import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Démonte les composants rendus après chaque test, pour que le DOM d'un test
// ne déborde pas sur le suivant.
afterEach(() => {
  cleanup();
});
