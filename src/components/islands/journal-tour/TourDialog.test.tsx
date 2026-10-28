import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TourDialog } from './TourDialog';

// A step in the middle of the screen: no area to scroll to in jsdom.
const STEP = { target: null, title: 'Le journal', text: 'Bienvenue.' };

function renderDialog(index: number) {
  const handlers = { onNext: vi.fn(), onPrevious: vi.fn(), onClose: vi.fn() };
  render(<TourDialog step={STEP} index={index} count={3} {...handlers} />);
  return handlers;
}

describe('TourDialog', () => {
  it('closes on Escape before the top bar sees the key', () => {
    const handlers = renderDialog(1);
    const isNotCancelled = fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(handlers.onClose).toHaveBeenCalled();
    expect(isNotCancelled).toBe(false);
  });

  it('moves with the arrow keys', () => {
    const handlers = renderDialog(1);
    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
    expect(handlers.onNext).toHaveBeenCalledTimes(1);
    expect(handlers.onPrevious).toHaveBeenCalledTimes(1);
  });

  it('offers no previous step on the first one', () => {
    renderDialog(0);
    expect(
      screen.getByRole('button', { name: 'Étape précédente' }),
    ).toBeDisabled();
  });

  it('ends on the last step', () => {
    renderDialog(2);
    expect(screen.getByRole('button', { name: /Terminer/ })).toBeVisible();
  });
});
