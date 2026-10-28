import type { ReactNode } from 'react';

import type { Quest, QuestId } from '../../../data/quests';
import { questNeighbours } from '../../../lib/journal/quest-list';
import styles from './QuestNav.module.css';

interface QuestNavProps {
  quest: Quest;
  onSelect: (id: QuestId) => void;
}

// Older and newer quest, always in campaign order whatever the list order:
// older on the left, newer on the right. A missing side keeps its room.
export function QuestNav({ quest, onSelect }: QuestNavProps) {
  const { older, newer } = questNeighbours(quest);

  let olderButton: ReactNode = <span />;
  if (older !== null) {
    olderButton = (
      <button
        type="button"
        className={styles.button}
        onClick={() => onSelect(older.id)}
      >
        <span className={styles.micro}>◂ Plus ancienne</span>
        <b>{older.title}</b>
      </button>
    );
  }

  let newerButton: ReactNode = <span />;
  if (newer !== null) {
    newerButton = (
      <button
        type="button"
        className={`${styles.button} ${styles.newer}`}
        onClick={() => onSelect(newer.id)}
      >
        <span className={styles.micro}>Plus récente ▸</span>
        <b>{newer.title}</b>
      </button>
    );
  }

  return (
    <nav
      className={styles.nav}
      aria-label="Quête plus ancienne et plus récente"
    >
      {olderButton}
      {newerButton}
    </nav>
  );
}
