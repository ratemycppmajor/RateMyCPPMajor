import { fireEvent, render, screen } from '@testing-library/react';

import { LogoutButton } from '@/components/auth/logout-button';

const mockSignOut = jest.fn();

jest.mock('next-auth/react', () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
}));

describe('LogoutButton', () => {
  beforeEach(() => {
    mockSignOut.mockClear();
  });

  it('calls signOut when clicked', () => {
    render(<LogoutButton>Sign out</LogoutButton>);

    fireEvent.click(screen.getByText('Sign out'));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
