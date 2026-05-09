import { render, screen } from '@testing-library/react';

import FormSuccess from '@/components/form-success';

describe('FormSuccess', () => {
  it('does not render when no message is provided', () => {
    const { container } = render(<FormSuccess />);

    expect(container.firstChild).toBeNull();
  });

  it('renders the provided success message', () => {
    render(<FormSuccess message="Account created" />);

    expect(screen.getByText('Account created')).toBeTruthy();
  });
});
