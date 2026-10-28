import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import QuestForm from './QuestForm';

function submit() {
  fireEvent.click(screen.getByRole('button', { name: /Envoyer le messager/ }));
}

describe('QuestForm', () => {
  it('flags the empty required fields and focuses the first one', () => {
    render(<QuestForm />);
    submit();
    const name = screen.getByLabelText('Nom');
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Donnez un titre à la quête.')).toBeVisible();
    expect(screen.queryByText('Messager parti')).not.toBeInTheDocument();
  });

  it('clears an error once its field is filled in', () => {
    render(<QuestForm />);
    submit();
    fireEvent.change(screen.getByLabelText('Nom'), {
      target: { value: 'Alex' },
    });
    expect(screen.queryByText('Indiquez votre nom.')).not.toBeInTheDocument();
    expect(screen.getByText('Donnez un titre à la quête.')).toBeVisible();
  });

  it('counts the characters of the story', () => {
    render(<QuestForm />);
    fireEvent.change(screen.getByLabelText('Récit'), {
      target: { value: 'Bonjour' },
    });
    expect(screen.getByText('7 / 2000')).toBeInTheDocument();
  });
});
