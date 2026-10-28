// Entries of the pause menu, clockwise from the top medallion of the wheel.

export type MenuEntryId =
  'personnage' | 'competences' | 'journal' | 'atelier' | 'contact';

// Miniature printed for the entry, see src/lib/prints/print-specs.ts.
export type MenuFigure = 'paladev' | 'tree' | 'book' | 'anvil' | 'envelope';

// plain: empty center, the sun circle only. rune: the paladev rune at the
// center, a wide spiked sun.
export type MenuVersion = 'plain' | 'rune';

export interface MenuEntry {
  id: MenuEntryId;
  name: string;
  code: string;
  href: string;
  figure: MenuFigure;
  // Shown in the selection panel on desktop.
  description: string;
  // Shown under the name on phones.
  short: string;
}

export const MENU_ENTRIES: MenuEntry[] = [
  {
    id: 'personnage',
    name: 'Personnage',
    code: 'FCH.01',
    href: '/personnage',
    figure: 'paladev',
    description: 'La fiche du paladev : identité, attributs et équipement.',
    short: 'Identité, attributs, équipement',
  },
  {
    id: 'competences',
    name: 'Compétences',
    code: 'FCH.02',
    href: '/competences',
    figure: 'tree',
    description:
      "L'arbre de compétences, branche par branche, chaque compétence reliée à sa quête.",
    short: "L'arbre, branche par branche",
  },
  {
    id: 'journal',
    name: 'Journal',
    code: 'FCH.03',
    href: '/journal',
    figure: 'book',
    description: 'Mon parcours raconté en quêtes, du pyrozinc au paladev.',
    short: 'Le parcours en quêtes',
  },
  {
    id: 'atelier',
    name: 'Atelier',
    code: 'FCH.04',
    href: '/atelier',
    figure: 'anvil',
    description:
      "Les projets personnels, leurs mesures et leur carnet d'expériences.",
    short: 'Projets et expériences',
  },
  {
    id: 'contact',
    name: 'Contact',
    code: 'FCH.05',
    href: '/contact',
    figure: 'envelope',
    description: 'Email, LinkedIn et GitHub, ou une quête à proposer.',
    short: 'Email, LinkedIn, GitHub',
  },
];

export const MENU_VERSION_HREFS: Record<MenuVersion, string> = {
  plain: '/menu',
  rune: '/menu/rune',
};

// Where "Retour" leads when the menu was not opened from a page of the site.
export const MENU_BACK_HREF = '/personnage';
