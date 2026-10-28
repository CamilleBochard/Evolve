import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SKILL_BRANCHES } from '../../../data/skill-tree';
import { treeEntries } from '../../../lib/skill-tree/entries';
import { layoutTree } from '../../../lib/skill-tree/layout';
import { SkillPopup } from './SkillPopup';

const entries = treeEntries(layoutTree(SKILL_BRANCHES));

function entryById(id: string) {
  const entry = entries.get(id);
  if (entry === undefined) {
    throw new Error(`No skill ${id}`);
  }
  return entry;
}

describe('SkillPopup', () => {
  it('links an earned skill to its quest in the journal', () => {
    render(
      <SkillPopup
        entry={entryById('graphql')}
        isSheet={false}
        position={{ left: 0, top: 0 }}
        onClose={() => {}}
      />,
    );
    expect(screen.getByRole('dialog', { name: 'GraphQL' })).toBeInTheDocument();
    expect(screen.getByText('Voir la quête').closest('a')).toHaveAttribute(
      'href',
      '/journal#potager',
    );
  });

  it('disables the quest link of a skill not earned yet', () => {
    render(
      <SkillPopup
        entry={entryById('ddd')}
        isSheet={false}
        position={{ left: 0, top: 0 }}
        onClose={() => {}}
      />,
    );
    const link = screen.getByText('Voir la quête').closest('a');
    expect(link).not.toHaveAttribute('href');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('closes from its close button', () => {
    const onClose = vi.fn();
    render(
      <SkillPopup
        entry={entryById('php')}
        isSheet
        onClose={onClose}
        position={null}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(onClose).toHaveBeenCalled();
  });
});
