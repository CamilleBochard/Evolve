// Placement of the tutorial: the spot cut around the explained area, and
// the card that explains it, both kept on screen.

// Room between the spot and the card, and around the screen edges.
const CARD_GAP = 14;
const SCREEN_MARGIN = 12;
// Room between the explained area and the spot.
const SPOT_PADDING = 6;
// Side margin of the spot: tighter than the card's, the spot is thin.
const SPOT_SIDE_MARGIN = 2;

export interface Box {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Point {
  top: number;
  left: number;
}

function clamp(value: number, min: number, max: number): number {
  const clamped = Math.min(Math.max(value, min), max);
  return clamped;
}

// The area with some room around it. A tall area, like the quest list, is
// cut to the screen so the card still has room.
export function spotBox(area: Box, screen: Size): Box {
  const spot: Box = {
    top: Math.max(area.top - SPOT_PADDING, SCREEN_MARGIN),
    left: Math.max(area.left - SPOT_PADDING, SPOT_SIDE_MARGIN),
    bottom: Math.min(area.bottom + SPOT_PADDING, screen.height - SCREEN_MARGIN),
    right: Math.min(area.right + SPOT_PADDING, screen.width - SPOT_SIDE_MARGIN),
  };
  return spot;
}

// The card goes below the spot, else above, else on its right, and always
// stays on screen.
export function cardPosition(spot: Box, card: Size, screen: Size): Point {
  let top = spot.bottom + CARD_GAP;
  let left = spot.left;
  const fitsBelow = top + card.height <= screen.height - SCREEN_MARGIN;
  const fitsAbove = spot.top - CARD_GAP - card.height >= SCREEN_MARGIN;
  const fitsRight =
    spot.right + CARD_GAP + card.width <= screen.width - SCREEN_MARGIN;
  if (!fitsBelow && fitsAbove) {
    top = spot.top - CARD_GAP - card.height;
  }
  if (!fitsBelow && !fitsAbove && fitsRight) {
    top = spot.top;
    left = spot.right + CARD_GAP;
  }
  const position: Point = {
    top: clamp(top, SCREEN_MARGIN, screen.height - card.height - SCREEN_MARGIN),
    left: clamp(left, SCREEN_MARGIN, screen.width - card.width - SCREEN_MARGIN),
  };
  return position;
}

export function centeredPosition(card: Size, screen: Size): Point {
  const position: Point = {
    top: (screen.height - card.height) / 2,
    left: (screen.width - card.width) / 2,
  };
  return position;
}
