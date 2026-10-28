// Career as an RPG quest log: chapters, then quests, both written oldest
// first. Placeholder content taken from the CV, to be replaced by the full
// text once it is written.
// Skill rewards are not listed here: they come from the skill tree, through
// the quest id.

export type QuestId =
  | 'fondations'
  | 'compagnons'
  | 'chantiers'
  | 'formation'
  | 'potager'
  | 'magento'
  | 'maisondunet'
  | 'evolve'
  | 'chessme'
  | 'suite';

export type ChapterId =
  'couvreur' | 'reconversion' | 'paladev' | 'atelier' | 'suite';

export type QuestStatus = 'done' | 'progress' | 'locked';

export type QuestType = 'main' | 'side';

export interface QuestChapter {
  id: ChapterId;
  numeral: string;
  name: string;
  // Heading of the chapter in the simple view, without the game vocabulary.
  plainName: string;
  period: string;
  isLocked: boolean;
}

export interface QuestFact {
  term: string;
  value: string;
}

export interface QuestObjective {
  text: string;
  isDone: boolean;
}

export interface QuestFeat {
  value: string;
  label: string;
}

export interface QuestLogEntry {
  when: string;
  what: string;
}

export interface QuestLoot {
  kind: string;
  name: string;
  // Short code printed in the octagon.
  icon: string;
}

export interface QuestLink {
  label: string;
  href: string;
}

export interface Quest {
  id: QuestId;
  chapter: ChapterId;
  type: QuestType;
  status: QuestStatus;
  title: string;
  summary: string;
  // Fractional years placing the bar on the timeline. A quest without start
  // stays off the timeline; a quest without end is still running.
  from: number | null;
  to: number | null;
  // What the page shows for the dates.
  period: string;
  facts: QuestFact[];
  story: string[];
  objectives: QuestObjective[];
  feats: QuestFeat[];
  log: QuestLogEntry[];
  loot: QuestLoot[];
  link?: QuestLink;
}

// Bounds of the campaign timeline, in fractional years. Written by hand:
// "now" moves with each new version of the page, not with each build.
export const TIMELINE = {
  start: 2010.5,
  end: 2027,
  now: 2026.82,
  ticks: [2011, 2014, 2017, 2020, 2023, 2026],
};

export const CAMPAIGN_YEARS = 15;

// Quest opened when the address names none.
export const DEFAULT_QUEST_ID: QuestId = 'potager';

export const STATUS_LABELS: Record<QuestStatus, string> = {
  done: 'Accomplie',
  progress: 'En cours',
  locked: 'Verrouillée',
};

export const TYPE_LABELS: Record<QuestType, string> = {
  main: 'Quête principale',
  side: 'Quête secondaire',
};

export const TYPE_MARKS: Record<QuestType, string> = {
  main: '◆',
  side: '◇',
};

export const QUEST_CHAPTERS: QuestChapter[] = [
  {
    id: 'couvreur',
    numeral: 'I',
    name: 'Le pyrozinc',
    plainName: 'Couvreur-zingueur',
    period: '2011 → 2022',
    isLocked: false,
  },
  {
    id: 'reconversion',
    numeral: 'II',
    name: 'Changement de classe',
    plainName: 'Reconversion',
    period: '2022 → 2024',
    isLocked: false,
  },
  {
    id: 'paladev',
    numeral: 'III',
    name: 'Le paladev',
    plainName: 'Développeur PHP chez Maisondunet',
    period: '2023 → 2026',
    isLocked: false,
  },
  {
    id: 'atelier',
    numeral: 'IV',
    name: "L'Atelier",
    plainName: 'Projets personnels',
    period: '2026 →',
    isLocked: false,
  },
  {
    id: 'suite',
    numeral: 'V',
    name: '???',
    plainName: '',
    period: '',
    isLocked: true,
  },
];

