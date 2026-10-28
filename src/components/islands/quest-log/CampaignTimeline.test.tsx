import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CampaignTimeline } from './CampaignTimeline';

describe('CampaignTimeline', () => {
  it('links each bar to its quest', () => {
    render(<CampaignTimeline selectedId="potager" onSelect={() => {}} />);
    const bar = screen.getByRole('link', { name: /Changement de classe/ });
    expect(bar).toHaveAttribute('href', '#formation');
  });

  it('selects the quest of a clicked bar', () => {
    const onSelect = vi.fn();
    render(<CampaignTimeline selectedId="potager" onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('link', { name: /ChessMe/ }));
    expect(onSelect).toHaveBeenCalledWith('chessme');
  });
});
