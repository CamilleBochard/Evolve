// Layout of the skill tree, computed once from the data: one column per
// branch, a chain of octagonal hubs per column, the satellites stacked on
// both sides of their hub. Pure function: the same tree on the server and in
// the browser, and the same tree for a given seed.
import type {
  Skill,
  SkillBranch,
  SkillHub,
  SkillState,
} from '../../data/skill-tree';
import { createSeededRandom } from '../seeded-random';

// ---------- Geometry, in tree units (1 unit = 1 CSS pixel at scale 1) ----------

export const TREE_FIRST_CENTER_X = 250;
export const TREE_COLUMN_SPACING = 540;
const TREE_TOP = 96;
const TREE_HUB_MIN_GAP = 70;
const TREE_HUB_GAP_SPREAD = 110;
const TREE_BOTTOM_MARGIN = 90;
const TREE_TITLE_OFFSET = 46;

export const HUB_HALF = 34;
export const HUB_CUT = 14;
export const HUB_RING = 7;
export const HUB_LABEL_OFFSET = 12;
export const HUB_LABEL_HEIGHT = 20;

export const SAT_WIDTH = 136;
export const SAT_HEIGHT = 30;
const SAT_CUT = 8;
// Space between a hub and its satellites, wider than the base 12 units.
const SAT_GAP = 24;
const SAT_ROW_GAP = 8;

// Hub labels are set in Space Mono 11px: every character has the same width.
const LABEL_CHAR_WIDTH = 6.73;
const LABEL_PADDING = 18;

export const DEFAULT_TREE_SEED = 15;

// ---------- Types ----------

export type SatelliteSide = 'left' | 'right';

interface Extents {
  top: number;
  bottom: number;
}

export interface PlacedHub {
  hub: SkillHub;
  branch: SkillBranch;
  branchIndex: number;
  x: number;
  y: number;
  extents: Extents;
  parentId: string | null;
  label: string;
  labelWidth: number;
}

export interface PlacedSatellite {
  skill: Skill;
  hubId: string;
  side: SatelliteSide;
  // Top-left corner.
  x: number;
  y: number;
  linkPath: string;
}

export interface Spine {
  hubId: string;
  path: string;
  state: SkillState;
}

export interface BranchTitle {
  branchId: string;
  x: number;
  y: number;
  name: string;
  code: string;
}

export interface TreeLayout {
  width: number;
  height: number;
  hubs: PlacedHub[];
  satellites: PlacedSatellite[];
  spines: Spine[];
  // x of the dashed lines between two columns.
  dividers: number[];
  titles: BranchTitle[];
}

// ---------- Helpers ----------

export function countUnlockedSatellites(hub: SkillHub): string {
  const unlocked = hub.satellites.filter(
    (satellite) => satellite.state === 'unlocked',
  ).length;
  const counter = `${unlocked}/${hub.satellites.length}`;
  return counter;
}

export function columnX(branchIndex: number): number {
  const x = TREE_FIRST_CENTER_X + branchIndex * TREE_COLUMN_SPACING;
  return x;
}

// The first half of the satellites goes left, the rest right.
function splitSatellites(hub: SkillHub): Record<SatelliteSide, Skill[]> {
  const leftCount = Math.ceil(hub.satellites.length / 2);
  const sides = {
    left: hub.satellites.slice(0, leftCount),
    right: hub.satellites.slice(leftCount),
  };
  return sides;
}

function stackHeight(count: number): number {
  let height = 0;
  if (count > 0) {
    height = count * SAT_HEIGHT + (count - 1) * SAT_ROW_GAP;
  }
  return height;
}

// Vertical room a hub needs above and below its center.
function hubExtents(hub: SkillHub): Extents {
  const sides = splitSatellites(hub);
  const tallestSide = Math.max(sides.left.length, sides.right.length);
  const stackHalf = stackHeight(tallestSide) / 2;
  const extents: Extents = {
    top: Math.max(HUB_HALF + HUB_RING, stackHalf),
    bottom: Math.max(HUB_HALF + HUB_LABEL_OFFSET + HUB_LABEL_HEIGHT, stackHalf),
  };
  return extents;
}

export function octagonPoints(
  centerX: number,
  centerY: number,
  half: number,
  cut: number,
): string {
  const inner = half - cut;
  const corners = [
    [centerX - inner, centerY - half],
    [centerX + inner, centerY - half],
    [centerX + half, centerY - inner],
    [centerX + half, centerY + inner],
    [centerX + inner, centerY + half],
    [centerX - inner, centerY + half],
    [centerX - half, centerY + inner],
    [centerX - half, centerY - inner],
  ];
  const points = corners.map((corner) => corner.join(',')).join(' ');
  return points;
}

// Satellite shape: a rectangle with two cut corners.
export function satellitePoints(x: number, y: number): string {
  const right = x + SAT_WIDTH;
  const bottom = y + SAT_HEIGHT;
  const corners = [
    [x + SAT_CUT, y],
    [right, y],
    [right, bottom - SAT_CUT],
    [right - SAT_CUT, bottom],
    [x, bottom],
    [x, y + SAT_CUT],
  ];
  const points = corners.map((corner) => corner.join(',')).join(' ');
  return points;
}

