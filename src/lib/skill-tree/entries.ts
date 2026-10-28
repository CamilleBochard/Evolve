// Every skill of the laid-out tree, by id, with its center point: what the
// popup and the keyboard navigation need to find a skill on the tree.
import type { Skill } from '../../data/skill-tree';
import { HUB_HALF, SAT_HEIGHT, SAT_WIDTH } from './layout';
import type { PlacedHub, TreeLayout } from './layout';

export type SkillKind = 'hub' | 'satellite';

export interface SkillEntry {
  kind: SkillKind;
  skill: Skill;
  // The hub of a satellite, or the hub itself.
  hub: PlacedHub;
  // Center of the shape, in tree units.
  x: number;
  y: number;
  // Half the width of the shape, to place the popup beside it.
  halfWidth: number;
}

export function treeEntries(layout: TreeLayout): Map<string, SkillEntry> {
  const entries = new Map<string, SkillEntry>();
  const hubsById = new Map<string, PlacedHub>();
  for (const placed of layout.hubs) {
    hubsById.set(placed.hub.id, placed);
    entries.set(placed.hub.id, {
      kind: 'hub',
      skill: placed.hub,
      hub: placed,
      x: placed.x,
      y: placed.y,
      halfWidth: HUB_HALF + 7,
    });
  }
  for (const satellite of layout.satellites) {
    const hub = hubsById.get(satellite.hubId);
    if (hub === undefined) {
      continue;
    }
    entries.set(satellite.skill.id, {
      kind: 'satellite',
      skill: satellite.skill,
      hub,
      x: satellite.x + SAT_WIDTH / 2,
      y: satellite.y + SAT_HEIGHT / 2,
      halfWidth: SAT_WIDTH / 2,
    });
  }
  return entries;
}
