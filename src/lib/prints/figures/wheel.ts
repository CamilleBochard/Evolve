// The menu wheel, an octagon medallion per entry around a hub:
// - Atelier (Evolve project): six medallions around the paladev helm;
// - menu page: five larger medallions with a dark core, where the page lays
//   the miniature of each entry, around an empty hub or the paladev rune.
import { octagonPoints, svgDocument } from './figure.ts';
import type { PrintFigure } from './figure.ts';
import { sunSvg } from './sun.ts';
import {
  MENU_SUN_VIEWBOX,
  MENU_VIEWBOX,
  MENU_WHEEL,
  WHEEL_CENTER,
  WHEEL_RING_RADIUS,
} from './wheel-shape.ts';
import type { WheelHub, WheelShape } from './wheel-shape.ts';
import { GROUND_LINE, workshopFigure } from './workshop.ts';

const TICK_COUNT = 48;
// One long tick every four.
const LONG_TICK_EVERY = 4;

const ATELIER_WHEEL: WheelShape = {
  count: 6,
  medallionSize: 20,
  tickInner: 98,
  tickOuter: 110,
  innerFill: 'none',
  innerRatio: 0.6,
  hub: 'helm',
  hubScale: 1,
};

interface Point {
  x: number;
  y: number;
}

function pointOnCircle(angle: number, radius: number): Point {
  const point = {
    x: WHEEL_CENTER.x + Math.cos(angle) * radius,
    y: WHEEL_CENTER.y + Math.sin(angle) * radius,
  };
  return point;
}

function wheelMedallions(shape: WheelShape): string {
  const medallions: string[] = [];
  const innerSize = shape.medallionSize * shape.innerRatio;
  for (let index = 0; index < shape.count; index++) {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / shape.count;
    const { x, y } = pointOnCircle(angle, WHEEL_RING_RADIUS);
    medallions.push(
      `<polygon points="${octagonPoints(x, y, shape.medallionSize)}" fill="url(#steel-down)" stroke="#000" stroke-width="2"/>`,
      `<polygon points="${octagonPoints(x, y, innerSize)}" fill="${shape.innerFill}" stroke="#000" stroke-width="1.6"/>`,
    );
  }
  const markup = medallions.join('');
  return markup;
}

function radialTicks(
  count: number,
  inner: number,
  outer: number,
  longInner: number,
  style: string,
): string {
  const ticks: string[] = [];
  for (let index = 0; index < count; index++) {
    const angle = (index * Math.PI * 2) / count;
    let start = inner;
    if (index % LONG_TICK_EVERY === 0) {
      start = longInner;
    }
    const from = pointOnCircle(angle, start);
    const to = pointOnCircle(angle, outer);
    ticks.push(
      `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" ${style}/>`,
    );
  }
  const markup = ticks.join('');
  return markup;
}

function wheelTicks(shape: WheelShape): string {
  const middle = shape.tickInner + (shape.tickOuter - shape.tickInner) / 2;
  const markup = radialTicks(
    TICK_COUNT,
    middle,
    shape.tickOuter,
    shape.tickInner,
    'stroke="#d0d0d0" stroke-width="2"',
  );
  return markup;
}

// The paladev helm on a steel plate.
const HELM_HUB = `
  <polygon points="${octagonPoints(WHEEL_CENTER.x, WHEEL_CENTER.y, 44)}" fill="url(#steel)" stroke="#000" stroke-width="2.4"/>
  <path d="M98 160 L98 132 C98 116 108 108 120 108 C132 108 142 116 142 132 L142 160 Z" fill="url(#steel-down)" stroke="#000" stroke-width="2"/>
  <rect x="102" y="128" width="36" height="6" fill="#000"/>
  <line x1="120" y1="110" x2="120" y2="158" stroke="#000" stroke-width="1.6"/>
  <path d="M120 108 C128 96 138 92 148 94" fill="none" stroke="#e8e8e8" stroke-width="4"/>`;

// Every stroke of the rune: a black outline under a light stroke, like a
// carved line.
function runeStroke(pathData: string, width: number): string {
  const markup =
    `<path d="${pathData}" fill="none" stroke="#000" stroke-width="${width + 4}" stroke-linejoin="miter" stroke-linecap="square"/>` +
    `<path d="${pathData}" fill="none" stroke="url(#rune-light)" stroke-width="${width}" stroke-linejoin="miter" stroke-linecap="square"/>`;
  return markup;
}

