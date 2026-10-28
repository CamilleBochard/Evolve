import { PROJECT_STATUS_LABELS } from '../../../data/projects';
import type { Project } from '../../../data/projects';
import { BlockHead } from '../shared/BlockHead';
import { PrintPaper } from './PrintPaper';
import styles from './ProjectPlate.module.css';
import type { PrintFile } from './project-prints';

interface ProjectPlateProps {
  project: Project;
  print: PrintFile;
}

// Left of the project sheet: the engraved figure of the project, then the
// ingredients it is made of.
export function ProjectPlate({ project, print }: ProjectPlateProps) {
  const alt = `${project.figureName} en gravure tramée, devant un soleil à pointes.`;
  const ingredientCount = `${project.ingredients.length} composants`;

  return (
    <div className={styles.plate}>
      <PrintPaper className={styles.print} print={print} alt={alt}>
        <span className={styles.printLabel} aria-hidden="true">
          {project.code} · {project.figureName}
        </span>
      </PrintPaper>
      <span className={styles.caption} aria-hidden="true">
        <span>Gravure deux encres</span>
        <span>{PROJECT_STATUS_LABELS[project.status]}</span>
      </span>
      {project.ingredients.length > 0 && (
        <section className={styles.ingredients}>
          <BlockHead label="[Ingrédients]" micro={ingredientCount} />
          <ul className={styles.ingredientList}>
            {project.ingredients.map((ingredient) => (
              <li key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
