import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// Only checks that the React component test chain runs (JSX, jsdom,
// Testing Library). Remove once a real component test exists.
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
