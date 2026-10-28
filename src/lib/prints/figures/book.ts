// Journal: an open quest book, a ribbon and a quill.
import { workshopFigure } from './workshop.ts';

export const BOOK = workshopFigure(`
  <path d="M20 214 Q70 192 118 210 L118 98 Q70 80 20 102 Z" fill="url(#steel)" stroke="#000" stroke-width="2.4"/>
  <path d="M220 214 Q170 192 122 210 L122 98 Q170 80 220 102 Z" fill="url(#steel-down)" stroke="#000" stroke-width="2.4"/>
  <path d="M18 222 Q70 200 120 218 Q170 200 222 222" fill="none" stroke="#bdbdbd" stroke-width="4"/>
  <path d="M36 116 Q72 104 106 116 M36 136 Q72 124 106 136 M36 156 Q72 144 106 156 M36 176 Q72 164 96 172"
        fill="none" stroke="#000" stroke-width="2.4"/>
  <path d="M134 116 Q168 104 204 116 M134 136 Q168 124 204 136 M134 156 Q160 148 180 152"
        fill="none" stroke="#000" stroke-width="2.4"/>
  <path d="M150 210 L150 252 L160 242 L170 252 L170 206" fill="#e0e0e0" stroke="#000" stroke-width="2"/>
  <path d="M206 30 C182 48 162 82 150 128 L156 130 C172 90 192 58 214 38 Z" fill="#f0f0f0" stroke="#000" stroke-width="2"/>
  <line x1="152" y1="128" x2="146" y2="146" stroke="#d0d0d0" stroke-width="3"/>`);
