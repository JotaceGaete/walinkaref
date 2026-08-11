import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import AuthCallbackPage from './page';

const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

const { getSessionMock } = vi.hoisted(() => ({ getSessionMock: vi.fn() }));
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: getSessionMock,
    },
  },
}));

describe('AuthCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sin sesión, redirige a /sign-up-login-screen', async () => {
    getSessionMock.mockResolvedValue({ data: { session: null }, error: null });

    render(<AuthCallbackPage />);

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/sign-up-login-screen'));
  });

  it('con sesión válida, redirige a /affiliate-dashboard', async () => {
    getSessionMock.mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } },
      error: null,
    });

    render(<AuthCallbackPage />);

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/affiliate-dashboard'));
  });
});
