// ChessMe: a knight on its pedestal, over a chessboard in perspective.
import { workshopFigure } from './workshop.ts';

const BOARD = {
  rows: 4,
  columns: 8,
  backY: 262,
  frontY: 300,
  backHalfWidth: 74,
  frontHalfWidth: 112,
  centerX: 120,
};

// Left edge of a column at a given half width of the board.
function columnX(halfWidth: number, column: number): number {
  const x =
    BOARD.centerX - halfWidth + (halfWidth * 2 * column) / BOARD.columns;
  return x;
}

// Rows get narrower towards the back.
function boardFloor(): string {
  const squares: string[] = [];
  const depth = BOARD.frontY - BOARD.backY;
  const widening = BOARD.frontHalfWidth - BOARD.backHalfWidth;
  for (let row = 0; row < BOARD.rows; row++) {
    const topRatio = row / BOARD.rows;
    const bottomRatio = (row + 1) / BOARD.rows;
    const topY = BOARD.backY + depth * topRatio;
    const bottomY = BOARD.backY + depth * bottomRatio;
    const topHalf = BOARD.backHalfWidth + widening * topRatio;
    const bottomHalf = BOARD.backHalfWidth + widening * bottomRatio;
    for (let column = 0; column < BOARD.columns; column++) {
      const topLeft = columnX(topHalf, column);
      const topRight = columnX(topHalf, column + 1);
      const bottomLeft = columnX(bottomHalf, column);
      const bottomRight = columnX(bottomHalf, column + 1);
      let fill = '#2a2a2a';
      if ((row + column) % 2 === 0) {
        fill = '#d6d6d6';
      }
      squares.push(
        `<path d="M${topLeft} ${topY} L${topRight} ${topY} L${bottomRight} ${bottomY} L${bottomLeft} ${bottomY} Z" fill="${fill}" stroke="#000" stroke-width="1"/>`,
      );
    }
  }
  const markup = squares.join('');
  return markup;
}

export const KNIGHT = workshopFigure(`
  ${boardFloor()}
  <ellipse cx="120" cy="252" rx="54" ry="10" fill="url(#steel)" stroke="#000" stroke-width="2"/>
  <rect x="72" y="226" width="96" height="26" fill="url(#steel)" stroke="#000" stroke-width="2"/>
  <ellipse cx="120" cy="226" rx="50" ry="8" fill="url(#steel-down)" stroke="#000" stroke-width="2"/>
  <rect x="82" y="210" width="76" height="14" fill="url(#steel)" stroke="#000" stroke-width="2"/>
  <path d="M86 212 C88 192 96 178 108 168 C94 166 78 160 66 150 C56 142 54 130 62 124 C70 118 82 120 90 116
           C96 104 96 94 92 86 L104 70 L114 84 C124 78 136 78 146 84 L154 64 L160 90
           C180 104 192 134 188 168 C186 190 176 204 166 212 Z"
        fill="url(#steel)" stroke="#000" stroke-width="2.4"/>
  <path d="M160 94 C172 108 178 128 178 150 M150 102 C160 118 164 138 162 160 M140 110 C148 126 150 146 148 166"
        fill="none" stroke="#000" stroke-width="2"/>
  <path d="M100 170 C112 180 124 186 140 188 M96 186 C110 196 128 200 146 200"
        fill="none" stroke="#000" stroke-width="1.6"/>
  <ellipse cx="106" cy="104" rx="6" ry="4" fill="#000"/>
  <circle cx="66" cy="132" r="2.6" fill="#000"/>
  <path d="M58 140 C66 145 76 145 84 140" fill="none" stroke="#000" stroke-width="2"/>
  <path d="M70 124 C78 120 86 122 92 118" fill="none" stroke="#f4f4f4" stroke-width="2"/>`);
