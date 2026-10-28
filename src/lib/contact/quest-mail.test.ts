import { describe, expect, it } from 'vitest';

import { questErrors, questMailto } from './quest-mail';
import type { QuestFields } from './quest-mail';

const COMPLETE: QuestFields = {
  kind: 'job',
  name: 'Alex Martin',
  guild: 'Studio Nord',
  title: 'Développeur PHP · Laravel',
  message: 'Bonjour,\nun poste vous attend.',
};

describe('questErrors', () => {
  it('accepts a complete quest', () => {
    expect(questErrors(COMPLETE)).toEqual({});
  });

  it('flags the required fields left blank, the guild aside', () => {
    const errors = questErrors({ ...COMPLETE, name: '  ', guild: '' });
    expect(Object.keys(errors)).toEqual(['name']);
  });
});

describe('questMailto', () => {
  it('writes the kind and the title in the subject', () => {
    const href = questMailto('contact@example.fr', COMPLETE);
    const subject = new URL(href).searchParams.get('subject');
    expect(href.startsWith('mailto:contact@example.fr?')).toBe(true);
    expect(subject).toBe('[Offre de poste] Développeur PHP · Laravel');
  });

  it('names the giver and keeps the line breaks of the message', () => {
    const href = questMailto('contact@example.fr', COMPLETE);
    const body = new URL(href).searchParams.get('body');
    expect(body).toBe(
      'Type de quête : Offre de poste\nCommanditaire : Alex Martin · Studio Nord\n\nBonjour,\nun poste vous attend.',
    );
  });

  it('leaves the guild out when there is none', () => {
    const href = questMailto('contact@example.fr', { ...COMPLETE, guild: '' });
    const body = new URL(href).searchParams.get('body');
    expect(body).toContain('Commanditaire : Alex Martin\n');
  });
});
