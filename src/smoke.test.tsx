import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// Vérifie seulement que la chaîne de test des composants React tourne (JSX,
// jsdom, Testing Library). À supprimer dès qu'un vrai test de composant existe.
function Greeting() {
  return <p>Hello</p>;
}

describe('component test runner', () => {
  it('renders a React component', () => {
    render(<Greeting />);

    const greeting = screen.getByText('Hello');

    expect(greeting).toBeInTheDocument();
  });
});
