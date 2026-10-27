// Generates the halftone prints of the site into src/assets/prints/.
// Run before dev, check and build: the pages import the PNG files, and the
// browser never computes a print.
//
// For each print:
// 1. the sun is rasterized at twice the body scale and printed with grain;
// 2. the body is rasterized at its own scale, printed with the Bayer
//    screen, then enlarged twice without smoothing;
// 3. both layers are stacked in one transparent PNG.
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';
import type { OverlayOptions, SharpOptions } from 'sharp';

import { ditherPixels } from '../src/lib/prints/dither.ts';
import type { DitherOptions } from '../src/lib/prints/dither.ts';
import type { ViewBox } from '../src/lib/prints/figures/figure.ts';
import { PRINT_COLORS, PRINT_SPECS } from '../src/lib/prints/print-specs.ts';
import type { PrintSpec } from '../src/lib/prints/print-specs.ts';

const OUTPUT_DIRECTORY = fileURLToPath(
  new URL('../src/assets/prints/', import.meta.url),
);
// Output pixels per body pixel.
const OUTPUT_DENSITY = 2;
// Density at which sharp reads an SVG whose width is given in pixels.
const SVG_BASE_DENSITY = 72;

const SUN_PRINT = {
  grain: 0,
  contrast: 1.4,
  seed: 3,
  pattern: 'noise',
  keepAlpha: true,
} as const;

const BODY_PRINT = {
  grain: 0.22,
  contrast: 1.35,
  seed: 7,
  pattern: 'bayer',
  keepAlpha: true,
} as const;

interface RawLayer {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

// Rasterizes an SVG document to an exact pixel size, as RGBA.
// sourceWidth is the width written in the SVG document, in pixels.
async function rasterize(
  svg: string,
  sourceWidth: number,
  width: number,
  height: number,
): Promise<RawLayer> {
  const scale = width / sourceWidth;
  const { data, info } = await sharp(Buffer.from(svg), {
    density: SVG_BASE_DENSITY * scale,
  })
    .resize(width, height, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const layer: RawLayer = {
    data: new Uint8ClampedArray(data),
    width: info.width,
    height: info.height,
  };
  return layer;
}

async function printLayer(
  svg: string,
  box: ViewBox,
  scale: number,
  options: DitherOptions,
): Promise<RawLayer> {
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);
  const picture = await rasterize(svg, box.width, width, height);
  const printed: RawLayer = {
    data: ditherPixels(picture.data, width, height, options),
    width,
    height,
  };
  return printed;
}

function rawInput(layer: RawLayer): SharpOptions {
  const input: SharpOptions = {
    raw: { width: layer.width, height: layer.height, channels: 4 },
  };
  return input;
}

// Enlarges a printed layer without smoothing, so each dot stays square.
async function enlarge(layer: RawLayer, factor: number): Promise<Buffer> {
  const enlarged = await sharp(Buffer.from(layer.data), rawInput(layer))
    .resize(layer.width * factor, layer.height * factor, { kernel: 'nearest' })
    .png()
    .toBuffer();
  return enlarged;
}

async function encode(layer: RawLayer): Promise<Buffer> {
  const encoded = await sharp(Buffer.from(layer.data), rawInput(layer))
    .png()
    .toBuffer();
  return encoded;
}

async function generatePrint(spec: PrintSpec): Promise<string> {
  const { figure } = spec;
  const layers = spec.layers ?? ['sun', 'body'];
  const inks = { paper: PRINT_COLORS.paper, ink: spec.ink, accent: spec.ink };
  const bodyScale = spec.bodyWidth / figure.viewBox.width;
  const outputScale = bodyScale * OUTPUT_DENSITY;

  // The PNG covers the sun box when the sun runs past the body.
  let outputBox = figure.viewBox;
  if (layers.includes('sun') && figure.sunViewBox) {
    outputBox = figure.sunViewBox;
  }
  const outputWidth = Math.round(outputBox.width * outputScale);
  const outputHeight = Math.round(outputBox.height * outputScale);

  const composites: OverlayOptions[] = [];
  if (layers.includes('sun')) {
    const sunBox = figure.sunViewBox ?? figure.viewBox;
    const sun = await printLayer(figure.sun, sunBox, outputScale, {
      ...inks,
      ...SUN_PRINT,
    });
    composites.push({ input: await encode(sun), left: 0, top: 0 });
  }
  if (layers.includes('body')) {
    const body = await printLayer(figure.body, figure.viewBox, bodyScale, {
      ...inks,
      ...BODY_PRINT,
    });
    composites.push({
      input: await enlarge(body, OUTPUT_DENSITY),
      left: Math.round((figure.viewBox.x - outputBox.x) * outputScale),
      top: Math.round((figure.viewBox.y - outputBox.y) * outputScale),
    });
  }

  const outputPath = `${OUTPUT_DIRECTORY}${spec.name}.png`;
  await sharp({
    create: {
      width: outputWidth,
      height: outputHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png({ compressionLevel: 9, palette: true })
    .toFile(outputPath);
  return outputPath;
}

await mkdir(OUTPUT_DIRECTORY, { recursive: true });
for (const spec of PRINT_SPECS) {
  const outputPath = await generatePrint(spec);
  console.log(`print: ${outputPath}`);
}
