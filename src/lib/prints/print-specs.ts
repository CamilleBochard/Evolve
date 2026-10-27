// Every print of the site, generated at build time by
// scripts/generate-prints.ts into src/assets/prints/<name>.png.
//
// bodyWidth is the width at which the page shows the body, in CSS pixels:
// one Bayer dot per CSS pixel. The PNG is twice as large, so the finer sun
// grain stays sharp on high-density screens.
import { ENVELOPE } from './figures/envelope.ts';
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

export const PRINT_SPECS: PrintSpec[] = [
  {
    name: 'envelope',
    figure: ENVELOPE,
    bodyWidth: 300,
    ink: PRINT_COLORS.ember,
  },
];
