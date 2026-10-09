import { describe, expect, it } from 'vitest';

// Only checks that Vitest runs. Remove once a real test exists.
describe('test runner', () => {
  it('runs a test', () => {
    const sum = 1 + 1;

    expect(sum).toBe(2);
  });
});
