import { memo } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';

import type { SkillState } from '../../../data/skill-tree';
import {
  HUB_CUT,
  HUB_HALF,
  HUB_LABEL_HEIGHT,
  HUB_LABEL_OFFSET,
  HUB_RING,
  SAT_HEIGHT,
  SAT_WIDTH,
  countUnlockedSatellites,
  octagonPoints,
  satellitePoints,
} from '../../../lib/skill-tree/layout';
import type {
  PlacedHub,
  PlacedSatellite,
  TreeLayout,
} from '../../../lib/skill-tree/layout';
import { STATE_LABELS } from '../../../lib/skill-tree/popup';
import styles from './TreeSvg.module.css';

interface NodeHandlers {
  onToggle: (id: string) => void;
  onFocusSkill: (id: string) => void;
}

interface TreeSvgProps extends NodeHandlers {
  layout: TreeLayout;
  scale: number;
  selectedId: string | null;
  // Click on the empty tree, outside any skill.
  onBackgroundClick: () => void;
}

function stateClass(state: SkillState): string {
  const className = styles[state];
  return className;
}

// Enter and Space open a skill, like a button.
function activationHandler(id: string, onToggle: (id: string) => void) {
  function onKeyDown(event: KeyboardEvent<SVGGElement>): void {
    const isActivation = event.key === 'Enter' || event.key === ' ';
    if (isActivation) {
      event.preventDefault();
      onToggle(id);
    }
  }
  return onKeyDown;
}

interface HubNodeProps extends NodeHandlers {
  placed: PlacedHub;
  isSelected: boolean;
}

const HubNode = memo(function HubNode({
  placed,
  isSelected,
  onToggle,
  onFocusSkill,
}: HubNodeProps) {
  const { hub, x, y } = placed;
  const labelY = y + HUB_HALF + HUB_LABEL_OFFSET;
  const classNames = [styles.hub, stateClass(hub.state)];
  if (isSelected) {
    classNames.push(styles.selected);
  }
  const label = `${hub.name}, ${STATE_LABELS[hub.state]}, ${countUnlockedSatellites(hub)} satellites débloqués`;
  return (
    <g
      className={classNames.join(' ')}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-expanded={isSelected}
      data-skill-id={hub.id}
      onClick={() => onToggle(hub.id)}
      onKeyDown={activationHandler(hub.id, onToggle)}
      onFocus={() => onFocusSkill(hub.id)}
    >
      <polygon
        className={styles.ring}
        points={octagonPoints(x, y, HUB_HALF + HUB_RING, HUB_CUT + 3)}
      />
      <polygon
        className={styles.core}
        points={octagonPoints(x, y, HUB_HALF, HUB_CUT)}
      />
      <text className={styles.mono} x={x} y={y + 6}>
        {hub.mono}
      </text>
      <rect
        className={styles.labelBackground}
        x={x - placed.labelWidth / 2}
        y={labelY}
        width={placed.labelWidth}
        height={HUB_LABEL_HEIGHT}
      />
      <text className={styles.label} x={x} y={labelY + 14}>
        {placed.label}
      </text>
    </g>
  );
});

interface SatelliteNodeProps extends NodeHandlers {
  satellite: PlacedSatellite;
  isSelected: boolean;
}

const SatelliteNode = memo(function SatelliteNode({
  satellite,
  isSelected,
  onToggle,
  onFocusSkill,
}: SatelliteNodeProps) {
  const { skill, x, y } = satellite;
  const classNames = [styles.satellite, stateClass(skill.state)];
  if (isSelected) {
    classNames.push(styles.selected);
  }
  return (
    <g
      className={classNames.join(' ')}
      role="button"
      tabIndex={0}
      aria-label={`${skill.name}, ${STATE_LABELS[skill.state]}`}
      aria-expanded={isSelected}
      data-skill-id={skill.id}
      onClick={() => onToggle(skill.id)}
      onKeyDown={activationHandler(skill.id, onToggle)}
      onFocus={() => onFocusSkill(skill.id)}
    >
      <polygon points={satellitePoints(x, y)} />
      <text x={x + 10} y={y + 19}>
        {skill.name}
      </text>
      {skill.state === 'progress' && (
        <rect
          className={styles.pulse}
          x={x + SAT_WIDTH - 14}
          y={y + SAT_HEIGHT / 2 - 4}
          width={6}
          height={6}
        />
      )}
    </g>
  );
});

// The whole tree, drawn in tree units and scaled through its size: the
// drawing and its hit areas shrink together on small screens.
export function TreeSvg({
  layout,
  scale,
  selectedId,
  onToggle,
  onFocusSkill,
  onBackgroundClick,
}: TreeSvgProps) {
  function onClick(event: MouseEvent<SVGSVGElement>): void {
    const target = event.target;
    const isOnSkill =
      target instanceof Element && target.closest('[data-skill-id]') !== null;
    if (!isOnSkill) {
      onBackgroundClick();
    }
  }

  return (
    <svg
      className={styles.tree}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      width={layout.width * scale}
      height={layout.height * scale}
      role="group"
      aria-label="Arbre des compétences"
      onClick={onClick}
    >
      {layout.dividers.map((x) => (
        <path
          key={x}
          className={styles.divider}
          d={`M${x} 24 V${layout.height - 24}`}
        />
      ))}
      {layout.titles.map((title) => (
        <g key={title.branchId}>
          <text className={styles.branchTitle} x={title.x} y={title.y}>
            {title.name}
          </text>
          <text className={styles.branchCode} x={title.x} y={title.y + 16}>
            {title.code}
          </text>
        </g>
      ))}
      {layout.spines.map((spine) => (
        <path
          key={spine.hubId}
          className={`${styles.spine} ${stateClass(spine.state)}`}
          d={spine.path}
        />
      ))}
      {layout.satellites.map((satellite) => (
        <path
          key={`link-${satellite.skill.id}`}
          className={`${styles.link} ${stateClass(satellite.skill.state)}`}
          d={satellite.linkPath}
        />
      ))}
      {layout.satellites.map((satellite) => (
        <SatelliteNode
          key={satellite.skill.id}
          satellite={satellite}
          isSelected={satellite.skill.id === selectedId}
          onToggle={onToggle}
          onFocusSkill={onFocusSkill}
        />
      ))}
      {layout.hubs.map((placed) => (
        <HubNode
          key={placed.hub.id}
          placed={placed}
          isSelected={placed.hub.id === selectedId}
          onToggle={onToggle}
          onFocusSkill={onFocusSkill}
        />
      ))}
    </svg>
  );
}
