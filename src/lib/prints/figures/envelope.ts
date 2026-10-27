// Contact: a sealed envelope in front of the spiked sun.
import { svgDocument } from './figure.ts';
import type { PrintFigure, ViewBox } from './figure.ts';
import { sunSvg } from './sun.ts';

const VIEWBOX: ViewBox = { x: 0, y: 0, width: 240, height: 300 };

const BODY = svgDocument(
  VIEWBOX,
  `
  <rect x="28" y="92" width="184" height="128" fill="url(#steel-down)" stroke="#000" stroke-width="2.4"/>
  <path d="M28 92 L120 166 L212 92" fill="url(#steel)" stroke="#000" stroke-width="2.4"/>
  <path d="M28 220 L98 150 M212 220 L142 150" fill="none" stroke="#000" stroke-width="2.4"/>
  <circle cx="120" cy="164" r="18" fill="#e8e8e8" stroke="#000" stroke-width="2.4"/>
  <circle cx="120" cy="164" r="9" fill="none" stroke="#000" stroke-width="2"/>
  <path d="M60 252 L180 252" stroke="#bdbdbd" stroke-width="2"/>`,
);

export const ENVELOPE: PrintFigure = {
  viewBox: VIEWBOX,
  sun: sunSvg(
    VIEWBOX,
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
  ),
  body: BODY,
};
