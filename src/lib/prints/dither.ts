// Halftone print: each pixel of a grayscale picture is reduced to one ink,
// with an ordered (Bayer) screen or a random grain, like a cheap print.
// Pure function on an RGBA buffer, so it runs the same at build time and in
// tests, without a canvas.

export type DitherPattern = 'bayer' | 'noise';

export interface DitherOptions {
  // Hex colors, for example '#cf5a44'.
  paper: string;
  ink: string;
  accent: string;
  // Random jitter added to the Bayer threshold, from 0 to 1.
  grain: number;
  // 1 keeps the tones; above 1 pushes them away from mid-gray.
  contrast: number;
  // Seed of the grain, so the print is the same on every build.
  seed: number;
  pattern: DitherPattern;
  // Leaves transparent the pixels where the picture is empty.
  keepAlpha: boolean;
}

type Rgb = [number, number, number];

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// Above this share of red over green and blue, a pixel takes the accent ink.
const ACCENT_MIN_STRENGTH = 0.2;
// Below this alpha, a pixel counts as empty.
const EMPTY_ALPHA = 128;

// Mulberry32: a small seeded random generator.
export function createGrain(seed: number): () => number {
  let state = seed >>> 0;
  function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    const result = ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    return result;
  }
  return next;
}

export function hexToRgb(hex: string): Rgb {
  const value = Number.parseInt(hex.slice(1), 16);
  const rgb: Rgb = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  return rgb;
}

function applyContrast(luminance: number, contrast: number): number {
  const stretched = (luminance - 0.5) * contrast + 0.5;
  const clamped = Math.min(1, Math.max(0, stretched));
  return clamped;
}

function thresholdAt(
  x: number,
  y: number,
  options: DitherOptions,
  grain: () => number,
): number {
  let threshold = grain();
  if (options.pattern === 'bayer') {
    const screen = (BAYER_4[y % 4][x % 4] + 0.5) / 16;
    threshold = screen + (grain() - 0.5) * options.grain;
  }
  return threshold;
}

interface Inks {
  paper: Rgb;
  ink: Rgb;
  accent: Rgb;
}

// Light tones become ink, dark tones stay paper; reddish tones become accent.
function pickInk(
  red: number,
  green: number,
  blue: number,
  threshold: number,
  inks: Inks,
  contrast: number,
): Rgb {
  let color = inks.paper;
  const accentStrength = (red - Math.max(green, blue)) / 255;
  if (accentStrength > ACCENT_MIN_STRENGTH) {
    if (red / 255 > threshold) {
      color = inks.accent;
    }
    return color;
  }
  const luminance = (0.3 * red + 0.59 * green + 0.11 * blue) / 255;
  if (applyContrast(luminance, contrast) > threshold) {
    color = inks.ink;
  }
  return color;
}

// Returns a new RGBA buffer of the same size, printed with the inks.
export function ditherPixels(
  pixels: Uint8Array | Uint8ClampedArray,
  width: number,
  height: number,
  options: DitherOptions,
): Uint8ClampedArray {
  const printed = new Uint8ClampedArray(width * height * 4);
  const grain = createGrain(options.seed);
  const inks: Inks = {
    paper: hexToRgb(options.paper),
    ink: hexToRgb(options.ink),
    accent: hexToRgb(options.accent),
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const threshold = thresholdAt(x, y, options, grain);
      const color = pickInk(
        pixels[index],
        pixels[index + 1],
        pixels[index + 2],
        threshold,
        inks,
        options.contrast,
      );
      let alpha = 255;
      const isEmpty = pixels[index + 3] < EMPTY_ALPHA;
      if (options.keepAlpha && isEmpty) {
        alpha = 0;
      }
      printed[index] = color[0];
      printed[index + 1] = color[1];
      printed[index + 2] = color[2];
      printed[index + 3] = alpha;
    }
  }
  return printed;
}
