import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MenuWheel from './MenuWheel';
import type { MenuWheelPrints } from './menu-prints';

const PRINT = { src: '/print.png', width: 240, height: 300 };
const PRINTS: MenuWheelPrints = {
  wheel: PRINT,
  sun: PRINT,
  medallions: {
    paladev: PRINT,
    tree: PRINT,
    book: PRINT,
    anvil: PRINT,
    envelope: PRINT,
  },
};

describe('MenuWheel', () => {
  beforeEach(() => {
    // jsdom has no media queries: the wheel is shown, as on desktop.
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true })),
    );
  });

  it('links each medallion to its page', () => {
    render(<MenuWheel version="plain" prints={PRINTS} />);
    expect(screen.getByRole('link', { name: /Journal/ })).toHaveAttribute(
      'href',
      '/journal',
    );
  });

  it('describes the entry under the pointer', () => {
    render(<MenuWheel version="plain" prints={PRINTS} />);
    fireEvent.mouseEnter(screen.getByRole('link', { name: /Atelier/ }));
    expect(screen.getByText(/carnet d'expériences/)).toBeInTheDocument();
  });

  it('turns the wheel with the number keys and the arrows', () => {
    render(<MenuWheel version="plain" prints={PRINTS} />);
    fireEvent.keyDown(document.body, { key: '3' });
    expect(screen.getByRole('link', { name: /Journal/ })).toHaveFocus();
    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    expect(screen.getByRole('link', { name: /Atelier/ })).toHaveFocus();
  });
});
