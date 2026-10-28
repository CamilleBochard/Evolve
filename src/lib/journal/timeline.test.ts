import { describe, expect, it } from 'vitest';

import { QUESTS, TIMELINE } from '../../data/quests';
import { planTimeline, timelinePercent } from './timeline';

describe('timelinePercent', () => {
  it('maps the bounds of the timeline to 0 and 100', () => {
    expect(timelinePercent(TIMELINE.start)).toBe(0);
    expect(timelinePercent(TIMELINE.end)).toBe(100);
  });
});

describe('planTimeline', () => {
  const plan = planTimeline(QUESTS);

  function barOf(id: string) {
    const bar = plan.bars.find((item) => item.quest.id === id);
    if (bar === undefined) {
      throw new Error(`No bar for ${id}`);
    }
    return bar;
  }

  it('leaves the quests without dates off the timeline', () => {
    expect(plan.bars.some((bar) => bar.quest.id === 'suite')).toBe(false);
  });

  it('opens a new lane only when every lane overlaps', () => {
    expect(barOf('fondations').lane).toBe(0);
    expect(barOf('compagnons').lane).toBe(1);
    expect(barOf('chantiers').lane).toBe(2);
    expect(barOf('formation').lane).toBe(0);
    expect(barOf('maisondunet').lane).toBe(3);
    expect(plan.laneCount).toBe(4);
  });

  it('reuses a lane from the year its last quest ends', () => {
    expect(barOf('chessme').lane).toBe(1);
  });

  it('ends a running quest today', () => {
    const bar = barOf('evolve');
    expect(bar.left + bar.width).toBeCloseTo(timelinePercent(TIMELINE.now));
  });
});
