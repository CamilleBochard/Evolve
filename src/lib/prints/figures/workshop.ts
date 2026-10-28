// Frame shared by the workshop figures (Atelier projects, menu miniatures,
// contact): a 240 × 300 plate with the same spiked sun behind the subject.
import { svgDocument } from './figure.ts';
import type { PrintFigure, ViewBox } from './figure.ts';
import { sunSvg } from './sun.ts';

export const WORKSHOP_VIEWBOX: ViewBox = {
  x: 0,
  y: 0,
  width: 240,
  height: 300,
};

const WORKSHOP_SUN = sunSvg(
  WORKSHOP_VIEWBOX,
  { x: 120, y: 116 },
  {
    count: 24,
    base: 46,
    short: 76,
    long: 106,
    halfWidth: 3.6,
    ring: 40,
    stroke: 0.8,
  },
);

// The subject is SVG content in the 240 × 300 plate, without the svg tag.
export function workshopFigure(bodyContent: string): PrintFigure {
  const figure: PrintFigure = {
    viewBox: WORKSHOP_VIEWBOX,
    sun: WORKSHOP_SUN,
    body: svgDocument(WORKSHOP_VIEWBOX, bodyContent),
  };
  return figure;
}

// Ground line under the floating subjects.
export const GROUND_LINE = `<path d="M60 268 L180 268" stroke="#bdbdbd" stroke-width="2"/>`;
