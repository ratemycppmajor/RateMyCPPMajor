import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import LoginForm from '@/app/(auth)/login/login-form';

const searchParamsRef = { current: new URLSearchParams() };

jest.mock('next/navigation', () => ({
  useSearchParams: () => searchParamsRef.current,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  },
}));

const mockSignIn = jest.fn();
jest.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => mockSignIn(...args),
}));

const mockLogin = jest.fn();
jest.mock('@/actions/login', () => ({
  login: (...args: unknown[]) => mockLogin(...args),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    searchParamsRef.current = new URLSearchParams();
    mockLogin.mockReset();
    mockSignIn.mockReset();
  });

  it('renders email and password fields and submit control', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('●●●●●●●●')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Login' })).toBeTruthy();
  });

  it('shows OAuth account error from search params', () => {
    searchParamsRef.current = new URLSearchParams({
      error: 'OAuthAccountNotLinked',
    });

    render(<LoginForm />);

    expect(
      screen.getByText('Email already in use with different provider!'),
    ).toBeTruthy();
  });

  it('shows server error message after failed login', async () => {
    mockLogin.mockResolvedValue({ error: 'Invalid credentials!' });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'student@cpp.edu' },
    });
    fireEvent.change(screen.getByPlaceholderText('●●●●●●●●'), {
      target: { value: 'secretpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials!')).toBeTruthy();
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'student@cpp.edu',
      password: 'secretpass',
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });
});
