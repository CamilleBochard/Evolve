// Prints of the projects, generated at build time: the page imports the PNG
// files and hands their address and size to the island.
import type { ProjectFigure } from '../../../data/projects';

export interface PrintFile {
  src: string;
  width: number;
  height: number;
}

export interface ProjectPrints {
  // Small print of the bench slot.
  slot: PrintFile;
  // Large print of the project sheet.
  plate: PrintFile;
}

export type PrintsByFigure = Record<ProjectFigure, ProjectPrints>;
