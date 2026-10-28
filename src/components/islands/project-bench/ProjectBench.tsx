import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_PROJECT_ID, PROJECTS } from '../../../data/projects';
import type { ProjectId } from '../../../data/projects';
import { findProject, isProjectId } from '../../../lib/atelier/projects';
import { useHashSelection } from '../shared/useHashSelection';
import { BenchSlots } from './BenchSlots';
import styles from './ProjectBench.module.css';
import { ProjectSheet } from './ProjectSheet';
import type { PrintsByFigure } from './project-prints';

// Below this width the bench and the sheet are stacked and the page
// scrolls: the sheet is brought into view after a choice. Same value as
// the CSS.
const STACKED_QUERY = '(max-width: 960px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

interface ProjectBenchProps {
  prints: PrintsByFigure;
}

function scrollBehavior(): ScrollBehavior {
  let behavior: ScrollBehavior = 'smooth';
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    behavior = 'auto';
  }
  return behavior;
}

// The bench of projects and the sheet of the chosen one. Rendered on the
// server with the default project; a link such as /atelier#evolve, from the
// journal, opens that project once the island wakes up.
export default function ProjectBench({ prints }: ProjectBenchProps) {
  const [selectedId, setSelectedId] = useState<ProjectId>(DEFAULT_PROJECT_ID);
  const sheetColumnRef = useRef<HTMLDivElement>(null);
  // Set by a click: on stacked screens, the sheet is scrolled into view.
  const shouldRevealSheet = useRef(false);
  const project = findProject(selectedId);

  const selectProject = useCallback((id: ProjectId) => {
    shouldRevealSheet.current = true;
    setSelectedId(id);
    window.history.replaceState(null, '', `#${id}`);
  }, []);

  useHashSelection(isProjectId, setSelectedId);

  // A new project: its sheet starts at the top.
  useEffect(() => {
    const sheetColumn = sheetColumnRef.current;
    if (sheetColumn === null) {
      return;
    }
    sheetColumn.scrollTop = 0;
    const isStacked = window.matchMedia(STACKED_QUERY).matches;
    if (isStacked && shouldRevealSheet.current) {
      sheetColumn.scrollIntoView({
        behavior: scrollBehavior(),
        block: 'start',
      });
    }
    shouldRevealSheet.current = false;
  }, [selectedId]);

  return (
    <div className={styles.workshop}>
      <BenchSlots
        projects={PROJECTS}
        prints={prints}
        selectedId={selectedId}
        onSelect={selectProject}
      />
      <div className={styles.sheetColumn} ref={sheetColumnRef}>
        <p className="visually-hidden" aria-live="polite">
          Projet affiché : {project.title}
        </p>
        <ProjectSheet
          key={project.id}
          project={project}
          print={prints[project.figure].plate}
        />
      </div>
    </div>
  );
}
