import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAuthRedirectUrl } from './authUrl';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getAuthRedirectUrl', () => {
  it('en localhost (dev) usa el propio origen del navegador, no ref.walinka.com', () => {
    vi.stubGlobal('window', {
      location: { origin: 'http://localhost:4028', hostname: 'localhost' },
    });

    expect(getAuthRedirectUrl()).toBe('http://localhost:4028/auth/callback');
  });

  it('en producción siempre resuelve a https://ref.walinka.com/auth/callback', () => {
    vi.stubGlobal('window', {
      location: { origin: 'https://ref.walinka.com', hostname: 'ref.walinka.com' },
    });

    expect(getAuthRedirectUrl()).toBe('https://ref.walinka.com/auth/callback');
  });

  it('nunca resuelve a go.ventalink.app, sin importar el hostname real', () => {
    vi.stubGlobal('window', {
      location: { origin: 'https://ref.walinka.com', hostname: 'ref.walinka.com' },
    });

    expect(getAuthRedirectUrl()).not.toContain('go.ventalink.app');
  });

  it('sin window (SSR) devuelve el callback de producción por defecto', () => {
    vi.stubGlobal('window', undefined);

    expect(getAuthRedirectUrl()).toBe('https://ref.walinka.com/auth/callback');
  });
});
