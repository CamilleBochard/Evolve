// The quest form of the contact page: checks the fields, then writes the
// email the visitor's own mail app opens. Nothing is sent by the site.
import type { QuestKind } from '../../data/contact';
import { QUEST_KINDS } from '../../data/contact';

export interface QuestFields {
  kind: QuestKind;
  name: string;
  guild: string;
  title: string;
  message: string;
}

export type RequiredField = 'name' | 'title' | 'message';

export type QuestErrors = Partial<Record<RequiredField, string>>;

// In the order of the form: the first one missing gets the focus.
export const REQUIRED_FIELDS: RequiredField[] = ['name', 'title', 'message'];

const MISSING_MESSAGES: Record<RequiredField, string> = {
  name: 'Indiquez votre nom.',
  title: 'Donnez un titre à la quête.',
  message: 'Racontez la quête en quelques lignes.',
};

// An error for each required field left empty or blank.
export function questErrors(fields: QuestFields): QuestErrors {
  const errors: QuestErrors = {};
  for (const field of REQUIRED_FIELDS) {
    const isBlank = fields[field].trim() === '';
    if (isBlank) {
      errors[field] = MISSING_MESSAGES[field];
    }
  }
  return errors;
}

function kindLabel(kind: QuestKind): string {
  const option = QUEST_KINDS.find((item) => item.value === kind);
  let label: string = kind;
  if (option !== undefined) {
    label = option.label;
  }
  return label;
}

export function questMailto(email: string, fields: QuestFields): string {
  const label = kindLabel(fields.kind);
  const name = fields.name.trim();
  const guild = fields.guild.trim();
  let giver = name;
  if (guild !== '') {
    giver = `${name} · ${guild}`;
  }
  const subject = `[${label}] ${fields.title.trim()}`;
  const lines = [
    `Type de quête : ${label}`,
    `Commanditaire : ${giver}`,
    '',
    fields.message.trim(),
  ];
  const body = lines.join('\n');
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
  return href;
}
