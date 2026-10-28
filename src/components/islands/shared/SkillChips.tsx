import type { EarnedSkill } from '../../../lib/journal/rewards';
import styles from './SkillChips.module.css';

export const SKILLS_HREF = '/competences';

interface SkillChipsProps {
  skills: EarnedSkill[];
}

// Skills of the tree as chamfered chips, each leading to the tree. Hubs are
// marked with a diamond, skills still in progress with an accent outline.
export function SkillChips({ skills }: SkillChipsProps) {
  return (
    <ul className={styles.chips}>
      {skills.map((skill) => {
        const classNames = [styles.chip];
        if (skill.isHub) {
          classNames.push(styles.hub);
        }
        if (skill.state === 'progress') {
          classNames.push(styles.inProgress);
        }
        return (
          <li key={skill.id}>
            <a className={classNames.join(' ')} href={SKILLS_HREF}>
              {skill.name}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
