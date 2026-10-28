import { PROJECT_STATUS_LABELS } from '../../../data/projects';
import type { Project } from '../../../data/projects';
import styles from './ProjectHead.module.css';

interface ProjectHeadProps {
  project: Project;
}

// Head of the project sheet: code, title and tagline, with the status
// pressed on it like an ink stamp.
export function ProjectHead({ project }: ProjectHeadProps) {
  return (
    <header className={styles.head}>
      <div className={styles.top}>
        <span className={styles.label}>[Projet personnel]</span>
        <span className={styles.micro}>{project.code}</span>
      </div>
      <h2 className={styles.title}>{project.title}</h2>
      <p className={styles.tagline}>{project.tagline}</p>
      <span className={`${styles.stamp} ${styles[project.status]}`}>
        {PROJECT_STATUS_LABELS[project.status]}
      </span>
    </header>
  );
}
