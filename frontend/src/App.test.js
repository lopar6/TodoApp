import { render, screen } from '@testing-library/react';
import App from './App';

test('renders save button', () => {
  render(<App />);
  const linkElement = screen.getByText(/save/i);
  expect(linkElement).toBeInTheDocument();
});
