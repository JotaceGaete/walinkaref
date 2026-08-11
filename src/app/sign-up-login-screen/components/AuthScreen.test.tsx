import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AuthScreen from './AuthScreen';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

const signInMock = vi.fn();
const signUpMock = vi.fn();
const signInWithGoogleMock = vi.fn();
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: signInMock,
    signUp: signUpMock,
    signInWithGoogle: signInWithGoogleMock,
  }),
}));

describe('AuthScreen — Google OAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('el botón "Continuar con Google" llama a signInWithGoogle()', async () => {
    signInWithGoogleMock.mockResolvedValue({ error: null });
    render(<AuthScreen />);

    fireEvent.click(screen.getByRole('button', { name: /continuar con google/i }));

    await waitFor(() => expect(signInWithGoogleMock).toHaveBeenCalledTimes(1));
  });

  it('si signInWithGoogle devuelve error, se muestra el mensaje y la pantalla sigue interactiva', async () => {
    signInWithGoogleMock.mockResolvedValue({
      error: { message: 'No se pudo iniciar sesión con Google' },
    });
    render(<AuthScreen />);

    fireEvent.click(screen.getByRole('button', { name: /continuar con google/i }));

    expect(await screen.findByText(/no se pudo iniciar sesión con google/i)).toBeInTheDocument();

    // La pantalla no se rompió: el botón de Google sigue presente y habilitado.
    const googleButton = screen.getByRole('button', { name: /continuar con google/i });
    expect(googleButton).toBeEnabled();
  });
});
