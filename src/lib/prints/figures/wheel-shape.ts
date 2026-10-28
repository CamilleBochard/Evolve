// Dimensions of the menu wheel, in figure units. Shared by the print of the
// wheel and by the menu page, which lays its entries over the medallions.
import type { ViewBox } from './figure.ts';

export const WHEEL_CENTER = { x: 120, y: 140 };
// Radius of the circle the medallion centers sit on.
export const WHEEL_RING_RADIUS = 80;

export type WheelHub = 'helm' | 'rune' | 'none';

export interface WheelShape {
  // One medallion per menu entry.
  count: number;
  medallionSize: number;
  tickInner: number;
  tickOuter: number;
  // Inner octagon of each medallion: fill and size relative to the medallion.
  innerFill: string;
  innerRatio: number;
  hub: WheelHub;
  hubScale: number;
}

// Menu wheel: a larger dark core (thinner border) for the miniatures, and a
// smaller hub, so some black is left between the hub and the miniatures.
export const MENU_WHEEL: WheelShape = {
  count: 5,
  medallionSize: 27,
  tickInner: 110,
  tickOuter: 119,
  innerFill: '#000',
  innerRatio: 0.8,
  hub: 'rune',
  hubScale: 0.96,
};

// The wheel cropped square around its center.
export const MENU_VIEWBOX: ViewBox = { x: 0, y: 20, width: 240, height: 240 };

// The sun starts beyond the medallions and runs past the wheel: it is drawn
// on a box twice as large, centered on the wheel, and may leave the window.
export const MENU_SUN_VIEWBOX: ViewBox = {
  x: -120,
  y: -100,
  width: 480,
  height: 480,
};
