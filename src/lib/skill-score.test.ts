import { describe, expect, it } from 'vitest';

import type { SkillBranch } from '../data/skill-tree';
import { branchScore, scoreRatio, treeScore } from './skill-score';

const BRANCH: SkillBranch = {
  id: 'test',
  name: 'Test',
  code: 'BR.00',
  hubs: [
    {
      id: 'hub',
      name: 'Hub',
      mono: 'HB',
      state: 'unlocked',
      satellites: [
        { id: 'done', name: 'Done', state: 'unlocked' },
        { id: 'doing', name: 'Doing', state: 'progress' },
        { id: 'later', name: 'Later', state: 'locked' },
      ],
    },
  ],
};

describe('branchScore', () => {
  it('counts the hub and its satellites, unlocked ones only', () => {
    expect(branchScore(BRANCH)).toEqual({ unlocked: 2, total: 4 });
  });
});

describe('treeScore', () => {
  it('adds the scores of every branch', () => {
    expect(treeScore([BRANCH, BRANCH])).toEqual({ unlocked: 4, total: 8 });
  });
});

describe('scoreRatio', () => {
  it('gives the share of unlocked skills', () => {
    expect(scoreRatio({ unlocked: 1, total: 4 })).toBe(0.25);
  });

  it('gives 0 for an empty tree', () => {
    expect(scoreRatio({ unlocked: 0, total: 0 })).toBe(0);
  });
});