// Link from the label of a hub down to the ring of the next one.
function spinePath(parent: PlacedHub, child: PlacedHub): string {
  const startY = parent.y + HUB_HALF + HUB_LABEL_OFFSET + HUB_LABEL_HEIGHT + 6;
  const endY = child.y - HUB_HALF - HUB_RING - 6;
  const elbowY = (startY + endY) / 2;
  const path = `M${parent.x} ${startY} V${elbowY} H${child.x} V${endY}`;
  return path;
}

// The vertical link of a stack runs between the hub ring and the satellites.
const BUS_DISTANCE = (HUB_HALF + HUB_RING + HUB_HALF + SAT_GAP) / 2;

function placeSatellites(placed: PlacedHub): PlacedSatellite[] {
  const sides = splitSatellites(placed.hub);
  const satellites: PlacedSatellite[] = [];
  for (const side of ['left', 'right'] as const) {
    const skills = sides[side];
    const stackTop = placed.y - stackHeight(skills.length) / 2;
    let hubEdgeX = placed.x + HUB_HALF;
    let busX = placed.x + BUS_DISTANCE;
    let satelliteX = placed.x + HUB_HALF + SAT_GAP;
    let satelliteEdgeX = satelliteX;
    if (side === 'left') {
      hubEdgeX = placed.x - HUB_HALF;
      busX = placed.x - BUS_DISTANCE;
      satelliteX = placed.x - HUB_HALF - SAT_GAP - SAT_WIDTH;
      satelliteEdgeX = satelliteX + SAT_WIDTH;
    }
    skills.forEach((skill, index) => {
      const y = stackTop + index * (SAT_HEIGHT + SAT_ROW_GAP);
      const middleY = y + SAT_HEIGHT / 2;
      const linkPath = `M${hubEdgeX} ${placed.y} H${busX} V${middleY} H${satelliteEdgeX}`;
      satellites.push({
        skill,
        hubId: placed.hub.id,
        side,
        x: satelliteX,
        y,
        linkPath,
      });
    });
  }
  return satellites;
}

// ---------- Layout ----------

export function layoutTree(
  branches: SkillBranch[],
  seed: number = DEFAULT_TREE_SEED,
): TreeLayout {
  const random = createSeededRandom(seed);
  const hubs: PlacedHub[] = [];
  let lowestPoint = 0;
  // Every branch starts on the same line, low enough for its tallest first hub.
  const firstHubTops = branches.map((branch) => hubExtents(branch.hubs[0]).top);
  const alignedFirstY = TREE_TOP + Math.max(...firstHubTops);

  branches.forEach((branch, branchIndex) => {
    let previous: PlacedHub | null = null;
    for (const hub of branch.hubs) {
      const extents = hubExtents(hub);
      let centerY = alignedFirstY;
      // Same draws as the mockup, so a seed gives the same tree: a start
      // height (unused, the branches are aligned), the gap to the previous
      // hub, then a horizontal shift (unused, the branches are straight).
      random();
      if (previous !== null) {
        const gap = TREE_HUB_MIN_GAP + random() * TREE_HUB_GAP_SPREAD;
        centerY = previous.y + previous.extents.bottom + gap + extents.top;
      }
      random();
      const label = `${hub.name} · ${countUnlockedSatellites(hub)}`;
      let parentId: string | null = null;
      if (previous !== null) {
        parentId = previous.hub.id;
      }
      const placed: PlacedHub = {
        hub,
        branch,
        branchIndex,
        x: columnX(branchIndex),
        y: centerY,
        extents,
        parentId,
        label,
        labelWidth: label.length * LABEL_CHAR_WIDTH + LABEL_PADDING,
      };
      hubs.push(placed);
      previous = placed;
      lowestPoint = Math.max(lowestPoint, centerY + extents.bottom);
    }
  });

  const hubsById = new Map(hubs.map((placed) => [placed.hub.id, placed]));
  const spines: Spine[] = [];
  for (const placed of hubs) {
    if (placed.parentId === null) {
      continue;
    }
    const parent = hubsById.get(placed.parentId);
    if (parent) {
      spines.push({
        hubId: placed.hub.id,
        path: spinePath(parent, placed),
        state: placed.hub.state,
      });
    }
  }

  const dividers: number[] = [];
  for (let index = 0; index < branches.length - 1; index++) {
    dividers.push(columnX(index) + TREE_COLUMN_SPACING / 2);
  }

  const titles: BranchTitle[] = branches.map((branch, branchIndex) => {
    const title: BranchTitle = {
      branchId: branch.id,
      x: columnX(branchIndex),
      y: TREE_TOP - TREE_TITLE_OFFSET,
      name: `[${branch.name}]`,
      code: branch.code,
    };
    return title;
  });

  const layout: TreeLayout = {
    width:
      TREE_FIRST_CENTER_X * 2 + (branches.length - 1) * TREE_COLUMN_SPACING,
    height: lowestPoint + TREE_BOTTOM_MARGIN,
    hubs,
    satellites: hubs.flatMap(placeSatellites),
    spines,
    dividers,
    titles,
  };
  return layout;
}
