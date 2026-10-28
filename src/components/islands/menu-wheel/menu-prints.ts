// Prints of the menu wheel, generated at build time.
import type { MenuFigure } from '../../../data/menu';
import type { PrintFile } from '../shared/print-file';

export interface MenuWheelPrints {
  wheel: PrintFile;
  // Twice as wide as the wheel, centered on it.
  sun: PrintFile;
  // Miniature of each page, in the dark core of its medallion.
  medallions: Record<MenuFigure, PrintFile>;
}
