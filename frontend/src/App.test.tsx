import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('Renders data from shared module', () => {
  render(<App />);
  const linkElement = screen.getByText(/Aberdeen there are 44/i);
  expect(linkElement).toBeInTheDocument();
});
