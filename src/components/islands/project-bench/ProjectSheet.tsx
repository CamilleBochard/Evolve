import type { Project } from '../../../data/projects';
import { projectSkills } from '../../../lib/atelier/projects';
import { BlockHead } from '../shared/BlockHead';
import { GameLink } from '../shared/GameLink';
import { SkillChips } from '../shared/SkillChips';
import { ExperimentNotebook } from './ExperimentNotebook';
import { ProjectHead } from './ProjectHead';
import { ProjectPlate } from './ProjectPlate';
import styles from './ProjectSheet.module.css';
import type { PrintFile } from './project-prints';

interface ProjectSheetProps {
  project: Project;
  print: PrintFile;
}

// Full sheet of the chosen project: its plate on the left; on the right the
// question it starts from, then each block the project has something for.
export function ProjectSheet({ project, print }: ProjectSheetProps) {
  const skills = projectSkills(project);
  const doneStages = project.stages.filter((stage) => stage.isDone);
  const stageCount = `${doneStages.length} / ${project.stages.length}`;
  const skillCount = `${skills.length} dans l'arbre`;

  return (
    <article className={styles.sheet}>
      <ProjectPlate project={project} print={print} />
      <div className={styles.main}>
        <ProjectHead project={project} />

        <section>
          <BlockHead label="[Question de départ]" />
          <p className={styles.question}>{project.question}</p>
        </section>

        {project.note !== undefined && (
          <p className={styles.note}>{project.note}</p>
        )}

        {project.story.length > 0 && (
          <section className={styles.story}>
            <BlockHead label="[Le projet]" />
            {project.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        )}

        {project.stages.length > 0 && (
          <section>
            <BlockHead label="[Étapes de fabrication]" micro={stageCount} />
            <ol className={styles.stages}>
              {project.stages.map((stage) => {
                let stateClass = styles.stageOpen;
                let checkMark = '';
                let stateText = 'À faire : ';
                if (stage.isDone) {
                  stateClass = styles.stageDone;
                  checkMark = '✓';
                  stateText = 'Fait : ';
                }
                return (
                  <li key={stage.text} className={stateClass}>
                    <span className={styles.check} aria-hidden="true">
                      {checkMark}
                    </span>
                    <span className={styles.stageText}>
                      <span className="visually-hidden">{stateText}</span>
                      {stage.text}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {project.measures.length > 0 && (
          <section>
            <BlockHead label="[Mesures]" micro={project.measuresScope} />
            <ul className={styles.measures}>
              {project.measures.map((measure) => (
                <li key={measure.label} className={styles.measure}>
                  <b>{measure.value}</b>
                  <span>{measure.label}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.experiments.length > 0 && (
          <ExperimentNotebook experiments={project.experiments} />
        )}

        {skills.length > 0 && (
          <section>
            <BlockHead label="[Compétences travaillées]" micro={skillCount} />
            <SkillChips skills={skills} />
          </section>
        )}

        {project.actions.length > 0 && (
          <div className={styles.actions}>
            {project.actions.map((action) => (
              <GameLink
                key={action.label}
                label={action.label}
                href={action.href}
                note={action.soonLabel}
                isAccent={action.isAccent}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
