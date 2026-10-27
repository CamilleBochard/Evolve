// A figure printed in two layers, the way the paladev miniature is:
// - sun: the spiked crown behind, printed with a fine random grain;
// - body: the subject in front, printed with the coarse Bayer screen.
// Both are grayscale SVG documents without background: light tones become
// ink, dark tones and black strokes stay paper.

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PrintFigure {
  viewBox: ViewBox;
  sun: string;
  body: string;
  // Set when the sun runs past the body, like the wide sun of the menu.
  sunViewBox?: ViewBox;
}

export function viewBoxAttribute(viewBox: ViewBox): string {
  const attribute = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
  return attribute;
}

// Steel gradients shared by the figures: light on the left or the top.
export const STEEL_GRADIENTS = `
  <defs>
    <linearGradient id="steel" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#f4f4f4"/><stop offset="0.45" stop-color="#a6a6a6"/><stop offset="1" stop-color="#363636"/>
    </linearGradient>
    <linearGradient id="steel-down" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#e6e6e6"/><stop offset="1" stop-color="#3e3e3e"/>
    </linearGradient>
  </defs>`;

export function svgDocument(viewBox: ViewBox, content: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxAttribute(viewBox)}" width="${viewBox.width}" height="${viewBox.height}">${STEEL_GRADIENTS}${content}</svg>`;
  return svg;
}

// Corner points of a regular octagon, flat on each side.
export function octagonPoints(
  centerX: number,
  centerY: number,
  radius: number,
): string {
  const points: string[] = [];
  for (let index = 0; index < 8; index++) {
    const angle = Math.PI / 8 + (index * Math.PI) / 4;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    points.push(`${x},${y}`);
  }
  const list = points.join(' ');
  return list;
}
