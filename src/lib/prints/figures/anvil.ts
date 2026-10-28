// Atelier: an anvil, a hammer and a few sparks.
import { workshopFigure } from './workshop.ts';

export const ANVIL = workshopFigure(`
  <path d="M20 128 Q46 120 64 128 H206 V150 C188 152 176 160 170 172 L160 204 L176 232 H70 L86 204 L76 172 C70 160 58 154 40 150 Q24 144 20 128 Z"
        fill="url(#steel)" stroke="#000" stroke-width="2.4"/>
  <line x1="64" y1="140" x2="206" y2="140" stroke="#000" stroke-width="2"/>
  <rect x="60" y="232" width="126" height="16" fill="url(#steel-down)" stroke="#000" stroke-width="2"/>
  <rect x="132" y="38" width="16" height="92" fill="#cfcfcf" stroke="#000" stroke-width="2" transform="rotate(38 140 84)"/>
  <rect x="96" y="40" width="66" height="30" fill="url(#steel-down)" stroke="#000" stroke-width="2.4" transform="rotate(38 129 55)"/>
  <path d="M100 112 L84 92 M114 108 L114 84 M126 112 L142 96 M92 120 L70 112" stroke="#f0f0f0" stroke-width="3"/>`);
