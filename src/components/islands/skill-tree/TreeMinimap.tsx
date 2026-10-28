import { memo, useRef } from 'react';
import type { PointerEvent } from 'react';

import {
  HUB_CUT,
  HUB_HALF,
  SAT_HEIGHT,
  SAT_WIDTH,
  octagonPoints,
} from '../../../lib/skill-tree/layout';
import type { TreeLayout } from '../../../lib/skill-tree/layout';
import styles from './TreeMinimap.module.css';

export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TreeMinimapProps {
  layout: TreeLayout;
  // Visible area of the tree, in tree units.
  viewport: Viewport;
  // Point to center the view on, in tree units.
  onNavigate: (x: number, y: number, animate: boolean) => void;
}

// The static drawing: it only changes with the layout.
const MinimapShapes = memo(function MinimapShapes({
  layout,
}: {
  layout: TreeLayout;
}) {
  return (
    <>
      {layout.dividers.map((x) => (
        <path
          key={x}
          className={styles.divider}
          d={`M${x} 24 V${layout.height - 24}`}
        />
      ))}
      {layout.spines.map((spine) => (
        <path
          key={spine.hubId}
          className={`${styles.spine} ${styles[spine.state]}`}
          d={spine.path}
        />
      ))}
      {layout.satellites.map((satellite) => (
        <rect
          key={satellite.skill.id}
          className={styles.satellites}
          x={satellite.x}
          y={satellite.y}
          width={SAT_WIDTH}
          height={SAT_HEIGHT}
        />
      ))}
      {layout.hubs.map((placed) => (
        <polygon
          key={placed.hub.id}
          className={`${styles.hub} ${styles[placed.hub.state]}`}
          points={octagonPoints(placed.x, placed.y, HUB_HALF + 8, HUB_CUT + 3)}
        />
      ))}
    </>
  );
});

// Overview of the tree with the visible area framed; click or drag to move.
// A mouse shortcut only: the keyboard reaches every skill through Tab.
export function TreeMinimap({
  layout,
  viewport,
  onNavigate,
}: TreeMinimapProps) {
  const isDragging = useRef(false);

  function treePoint(event: PointerEvent<SVGSVGElement>): {
    x: number;
    y: number;
  } {
    const bounds = event.currentTarget.getBoundingClientRect();
    const point = {
      x: ((event.clientX - bounds.left) / bounds.width) * layout.width,
      y: ((event.clientY - bounds.top) / bounds.height) * layout.height,
    };
    return point;
  }

  function onPointerDown(event: PointerEvent<SVGSVGElement>): void {
    isDragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = treePoint(event);
    onNavigate(point.x, point.y, true);
  }

  function onPointerMove(event: PointerEvent<SVGSVGElement>): void {
    if (!isDragging.current) {
      return;
    }
    const point = treePoint(event);
    onNavigate(point.x, point.y, false);
  }

  function onPointerUp(): void {
    isDragging.current = false;
  }

  return (
    <div className={styles.minimap} aria-hidden="true">
      <div className={styles.caption}>
        <span>Radar</span>
        <span>MAP.01</span>
      </div>
      <svg
        className={styles.map}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <MinimapShapes layout={layout} />
        <rect
          className={styles.view}
          x={viewport.x}
          y={viewport.y}
          width={viewport.width}
          height={viewport.height}
        />
      </svg>
    </div>
  );
}
