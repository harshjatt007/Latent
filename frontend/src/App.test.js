import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple component test that doesn't require complex dependencies
const SimpleComponent = () => <div>Test Component</div>;

test('renders test component', () => {
  render(<SimpleComponent />);
  const element = screen.getByText(/test component/i);
  expect(element).toBeInTheDocument();
});
