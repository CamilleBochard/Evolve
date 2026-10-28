import type { ChangeEvent, Ref } from 'react';

import styles from './QuestField.module.css';

interface QuestFieldProps {
  id: string;
  label: string;
  // Shown after the label, in small.
  labelNote?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isRequired?: boolean;
  isMultiline?: boolean;
  isWide?: boolean;
  maxLength?: number;
  placeholder?: string;
  autoComplete?: string;
  ref?: Ref<HTMLInputElement & HTMLTextAreaElement>;
}

// A labelled field of the quest form, with its error under it. A long
// text shows how many characters are left.
export function QuestField({
  id,
  label,
  labelNote,
  value,
  onChange,
  error,
  isRequired = false,
  isMultiline = false,
  isWide = false,
  maxLength,
  placeholder,
  autoComplete,
  ref,
}: QuestFieldProps) {
  const errorId = `${id}-error`;
  const hasError = error !== undefined;
  const classNames = [styles.field];
  if (isWide) {
    classNames.push(styles.wide);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    onChange(event.target.value);
  }

  const sharedProps = {
    id,
    ref,
    value,
    onChange: handleChange,
    required: isRequired,
    maxLength,
    placeholder,
    autoComplete,
    'aria-invalid': hasError,
    'aria-describedby': errorId,
  };

  let control = <input type="text" {...sharedProps} />;
  if (isMultiline) {
    control = <textarea {...sharedProps} />;
  }

  return (
    <div className={classNames.join(' ')}>
      <label htmlFor={id}>
        {label}
        {labelNote !== undefined && <small> {labelNote}</small>}
      </label>
      {control}
      {maxLength !== undefined && (
        <span className={styles.counter}>
          {value.length} / {maxLength}
        </span>
      )}
      <span className={styles.error} id={errorId}>
        {error}
      </span>
    </div>
  );
}
