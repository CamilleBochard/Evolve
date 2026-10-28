import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { questGroups } from '../../../lib/journal/quest-list';
import { QuestList } from './QuestList';

function renderList(onSelect = vi.fn()) {
  render(
    <QuestList
      groups={questGroups('all', 'newest')}
      selectedId="magento"
      onSelect={onSelect}
      onArrowKey={() => {}}
      registerItem={() => {}}
    />,
  );
}

describe('QuestList', () => {
  it('marks the selected quest as current', () => {
    renderList();
    const selected = screen.getByRole('button', { name: /boutique solaire/ });
    const other = screen.getByRole('button', { name: /potager connecté/ });
    expect(selected).toHaveAttribute('aria-current', 'true');
    expect(other).toHaveAttribute('aria-current', 'false');
  });

  it('asks to select the clicked quest', () => {
    const onSelect = vi.fn();
    renderList(onSelect);
    fireEvent.click(screen.getByRole('button', { name: /ChessMe/ }));
    expect(onSelect).toHaveBeenCalledWith('chessme');
  });
});
