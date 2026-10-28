import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PROJECTS } from '../../../data/projects';
import { findProject } from '../../../lib/atelier/projects';
import { BenchSlots } from './BenchSlots';
import { ProjectSheet } from './ProjectSheet';
import type { PrintsByFigure } from './project-prints';

const PRINT = { src: '/print.png', width: 600, height: 750 };
const PRINTS: PrintsByFigure = {
  knight: { slot: PRINT, plate: PRINT },
  wheel: { slot: PRINT, plate: PRINT },
  cube: { slot: PRINT, plate: PRINT },
  bubble: { slot: PRINT, plate: PRINT },
};

describe('BenchSlots', () => {
  it('marks the chosen project and asks for another one', () => {
    const onSelect = vi.fn();
    render(
      <BenchSlots
        projects={PROJECTS}
        prints={PRINTS}
        selectedId="chessme"
        onSelect={onSelect}
      />,
    );
    expect(screen.getByRole('button', { name: /ChessMe/ })).toHaveAttribute(
      'aria-current',
      'true',
    );
    fireEvent.click(screen.getByRole('button', { name: /Evolve/ }));
    expect(onSelect).toHaveBeenCalledWith('evolve');
  });
});

describe('ProjectSheet', () => {
  it('shows an action not available yet as text, not as a link', () => {
    render(<ProjectSheet project={findProject('chessme')} print={PRINT} />);
    expect(screen.getByText(/Jouer contre le bot/)).toBeVisible();
    expect(
      screen.queryByRole('link', { name: /Jouer contre le bot/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Journal de quête/ }),
    ).toHaveAttribute('href', '/journal#chessme');
  });

  it('shows the note of a project not started, without the empty blocks', () => {
    render(<ProjectSheet project={findProject('scene-3d')} print={PRINT} />);
    expect(screen.getByText(/Emplacement réservé/)).toBeVisible();
    expect(screen.queryByText('[Le projet]')).not.toBeInTheDocument();
    expect(
      screen.queryByText("[Carnet d'expériences]"),
    ).not.toBeInTheDocument();
  });
});
