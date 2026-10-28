// Where each menu entry goes over the printed wheel. Points are given in
// figure units for the SVG overlay, or in percent of the square print for
// the HTML entries laid over it.
import {
  MENU_VIEWBOX,
  MENU_WHEEL,
  WHEEL_CENTER,
  WHEEL_RING_RADIUS,
} from '../prints/figures/wheel-shape.ts';

export interface Point {
  x: number;
  y: number;
}

export interface EntryPlacement {
  // Center of the medallion, in percent of the print.
  medallion: Point;
  // Center of the label, outside the wheel, in percent of the print.
  label: Point;
}

// Labels sit outside the ring, beyond the tick marks; side labels are
// wide, so they move further out.
const LABEL_RADIUS = 142;
const LABEL_SIDE_EXTRA = 30;
// The hit area is a little larger than the medallion.
const HIT_RADIUS_FACTOR = 1.1;
// Room between the medallion and the start of the leader line, and between
// the end of the line and the label.
const LEADER_START_GAP = 6;
const LEADER_END_GAP = 14;

// The first entry is at the top, the others follow clockwise.
function entryAngle(index: number): number {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / MENU_WHEEL.count;
  return angle;
}

export function wheelPoint(index: number, radius: number): Point {
  const angle = entryAngle(index);
  const point: Point = {
    x: WHEEL_CENTER.x + Math.cos(angle) * radius,
    y: WHEEL_CENTER.y + Math.sin(angle) * radius,
  };
  return point;
}

function labelRadius(index: number): number {
  const sideShift = Math.abs(Math.cos(entryAngle(index))) * LABEL_SIDE_EXTRA;
  const radius = LABEL_RADIUS + sideShift;
  return radius;
}

function toPercent(point: Point): Point {
  const percent: Point = {
    x: ((point.x - MENU_VIEWBOX.x) / MENU_VIEWBOX.width) * 100,
    y: ((point.y - MENU_VIEWBOX.y) / MENU_VIEWBOX.height) * 100,
  };
  return percent;
}

export function entryPlacement(index: number): EntryPlacement {
  const placement: EntryPlacement = {
    medallion: toPercent(wheelPoint(index, WHEEL_RING_RADIUS)),
    label: toPercent(wheelPoint(index, labelRadius(index))),
  };
  return placement;
}

// Leader line from the medallion towards the label, in figure units.
export function leaderLine(index: number): { from: Point; to: Point } {
  const startRadius =
    WHEEL_RING_RADIUS + MENU_WHEEL.medallionSize + LEADER_START_GAP;
  const line = {
    from: wheelPoint(index, startRadius),
    to: wheelPoint(index, labelRadius(index) - LEADER_END_GAP),
  };
  return line;
}

// Size of the hit area, in percent of the print width.
export function hitSizePercent(): number {
  const diameter = MENU_WHEEL.medallionSize * 2 * HIT_RADIUS_FACTOR;
  const percent = (diameter / MENU_VIEWBOX.width) * 100;
  return percent;
}

// Size of the miniature, which fills the dark core of the medallion, in
// percent of the hit area.
export function miniatureSizePercent(): number {
  const percent = (MENU_WHEEL.innerRatio / HIT_RADIUS_FACTOR) * 100;
  return percent;
}
