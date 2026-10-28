// Projects of the Atelier, the experiment workshop: each project starts from
// a question, with its making stages, its ingredients, its measures and a
// lab notebook of hypotheses, confirmed or refuted. ChessMe figures come
// from the notebook of that project.
// Skills are not listed here: they come from the skill tree, through the
// journal quest of the project.
import type { QuestId } from './quests';

export type ProjectId = 'chessme' | 'evolve' | 'scene-3d' | 'chatbot';

// soon: almost done; locked: not started.
export type ProjectStatus = 'soon' | 'progress' | 'locked' | 'paused';

export type ExperimentVerdict = 'confirmed' | 'refuted';

// Figure printed for the project, see src/lib/prints/print-specs.ts.
export type ProjectFigure = 'knight' | 'wheel' | 'cube' | 'bubble';

export interface ProjectStage {
  text: string;
  isDone: boolean;
}

export interface ProjectMeasure {
  value: string;
  label: string;
}

export interface Experiment {
  hypothesis: string;
  verdict: ExperimentVerdict;
  result: string;
}

export interface ProjectAction {
  label: string;
  // Missing for an action not available yet.
  href?: string;
  // Shown after the label of an action not available yet.
  soonLabel?: string;
  isAccent?: boolean;
}

export interface Project {
  id: ProjectId;
  code: string;
  // Journal quest of the project, where its skills come from.
  quest: QuestId | null;
  figure: ProjectFigure;
  figureName: string;
  status: ProjectStatus;
  title: string;
  tagline: string;
  question: string;
  story: string[];
  stages: ProjectStage[];
  ingredients: string[];
  measures: ProjectMeasure[];
  // What the measures were taken on.
  measuresScope?: string;
  experiments: Experiment[];
  // Shown instead of the story for a project not started or paused.
  note?: string;
  actions: ProjectAction[];
}

// Project opened when the address names none.
export const DEFAULT_PROJECT_ID: ProjectId = 'chessme';

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  soon: 'Bientôt jouable',
  progress: 'En cours',
  locked: 'À venir',
  paused: 'En pause',
};

export const VERDICT_LABELS: Record<ExperimentVerdict, string> = {
  confirmed: 'Confirmée',
  refuted: 'Réfutée',
};

