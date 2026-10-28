// Every print of the site, generated at build time by
// scripts/generate-prints.ts into src/assets/prints/<name>.png.
//
// bodyWidth is the width at which the page shows the body, in CSS pixels:
// one Bayer dot per CSS pixel. The PNG is twice as large, so the finer sun
// grain stays sharp on high-density screens.
import { ANVIL } from './figures/anvil.ts';
import { BOOK } from './figures/book.ts';
import { BUBBLE } from './figures/bubble.ts';
import { CUBE } from './figures/cube.ts';
import { ENVELOPE } from './figures/envelope.ts';
import { KNIGHT } from './figures/knight.ts';
import { PALADEV_STANDING } from './figures/paladev.ts';
import { TREE } from './figures/tree.ts';
import { MENU_WHEEL_PLAIN, MENU_WHEEL_RUNE, WHEEL } from './figures/wheel.ts';
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

// Menu wheel, printed at about its size on a desktop screen. Its sun runs
// twice as wide as the wheel: printed apart, at half the width, so it keeps
// one dot per screen pixel without a huge file.
const MENU_WHEEL_WIDTH = 640;
const MENU_SUN_WIDTH = MENU_WHEEL_WIDTH / 2;

function menuWheelPrints(name: string, figure: PrintFigure): PrintSpec[] {
  const specs: PrintSpec[] = [
    {
      name: `menu-wheel-${name}`,
      figure,
      bodyWidth: MENU_WHEEL_WIDTH,
      ink: PRINT_COLORS.ember,
      layers: ['body'],
    },
    {
      name: `menu-sun-${name}`,
      figure,
      bodyWidth: MENU_SUN_WIDTH,
      ink: PRINT_COLORS.ember,
      layers: ['sun'],
    },
  ];
  return specs;
}

// Menu miniatures: in the dark core of a medallion on desktop, beside the
// button on phones. The paladev is tall and thin: printed larger in the
// medallion, so it is framed on its upper body.
const MENU_MEDALLION_WIDTH = 120;
const MENU_PALADEV_MEDALLION_WIDTH = 150;
const MENU_THUMB_WIDTH = 64;

function menuMiniaturePrints(
  name: string,
  figure: PrintFigure,
  medallionWidth: number,
): PrintSpec[] {
  const specs: PrintSpec[] = [
    {
      name: `menu-${name}-medallion`,
      figure,
      bodyWidth: medallionWidth,
      ink: PRINT_COLORS.ember,
    },
    {
      name: `menu-${name}-thumb`,
      figure,
      bodyWidth: MENU_THUMB_WIDTH,
      ink: PRINT_COLORS.ember,
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
  // Menu: the wheel in its two versions, then a miniature per page.
  ...menuWheelPrints('plain', MENU_WHEEL_PLAIN),
  ...menuWheelPrints('rune', MENU_WHEEL_RUNE),
  ...menuMiniaturePrints(
    'paladev',
    PALADEV_STANDING,
    MENU_PALADEV_MEDALLION_WIDTH,
  ),
  ...menuMiniaturePrints('tree', TREE, MENU_MEDALLION_WIDTH),
  ...menuMiniaturePrints('book', BOOK, MENU_MEDALLION_WIDTH),
  ...menuMiniaturePrints('anvil', ANVIL, MENU_MEDALLION_WIDTH),
  ...menuMiniaturePrints('envelope', ENVELOPE, MENU_MEDALLION_WIDTH),
];
