// Evolve: the menu wheel, an octagon per entry around the paladev helm.
import { octagonPoints } from './figure.ts';
import { GROUND_LINE, workshopFigure } from './workshop.ts';

const CENTER = { x: 120, y: 140 };
const RING_RADIUS = 80;
const TICK_COUNT = 48;
// One long tick every four.
const LONG_TICK_EVERY = 4;

export interface WheelShape {
  // One medallion per menu entry.
  count: number;
  medallionSize: number;
  tickInner: number;
  tickOuter: number;
  // Fill of the inner octagon of each medallion.
  innerFill: string;
}

const ATELIER_WHEEL: WheelShape = {
  count: 6,
  medallionSize: 20,
  tickInner: 98,
  tickOuter: 110,
  innerFill: 'none',
};

// Size of the inner octagon of a medallion, relative to the medallion.
const INNER_RATIO = 0.6;

function pointOnCircle(
  angle: number,
  radius: number,
): { x: number; y: number } {
  const point = {
    x: CENTER.x + Math.cos(angle) * radius,
    y: CENTER.y + Math.sin(angle) * radius,
  };
  return point;
}

function wheelMedallions(shape: WheelShape): string {
  const medallions: string[] = [];
  const innerSize = shape.medallionSize * INNER_RATIO;
  for (let index = 0; index < shape.count; index++) {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / shape.count;
    const { x, y } = pointOnCircle(angle, RING_RADIUS);
    medallions.push(
      `<polygon points="${octagonPoints(x, y, shape.medallionSize)}" fill="url(#steel-down)" stroke="#000" stroke-width="2"/>`,
      `<polygon points="${octagonPoints(x, y, innerSize)}" fill="${shape.innerFill}" stroke="#000" stroke-width="1.6"/>`,
    );
  }
  const markup = medallions.join('');
  return markup;
}

function wheelTicks(shape: WheelShape): string {
  const ticks: string[] = [];
  const middle = shape.tickInner + (shape.tickOuter - shape.tickInner) / 2;
  for (let index = 0; index < TICK_COUNT; index++) {
    const angle = (index * Math.PI * 2) / TICK_COUNT;
    let inner = middle;
    if (index % LONG_TICK_EVERY === 0) {
      inner = shape.tickInner;
    }
    const start = pointOnCircle(angle, inner);
    const end = pointOnCircle(angle, shape.tickOuter);
    ticks.push(
      `<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="#d0d0d0" stroke-width="2"/>`,
    );
  }
  const markup = ticks.join('');
  return markup;
}

// Hub of the wheel: the paladev helm on a steel plate.
const HELM_HUB = `
  <polygon points="${octagonPoints(CENTER.x, CENTER.y, 44)}" fill="url(#steel)" stroke="#000" stroke-width="2.4"/>
  <path d="M98 160 L98 132 C98 116 108 108 120 108 C132 108 142 116 142 132 L142 160 Z" fill="url(#steel-down)" stroke="#000" stroke-width="2"/>
  <rect x="102" y="128" width="36" height="6" fill="#000"/>
  <line x1="120" y1="110" x2="120" y2="158" stroke="#000" stroke-width="1.6"/>
  <path d="M120 108 C128 96 138 92 148 94" fill="none" stroke="#e8e8e8" stroke-width="4"/>`;

function wheelContent(shape: WheelShape): string {
  const content = `
  ${wheelTicks(shape)}
  <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING_RADIUS}" fill="none" stroke="url(#steel)" stroke-width="9"/>
  <circle cx="${CENTER.x}" cy="${CENTER.y}" r="${RING_RADIUS}" fill="none" stroke="#000" stroke-width="1.4"/>
  ${wheelMedallions(shape)}
  ${HELM_HUB}`;
  return content;
}

export const WHEEL = workshopFigure(`
  ${wheelContent(ATELIER_WHEEL)}
  ${GROUND_LINE}
  <path d="M80 280 L160 280" stroke="#8a8a8a" stroke-width="2"/>`);
