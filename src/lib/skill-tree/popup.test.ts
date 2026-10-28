import { describe, expect, it } from 'vitest';

import { SKILL_BRANCHES } from '../../data/skill-tree';
import { treeEntries } from './entries';
import { layoutTree } from './layout';
import { describeEntry, monogram, popupPosition } from './popup';

const layout = layoutTree(SKILL_BRANCHES);
const entries = treeEntries(layout);

function entryById(id: string) {
  const entry = entries.get(id);
  if (entry === undefined) {
    throw new Error(`No skill ${id}`);
  }
  return entry;
}

describe('describeEntry', () => {
  it('lists the satellites of a hub', () => {
    const description = describeEntry(entryById('php'));
    expect(description.label).toBe('[Satellites]');
    expect(description.title).toBe('4/5 débloqués');
  });

  it('names the quest of an unlocked skill', () => {
    const description = describeEntry(entryById('graphql'));
    expect(description.label).toBe('[Obtenue dans la quête]');
    expect(description.title).toContain('potager');
  });

  it('says a skill in progress is still being earned', () => {
    expect(describeEntry(entryById('a11y')).label).toBe(
      '[En cours dans la quête]',
    );
  });

  it('lists every quest of a skill earned in several', () => {
    const description = describeEntry(entryById('solid'));
    expect(description.label).toBe('[Obtenue dans les quêtes]');
    expect(description.title.split('\n')).toHaveLength(2);
  });

  it('has no quest for a locked skill', () => {
    expect(describeEntry(entryById('ddd')).title).toBe(
      'Aucune quête pour l’instant',
    );
  });
});

describe('monogram', () => {
  it('uses the hub code', () => {
    expect(monogram(entryById('laravel'))).toBe('LV');
  });

  it('uses the capitals of a satellite name', () => {
    expect(monogram(entryById('ddd'))).toBe('DDD');
    expect(monogram(entryById('mysql'))).toBe('MSQL');
  });
});

describe('popupPosition', () => {
  const popup = { width: 340, height: 260 };
  const tree = { width: layout.width, height: layout.height };

  it('opens on the outer side of a satellite when there is room', () => {
    const leftSatellite = entryById('html');
    const position = popupPosition(leftSatellite, popup, tree);
    expect(position.left + popup.width).toBeLessThan(leftSatellite.x);
  });

  it('falls back to another side at the edge of the tree', () => {
    const edgeSatellite = entryById('poo');
    const position = popupPosition(edgeSatellite, popup, tree);
    expect(position.left).toBeGreaterThanOrEqual(24);
  });

  it('stays inside the tree', () => {
    const position = popupPosition(entryById('php'), popup, tree);
    expect(position.left).toBeGreaterThanOrEqual(24);
    expect(position.top).toBeGreaterThanOrEqual(24);
  });
});
