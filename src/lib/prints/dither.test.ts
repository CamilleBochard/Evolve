import { describe, expect, it } from 'vitest';

import { createGrain, ditherPixels, hexToRgb } from './dither';
import type { DitherOptions } from './dither';

const OPTIONS: DitherOptions = {
  paper: '#000000',
  ink: '#ffffff',
  accent: '#ff0000',
  grain: 0,
  contrast: 1,
  seed: 1,
  pattern: 'bayer',
  keepAlpha: true,
};

// A single-color picture of the given size, as an RGBA buffer.
function solidPicture(
  width: number,
  height: number,
  rgba: [number, number, number, number],
): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < pixels.length; index += 4) {
    pixels.set(rgba, index);
  }
  return pixels;
}

function pixelAt(pixels: Uint8ClampedArray, index: number): number[] {
  const pixel = Array.from(pixels.slice(index * 4, index * 4 + 4));
  return pixel;
}

describe('hexToRgb', () => {
  it('reads a six-digit hex color', () => {
    expect(hexToRgb('#cf5a44')).toEqual([207, 90, 68]);
  });
});

describe('createGrain', () => {
  it('gives the same sequence for the same seed', () => {
    const first = createGrain(7);
    const second = createGrain(7);
    expect([first(), first(), first()]).toEqual([second(), second(), second()]);
  });
});

describe('ditherPixels', () => {
  it('prints white as ink and black as paper', () => {
    const white = ditherPixels(
      solidPicture(4, 4, [255, 255, 255, 255]),
      4,
      4,
      OPTIONS,
    );
    const black = ditherPixels(
      solidPicture(4, 4, [0, 0, 0, 255]),
      4,
      4,
      OPTIONS,
    );
    expect(pixelAt(white, 5)).toEqual([255, 255, 255, 255]);
    expect(pixelAt(black, 5)).toEqual([0, 0, 0, 255]);
  });

  it('prints mid-gray as an even mix of ink and paper', () => {
    const gray = ditherPixels(
      solidPicture(4, 4, [128, 128, 128, 255]),
      4,
      4,
      OPTIONS,
    );
    let inkCount = 0;
    for (let index = 0; index < 16; index++) {
      if (gray[index * 4] === 255) {
        inkCount++;
      }
    }
    expect(inkCount).toBe(8);
  });

  it('prints reddish tones with the accent ink', () => {
    const red = ditherPixels(
      solidPicture(4, 4, [255, 20, 20, 255]),
      4,
      4,
      OPTIONS,
    );
    expect(pixelAt(red, 0)).toEqual([255, 0, 0, 255]);
  });

  it('keeps empty pixels transparent when asked', () => {
    const empty = solidPicture(2, 2, [255, 255, 255, 0]);
    const kept = ditherPixels(empty, 2, 2, OPTIONS);
    const filled = ditherPixels(empty, 2, 2, { ...OPTIONS, keepAlpha: false });
    expect(kept[3]).toBe(0);
    expect(filled[3]).toBe(255);
  });

  it('gives the same print on every run', () => {
    const picture = solidPicture(8, 8, [140, 140, 140, 255]);
    const noisy: DitherOptions = { ...OPTIONS, pattern: 'noise' };
    expect(ditherPixels(picture, 8, 8, noisy)).toEqual(
      ditherPixels(picture, 8, 8, noisy),
    );
  });
});