export const PROJECTS: Project[] = [
  {
    id: 'chessme',
    code: 'PRJ.02',
    quest: 'chessme',
    figure: 'knight',
    figureName: 'Cavalier',
    status: 'soon',
    title: 'ChessMe',
    tagline: "Un bot d'échecs qui joue comme moi",
    question:
      "Un millier de mes parties suffit-il pour qu'un modèle joue comme moi, avec mon niveau et mes erreurs ?",
    story: [
      "Un bot contre lequel on joue dans le navigateur. Il ne cherche pas le meilleur coup : il cherche le mien. Mon répertoire d'ouverture d'abord, puis un réseau de neurones entraîné à jouer comme un humain, ajusté sur mes propres parties.",
      'Le projet sépare deux choses : le niveau, c’est-à-dire la fréquence et la taille de mes erreurs, et le style, c’est-à-dire le coup que je choisis parmi les coups raisonnables. Un bot qui me ressemble doit coller aux deux.',
    ],
    stages: [
      {
        text: 'Récupérer et analyser mes parties avec Stockfish',
        isDone: true,
      },
      {
        text: 'Choisir le modèle par la mesure, pas par conversion',
        isDone: true,
      },
      { text: "Construire le livre d'ouverture", isDone: true },
      {
        text: 'Fine-tuner le modèle et régler la température',
        isDone: true,
      },
      { text: 'Faire tourner le bot dans le navigateur', isDone: true },
      { text: 'Mettre le bot en ligne', isDone: false },
    ],
    ingredients: [
      'Python',
      'Stockfish 19',
      'Maia-3 · ONNX',
      'TypeScript',
      'Web Worker',
      'WASM',
      'Astro',
      'Vitest · pytest',
    ],
    measures: [
      { value: '1 046', label: 'parties analysées, soit 30 860 positions' },
      {
        value: '51,5 %',
        label: 'de mes coups reproduits par le modèle fine-tuné',
      },
      { value: '182', label: "positions dans le livre d'ouverture" },
      {
        value: '104,6',
        label:
          'centipions perdus par coup au milieu de jeu, contre 103,1 pour moi',
      },
    ],
    measuresScope: 'Test Set · parties jamais vues',
    experiments: [
      {
        hypothesis:
          'Convertir mon classement Chess.com suffit pour régler le niveau du modèle.',
        verdict: 'refuted',
        result:
          'Mesuré plutôt que converti : le niveau qui reproduit le mieux mes coups est 1100, soit 231 points sous mon classement Lichess.',
      },
      {
        hypothesis:
          "Un livre d'ouverture tiré de mes parties rapproche le bot de mon jeu.",
        verdict: 'confirmed',
        result:
          "Dans l'ouverture, la part de mes coups reproduits passe de 51,3 % à 62,6 %.",
      },
      {
        hypothesis:
          'Avec seulement 1 000 parties, le fine-tuning va dégrader le modèle.',
        verdict: 'refuted',
        result:
          "Gain de 1,97 point, de 49,53 % à 51,50 %. Un modèle témoin entraîné sur les parties d'autres joueurs de mon niveau ne gagne rien.",
      },
      {
        hypothesis:
          'Jouer toujours le coup favori du modèle suffit pour jouer comme moi.',
        verdict: 'refuted',
        result:
          "21 parties, 21 défaites : le bot faisait deux fois moins d'erreurs que moi. Tirer le coup au hasard à température 1 retrouve mon profil d'erreurs.",
      },
    ],
    actions: [
      { label: 'Jouer contre le bot', soonLabel: 'Bientôt', isAccent: true },
      { label: 'Journal de quête', href: '/journal#chessme' },
    ],
  },
  {
    id: 'evolve',
    code: 'PRJ.01',
    quest: 'evolve',
    figure: 'wheel',
    figureName: 'Roue du menu',
    status: 'progress',
    title: 'Evolve',
    tagline: 'Ce portfolio, pensé comme un menu de RPG',
    question:
      "Un portfolio peut-il se jouer comme un jeu sans sacrifier la performance, l'accessibilité ni le mobile ?",
    story: [
      'Un site Astro statique avec des islands React, servi par nginx dans une image Docker, derrière Traefik, sur un VPS durci et déployé en continu.',
      'Une couche de jeu se prépare : des robots infectent le site pendant la navigation.',
    ],
    stages: [
      { text: 'Durcir le VPS', isDone: true },
      {
        text: 'Mettre en place Traefik et le déploiement continu',
        isDone: true,
      },
      { text: 'Publier le site statique', isDone: true },
      { text: "Construire l'arbre de compétences", isDone: false },
      { text: 'Lancer le jeu Intrusion', isDone: false },
    ],
    ingredients: [
      'Astro',
      'React · TypeScript',
      'Docker',
      'Traefik',
      'nginx',
      'GitHub Actions',
    ],
    measures: [],
    experiments: [
      {
        hypothesis:
          "Le routeur d'Astro (ClientRouter) cohabite avec la CSP stricte du site.",
        verdict: 'refuted',
        result:
          'Les deux sont incompatibles. Le site garde sa CSP et passe aux View Transitions natives du navigateur.',
      },
    ],
    actions: [{ label: 'Journal de quête', href: '/journal#evolve' }],
  },
  {
    id: 'scene-3d',
    code: 'PRJ.03',
    quest: null,
    figure: 'cube',
    figureName: 'Cube',
    status: 'locked',
    title: 'Scène 3D',
    tagline: 'Une scène Three.js, isolée sur sa page',
    question:
      'Quelle scène 3D peut tourner dans une page sans alourdir le reste du site ?',
    story: [],
    stages: [],
    ingredients: ['Three.js', 'TypeScript'],
    measures: [],
    experiments: [],
    note: "Emplacement réservé. La scène sera chargée uniquement sur sa page de l'atelier, pour ne pas alourdir le reste du site.",
    actions: [],
  },
  {
    id: 'chatbot',
    code: 'PRJ.04',
    quest: null,
    figure: 'bubble',
    figureName: 'Bulle',
    status: 'paused',
    title: 'Chatbot',
    tagline: 'Une expérience mise en pause',
    question:
      'Un chatbot apporte-t-il assez à un portfolio pour justifier un serveur ?',
    story: [],
    stages: [],
    ingredients: [],
    measures: [],
    experiments: [],
    note: "Mis en pause en octobre 2026 : le site est resté 100 % statique, sans serveur à faire tourner. L'idée reviendra avec un vrai besoin.",
    actions: [],
  },
];
