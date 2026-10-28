import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { findQuest } from '../../../lib/journal/quest-list';
import { QuestSheet } from './QuestSheet';

describe('QuestSheet', () => {
  it('links the skills earned in the quest to the tree', () => {
    render(<QuestSheet quest={findQuest('magento')} onSelect={() => {}} />);
    expect(screen.getByRole('link', { name: /Plugins/ })).toHaveAttribute(
      'href',
      '/competences',
    );
  });

  it('leaves out the rewards of a quest that gives none', () => {
    render(<QuestSheet quest={findQuest('suite')} onSelect={() => {}} />);
    expect(screen.queryByText('[Récompenses]')).not.toBeInTheDocument();
    expect(screen.getByText(/se dévoilera au prochain niveau/)).toBeVisible();
  });

  it('opens the older quest from the bottom navigation', () => {
    const onSelect = vi.fn();
    render(<QuestSheet quest={findQuest('potager')} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /Plus ancienne/ }));
    expect(onSelect).toHaveBeenCalledWith('formation');
  });
});
