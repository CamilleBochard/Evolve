// Skill tree of the character: one branch per field, a chain of hubs per
// branch (each hub is a prerequisite of the next), satellites around each hub.
// Each earned skill points to the journal quest where it was used.
import type { QuestId } from './quests';

export type SkillState = 'unlocked' | 'progress' | 'locked';

// Journal quests where skills of the tree were earned.
export type SkillQuestId = Extract<
  QuestId,
  'potager' | 'magento' | 'maisondunet' | 'formation' | 'evolve' | 'chessme'
>;

export interface SkillQuest {
  title: string;
  text: string;
}

export interface Skill {
  id: string;
  name: string;
  state: SkillState;
  // Missing for a skill not earned yet.
  quest?: SkillQuestId;
  // Other quests where the skill was also earned.
  otherQuests?: SkillQuestId[];
}

export interface SkillHub extends Skill {
  // Short code printed in the octagon of the hub.
  mono: string;
  satellites: Skill[];
}

export interface SkillBranch {
  id: string;
  name: string;
  code: string;
  hubs: SkillHub[];
}

export const SKILL_QUESTS: Record<SkillQuestId, SkillQuest> = {
  potager: {
    title: 'Le potager connecté · Maisondunet · 2023 → 2026',
    text: "Application Laravel et Vue.js de suivi des cultures, d'une V1 éprouvée sur une saison à une V2 enrichie.",
  },
  magento: {
    title: 'Boutique solaire · Maisondunet · Magento 2',
    text: 'Fonctionnalités e-commerce pour un distributeur de panneaux solaires : connecteur Looker Studio, panier sauvegardé, devis.',
  },
  maisondunet: {
    title: 'Poste de développeur · Maisondunet · 2023 → 2026',
    text: 'Travail quotidien sous Linux, environnements Docker avec Warden pour les projets Magento 2 et Laravel.',
  },
  formation: {
    title: 'Changement de classe · Campus numérique · 2022 → 2024',
    text: 'Titre RNCP niveau 5 Développeur web et web mobile.',
  },
  evolve: {
    title: 'Evolve · Atelier · 2026',
    text: 'Ce portfolio : Astro, islands React, VPS durci, Traefik, déploiement continu.',
  },
  chessme: {
    title: 'ChessMe · Atelier · 2026',
    text: "Un bot d'échecs qui imite mon jeu, entraîné en Python et exécuté dans le navigateur.",
  },
};

