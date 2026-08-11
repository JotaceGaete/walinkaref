import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

const { signInWithOAuthMock, getSessionMock, onAuthStateChangeMock } = vi.hoisted(() => ({
  signInWithOAuthMock: vi.fn(),
  getSessionMock: vi.fn(),
  onAuthStateChangeMock: vi.fn(),
}));

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
      signInWithOAuth: signInWithOAuthMock,
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

import { AuthProvider, useAuth } from './AuthContext';

async function renderAuth() {
  const result = renderHook(() => useAuth(), { wrapper: AuthProvider });
  await waitFor(() => expect(result.result.current.loading).toBe(false));
  return result;
}

describe('AuthContext.signInWithGoogle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue({ data: { session: null } });
    onAuthStateChangeMock.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('llama a supabase.auth.signInWithOAuth con provider "google" y un redirectTo de /auth/callback', async () => {
    signInWithOAuthMock.mockResolvedValue({
      data: { url: 'https://accounts.google.com/o/oauth2/authorize?client_id=xyz' },
      error: null,
    });
    const { result } = await renderAuth();

    await act(async () => {
      await result.current.signInWithGoogle();
    });

    expect(signInWithOAuthMock).toHaveBeenCalledTimes(1);
    expect(signInWithOAuthMock).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: expect.stringContaining('/auth/callback') },
    });
  });

  it('si Supabase devuelve error, no lanza excepción y retorna { error }', async () => {
    signInWithOAuthMock.mockResolvedValue({
      data: null,
      error: { message: 'popup_closed_by_user' },
    });
    const { result } = await renderAuth();

    let response: { error: { message: string } | null } | undefined;
    await act(async () => {
      response = await result.current.signInWithGoogle();
    });

    expect(response?.error?.message).toBe('popup_closed_by_user');
  });

  it('si el cliente Supabase lanza una excepción de red, la atrapa y retorna { error } en vez de propagarla', async () => {
    signInWithOAuthMock.mockRejectedValue(new Error('Network error'));
    const { result } = await renderAuth();

    let response: { error: { message: string } | null } | undefined;
    await expect(
      act(async () => {
        response = await result.current.signInWithGoogle();
      })
    ).resolves.not.toThrow();

    expect(response?.error?.message).toBe('Network error');
  });
});
