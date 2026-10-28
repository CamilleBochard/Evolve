import { Fragment } from 'react';
import type { KeyboardEvent } from 'react';

import { STATUS_LABELS, TYPE_MARKS } from '../../../data/quests';
import type { QuestId } from '../../../data/quests';
import type { ChapterGroup } from '../../../lib/journal/quest-list';
import styles from './QuestList.module.css';

interface QuestListProps {
  groups: ChapterGroup[];
  selectedId: QuestId;
  onSelect: (id: QuestId) => void;
  onArrowKey: (event: KeyboardEvent<HTMLButtonElement>) => void;
  // Keeps the button of each quest, to focus it and scroll it into view.
  registerItem: (id: QuestId, button: HTMLButtonElement | null) => void;
}

// Quests grouped by chapter, each with its type and state. The up and down
// arrows walk through the list, like a game menu.
export function QuestList({
  groups,
  selectedId,
  onSelect,
  onArrowKey,
  registerItem,
}: QuestListProps) {
  return (
    <nav
      className={styles.list}
      aria-label="Liste des quêtes"
      data-tour="quests"
    >
      {groups.map((group) => {
        const { chapter } = group;
        const headClassNames = [styles.chapter];
        if (chapter.isLocked) {
          headClassNames.push(styles.chapterLocked);
        }
        return (
          <Fragment key={chapter.id}>
            <div className={headClassNames.join(' ')}>
              <b>{chapter.numeral}</b>
              <span>{chapter.name}</span>
              <small>{chapter.period}</small>
            </div>
            <ol className={styles.quests}>
              {group.quests.map((quest) => {
                const itemClassNames = [styles.item];
                if (quest.status === 'locked') {
                  itemClassNames.push(styles.itemLocked);
                }
                return (
                  <li key={quest.id}>
                    <button
                      ref={(button) => registerItem(quest.id, button)}
                      type="button"
                      className={itemClassNames.join(' ')}
                      aria-current={quest.id === selectedId}
                      onClick={() => onSelect(quest.id)}
                      onKeyDown={onArrowKey}
                    >
                      <span className={styles.mark} aria-hidden="true">
                        {TYPE_MARKS[quest.type]}
                      </span>
                      <span className={styles.title}>{quest.title}</span>
                      <span
                        className={`${styles.status} ${styles[quest.status]}`}
                      >
                        {STATUS_LABELS[quest.status]}
                      </span>
                      <span className={styles.meta}>
                        {quest.summary} · {quest.period}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Fragment>
        );
      })}
    </nav>
  );
}
