// Fixed texts of the journal page, around the quests: prologue, class
// change and languages.

export interface PreviousClass {
  name: string;
  level: number;
  // The trade behind the class name, for screen readers and the simple view.
  trade: string;
}

export interface Language {
  name: string;
  level: string;
  // Filled pips out of LANGUAGE_PIPS.
  pips: number;
}

export const PROLOGUE: string[] = [
  "Après une première carrière dans le bâtiment, j'ai réussi une reconversion comme développeur. Cette nouvelle aventure est le résultat de ma passion pour le numérique, d'une grande curiosité et de beaucoup de travail.",
  "J'aime m'investir dans les projets comme dans la vie de l'entreprise, et j'affectionne particulièrement le fait de découvrir et de tester de nouvelles choses.",
];

// Role line under the name in the simple view.
export const PLAIN_ROLE = 'Développeur PHP · Laravel, Magento 2, Vue.js';

export const PREVIOUS_CLASS: PreviousClass = {
  name: 'Pyrozinc',
  level: 11,
  trade: 'couvreur-zingueur',
};

export const LANGUAGE_PIPS = 6;

export const LANGUAGES: Language[] = [
  { name: 'Français', level: 'Langue maternelle', pips: 6 },
  { name: 'Anglais', level: 'B1', pips: 3 },
];
