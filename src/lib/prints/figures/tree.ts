// Compétences: a hub of the skill tree, its satellites and the links to the
// next hubs.
import { octagonPoints } from './figure.ts';
import { workshopFigure } from './workshop.ts';

export const TREE = workshopFigure(`
  <line x1="120" y1="40" x2="120" y2="270" stroke="#d8d8d8" stroke-width="4"/>
  <polygon points="${octagonPoints(120, 52, 18)}" fill="url(#steel-down)" stroke="#000" stroke-width="2"/>
  <polygon points="${octagonPoints(120, 256, 18)}" fill="#6a6a6a" stroke="#000" stroke-width="2"/>
  <path d="M78 116 H96 V184 H78 M162 116 H144 V184 H162 M78 150 H96 M144 150 H162" fill="none" stroke="#d8d8d8" stroke-width="3"/>
  <rect x="14" y="104" width="64" height="24" fill="url(#steel)" stroke="#000" stroke-width="2"/>
  <rect x="14" y="138" width="64" height="24" fill="url(#steel)" stroke="#000" stroke-width="2"/>
  <rect x="14" y="172" width="64" height="24" fill="url(#steel)" stroke="#000" stroke-width="2"/>
  <rect x="162" y="104" width="64" height="24" fill="url(#steel)" stroke="#000" stroke-width="2"/>
  <rect x="162" y="138" width="64" height="24" fill="#5a5a5a" stroke="#000" stroke-width="2"/>
  <rect x="162" y="172" width="64" height="24" fill="url(#steel)" stroke="#000" stroke-width="2"/>
  <polygon points="${octagonPoints(120, 150, 40)}" fill="url(#steel)" stroke="#000" stroke-width="2.4"/>
  <polygon points="${octagonPoints(120, 150, 28)}" fill="none" stroke="#000" stroke-width="2"/>`);
