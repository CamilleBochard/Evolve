import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { QUEST_MESSAGE_MAX_LENGTH } from '../../../data/contact';
import type { QuestKind } from '../../../data/contact';
import { PROFILE } from '../../../data/profile';
import {
  REQUIRED_FIELDS,
  questErrors,
  questMailto,
} from '../../../lib/contact/quest-mail';
import type {
  QuestErrors,
  QuestFields,
  RequiredField,
} from '../../../lib/contact/quest-mail';
import { BlockHead } from '../shared/BlockHead';
import { useIsAwake } from '../shared/useIsAwake';
import { QuestField } from './QuestField';
import styles from './QuestForm.module.css';
import { QuestKindPicker } from './QuestKindPicker';

type TextField = Exclude<keyof QuestFields, 'kind'>;

const EMPTY_QUEST: QuestFields = {
  kind: 'job',
  name: '',
  guild: '',
  title: '',
  message: '',
};

// The quest form of the contact page. Sending opens the visitor's own mail
// app with the quest written out: the site stays static and stores
// nothing. The send button waits for the island: without JavaScript, the
// form would post the quest to the page address instead.
export default function QuestForm() {
  const isAwake = useIsAwake();
  const [fields, setFields] = useState<QuestFields>(EMPTY_QUEST);
  const [errors, setErrors] = useState<QuestErrors>({});
  const [isSent, setIsSent] = useState(false);
  const requiredRefs = useRef<
    Partial<Record<RequiredField, HTMLInputElement | null>>
  >({});

  function updateKind(kind: QuestKind): void {
    setFields({ ...fields, kind });
  }

  // An error goes away as soon as its field is filled in.
  function updateText(field: TextField, value: string): void {
    setFields({ ...fields, [field]: value });
    const isFilled = value.trim() !== '';
    if (field !== 'guild' && isFilled && errors[field] !== undefined) {
      const remaining = { ...errors };
      delete remaining[field];
      setErrors(remaining);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const found = questErrors(fields);
    setErrors(found);
    const firstMissing = REQUIRED_FIELDS.find(
      (field) => found[field] !== undefined,
    );
    if (firstMissing !== undefined) {
      requiredRefs.current[firstMissing]?.focus();
      return;
    }
    setIsSent(true);
    window.location.href = questMailto(PROFILE.email, fields);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <QuestKindPicker value={fields.kind} onChange={updateKind} />

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          <BlockHead label="[Commanditaire]" micro="Qui propose la quête" />
        </legend>
        <div className={styles.fields}>
          <QuestField
            id="quest-name"
            label="Nom"
            value={fields.name}
            onChange={(value) => updateText('name', value)}
            error={errors.name}
            isRequired
            autoComplete="name"
            ref={(element) => {
              requiredRefs.current.name = element;
            }}
          />
          <QuestField
            id="quest-guild"
            label="Guilde"
            labelNote="(entreprise, facultatif)"
            value={fields.guild}
            onChange={(value) => updateText('guild', value)}
            autoComplete="organization"
          />
          <QuestField
            id="quest-title"
            label="Titre de la quête"
            value={fields.title}
            onChange={(value) => updateText('title', value)}
            error={errors.title}
            isRequired
            isWide
            placeholder="Développeur PHP · Laravel"
            ref={(element) => {
              requiredRefs.current.title = element;
            }}
          />
          <QuestField
            id="quest-message"
            label="Récit"
            value={fields.message}
            onChange={(value) => updateText('message', value)}
            error={errors.message}
            isRequired
            isMultiline
            isWide
            maxLength={QUEST_MESSAGE_MAX_LENGTH}
            ref={(element) => {
              requiredRefs.current.message = element;
            }}
          />
        </div>
      </fieldset>

      <div className={styles.submitRow}>
        <p className={styles.note}>
          Rien n'est envoyé par ce site : votre messagerie s'ouvre avec le
          message prérempli, et vous choisissez de l'envoyer.
        </p>
        <button type="submit" className={styles.submit} disabled={!isAwake}>
          <span className={styles.submitLabel}>Envoyer le messager</span>
          <span className={styles.submitHatch} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.sent} role="status">
        {isSent && (
          <>
            <b>Messager parti</b>
            <span>
              Votre messagerie s'ouvre avec la quête. Si rien ne s'ouvre,
              écrivez directement à {PROFILE.email}.
            </span>
          </>
        )}
      </div>
    </form>
  );
}
