import { render, screen } from '@testing-library/react';

import FormError from '@/components/form-error';

describe('FormError', () => {
  it('does not render when no message is provided', () => {
    const { container } = render(<FormError />);

    expect(container.firstChild).toBeNull();
  });

  it('renders the provided error message', () => {
    render(<FormError message="Invalid credentials" />);

    expect(screen.getByText('Invalid credentials')).toBeTruthy();
  });
});
