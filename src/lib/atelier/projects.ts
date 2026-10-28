// Lookups and counts over the projects of the Atelier.
import { PROJECTS } from '../../data/projects';
import type { Project, ProjectId } from '../../data/projects';
import { skillsEarnedIn } from '../journal/rewards';
import type { EarnedSkill } from '../journal/rewards';

export interface NotebookStats {
  experimentCount: number;
  confirmedCount: number;
  refutedCount: number;
}

export function isProjectId(value: string): value is ProjectId {
  const isKnown = PROJECTS.some((project) => project.id === value);
  return isKnown;
}

export function findProject(id: ProjectId): Project {
  const project = PROJECTS.find((item) => item.id === id);
  if (project === undefined) {
    throw new Error(`No project ${id}`);
  }
  return project;
}

// Hypotheses noted in every project, by verdict.
export function notebookStats(projects: Project[]): NotebookStats {
  const experiments = projects.flatMap((project) => project.experiments);
  const confirmed = experiments.filter(
    (experiment) => experiment.verdict === 'confirmed',
  );
  const refuted = experiments.filter(
    (experiment) => experiment.verdict === 'refuted',
  );
  const stats: NotebookStats = {
    experimentCount: experiments.length,
    confirmedCount: confirmed.length,
    refutedCount: refuted.length,
  };
  return stats;
}

// Skills of the tree worked on in the project, through its journal quest.
export function projectSkills(project: Project): EarnedSkill[] {
  let skills: EarnedSkill[] = [];
  if (project.quest !== null) {
    skills = skillsEarnedIn(project.quest);
  }
  return skills;
}
