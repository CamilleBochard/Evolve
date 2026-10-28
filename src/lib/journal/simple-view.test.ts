import { describe, expect, it } from 'vitest';

import { findQuest } from './quest-list';
import {
  plainChapters,
  plainFeats,
  plainObjective,
  plainPlace,
} from './simple-view';

describe('plainChapters', () => {
  it('lists the open chapters, most recent first', () => {
    const ids = plainChapters().map((group) => group.chapter.id);
    expect(ids).toEqual(['atelier', 'paladev', 'reconversion', 'couvreur']);
  });
});

describe('plainPlace', () => {
  it('joins the employer and the client', () => {
    expect(plainPlace(findQuest('magento'))).toBe(
      'Maisondunet · Distributeur de panneaux solaires',
    );
  });

  it('drops the game name of personal projects', () => {
    expect(plainPlace(findQuest('evolve'))).toBe('');
  });
});

describe('plainObjective', () => {
  it('marks an objective still open', () => {
    const objective = { text: 'Lancer le jeu', isDone: false };
    expect(plainObjective(objective)).toBe('Lancer le jeu (en cours)');
  });
});

describe('plainFeats', () => {
  it('writes the key figures on one line', () => {
    expect(plainFeats(findQuest('chantiers'))).toBe(
      '11 ans de chantiers · Niv. 11 classe Pyrozinc atteinte',
    );
  });
});
