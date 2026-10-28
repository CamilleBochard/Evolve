import { VERDICT_LABELS } from '../../../data/projects';
import type { Experiment } from '../../../data/projects';
import { BlockHead } from '../shared/BlockHead';
import styles from './ExperimentNotebook.module.css';

interface ExperimentNotebookProps {
  experiments: Experiment[];
}

function experimentNumber(index: number): string {
  const number = String(index + 1).padStart(2, '0');
  return number;
}

// Lab notebook of a project: each hypothesis, its verdict stamped beside it,
// and what the measure said.
export function ExperimentNotebook({ experiments }: ExperimentNotebookProps) {
  const refuted = experiments.filter(
    (experiment) => experiment.verdict === 'refuted',
  );
  const count = `${experiments.length} notées · ${refuted.length} réfutées`;

  return (
    <section>
      <BlockHead label="[Carnet d'expériences]" micro={count} />
      <ol className={styles.experiments}>
        {experiments.map((experiment, index) => (
          <li key={experiment.hypothesis} className={styles.experiment}>
            <span className={styles.number}>
              Exp.<b>{experimentNumber(index)}</b>
            </span>
            <p className={styles.hypothesis}>
              <span className={styles.hypothesisLabel}>Hypothèse · </span>
              {experiment.hypothesis}
            </p>
            <span className={`${styles.verdict} ${styles[experiment.verdict]}`}>
              {VERDICT_LABELS[experiment.verdict]}
            </span>
            <p className={styles.result}>{experiment.result}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
