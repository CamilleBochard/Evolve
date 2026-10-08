import { describe, expect, it } from 'vitest';

// Vérifie seulement que Vitest tourne. À supprimer dès qu'un vrai test existe.
describe('test runner', () => {
  it('runs a test', () => {
    const sum = 1 + 1;

    expect(sum).toBe(2);
  });
});
