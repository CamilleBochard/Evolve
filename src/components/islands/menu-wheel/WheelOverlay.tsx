import { MENU_ENTRIES } from '../../../data/menu';
import type { MenuVersion } from '../../../data/menu';
import { leaderLine, wheelPoint } from '../../../lib/menu/wheel-geometry';
import {
  MENU_VIEWBOX,
  MENU_WHEEL,
  WHEEL_CENTER,
  WHEEL_RING_RADIUS,
} from '../../../lib/prints/figures/wheel-shape.ts';
import styles from './WheelOverlay.module.css';

// Slow dotted ring around the whole wheel, and the dashed ring around the
// rune, in figure units.
const OUTER_RING_RADIUS = 116;
const RUNE_RING_RADIUS = 48;
const SELECTION_RING_GAP = 5;
// Each selection ring starts at another point of its turn, so they never
// spin in step.
const RING_DELAY_STEP_SECONDS = 4;

const VIEWBOX = `${MENU_VIEWBOX.x} ${MENU_VIEWBOX.y} ${MENU_VIEWBOX.width} ${MENU_VIEWBOX.height}`;

interface WheelOverlayProps {
  version: MenuVersion;
  selectedIndex: number;
  // Ring delays are set once the island runs in the browser.
  isAwake: boolean;
}

// Drawn over the print: the spinning outer ring, then the dashed ring and
// the leader line of the selected entry.
export function WheelOverlay({
  version,
  selectedIndex,
  isAwake,
}: WheelOverlayProps) {
  const classNames = [styles.overlay];
  if (version === 'rune') {
    classNames.push(styles.rune);
  }

  return (
    <svg className={classNames.join(' ')} viewBox={VIEWBOX} aria-hidden="true">
      <g className={styles.spin}>
        <circle
          className={styles.outerRing}
          cx={WHEEL_CENTER.x}
          cy={WHEEL_CENTER.y}
          r={OUTER_RING_RADIUS}
        />
      </g>
      <circle
        className={styles.runeRing}
        cx={WHEEL_CENTER.x}
        cy={WHEEL_CENTER.y}
        r={RUNE_RING_RADIUS}
      />
      {MENU_ENTRIES.map((entry, index) => {
        const medallion = wheelPoint(index, WHEEL_RING_RADIUS);
        const line = leaderLine(index);
        let ringDelay: { animationDelay: string } | undefined;
        if (isAwake) {
          ringDelay = {
            animationDelay: `-${index * RING_DELAY_STEP_SECONDS}s`,
          };
        }
        let markClass: string | undefined;
        if (index === selectedIndex) {
          markClass = styles.selected;
        }
        return (
          <g key={entry.id} className={markClass}>
            <circle
              className={styles.ring}
              style={ringDelay}
              cx={medallion.x}
              cy={medallion.y}
              r={MENU_WHEEL.medallionSize + SELECTION_RING_GAP}
            />
            <line
              className={styles.leader}
              x1={line.from.x}
              y1={line.from.y}
              x2={line.to.x}
              y2={line.to.y}
            />
          </g>
        );
      })}
    </svg>
  );
}
