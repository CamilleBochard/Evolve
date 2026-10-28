import { QUEST_KINDS } from '../../../data/contact';
import type { QuestKind } from '../../../data/contact';
import { BlockHead } from '../shared/BlockHead';
import styles from './QuestKindPicker.module.css';

interface QuestKindPickerProps {
  value: QuestKind;
  onChange: (kind: QuestKind) => void;
}

// Kind of quest: radio buttons drawn as game choice cards.
export function QuestKindPicker({ value, onChange }: QuestKindPickerProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        <BlockHead label="[Type de quête]" micro="1 choix" />
      </legend>
      <div className={styles.kinds}>
        {QUEST_KINDS.map((option) => {
          const id = `quest-kind-${option.value}`;
          let mark = '◇';
          if (option.value === value) {
            mark = '◆';
          }
          return (
            <div key={option.value} className={styles.kind}>
              <input
                type="radio"
                id={id}
                name="kind"
                value={option.value}
                checked={option.value === value}
                onChange={() => onChange(option.value)}
                aria-describedby={`${id}-hint`}
              />
              <label htmlFor={id}>
                <span className={styles.mark} aria-hidden="true">
                  {mark}
                </span>
                <b>{option.label}</b>
                <span className={styles.hint} id={`${id}-hint`}>
                  {option.hint}
                </span>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
