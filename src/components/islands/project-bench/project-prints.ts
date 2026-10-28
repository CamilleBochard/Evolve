// Prints of the projects, generated at build time.
import type { ProjectFigure } from '../../../data/projects';
import type { PrintFile } from '../shared/print-file';

export interface ProjectPrints {
  // Small print of the bench slot.
  slot: PrintFile;
  // Large print of the project sheet.
  plate: PrintFile;
}

export type PrintsByFigure = Record<ProjectFigure, ProjectPrints>;
