import { describe, expect, it } from 'vitest';

import { campaignStats } from './campaign';

describe('campaignStats', () => {
  it('counts the quests done and the chapters open', () => {
    const stats = campaignStats();
    expect(stats.doneCount).toBe(7);
    expect(stats.questCount).toBe(10);
    expect(stats.openChapterCount).toBe(4);
    expect(stats.chapterCount).toBe(5);
  });
});
