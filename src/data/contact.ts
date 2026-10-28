// Contact page: the channels to reach me, the kinds of quests a visitor can
// propose, and what to expect once the message is sent.
import { PROFILE, SOCIAL_LINKS } from './profile';

export type QuestKind = 'job' | 'project' | 'talk';

export interface QuestKindOption {
  value: QuestKind;
  label: string;
  hint: string;
}

export interface ContactChannel {
  id: 'email' | 'linkedin' | 'github';
  label: string;
  // Short code printed in the octagon.
  icon: string;
  value: string;
  href: string;
  isExternal: boolean;
}

export interface QuestTerm {
  title: string;
  text: string;
}

export const MESSENGER_TEXT =
  "Une offre de poste, un projet, une question sur un projet de l'atelier ou simplement l'envie d'échanger : écrivez-moi.";

function socialLink(label: string): string {
  const link = SOCIAL_LINKS.find((item) => item.label === label);
  if (link === undefined) {
    throw new Error(`No social link ${label}`);
  }
  return link.href;
}

// The last part of a profile address: the handle shown on the card.
function handleOf(href: string): string {
  const parts = href.split('/').filter((part) => part !== '');
  const handle = parts[parts.length - 1];
  return handle;
}

const LINKEDIN_HREF = socialLink('LinkedIn');
const GITHUB_HREF = socialLink('GitHub');

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'email',
    label: 'Email',
    icon: '@',
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    isExternal: false,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: 'in',
    value: handleOf(LINKEDIN_HREF),
    href: LINKEDIN_HREF,
    isExternal: true,
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: '</>',
    value: handleOf(GITHUB_HREF),
    href: GITHUB_HREF,
    isExternal: true,
  },
];

export const NO_PHONE_NOTE =
  "Pas de numéro de téléphone ici : l'email reste le plus sûr.";

export const QUEST_KINDS: QuestKindOption[] = [
  {
    value: 'job',
    label: 'Offre de poste',
    hint: 'Un poste à pourvoir dans votre équipe',
  },
  {
    value: 'project',
    label: 'Projet',
    hint: 'Une idée ou un projet à construire',
  },
  { value: 'talk', label: 'Échange', hint: 'Une question, un retour, un café' },
];

export const QUEST_MESSAGE_MAX_LENGTH = 2000;

export const QUEST_TERMS: QuestTerm[] = [
  {
    title: 'Réponse',
    text: "Elle arrive depuis l'adresse de contact, dans votre messagerie.",
  },
  {
    title: 'Confidentialité',
    text: 'Le site ne stocke rien : le message passe uniquement par votre messagerie.',
  },
  {
    title: 'Langues',
    text: 'Français, ou anglais (niveau B1) si vous préférez.',
  },
];
