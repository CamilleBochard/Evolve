// Skills of the tree earned in a quest: each hub first, then its satellites.
import type { QuestId } from '../../data/quests';
import { SKILL_BRANCHES } from '../../data/skill-tree';
import type { Skill, SkillState } from '../../data/skill-tree';

export interface EarnedSkill {
  id: string;
  name: string;
  state: SkillState;
  isHub: boolean;
}

function isEarnedIn(skill: Skill, questId: QuestId): boolean {
  let isEarned = skill.quest === questId;
  if (skill.otherQuests !== undefined) {
    const isOtherQuest = skill.otherQuests.some((id) => id === questId);
    if (isOtherQuest) {
      isEarned = true;
    }
  }
  return isEarned;
}

function toEarned(skill: Skill, isHub: boolean): EarnedSkill {
  const earned: EarnedSkill = {
    id: skill.id,
    name: skill.name,
    state: skill.state,
    isHub,
  };
  return earned;
}

export function skillsEarnedIn(questId: QuestId): EarnedSkill[] {
  const skills: EarnedSkill[] = [];
  for (const branch of SKILL_BRANCHES) {
    for (const hub of branch.hubs) {
      if (isEarnedIn(hub, questId)) {
        skills.push(toEarned(hub, true));
      }
      for (const satellite of hub.satellites) {
        if (isEarnedIn(satellite, questId)) {
          skills.push(toEarned(satellite, false));
        }
      }
    }
  }
  return skills;
}
