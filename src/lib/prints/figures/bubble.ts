// Chatbot, paused: a speech bubble with its three dots.
import { GROUND_LINE, workshopFigure } from './workshop.ts';

export const BUBBLE = workshopFigure(`
  <path d="M48 76 H192 C204 76 212 84 212 96 V164 C212 176 204 184 192 184 H112 L80 214 L86 184 H48
           C36 184 28 176 28 164 V96 C28 84 36 76 48 76 Z"
        fill="url(#steel)" stroke="#000" stroke-width="2.4"/>
  <circle cx="86" cy="130" r="11" fill="#000"/>
  <circle cx="120" cy="130" r="11" fill="#000"/>
  <circle cx="154" cy="130" r="11" fill="#000"/>
  ${GROUND_LINE}`);
