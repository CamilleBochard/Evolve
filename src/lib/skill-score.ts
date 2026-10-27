// Scores of the skill tree: how many skills are unlocked, out of how many.
// A fact read from the tree, not a self-assessment in percent.
import type { SkillBranch } from '../data/skill-tree';

export interface SkillScore {
  unlocked: number;
  total: number;
}

// Hubs and satellites of a branch, all counted the same way.
export function branchScore(branch: SkillBranch): SkillScore {
  let unlocked = 0;
  let total = 0;
  for (const hub of branch.hubs) {
    const skills = [hub, ...hub.satellites];
    total += skills.length;
    unlocked += skills.filter((skill) => skill.state === 'unlocked').length;
  }
  const score: SkillScore = { unlocked, total };
  return score;
}

export function treeScore(branches: SkillBranch[]): SkillScore {
  let unlocked = 0;
  let total = 0;
  for (const branch of branches) {
    const score = branchScore(branch);
    unlocked += score.unlocked;
    total += score.total;
  }
  const score: SkillScore = { unlocked, total };
  return score;
}

// Share of unlocked skills, from 0 to 1, for a gauge.
export function scoreRatio(score: SkillScore): number {
  let ratio = 0;
  if (score.total > 0) {
    ratio = score.unlocked / score.total;
  }
  return ratio;
}
