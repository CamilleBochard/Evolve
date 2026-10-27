// The spiked sun printed behind every figure.
import { viewBoxAttribute } from './figure.ts';
import type { ViewBox } from './figure.ts';

export interface Point {
  x: number;
  y: number;
}

export interface SunSizes {
  count: number;
  // Distance from the center to the base of the spikes.
  base: number;
  short: number;
  long: number;
  halfWidth: number;
  ring: number;
  stroke: number;
}

// Long and short spikes, alternating around the center.
function sunSpikes(center: Point, sizes: SunSizes): string {
  const spikes: string[] = [];
  for (let index = 0; index < sizes.count; index++) {
    const angle = (index / sizes.count) * Math.PI * 2;
    let length = sizes.short;
    if (index % 2 === 0) {
      length = sizes.long;
    }
    const side = angle + Math.PI / 2;
    const baseX = center.x + Math.cos(angle) * sizes.base;
    const baseY = center.y + Math.sin(angle) * sizes.base;
    const tipX = center.x + Math.cos(angle) * length;
    const tipY = center.y + Math.sin(angle) * length;
    const leftX = baseX + Math.cos(side) * sizes.halfWidth;
    const leftY = baseY + Math.sin(side) * sizes.halfWidth;
    const rightX = baseX - Math.cos(side) * sizes.halfWidth;
    const rightY = baseY - Math.sin(side) * sizes.halfWidth;
    spikes.push(
      `<path d="M${leftX} ${leftY} L${tipX} ${tipY} L${rightX} ${rightY} Z" fill="url(#spike)" stroke="#000" stroke-width="${sizes.stroke}"/>`,
    );
  }
  const markup = spikes.join('');
  return markup;
}

export function sunSvg(
  viewBox: ViewBox,
  center: Point,
  sizes: SunSizes,
): string {
  const outerRing = sizes.ring + sizes.halfWidth * 1.3;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxAttribute(viewBox)}" width="${viewBox.width}" height="${viewBox.height}">
    <defs>
      <linearGradient id="spike" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="#e8e8e8"/><stop offset="1" stop-color="#5a5a5a"/>
      </linearGradient>
    </defs>
    ${sunSpikes(center, sizes)}
    <circle cx="${center.x}" cy="${center.y}" r="${sizes.ring}" fill="none" stroke="#f0f0f0" stroke-width="${sizes.stroke * 2}"/>
    <circle cx="${center.x}" cy="${center.y}" r="${outerRing}" fill="none" stroke="#a0a0a0" stroke-width="${sizes.stroke * 0.8}"/>
  </svg>`;
  return svg;
}
