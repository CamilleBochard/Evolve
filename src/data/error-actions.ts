// Links offered on the error page to get back to the site or get in touch.
import type { IconName } from '../components/atoms/icon-name';
import { PROFILE, SOCIAL_LINKS } from './profile';

export interface ErrorAction {
  href: string;
  icon: IconName;
  label: string;
  hint: string;
  isPrimary: boolean;
}

export const HOME_HREF = '/';

function findSocialLink(label: string): string {
  const link = SOCIAL_LINKS.find((socialLink) => socialLink.label === label);
  if (link === undefined) {
    throw new Error(`Lien social introuvable : ${label}`);
  }
  const href = link.href;
  return href;
}

export const ERROR_ACTIONS: ErrorAction[] = [
  {
    href: HOME_HREF,
    icon: 'home',
    label: "Retour à l'accueil",
    hint: 'Revenir au checkpoint',
    isPrimary: true,
  },
  {
    href: findSocialLink('GitHub'),
    icon: 'code',
    label: 'GitHub',
    hint: 'Voir le code',
    isPrimary: false,
  },
  {
    href: findSocialLink('LinkedIn'),
    icon: 'linkedin',
    label: 'LinkedIn',
    hint: 'Parcours et contact',
    isPrimary: false,
  },
  {
    href: `mailto:${PROFILE.email}`,
    icon: 'mail',
    label: 'Email',
    hint: PROFILE.email,
    isPrimary: false,
  },
];
