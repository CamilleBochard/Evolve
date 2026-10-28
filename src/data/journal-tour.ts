// Guided tour of the journal, the way games present an inventory screen the
// first time. Each step points at an area marked data-tour="<target>", or
// at nothing (null) for a step in the middle of the screen.

export interface TourStep {
  target: string | null;
  title: string;
  text: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: null,
    title: 'Le journal de quêtes',
    text: "Chaque étape de mon parcours est racontée comme une quête de RPG. Ce tutoriel fait le tour de l'écran en quelques étapes.",
  },
  {
    target: 'prologue',
    title: 'Le prologue',
    text: 'Qui je suis, en quelques lignes. En dessous, mon changement de classe : pyrozinc (couvreur-zingueur pendant onze ans), puis paladev (développeur).',
  },
  {
    target: 'campaign',
    title: 'La campagne',
    text: "L'avancée de l'aventure : quêtes accomplies, chapitres ouverts et années de carrière. Chaque case de la barre est une quête.",
  },
  {
    target: 'timeline',
    title: 'La frise',
    text: 'Chaque quête placée dans le temps, de 2011 à aujourd’hui. Les barres pleines sont les quêtes principales. Cliquez sur une barre pour ouvrir sa quête.',
  },
  {
    target: 'filters',
    title: 'Filtres et ordre',
    text: "Affichez seulement les quêtes principales ou secondaires. Le bouton de droite inverse l'ordre : les plus récentes ou les plus anciennes d'abord.",
  },
  {
    target: 'quests',
    title: 'Les quêtes',
    text: 'Rangées par chapitre, avec leur état : accomplie, en cours ou verrouillée. Les flèches ↑ ↓ du clavier parcourent la liste.',
  },
  {
    target: 'quest-head',
    title: 'La fiche de quête',
    text: "Où, quand et pour qui. Le tampon indique l'état de la quête.",
  },
  {
    target: 'rewards',
    title: 'Les récompenses',
    text: "Diplômes, talents et compétences gagnés pendant la quête. Chaque compétence mène à l'arbre de compétences.",
  },
  {
    target: 'help',
    title: 'Besoin d’aide ?',
    text: 'Ce tutoriel reste disponible ici à tout moment.',
  },
];
