import type { Quest, QuestId } from '../../../data/quests';
import { BlockHead } from '../shared/BlockHead';
import { QuestHead } from './QuestHead';
import { QuestNav } from './QuestNav';
import { QuestRewards } from './QuestRewards';
import styles from './QuestSheet.module.css';

const LOCKED_NOTE =
  'Cette quête se dévoilera au prochain niveau. Le chapitre V reste à écrire : la prochaine classe se dessine du côté du fullstack.';

interface QuestSheetProps {
  quest: Quest;
  onSelect: (id: QuestId) => void;
}

// Full sheet of the selected quest. Each block shows only when the quest
// has something to put in it.
export function QuestSheet({ quest, onSelect }: QuestSheetProps) {
  const doneObjectives = quest.objectives.filter(
    (objective) => objective.isDone,
  );
  const objectiveCount = `${doneObjectives.length} / ${quest.objectives.length}`;

  return (
    <article className={styles.sheet}>
      <QuestHead quest={quest} />

      {quest.status === 'locked' && (
        <p className={styles.lockedNote}>{LOCKED_NOTE}</p>
      )}

      {quest.story.length > 0 && (
        <section className={styles.story}>
          <BlockHead label="[Récit]" />
          {quest.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      )}

      {quest.objectives.length > 0 && (
        <section>
          <BlockHead label="[Objectifs]" micro={objectiveCount} />
          <ol className={styles.objectives}>
            {quest.objectives.map((objective) => {
              let stateClass = styles.objectiveOpen;
              let checkMark = '';
              let stateText = 'À faire : ';
              if (objective.isDone) {
                stateClass = styles.objectiveDone;
                checkMark = '✓';
                stateText = 'Fait : ';
              }
              return (
                <li key={objective.text} className={stateClass}>
                  <span className={styles.check} aria-hidden="true">
                    {checkMark}
                  </span>
                  <span className={styles.objectiveText}>
                    <span className="visually-hidden">{stateText}</span>
                    {objective.text}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {quest.feats.length > 0 && (
        <section>
          <BlockHead label="[Hauts faits]" />
          <ul className={styles.feats}>
            {quest.feats.map((feat) => (
              <li key={feat.label} className={styles.feat}>
                <b>{feat.value}</b>
                <span>{feat.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {quest.log.length > 0 && (
        <section>
          <BlockHead label="[Journal de bord]" />
          <ol className={styles.log}>
            {quest.log.map((entry) => (
              <li key={entry.when}>
                <span className={styles.when}>{entry.when}</span>
                <span className={styles.what}>{entry.what}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <QuestRewards quest={quest} />
      <QuestNav quest={quest} onSelect={onSelect} />
    </article>
  );
}
