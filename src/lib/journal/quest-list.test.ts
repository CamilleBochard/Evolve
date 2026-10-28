import { describe, expect, it } from 'vitest';

import {
  findQuest,
  isQuestId,
  questCode,
  questGroups,
  questNeighbours,
  visibleQuests,
} from './quest-list';

function groupIds(groups: ReturnType<typeof questGroups>) {
  const ids = groups.map((group) => ({
    chapter: group.chapter.id,
    quests: group.quests.map((quest) => quest.id),
  }));
  return ids;
}

describe('questGroups', () => {
  it('puts the latest chapters and quests first', () => {
    const groups = groupIds(questGroups('all', 'newest'));
    expect(groups[0]).toEqual({ chapter: 'suite', quests: ['suite'] });
    expect(groups[1]).toEqual({
      chapter: 'atelier',
      quests: ['chessme', 'evolve'],
    });
  });

  it('drops the chapters left empty by the filter', () => {
    const groups = groupIds(questGroups('side', 'oldest'));
    expect(groups).toEqual([
      { chapter: 'couvreur', quests: ['fondations'] },
      { chapter: 'paladev', quests: ['maisondunet'] },
      { chapter: 'atelier', quests: ['chessme'] },
    ]);
  });
});

describe('visibleQuests', () => {
  it('flattens the groups in list order', () => {
    const ids = visibleQuests('main', 'oldest').map((quest) => quest.id);
    expect(ids).toEqual([
      'compagnons',
      'chantiers',
      'formation',
      'potager',
      'magento',
      'evolve',
      'suite',
    ]);
  });
});

describe('questNeighbours', () => {
  it('has no older quest for the first one', () => {
    const neighbours = questNeighbours(findQuest('fondations'));
    expect(neighbours.older).toBeNull();
    expect(neighbours.newer?.id).toBe('compagnons');
  });

  it('has no newer quest for the last one', () => {
    const neighbours = questNeighbours(findQuest('suite'));
    expect(neighbours.older?.id).toBe('chessme');
    expect(neighbours.newer).toBeNull();
  });
});

describe('quest ids and codes', () => {
  it('recognises the ids of the address', () => {
    expect(isQuestId('potager')).toBe(true);
    expect(isQuestId('constructor')).toBe(false);
  });

  it('numbers the quests in campaign order', () => {
    expect(questCode(findQuest('potager'))).toBe('QST.05');
  });
});
