import { describe, expect, it } from 'vitest';

import {
  entryPlacement,
  hitSizePercent,
  leaderLine,
  miniatureSizePercent,
} from './wheel-geometry';

describe('entryPlacement', () => {
  it('puts the first entry on the top medallion, its label above the wheel', () => {
    const placement = entryPlacement(0);
    expect(placement.medallion.x).toBeCloseTo(50);
    expect(placement.medallion.y).toBeCloseTo(16.67, 1);
    expect(placement.label.x).toBeCloseTo(50);
    expect(placement.label.y).toBeLessThan(0);
  });

  it('mirrors the entries on both sides of the wheel', () => {
    const right = entryPlacement(1);
    const left = entryPlacement(4);
    expect(right.label.x + left.label.x).toBeCloseTo(100);
    expect(right.label.y).toBeCloseTo(left.label.y);
  });

  it('pushes the side labels further out than the top one', () => {
    const top = entryPlacement(0);
    const side = entryPlacement(1);
    const topDistance = top.medallion.y - top.label.y;
    const sideDistance = side.label.x - side.medallion.x;
    expect(sideDistance).toBeGreaterThan(topDistance * 0.95);
  });
});

describe('leaderLine', () => {
  it('runs outwards from the medallion', () => {
    const line = leaderLine(0);
    expect(line.from.x).toBeCloseTo(120);
    expect(line.to.y).toBeLessThan(line.from.y);
  });
});

describe('sizes', () => {
  it('sizes the hit area a little larger than the medallion', () => {
    expect(hitSizePercent()).toBeCloseTo(24.75);
  });

  it('fits the miniature in the dark core of the medallion', () => {
    expect(miniatureSizePercent()).toBeCloseTo(72.73, 1);
  });
});
