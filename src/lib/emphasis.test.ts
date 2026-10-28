import { describe, expect, it } from 'vitest';

import { splitEmphasis } from './emphasis';

describe('splitEmphasis', () => {
  it('cuts the text around the words in bold', () => {
    expect(splitEmphasis('un espace libre ici', 'espace libre')).toEqual({
      before: 'un ',
      emphasis: 'espace libre',
      after: ' ici',
    });
  });

  it('keeps the whole text when the words are missing', () => {
    expect(splitEmphasis('un texte', 'absent')).toEqual({
      before: 'un texte',
      emphasis: '',
      after: '',
    });
  });

  it('keeps the whole text without emphasis', () => {
    expect(splitEmphasis('un texte').before).toBe('un texte');
  });
});
