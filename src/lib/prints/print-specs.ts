// Every print of the site, generated at build time by
// scripts/generate-prints.ts into src/assets/prints/<name>.png.
//
// bodyWidth is the width at which the page shows the body, in CSS pixels:
// one Bayer dot per CSS pixel. The PNG is twice as large, so the finer sun
// grain stays sharp on high-density screens.
import { BUBBLE } from './figures/bubble.ts';
import { CUBE } from './figures/cube.ts';
import { ENVELOPE } from './figures/envelope.ts';
import { KNIGHT } from './figures/knight.ts';
import { PALADEV_STANDING } from './figures/paladev.ts';
import { WHEEL } from './figures/wheel.ts';
import type { PrintFigure } from './figures/figure.ts';

export const PRINT_COLORS = {
  paper: '#0b0c0e',
  ember: '#cf5a44',
  dull: '#6d7077',
};

export type PrintLayer = 'sun' | 'body';

export interface PrintSpec {
  name: string;
  figure: PrintFigure;
  bodyWidth: number;
  ink: string;
  // Both layers by default; one alone when a page places them separately.
  layers?: PrintLayer[];
}

// Width of an Atelier print, in CSS pixels: the bench slot and the plate.
const ATELIER_SLOT_WIDTH = 76;
const ATELIER_PLATE_WIDTH = 300;

// Prints named atelier-<name>-slot and atelier-<name>-plate.
function atelierPrints(
  name: string,
  figure: PrintFigure,
  ink: string,
): PrintSpec[] {
  const specs: PrintSpec[] = [
    {
      name: `atelier-${name}-slot`,
      figure,
      bodyWidth: ATELIER_SLOT_WIDTH,
      ink,
    },
    {
      name: `atelier-${name}-plate`,
      figure,
      bodyWidth: ATELIER_PLATE_WIDTH,
      ink,
    },
  ];
  return specs;
}

export const PRINT_SPECS: PrintSpec[] = [
  // Character sheet: the poster figure, about 2 CSS pixels per Bayer dot.
  {
    name: 'paladev-standing',
    figure: PALADEV_STANDING,
    bodyWidth: 240,
    ink: PRINT_COLORS.ember,
  },
  // Skills page: the portrait of the character column, 280 CSS pixels wide.
  {
    name: 'paladev-portrait',
    figure: PALADEV_STANDING,
    bodyWidth: 280,
    ink: PRINT_COLORS.ember,
  },
  {
    name: 'envelope',
    figure: ENVELOPE,
    bodyWidth: 300,
    ink: PRINT_COLORS.ember,
  },
  // Atelier: each project twice, the slot of the bench and the plate of the
  // project sheet. Active projects in ember, the others in a dull gray, like
  // a greyed inventory slot.
  ...atelierPrints('knight', KNIGHT, PRINT_COLORS.ember),
  ...atelierPrints('wheel', WHEEL, PRINT_COLORS.ember),
  ...atelierPrints('cube', CUBE, PRINT_COLORS.dull),
  ...atelierPrints('bubble', BUBBLE, PRINT_COLORS.dull),
];
