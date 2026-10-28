import type { MenuEntry } from '../../../data/menu';
import styles from './SelectionPanel.module.css';
import { entryNumber } from './WheelEntry';

interface SelectionPanelProps {
  entry: MenuEntry;
  index: number;
  count: number;
}

// Bottom left of the menu: the page the wheel points at, with what it holds.
export function SelectionPanel({ entry, index, count }: SelectionPanelProps) {
  const position = `${entryNumber(index)} / ${entryNumber(count - 1)}`;

  return (
    <section
      className={styles.panel}
      aria-label="Page sélectionnée"
      aria-live="polite"
    >
      <span className={styles.number} aria-hidden="true">
        {entryNumber(index)}
      </span>
      <div className={styles.text}>
        <span className={styles.code}>
          [Sélection] {entry.code} · {position}
        </span>
        <span className={styles.title}>{entry.name}</span>
        <p className={styles.description}>{entry.description}</p>
      </div>
    </section>
  );
}
