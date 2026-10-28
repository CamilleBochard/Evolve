import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SKILL_BRANCHES } from '../../../data/skill-tree';
import { BranchBar } from './BranchBar';

describe('BranchBar', () => {
  it('marks the branch in view as current', () => {
    render(
      <BranchBar branches={SKILL_BRANCHES} activeIndex={2} onJump={() => {}} />,
    );
    expect(screen.getByRole('button', { name: 'Infra' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Backend' })).toHaveAttribute(
      'aria-current',
      'false',
    );
  });

  it('asks to jump to the clicked branch', () => {
    const onJump = vi.fn();
    render(
      <BranchBar branches={SKILL_BRANCHES} activeIndex={0} onJump={onJump} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Front' }));
    expect(onJump).toHaveBeenCalledWith(1);
  });
});
