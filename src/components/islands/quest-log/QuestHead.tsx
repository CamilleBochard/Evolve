import { STATUS_LABELS, TYPE_LABELS, TYPE_MARKS } from '../../../data/quests';
import type { Quest } from '../../../data/quests';
import { chapterOf, questCode } from '../../../lib/journal/quest-list';
import styles from './QuestHead.module.css';

interface QuestHeadProps {
  quest: Quest;
}

// Head of the quest sheet: chapter, type, title, summary and facts, with
// the status pressed on it like an ink stamp.
export function QuestHead({ quest }: QuestHeadProps) {
  const chapter = chapterOf(quest);

  return (
    <header className={styles.head} data-tour="quest-head">
      <div className={styles.top}>
        <span className={styles.label}>
          [Chapitre {chapter.numeral} · {chapter.name}]
        </span>
        <span className={styles.micro}>{questCode(quest)}</span>
      </div>
      <span className={styles.type}>
        <b aria-hidden="true">{TYPE_MARKS[quest.type]} </b>
        {TYPE_LABELS[quest.type]}
      </span>
      <h2 className={styles.title}>{quest.title}</h2>
      <p className={styles.summary}>{quest.summary}</p>
      <dl className={styles.facts}>
        {quest.facts.map((fact) => (
          <div key={fact.term}>
            <dt>{fact.term}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <span className={`${styles.stamp} ${styles[quest.status]}`}>
        {STATUS_LABELS[quest.status]}
      </span>
    </header>
  );
}