export const QUESTS: Quest[] = [
  {
    id: 'fondations',
    chapter: 'couvreur',
    type: 'side',
    status: 'done',
    title: 'Les fondations',
    summary: 'Bac STI génie civil',
    from: 2010.6,
    to: 2011.4,
    period: '2011',
    facts: [
      { term: 'Lieu', value: 'Lycée Champlain' },
      { term: 'Période', value: '2011' },
    ],
    story: [
      'Avant les toits, les bases : un bac STI génie civil, première approche technique du bâtiment.',
    ],
    objectives: [{ text: 'Obtenir le bac STI génie civil', isDone: true }],
    feats: [],
    log: [],
    loot: [{ kind: 'Diplôme', name: 'Bac STI génie civil', icon: 'BAC' }],
  },
  {
    id: 'compagnons',
    chapter: 'couvreur',
    type: 'main',
    status: 'done',
    title: 'La voie des Compagnons',
    summary: 'Brevet professionnel couvreur-zingueur',
    from: 2011,
    to: 2015,
    period: '2011 → 2015',
    facts: [
      { term: 'Guilde', value: 'CFA compagnonnique du Tour de France' },
      { term: 'Période', value: '2011 → 2015' },
    ],
    story: [
      "Quatre ans de formation au métier de couvreur-zingueur chez les Compagnons du Tour de France, dans l'exigence du travail bien fait.",
    ],
    objectives: [
      { text: 'Apprendre le métier de couvreur-zingueur', isDone: true },
      { text: 'Obtenir le brevet professionnel', isDone: true },
    ],
    feats: [],
    log: [],
    loot: [
      {
        kind: 'Diplôme',
        name: 'Brevet professionnel couvreur-zingueur',
        icon: 'BP',
      },
    ],
  },
  {
    id: 'chantiers',
    chapter: 'couvreur',
    type: 'main',
    status: 'done',
    title: "Chef d'équipe sur les toits",
    summary: "Couvreur-zingueur, puis chef d'équipe",
    from: 2011,
    to: 2022,
    period: '2011 → 2022',
    facts: [
      { term: 'Guilde', value: 'Entreprise et intérim' },
      { term: 'Période', value: '2011 → 2022' },
      { term: 'Rang atteint', value: "Chef d'équipe" },
    ],
    story: [
      "Onze ans de chantiers, en entreprise et en intérim. Le rôle de chef d'équipe ajoute l'organisation du chantier et l'encadrement de l'équipe.",
    ],
    objectives: [
      { text: 'Réaliser les chantiers', isDone: true },
      { text: "Devenir chef d'équipe", isDone: true },
    ],
    feats: [
      { value: '11 ans', label: 'de chantiers' },
      { value: 'Niv. 11', label: 'classe Pyrozinc atteinte' },
    ],
    log: [],
    loot: [
      { kind: 'Talent', name: "Encadrement d'équipe", icon: 'EQP' },
      { kind: 'Talent', name: 'Réalisation de chantiers', icon: 'CHT' },
    ],
  },
  {
    id: 'formation',
    chapter: 'reconversion',
    type: 'main',
    status: 'done',
    title: 'Changement de classe',
    summary: 'Titre RNCP niveau 5 · Développeur web et web mobile',
    from: 2022,
    to: 2024,
    period: '2022 → 2024',
    facts: [
      { term: 'Guilde', value: 'Campus numérique' },
      { term: 'Période', value: '2022 → 2024' },
      { term: 'Titre', value: 'RNCP niveau 5' },
    ],
    story: [
      'Le tournant de la campagne : quitter la classe Pyrozinc pour celle de paladev. Une reconversion portée par la passion du numérique, la curiosité et beaucoup de travail.',
    ],
    objectives: [
      { text: 'Quitter la classe Pyrozinc', isDone: true },
      { text: "Apprendre l'intégration et le développement web", isDone: true },
      {
        text: 'Obtenir le titre Développeur web et web mobile',
        isDone: true,
      },
    ],
    feats: [],
    log: [],
    loot: [
      {
        kind: 'Diplôme',
        name: 'Titre RNCP niveau 5 · Développeur web et web mobile',
        icon: 'RNCP',
      },
    ],
  },
  {
    id: 'potager',
    chapter: 'paladev',
    type: 'main',
    status: 'done',
    title: 'Le potager connecté',
    summary: 'Application Laravel et Vue.js de suivi des cultures',
    from: 2023,
    to: 2026,
    period: '2023 → 2026',
    facts: [
      { term: 'Guilde', value: 'Maisondunet' },
      {
        term: 'Commanditaire',
        value: 'Création de potagers et services paysagers',
      },
      { term: 'Durée', value: '~2 ans' },
    ],
    story: [
      'Une application web Laravel et Vue.js qui permet aux particuliers de suivre leurs cultures.',
      "Le projet avance par itérations : une V1 développée pendant l'hiver, mise en production pour être éprouvée sur la saison estivale. Les retours positifs des utilisateurs ont validé le lancement d'une V2 enrichie.",
    ],
    objectives: [
      {
        text: 'Modéliser la base de données et la logique métier',
        isDone: true,
      },
      {
        text: 'Calculer le planning des récoltes à partir des dates de culture',
        isDone: true,
      },
      { text: 'Mettre en place des notifications planifiées', isDone: true },
      {
        text: "Migrer l'API REST vers GraphQL : schéma, resolvers, mutations, pagination, authentification",
        isDone: true,
      },
      {
        text: 'Importer les données métier depuis des fichiers .xlsx (parsing, validation)',
        isDone: true,
      },
      {
        text: 'Garantir la qualité : tests Pest et PHPUnit, intégration continue, sprints Scrum',
        isDone: true,
      },
    ],
    feats: [
      { value: '200+', label: 'comptes clients créés par import' },
      { value: 'V1 → V2', label: 'validée par une saison réelle' },
      { value: '~2 ans', label: 'de projet' },
    ],
    log: [
      { when: 'Acte I · Hiver', what: 'Développement de la V1.' },
      {
        when: 'Acte II · Saison estivale',
        what: 'Mise en production, épreuve des conditions réelles.',
      },
      {
        when: 'Acte III · Retours',
        what: 'Retours positifs des utilisateurs, lancement de la V2.',
      },
    ],
    loot: [],
  },
  {
    id: 'magento',
    chapter: 'paladev',
    type: 'main',
    status: 'done',
    title: 'La boutique solaire',
    summary: 'Fonctionnalités e-commerce Magento 2',
    from: 2023,
    to: 2026,
    period: '2023 → 2026',
    facts: [
      { term: 'Guilde', value: 'Maisondunet' },
      { term: 'Commanditaire', value: 'Distributeur de panneaux solaires' },
      { term: 'Monde', value: 'Magento 2' },
    ],
    story: [
      "Pour un acteur de la distribution de panneaux solaires et de fournitures électriques, qui réalise plusieurs millions d'euros de chiffre d'affaires : des fonctionnalités pour simplifier le parcours d'achat et améliorer le pilotage de l'activité.",
    ],
    objectives: [
      {
        text: 'Concevoir un connecteur vers Looker Studio pour exploiter les données de ventes',
        isDone: true,
      },
      {
        text: 'Réaliser un module de sauvegarde de panier pour les clients professionnels',
        isDone: true,
      },
      {
        text: 'Créer un système de demande de devis avec gestion des remises en back-office',
        isDone: true,
      },
    ],
    feats: [
      {
        value: '250 k€',
        label: 'de ventes par jour en pic, exploitées dans Looker',
      },
      { value: 'B2B', label: "parcours d'achat pensé pour les professionnels" },
    ],
    log: [],
    loot: [],
  },
  {
    id: 'maisondunet',
    chapter: 'paladev',
    type: 'side',
    status: 'done',
    title: 'Au service de Maisondunet',
    summary: 'Développeur PHP · Linux, Docker, Warden',
    from: 2023,
    to: 2026,
    period: '2023 → 2026',
    facts: [
      { term: 'Guilde', value: 'Maisondunet' },
      { term: 'Période', value: '2023 → 2026' },
      { term: 'Poste', value: 'Développeur PHP' },
    ],
    story: [
      'Le quotidien du poste : travail sous Linux, environnements Docker avec Warden pour les projets Magento 2 et Laravel, livraisons à chaque sprint.',
      'Claude Code accélère le travail de tous les jours : génération de tests, refactoring assisté, exploration de la base de code.',
    ],
    objectives: [
      { text: 'Travailler au quotidien sous Linux', isDone: true },
      { text: 'Monter les environnements Docker avec Warden', isDone: true },
      { text: 'Livrer à chaque sprint, en méthode Scrum', isDone: true },
      { text: 'Intégrer Claude Code au flux de travail', isDone: true },
    ],
    feats: [],
    log: [],
    loot: [],
  },
  {
    id: 'evolve',
    chapter: 'atelier',
    type: 'main',
    status: 'progress',
    title: 'Evolve',
    summary: 'Ce portfolio, pensé comme un menu de RPG',
    from: 2026,
    to: null,
    period: '2026 · en cours',
    facts: [
      { term: 'Guilde', value: 'Atelier' },
      { term: 'Période', value: '2026 · en cours' },
      { term: 'Monde', value: 'Astro, React, VPS' },
    ],
    story: [
      'Ce portfolio : un site Astro statique avec des islands React, servi depuis un VPS durci derrière Traefik, déployé en continu.',
      'Une couche de jeu se prépare : des robots infectent le site pendant la navigation.',
    ],
    objectives: [
      { text: 'Durcir le VPS', isDone: true },
      {
        text: 'Mettre en place Traefik et le déploiement continu',
        isDone: true,
      },
      { text: 'Publier le site statique', isDone: true },
      { text: "Construire l'arbre de compétences", isDone: false },
      { text: 'Lancer le jeu Intrusion', isDone: false },
    ],
    feats: [],
    log: [],
    loot: [],
    link: { label: "Voir dans l'Atelier", href: '/atelier#evolve' },
  },
  {
    id: 'chessme',
    chapter: 'atelier',
    type: 'side',
    status: 'progress',
    title: 'ChessMe',
    summary: "Un bot d'échecs qui imite mon jeu",
    from: 2026,
    to: null,
    period: '2026 · en cours',
    facts: [
      { term: 'Guilde', value: 'Atelier' },
      { term: 'Période', value: '2026 · en cours' },
      { term: 'Monde', value: 'Python, navigateur' },
    ],
    story: [
      "Un bot d'échecs entraîné en Python sur mes propres parties, puis exécuté dans le navigateur.",
    ],
    objectives: [
      { text: 'Entraîner le modèle en Python', isDone: true },
      { text: 'Exécuter le bot dans le navigateur', isDone: true },
      { text: "Présenter le projet dans l'Atelier", isDone: false },
    ],
    feats: [],
    log: [],
    loot: [],
    link: { label: "Voir dans l'Atelier", href: '/atelier#chessme' },
  },
  {
    id: 'suite',
    chapter: 'suite',
    type: 'main',
    status: 'locked',
    title: '???',
    summary: 'Se dévoile au niveau 4',
    from: null,
    to: null,
    period: '???',
    facts: [
      { term: 'Prérequis', value: 'Paladev · niveau 4' },
      { term: 'Prochaine classe', value: 'Fullstack ?' },
    ],
    story: [],
    objectives: [],
    feats: [],
    log: [],
    loot: [],
  },
];