// The paladev rune, an invented glyph inside a graduated seal. The sword is
// the stave (blade, guard, pommel), a diamond of light crowns it, and the
// </> of the shield is cut across it: two chevrons and a slash.
const RUNE_HUB = `
  <defs>
    <radialGradient id="rune-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#8a8a8a"/><stop offset="0.6" stop-color="#3a3a3a"/><stop offset="1" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <!-- In figure units: a straight stroke has an empty bounding box, which would hide it. -->
    <linearGradient id="rune-light" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="92" y2="188">
      <stop offset="0" stop-color="#f6f6f6"/><stop offset="1" stop-color="#b8b8b8"/>
    </linearGradient>
  </defs>
  <circle cx="120" cy="140" r="34" fill="url(#rune-glow)"/>
  <circle cx="120" cy="140" r="45" fill="none" stroke="#8a8a8a" stroke-width="1.6"/>
  ${radialTicks(32, 38, 41, 35, 'stroke="#bdbdbd" stroke-width="1.4"')}
  ${runeStroke('M120 108 V170', 5)}
  ${runeStroke('M110 170 H130', 4)}
  ${runeStroke('M120 174 V180', 4)}
  <circle cx="120" cy="184" r="4" fill="#e8e8e8" stroke="#000" stroke-width="2"/>
  ${runeStroke('M106 124 L92 140 L106 156', 4.4)}
  ${runeStroke('M134 124 L148 140 L134 156', 4.4)}
  ${runeStroke('M132 118 L108 162', 3.4)}
  <path d="M120 92 L128 101 L120 110 L112 101 Z" fill="#f6f6f6" stroke="#000" stroke-width="2"/>
  <path d="M120 96 L124 101 L120 106 L116 101 Z" fill="#000"/>`;

const WHEEL_HUBS: Record<WheelHub, string> = {
  helm: HELM_HUB,
  rune: RUNE_HUB,
  none: '',
};

function wheelContent(shape: WheelShape): string {
  const { x, y } = WHEEL_CENTER;
  const hubTransform = `translate(${x} ${y}) scale(${shape.hubScale}) translate(${-x} ${-y})`;
  const content = `
  ${wheelTicks(shape)}
  <circle cx="${x}" cy="${y}" r="${WHEEL_RING_RADIUS}" fill="none" stroke="url(#steel)" stroke-width="9"/>
  <circle cx="${x}" cy="${y}" r="${WHEEL_RING_RADIUS}" fill="none" stroke="#000" stroke-width="1.4"/>
  ${wheelMedallions(shape)}
  <g transform="${hubTransform}">${WHEEL_HUBS[shape.hub]}</g>`;
  return content;
}

export const WHEEL = workshopFigure(`
  ${wheelContent(ATELIER_WHEEL)}
  ${GROUND_LINE}
  <path d="M80 280 L160 280" stroke="#8a8a8a" stroke-width="2"/>`);

// ---------- Menu page ----------

const RUNE_SUN = sunSvg(MENU_SUN_VIEWBOX, WHEEL_CENTER, {
  count: 36,
  base: 114,
  short: 168,
  long: 232,
  halfWidth: 5,
  ring: 112,
  stroke: 0.9,
});

// Plain version: only the circles of the sun, without its spikes.
const PLAIN_SUN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-120 -100 480 480" width="480" height="480">
  <circle cx="${WHEEL_CENTER.x}" cy="${WHEEL_CENTER.y}" r="112" fill="none" stroke="#f0f0f0" stroke-width="1.8"/>
  <circle cx="${WHEEL_CENTER.x}" cy="${WHEEL_CENTER.y}" r="118.5" fill="none" stroke="#a0a0a0" stroke-width="0.7"/>
</svg>`;

function menuWheel(hub: WheelHub, sun: string): PrintFigure {
  const shape: WheelShape = { ...MENU_WHEEL, hub };
  const figure: PrintFigure = {
    viewBox: MENU_VIEWBOX,
    sunViewBox: MENU_SUN_VIEWBOX,
    sun,
    body: svgDocument(MENU_VIEWBOX, wheelContent(shape)),
  };
  return figure;
}

// Default version: an empty center and the circle of the sun only.
export const MENU_WHEEL_PLAIN = menuWheel('none', PLAIN_SUN);
// Rune version: the paladev rune at the center, a wide spiked sun.
export const MENU_WHEEL_RUNE = menuWheel('rune', RUNE_SUN);
