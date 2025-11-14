import { render, screen } from '@testing-library/react';
import App from './App';

test('renders primary entry button', () => {
  render(<App />);
  const entryButton = screen.getByRole('button', { name: /enter/i });
  expect(entryButton).toBeInTheDocument();
});
