// 3D scene: an isometric cube in an orbit ring, with a small moon.
import { GROUND_LINE, workshopFigure } from './workshop.ts';

export const CUBE = workshopFigure(`
  <ellipse cx="120" cy="150" rx="104" ry="30" fill="none" stroke="#c8c8c8" stroke-width="2.4" transform="rotate(-16 120 150)"/>
  <polygon points="120,70 182,106 120,142 58,106" fill="#ececec" stroke="#000" stroke-width="2.4"/>
  <polygon points="58,106 120,142 120,214 58,178" fill="#9c9c9c" stroke="#000" stroke-width="2.4"/>
  <polygon points="120,142 182,106 182,178 120,214" fill="#555" stroke="#000" stroke-width="2.4"/>
  <path d="M89 88 L151 124 M151 88 L89 124 M89 124 L89 196 M151 124 L151 196" stroke="#000" stroke-width="1.2" opacity="0.7"/>
  <circle cx="214" cy="128" r="9" fill="url(#steel)" stroke="#000" stroke-width="2"/>
  ${GROUND_LINE}`);
