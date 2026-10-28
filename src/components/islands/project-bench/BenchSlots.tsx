import { PROJECT_STATUS_LABELS } from '../../../data/projects';
import type { Project, ProjectId } from '../../../data/projects';
import styles from './BenchSlots.module.css';
import { PrintPaper } from './PrintPaper';
import type { PrintsByFigure } from './project-prints';

interface BenchSlotsProps {
  projects: Project[];
  prints: PrintsByFigure;
  selectedId: ProjectId;
  onSelect: (id: ProjectId) => void;
}

// The bench: one slot per project, like a crafting grid. On phones it
// becomes a strip swiped sideways, like an inventory row.
export function BenchSlots({
  projects,
  prints,
  selectedId,
  onSelect,
}: BenchSlotsProps) {
  return (
    <section className={styles.bench} aria-label="Établi des projets">
      <div className={styles.head}>
        <span className={styles.label}>[Établi]</span>
        <span className={styles.micro}>Choisir un projet</span>
      </div>
      <ul className={styles.slots}>
        {projects.map((project) => (
          <li key={project.id}>
            <button
              type="button"
              className={styles.slot}
              aria-current={project.id === selectedId}
              onClick={() => onSelect(project.id)}
            >
              <PrintPaper
                className={styles.print}
                print={prints[project.figure].slot}
                alt=""
              />
              <span className={styles.text}>
                <span className={styles.micro}>{project.code}</span>
                <span className={styles.title}>{project.title}</span>
                <span className={styles.tagline}>{project.tagline}</span>
                <span className={`${styles.status} ${styles[project.status]}`}>
                  {PROJECT_STATUS_LABELS[project.status]}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
