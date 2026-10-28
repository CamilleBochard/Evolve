import type { Quest } from '../../../data/quests';
import { skillsEarnedIn } from '../../../lib/journal/rewards';
import { BlockHead } from '../shared/BlockHead';
import { GameLink } from '../shared/GameLink';
import { SKILLS_HREF, SkillChips } from '../shared/SkillChips';
import styles from './QuestRewards.module.css';

interface QuestRewardsProps {
  quest: Quest;
}

// Diplomas and talents of the quest, then the skills of the tree earned in
// it, each leading to the tree. Nothing when the quest gives no reward.
export function QuestRewards({ quest }: QuestRewardsProps) {
  const skills = skillsEarnedIn(quest.id);
  const hasSkills = skills.length > 0;
  const hasLoot = quest.loot.length > 0;
  if (!hasSkills && !hasLoot && quest.link === undefined) {
    return null;
  }

  let micro: string | undefined;
  if (hasSkills) {
    micro = `${skills.length} compétences`;
  }

  return (
    <section className={styles.rewards} data-tour="rewards">
      <BlockHead label="[Récompenses]" micro={micro} />
      {hasLoot && (
        <ul className={styles.loot}>
          {quest.loot.map((item) => (
            <li key={item.name}>
              <span className={styles.icon} aria-hidden="true">
                {item.icon}
              </span>
              <span>
                <span className={styles.kind}>{item.kind}</span>
                <span className={styles.name}>{item.name}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
      {hasSkills && <SkillChips skills={skills} />}
      <div className={styles.foot}>
        {hasSkills && <GameLink href={SKILLS_HREF} label="Ouvrir l'arbre" />}
        {quest.link !== undefined && (
          <GameLink href={quest.link.href} label={quest.link.label} isAccent />
        )}
      </div>
    </section>
  );
}
