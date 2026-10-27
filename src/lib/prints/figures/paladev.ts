// Personnage: the standing paladev of the v5 engraving, without its cross,
// halo and rays, in front of the spiked sun. The body has its own gradients
// (plate, blade, cloth, cape) on top of the shared steel ones.
import type { PrintFigure, ViewBox } from './figure.ts';
import { sunSvg } from './sun.ts';

const VIEWBOX: ViewBox = { x: -10, y: -40, width: 240, height: 340 };

const BODY = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 -40 240 340" width="240" height="340">
    <defs>
      <linearGradient id="steel" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#f4f4f4"/><stop offset="0.45" stop-color="#a6a6a6"/><stop offset="1" stop-color="#363636"/>
      </linearGradient>
      <linearGradient id="steel-down" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#e6e6e6"/><stop offset="1" stop-color="#3e3e3e"/>
      </linearGradient>
      <radialGradient id="plate" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#8e8e8e"/><stop offset="1" stop-color="#2e2e2e"/>
      </radialGradient>
      <linearGradient id="blade" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#d4d4d4"/><stop offset="0.52" stop-color="#6e6e6e"/><stop offset="1" stop-color="#a8a8a8"/>
      </linearGradient>
      <linearGradient id="cloth" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#e2e2e2"/><stop offset="1" stop-color="#7a7a7a"/>
      </linearGradient>
      <linearGradient id="cape" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#626262"/><stop offset="1" stop-color="#161616"/>
      </linearGradient>
    </defs>

    <ellipse cx="110" cy="290" rx="92" ry="8" fill="#3a3a3a"/>
    <g stroke="#000" stroke-width="2.2" stroke-linejoin="round">

    <path d="M78 112 C58 150 44 220 30 292 L190 292 C176 220 162 150 142 112 Z" fill="url(#cape)"/>
    <path d="M70 160 C62 210 56 250 50 290 M150 160 C158 210 166 250 172 290 M92 214 C90 244 88 272 86 292" stroke="#0a0a0a" stroke-width="3" fill="none"/>

    <path d="M90 200 L108 200 L106 268 L92 268 Z" fill="url(#steel)"/>
    <path d="M112 200 L130 200 L128 268 L114 268 Z" fill="url(#steel)"/>
    <ellipse cx="99" cy="228" rx="11" ry="8" fill="url(#plate)"/>
    <ellipse cx="121" cy="228" rx="11" ry="8" fill="url(#plate)"/>
    <path d="M86 266 L108 266 L110 286 L78 286 Q78 272 86 266 Z" fill="url(#steel-down)"/>
    <path d="M112 266 L134 266 Q142 272 142 286 L110 286 Z" fill="url(#steel-down)"/>

    <path d="M80 118 L140 118 L146 160 L138 196 L82 196 L74 160 Z" fill="url(#plate)"/>
    <path d="M110 122 L110 192" stroke="#262626" stroke-width="1.5"/>
    <path d="M84 176 Q110 186 136 176" stroke="#262626" stroke-width="2" fill="none"/>

    <path d="M92 182 L128 182 L134 252 L110 264 L86 252 Z" fill="url(#cloth)"/>
    <path d="M100 196 L98 250 M120 196 L122 250" stroke="#5a5a5a" stroke-width="1.5"/>
    <rect x="82" y="184" width="56" height="9" fill="#262626"/>
    <rect x="104" y="183" width="12" height="11" fill="#ececec" stroke="#262626" stroke-width="1.5"/>

    <path d="M96 112 L124 112 L128 124 L92 124 Z" fill="url(#steel-down)"/>
    <ellipse cx="78" cy="126" rx="24" ry="17" fill="url(#plate)"/>
    <path d="M56 134 Q78 148 100 134 M58 142 Q78 154 98 142" stroke="#1e1e1e" stroke-width="2" fill="none"/>
    <ellipse cx="142" cy="126" rx="24" ry="17" fill="url(#plate)"/>
    <path d="M120 134 Q142 148 164 134 M122 142 Q142 154 162 142" stroke="#1e1e1e" stroke-width="2" fill="none"/>

    <path d="M150 136 L166 140 L164 170 L150 168 Z" fill="url(#steel)"/>
    <path d="M150 168 L166 170 L166 192 L152 192 Z" fill="url(#steel)"/>

    <path d="M156 40 L160 22 L164 40 L164 182 L156 182 Z" fill="url(#blade)"/>
    <path d="M160 44 L160 176" stroke="#484848" stroke-width="1.5"/>
    <path d="M138 182 L182 182 L184 190 L136 190 Z" fill="#e2e2e2" stroke="#1e1e1e" stroke-width="1.5"/>
    <circle cx="135" cy="186" r="4" fill="url(#plate)"/>
    <circle cx="185" cy="186" r="4" fill="url(#plate)"/>
    <rect x="157" y="190" width="6" height="22" fill="#363636"/>
    <circle cx="160" cy="216" r="6" fill="url(#plate)"/>
    <path d="M148 188 L172 188 L172 206 L150 208 Z" fill="url(#plate)"/>
    <path d="M152 196 L170 196 M152 201 L170 201" stroke="#2a2a2a" stroke-width="1.2"/>

    <path d="M26 150 L94 150 L94 196 Q94 240 60 264 Q26 240 26 196 Z" fill="url(#plate)" stroke="#e8e8e8" stroke-width="3"/>
    <path d="M34 158 L86 158 L86 196 Q86 232 60 252 Q34 232 34 196 Z" fill="none" stroke="#1e1e1e" stroke-width="2"/>
    <path d="M47 192 L38 201 L47 210 M65 188 L56 214 M73 192 L82 201 L73 210" stroke="#0e0e0e" stroke-width="4.5" fill="none" stroke-linecap="square"/>

    <path d="M110 46 Q118 16 148 20 Q132 30 124 48 Z" fill="url(#cloth)"/>
    <path d="M90 74 Q90 46 110 44 Q130 46 130 74 L130 116 L90 116 Z" fill="url(#steel)"/>
    <rect x="90" y="70" width="40" height="4" fill="#f2f2f2"/>
    <rect x="90" y="80" width="40" height="8" fill="#060606"/>
    <path d="M110 46 L110 80 M110 88 L110 116" stroke="#262626" stroke-width="1.5"/>
    <circle cx="118" cy="98" r="1.8" fill="#0e0e0e"/>
    <circle cx="122" cy="102" r="1.8" fill="#0e0e0e"/>
    <circle cx="118" cy="106" r="1.8" fill="#0e0e0e"/>
    </g>
  </svg>
`;

export const PALADEV_STANDING: PrintFigure = {
  viewBox: VIEWBOX,
  sun: sunSvg(
    VIEWBOX,
    { x: 110, y: 78 },
    {
      count: 26,
      base: 50,
      short: 82,
      long: 114,
      halfWidth: 3.8,
      ring: 44,
      stroke: 0.8,
    },
  ),
  body: BODY,
};
