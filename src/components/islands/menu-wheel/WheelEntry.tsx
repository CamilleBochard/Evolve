import type { CSSProperties, Ref } from 'react';

import type { MenuEntry } from '../../../data/menu';
import {
  entryPlacement,
  hitSizePercent,
  miniatureSizePercent,
} from '../../../lib/menu/wheel-geometry';
import type { PrintFile } from '../shared/print-file';
import styles from './WheelEntry.module.css';

interface WheelEntryProps {
  entry: MenuEntry;
  index: number;
  miniature: PrintFile;
  isSelected: boolean;
  // Positions are set once the island runs in the browser.
  isAwake: boolean;
  onSelect: (index: number) => void;
  ref?: Ref<HTMLAnchorElement>;
}

export function entryNumber(index: number): string {
  const number = String(index + 1).padStart(2, '0');
  return number;
}

interface EntryStyles {
  hit?: CSSProperties;
  label?: CSSProperties;
  miniature?: CSSProperties;
}

// Set through the CSS object model in the browser, never as an inline
// style attribute in the HTML: the Content Security Policy refuses those.
function entryStyles(index: number, isAwake: boolean): EntryStyles {
  if (!isAwake) {
    const empty: EntryStyles = {};
    return empty;
  }
  const placement = entryPlacement(index);
  const styles: EntryStyles = {
    hit: {
      left: `${placement.medallion.x}%`,
      top: `${placement.medallion.y}%`,
      width: `${hitSizePercent()}%`,
    },
    label: {
      left: `${placement.label.x}%`,
      top: `${placement.label.y}%`,
    },
    miniature: { width: `${miniatureSizePercent()}%` },
  };
  return styles;
}

// One page of the menu: the miniature over its medallion, its number in a
// badge, and its name outside the wheel. Both parts are placed over the
// whole wheel and belong to the same link.
export function WheelEntry({
  entry,
  index,
  miniature,
  isSelected,
  isAwake,
  onSelect,
  ref,
}: WheelEntryProps) {
  const placement = entryStyles(index, isAwake);
  const classNames = [styles.entry];
  if (isSelected) {
    classNames.push(styles.selected);
  }

  return (
    <a
      ref={ref}
      className={classNames.join(' ')}
      href={entry.href}
      onMouseEnter={() => onSelect(index)}
      onFocus={() => onSelect(index)}
    >
      <span className={styles.hit} style={placement.hit} aria-hidden="true">
        <span className={styles.miniature} style={placement.miniature}>
          <img
            src={miniature.src}
            width={miniature.width}
            height={miniature.height}
            alt=""
            decoding="async"
          />
        </span>
        <span className={styles.badge}>{entryNumber(index)}</span>
      </span>
      <span className={styles.label} style={placement.label}>
        <span className={styles.key} aria-hidden="true">
          [{index + 1}] {entry.code}
        </span>
        <span className={styles.name}>{entry.name}</span>
      </span>
    </a>
  );
}
