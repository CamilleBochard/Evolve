// Contenu du profil affiché sur le site, séparé du balisage.

export interface SocialLink {
  label: string;
  href: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  className: string;
  level: number;
  email: string;
}

export const PROFILE: Profile = {
  firstName: 'Camille',
  lastName: 'Bochard',
  className: 'Développeur',
  level: 3,
  email: 'cam.bochard@gmail.com',
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/CamilleBochard' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/camille-bochard' },
];
