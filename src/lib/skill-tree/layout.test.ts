import { describe, expect, it } from 'vitest';

import { SKILL_BRANCHES } from '../../data/skill-tree';
import { columnX, countUnlockedSatellites, layoutTree } from './layout';

const layout = layoutTree(SKILL_BRANCHES);

function hubById(id: string) {
  const placed = layout.hubs.find((candidate) => candidate.hub.id === id);
  if (placed === undefined) {
    throw new Error(`No hub ${id}`);
  }
  return placed;
}

describe('layoutTree', () => {
  // Reference values read from the v6 mockup with the same seed.
  it('gives the same tree as the mockup', () => {
    expect(layout.width).toBe(2120);
    expect(layout.height).toBeCloseTo(1452.64, 2);
    expect(hubById('laravel').y).toBeCloseTo(387.078, 3);
    expect(hubById('scale').y).toBeCloseTo(1296.642, 3);
    expect(hubById('js').y).toBeCloseTo(377.08, 2);
  });

  it('aligns the first hub of every branch on one line', () => {
    const firstHubs = SKILL_BRANCHES.map((branch) =>
      hubById(branch.hubs[0].id),
    );
    const heights = new Set(firstHubs.map((placed) => placed.y));
    expect(heights.size).toBe(1);
  });

  it('puts each branch in its own column', () => {
    expect(hubById('php').x).toBe(columnX(0));
    expect(hubById('ui').x).toBe(columnX(1));
  });

  it('places every satellite, and links every hub but the first to its parent', () => {
    const satelliteCount = SKILL_BRANCHES.flatMap((branch) =>
      branch.hubs.flatMap((hub) => hub.satellites),
    ).length;
    const hubCount = layout.hubs.length;
    expect(layout.satellites).toHaveLength(satelliteCount);
    expect(layout.spines).toHaveLength(hubCount - SKILL_BRANCHES.length);
  });

  it('keeps the satellites of a hub on both sides of it', () => {
    const php = hubById('php');
    const satellites = layout.satellites.filter(
      (satellite) => satellite.hubId === 'php',
    );
    const leftOnes = satellites.filter((satellite) => satellite.x < php.x);
    expect(leftOnes).toHaveLength(3);
    expect(satellites).toHaveLength(5);
  });
});

describe('countUnlockedSatellites', () => {
  it('counts the unlocked satellites of a hub', () => {
    expect(countUnlockedSatellites(SKILL_BRANCHES[0].hubs[0])).toBe('4/5');
  });
});