export const SKILL_BRANCHES: SkillBranch[] = [
  {
    id: 'backend',
    name: 'Backend',
    code: 'BR.01',
    hubs: [
      {
        id: 'php',
        name: 'PHP',
        mono: 'PHP',
        state: 'unlocked',
        quest: 'potager',
        satellites: [
          { id: 'poo', name: 'POO', state: 'unlocked', quest: 'potager' },
          {
            id: 'composer',
            name: 'Composer',
            state: 'unlocked',
            quest: 'potager',
          },
          { id: 'mysql', name: 'MySQL', state: 'unlocked', quest: 'potager' },
          {
            id: 'design-patterns',
            name: 'Design patterns',
            state: 'unlocked',
            quest: 'potager',
            otherQuests: ['magento'],
          },
          { id: 'symfony', name: 'Symfony', state: 'locked' },
        ],
      },
      {
        id: 'laravel',
        name: 'Laravel',
        mono: 'LV',
        state: 'unlocked',
        quest: 'potager',
        satellites: [
          {
            id: 'eloquent',
            name: 'Eloquent',
            state: 'unlocked',
            quest: 'potager',
          },
          {
            id: 'modeling',
            name: 'Modélisation BDD',
            state: 'unlocked',
            quest: 'potager',
          },
          {
            id: 'scheduler',
            name: 'Planification',
            state: 'unlocked',
            quest: 'potager',
          },
          {
            id: 'xlsx',
            name: 'Import .xlsx',
            state: 'unlocked',
            quest: 'potager',
          },
          {
            id: 'pest',
            name: 'Pest · PHPUnit',
            state: 'unlocked',
            quest: 'potager',
          },
        ],
      },
      {
        id: 'magento',
        name: 'Magento 2',
        mono: 'M2',
        state: 'unlocked',
        quest: 'magento',
        satellites: [
          {
            id: 'di',
            name: 'Injection (DI)',
            state: 'unlocked',
            quest: 'magento',
          },
          { id: 'cqrs', name: 'CQRS', state: 'unlocked', quest: 'magento' },
          {
            id: 'service-contracts',
            name: 'Service contracts',
            state: 'unlocked',
            quest: 'magento',
          },
          {
            id: 'plugins',
            name: 'Plugins',
            state: 'unlocked',
            quest: 'magento',
          },
          {
            id: 'observers',
            name: 'Observers',
            state: 'unlocked',
            quest: 'magento',
          },
        ],
      },
      {
        id: 'api',
        name: 'API',
        mono: 'API',
        state: 'unlocked',
        quest: 'potager',
        satellites: [
          { id: 'rest', name: 'REST', state: 'unlocked', quest: 'potager' },
          {
            id: 'graphql',
            name: 'GraphQL',
            state: 'unlocked',
            quest: 'potager',
          },
          {
            id: 'auth',
            name: 'Authentification',
            state: 'unlocked',
            quest: 'potager',
          },
          {
            id: 'looker',
            name: 'Connecteur Looker',
            state: 'unlocked',
            quest: 'magento',
          },
        ],
      },
      {
        id: 'architecture',
        name: 'Architecture',
        mono: 'ARC',
        state: 'progress',
        quest: 'chessme',
        satellites: [
          {
            id: 'solid',
            name: 'SOLID',
            state: 'unlocked',
            quest: 'potager',
            otherQuests: ['magento'],
          },
          {
            id: 'owasp',
            name: 'Sécurité OWASP',
            state: 'progress',
            quest: 'evolve',
          },
          { id: 'adr', name: 'ADR', state: 'progress', quest: 'chessme' },
          { id: 'ddd', name: 'DDD', state: 'locked' },
        ],
      },
      {
        id: 'scale',
        name: 'Montée en charge',
        mono: 'SCL',
        state: 'locked',
        satellites: [
          { id: 'postgres', name: 'PostgreSQL', state: 'locked' },
          { id: 'redis', name: 'Redis', state: 'locked' },
          { id: 'queues', name: "Files d'attente", state: 'locked' },
          { id: 'websockets', name: 'WebSockets', state: 'locked' },
          { id: 'node-endpoints', name: 'Endpoints Node', state: 'locked' },
        ],
      },
    ],
  },
  {
    id: 'front',
    name: 'Front',
    code: 'BR.02',
    hubs: [
      {
        id: 'ui',
        name: 'Intégration',
        mono: 'UI',
        state: 'unlocked',
        quest: 'formation',
        satellites: [
          { id: 'html', name: 'HTML', state: 'unlocked', quest: 'formation' },
          { id: 'css', name: 'CSS', state: 'unlocked', quest: 'formation' },
          {
            id: 'responsive',
            name: 'Responsive',
            state: 'unlocked',
            quest: 'evolve',
          },
          { id: 'figma', name: 'Figma', state: 'unlocked', quest: 'formation' },
          {
            id: 'a11y',
            name: 'Accessibilité',
            state: 'progress',
            quest: 'evolve',
          },
        ],
      },
      {
        id: 'js',
        name: 'JavaScript',
        mono: 'JS',
        state: 'unlocked',
        quest: 'potager',
        satellites: [
          { id: 'vue', name: 'Vue.js', state: 'unlocked', quest: 'potager' },
          {
            id: 'alpine',
            name: 'Alpine.js',
            state: 'unlocked',
            quest: 'magento',
          },
          { id: 'ts', name: 'TypeScript', state: 'unlocked', quest: 'evolve' },
          {
            id: 'gql-client',
            name: 'Client GraphQL',
            state: 'unlocked',
            quest: 'potager',
          },
          { id: 'react', name: 'React', state: 'progress', quest: 'evolve' },
          {
            id: 'component-tests',
            name: 'Tests composants',
            state: 'unlocked',
            quest: 'evolve',
          },
        ],
      },
      {
        id: 'astro',
        name: 'Astro',
        mono: 'AST',
        state: 'unlocked',
        quest: 'evolve',
        satellites: [
          {
            id: 'islands',
            name: 'Islands',
            state: 'unlocked',
            quest: 'evolve',
          },
          {
            id: 'view-transitions',
            name: 'View Transitions',
            state: 'progress',
            quest: 'evolve',
          },
          {
            id: 'perf',
            name: 'Performance web',
            state: 'progress',
            quest: 'evolve',
          },
          {
            id: 'playwright',
            name: 'Playwright',
            state: 'unlocked',
            quest: 'evolve',
          },
        ],
      },
      {
        id: 'three-d',
        name: 'Scène 3D',
        mono: '3D',
        state: 'locked',
        satellites: [{ id: 'three', name: 'Three.js', state: 'locked' }],
      },
    ],
  },
  {
    id: 'infra',
    name: 'Infra',
    code: 'BR.03',
    hubs: [
      {
        id: 'linux',
        name: 'Linux',
        mono: 'LX',
        state: 'unlocked',
        quest: 'maisondunet',
        satellites: [
          { id: 'git', name: 'Git', state: 'unlocked', quest: 'potager' },
          { id: 'bash', name: 'Bash', state: 'unlocked', quest: 'maisondunet' },
          { id: 'ssh', name: 'SSH', state: 'unlocked', quest: 'maisondunet' },
        ],
      },
      {
        id: 'docker',
        name: 'Docker',
        mono: 'DK',
        state: 'unlocked',
        quest: 'maisondunet',
        satellites: [
          {
            id: 'warden',
            name: 'Warden',
            state: 'unlocked',
            quest: 'maisondunet',
          },
          {
            id: 'compose',
            name: 'Compose',
            state: 'unlocked',
            quest: 'maisondunet',
          },
          {
            id: 'nginx',
            name: 'nginx',
            state: 'unlocked',
            quest: 'maisondunet',
          },
          {
            id: 'ghcr',
            name: 'Registre GHCR',
            state: 'unlocked',
            quest: 'evolve',
          },
        ],
      },
      {
        id: 'network',
        name: 'Réseau et sécurité',
        mono: 'NET',
        state: 'unlocked',
        quest: 'evolve',
        satellites: [
          { id: 'dns', name: 'DNS', state: 'unlocked', quest: 'evolve' },
          {
            id: 'traefik',
            name: 'Traefik',
            state: 'unlocked',
            quest: 'evolve',
          },
          {
            id: 'tls',
            name: "TLS · Let's Enc.",
            state: 'unlocked',
            quest: 'evolve',
          },
          {
            id: 'hardening',
            name: 'Durcissement',
            state: 'unlocked',
            quest: 'evolve',
          },
          {
            id: 'csp',
            name: 'CSP et en-têtes',
            state: 'unlocked',
            quest: 'evolve',
          },
        ],
      },
      {
        id: 'cicd',
        name: 'CI/CD',
        mono: 'CI',
        state: 'unlocked',
        quest: 'evolve',
        satellites: [
          {
            id: 'actions',
            name: 'GitHub Actions',
            state: 'unlocked',
            quest: 'evolve',
          },
          {
            id: 'deploy',
            name: 'Déploiement auto',
            state: 'unlocked',
            quest: 'evolve',
          },
          {
            id: 'smoke-tests',
            name: 'Smoke tests',
            state: 'unlocked',
            quest: 'evolve',
          },
        ],
      },
      {
        id: 'ops',
        name: 'Exploitation',
        mono: 'OPS',
        state: 'progress',
        quest: 'evolve',
        satellites: [
          { id: 'zap', name: 'Audit ZAP', state: 'progress', quest: 'evolve' },
          {
            id: 'backups',
            name: 'Sauvegardes',
            state: 'progress',
            quest: 'chessme',
          },
          { id: 'monitoring', name: 'Supervision', state: 'locked' },
          { id: 'logs', name: 'Logs centralisés', state: 'locked' },
        ],
      },
      {
        id: 'orchestration',
        name: 'Orchestration',
        mono: 'K8S',
        state: 'locked',
        satellites: [
          { id: 'kubernetes', name: 'Kubernetes', state: 'locked' },
          { id: 'ansible', name: 'Ansible', state: 'locked' },
          { id: 'terraform', name: 'Terraform', state: 'locked' },
        ],
      },
    ],
  },
  {
    id: 'data',
    name: 'Data · IA',
    code: 'BR.04',
    hubs: [
      {
        id: 'ai-dev',
        name: 'Dév assisté IA',
        mono: 'IA',
        state: 'unlocked',
        quest: 'evolve',
        satellites: [
          {
            id: 'claude-code',
            name: 'Claude Code CLI',
            state: 'unlocked',
            quest: 'evolve',
          },
          { id: 'skills', name: 'Skills', state: 'unlocked', quest: 'evolve' },
          {
            id: 'claude-md',
            name: 'CLAUDE.md',
            state: 'unlocked',
            quest: 'evolve',
          },
          {
            id: 'ai-review',
            name: 'Revue du code IA',
            state: 'unlocked',
            quest: 'evolve',
          },
        ],
      },
      {
        id: 'python',
        name: 'Python',
        mono: 'PY',
        state: 'unlocked',
        quest: 'chessme',
        satellites: [
          {
            id: 'pipeline',
            name: 'Pipeline données',
            state: 'unlocked',
            quest: 'chessme',
          },
          { id: 'sqlite', name: 'SQLite', state: 'unlocked', quest: 'chessme' },
        ],
      },
      {
        id: 'ml',
        name: 'Machine learning',
        mono: 'ML',
        state: 'unlocked',
        quest: 'chessme',
        satellites: [
          {
            id: 'training',
            name: 'Entraînement',
            state: 'unlocked',
            quest: 'chessme',
          },
          {
            id: 'onnx-export',
            name: 'Export ONNX',
            state: 'unlocked',
            quest: 'chessme',
          },
        ],
      },
      {
        id: 'inference',
        name: 'Inférence navigateur',
        mono: 'INF',
        state: 'unlocked',
        quest: 'chessme',
        satellites: [
          {
            id: 'workers',
            name: 'Web Workers',
            state: 'unlocked',
            quest: 'chessme',
          },
          {
            id: 'wasm',
            name: 'WebAssembly',
            state: 'unlocked',
            quest: 'chessme',
          },
          {
            id: 'onnx-runtime',
            name: 'ONNX Runtime',
            state: 'unlocked',
            quest: 'chessme',
          },
        ],
      },
    ],
  },
];
