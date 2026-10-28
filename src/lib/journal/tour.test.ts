import { describe, expect, it } from 'vitest';

import { cardPosition, centeredPosition, spotBox } from './tour';

const SCREEN = { width: 1440, height: 900 };
const CARD = { width: 360, height: 220 };

describe('spotBox', () => {
  it('leaves some room around the area', () => {
    const spot = spotBox(
      { top: 100, left: 100, bottom: 200, right: 300 },
      SCREEN,
    );
    expect(spot).toEqual({ top: 94, left: 94, bottom: 206, right: 306 });
  });

  it('cuts a tall area to the screen', () => {
    const spot = spotBox(
      { top: 50, left: 0, bottom: 2000, right: 300 },
      SCREEN,
    );
    expect(spot.bottom).toBe(888);
    expect(spot.left).toBe(2);
  });
});

describe('cardPosition', () => {
  it('puts the card below the spot when it fits', () => {
    const spot = { top: 100, left: 400, bottom: 200, right: 700 };
    expect(cardPosition(spot, CARD, SCREEN)).toEqual({ top: 214, left: 400 });
  });

  it('puts the card above a spot at the bottom of the screen', () => {
    const spot = { top: 600, left: 400, bottom: 800, right: 700 };
    expect(cardPosition(spot, CARD, SCREEN).top).toBe(366);
  });

  it('puts the card on the right of a spot as tall as the screen', () => {
    const spot = { top: 12, left: 40, bottom: 888, right: 400 };
    expect(cardPosition(spot, CARD, SCREEN)).toEqual({ top: 12, left: 414 });
  });

  it('keeps the card on screen', () => {
    const spot = { top: 100, left: 1300, bottom: 200, right: 1430 };
    expect(cardPosition(spot, CARD, SCREEN).left).toBe(1068);
  });
});

describe('centeredPosition', () => {
  it('centers the card on the screen', () => {
    expect(centeredPosition(CARD, SCREEN)).toEqual({ top: 340, left: 540 });
  });
});
