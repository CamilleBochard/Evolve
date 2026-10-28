import type { SkillBranch } from '../../../data/skill-tree';
import styles from './BranchBar.module.css';

interface BranchBarProps {
  branches: SkillBranch[];
  activeIndex: number;
  onJump: (branchIndex: number) => void;
}

// Shortcuts to each branch of the tree, the one in view marked as current,
// then the legend of the three skill states.
export function BranchBar({ branches, activeIndex, onJump }: BranchBarProps) {
  return (
    <nav className={styles.bar} aria-label="Branches de l'arbre">
      <span className={styles.prompt}>[Aller à]</span>
      {branches.map((branch, index) => (
        <button
          key={branch.id}
          type="button"
          className={styles.button}
          aria-current={index === activeIndex}
          onClick={() => onJump(index)}
        >
          {branch.name}
        </button>
      ))}
      <div className={styles.legend} aria-hidden="true">
        <span>
          <i className={`${styles.swatch} ${styles.unlocked}`} />
          Débloquée
        </span>
        <span>
          <i className={`${styles.swatch} ${styles.progress}`} />
          En cours
        </span>
        <span>
          <i className={`${styles.swatch} ${styles.locked}`} />
          Verrouillée
        </span>
      </div>
      <span className={styles.hint}>Glisser pour explorer</span>
    </nav>
  );
}
