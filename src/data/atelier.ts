// Fixed texts of the Atelier page, around the projects: welcome and method.

export interface WelcomeParagraph {
  // Words set in bold inside the paragraph, if any.
  emphasis?: string;
  text: string;
}

export const WELCOME_LEAD = 'Bienvenue dans mon atelier.';

export const WELCOME: WelcomeParagraph[] = [
  {
    text: "Fan de jeux vidéo depuis toujours, j'ai conçu ce site avec les codes des interfaces de RPG et de monde ouvert : une fiche de personnage, un arbre de compétences, un journal qui suit les quêtes en cours.",
  },
  {
    emphasis: "espace d'expérimentation",
    text: "L'atelier, c'est mon espace d'expérimentation. J'y mène des projets personnels pour explorer ce que mon quotidien de développeur ne me fait pas toucher : réseaux de neurones, rendu 3D, infrastructure.",
  },
  {
    text: "Chaque projet part d'une question. Ici, une hypothèse réfutée compte autant qu'une hypothèse confirmée : dans les deux cas, j'ai appris quelque chose.",
  },
];

export const PROTOCOL: string[] = [
  'Poser une question.',
  'Fixer la règle avant de lire les chiffres.',
  'Mesurer, et garder les résultats avec le code.',
  'Décider, puis noter pourquoi.',
];

export const PROTOCOL_SOURCE =
  'La méthode de ChessMe, où chaque décision a été mesurée.';
