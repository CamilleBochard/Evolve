import type { CSSProperties, Ref } from 'react';

import type { SkillEntry } from '../../../lib/skill-tree/entries';
import {
  STATE_LABELS,
  describeEntry,
  monogram,
} from '../../../lib/skill-tree/popup';
import type { Point } from '../../../lib/skill-tree/popup';
import styles from './SkillPopup.module.css';

const JOURNAL_HREF = '/journal';

interface SkillPopupProps {
  entry: SkillEntry;
  // Small screens: a sheet pinned to the bottom of the frame.
  isSheet: boolean;
  // Position in screen pixels inside the tree; null until it is measured.
  position: Point | null;
  onClose: () => void;
  ref?: Ref<HTMLElement>;
}

function kindLabel(entry: SkillEntry): string {
  let label = `Compétence · ${entry.hub.hub.name}`;
  if (entry.kind === 'hub') {
    label = `Nœud · ${entry.hub.branch.name}`;
  }
  return label;
}

// Window describing the selected skill and the quest where it was earned.
// Marked data-no-pan, so dragging inside it selects text instead of panning.
export function SkillPopup({
  entry,
  isSheet,
  position,
  onClose,
  ref,
}: SkillPopupProps) {
  const { skill } = entry;
  const description = describeEntry(entry);
  const titleId = `skill-popup-${skill.id}`;

  const classNames = [styles.popup];
  // Placed through the CSS object model at runtime, never an inline style
  // attribute in the HTML: the popup is not rendered on the server.
  let placement: CSSProperties | undefined;
  if (isSheet) {
    classNames.push(styles.sheet);
  } else if (position === null) {
    // Measured first, then shown next to its skill.
    placement = { visibility: 'hidden' };
  } else {
    placement = { left: position.left, top: position.top };
  }

  let questHref: string | undefined;
  if (skill.quest !== undefined) {
    questHref = `${JOURNAL_HREF}#${skill.quest}`;
  }

  return (
    <section
      ref={ref}
      className={classNames.join(' ')}
      style={placement}
      role="dialog"
      aria-labelledby={titleId}
      data-no-pan
    >
      <div className={styles.bar}>
        <span className={styles.kind}>{kindLabel(entry)}</span>
        <button
          type="button"
          className={styles.close}
          aria-label="Fermer"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
      <div className={styles.head}>
        <div className={styles.visual} aria-hidden="true">
          {monogram(entry)}
        </div>
        <div className={styles.title}>
          <h2 className={styles.name} id={titleId}>
            {skill.name}
          </h2>
          <span className={`${styles.state} ${styles[skill.state]}`}>
            {STATE_LABELS[skill.state]}
          </span>
        </div>
      </div>
      <div className={styles.body}>
        <span className={styles.label}>{description.label}</span>
        <p className={styles.quest}>{description.title}</p>
        {description.text !== '' && (
          <p className={styles.text}>{description.text}</p>
        )}
        <a
          className={styles.go}
          href={questHref}
          aria-disabled={questHref === undefined}
        >
          <span className={styles.goLabel}>Voir la quête</span>
          <span className={styles.goHatch} />
        </a>
      </div>
    </section>
  );
}
