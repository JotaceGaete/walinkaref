import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReferralLandingPage from './page';

const notFoundMock = vi.fn(() => {
  throw new Error('NEXT_NOT_FOUND');
});
vi.mock('next/navigation', () => ({
  notFound: () => notFoundMock(),
}));

const resolveReferralCodeMock = vi.fn();
vi.mock('@/services/referralService', () => ({
  resolveReferralCode: (code: string) => resolveReferralCodeMock(code),
}));

const supabaseUrlMock = vi.hoisted(() => ({ current: 'https://real-project.supabase.co' }));
vi.mock('@/lib/supabase', () => ({
  get supabaseUrl() {
    return supabaseUrlMock.current;
  },
}));

describe('ReferralLandingPage (app/[code]/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    supabaseUrlMock.current = 'https://real-project.supabase.co';
  });

  it('código válido: resuelve vía wa_resolve_referral_code y renderiza la invitación con el nombre real', async () => {
    resolveReferralCodeMock.mockResolvedValue({ valid: true, referrerName: 'Jota' });

    const jsx = await ReferralLandingPage({ params: Promise.resolve({ code: 'jota-f92ee' }) });
    const { container } = render(jsx);

    expect(resolveReferralCodeMock).toHaveBeenCalledWith('jota-f92ee');
    // El h1 parte "Walinka" en un <span> propio (gradiente): se verifica
    // sobre el texto plano del contenedor, no un único nodo.
    expect(container.textContent).toMatch(/Jota te invitó a conocer\s*Walinka/);
    expect(screen.getAllByText(/ref\.walinka\.com\/jota-f92ee/).length).toBeGreaterThan(0);
  });

  it('código válido sin referrerName: usa el texto genérico en vez de inventar un nombre', async () => {
    resolveReferralCodeMock.mockResolvedValue({ valid: true });

    const jsx = await ReferralLandingPage({ params: Promise.resolve({ code: 'anon-f92ee' }) });
    const { container } = render(jsx);

    expect(container.textContent).toMatch(/Te recomendaron\s*Walinka\s*para hacer crecer tu negocio/);
  });

  it('TODOS los CTA "Crear mi negocio gratis" (header incluido) van directo a go.ventalink.app con ?ref={code} exacto — ninguno queda como ancla interna', async () => {
    resolveReferralCodeMock.mockResolvedValue({ valid: true, referrerName: 'Jota' });

    const jsx = await ReferralLandingPage({ params: Promise.resolve({ code: 'jota-f92ee' }) });
    const { container } = render(jsx);

    // 3 CTA de registro en la página: header (nav), hero, CTA final.
    const registrationCtas = screen.getAllByRole('link', { name: /crear mi negocio gratis/i });
    expect(registrationCtas.length).toBe(3);
    registrationCtas.forEach((link) => {
      expect(link.getAttribute('href')).toBe(
        'https://go.ventalink.app/business-registration?ref=jota-f92ee'
      );
    });

    // Ninguna ancla "#crear-negocio" debe seguir existiendo en ningún lado.
    expect(container.querySelector('a[href="#crear-negocio"]')).toBeNull();
    expect(container.querySelector('#crear-negocio')).toBeNull();

    // Los enlaces informativos ("Conocer Walinka") sí pueden seguir siendo
    // navegación interna — no deben apuntar al signup.
    const informativeLinks = screen.getAllByRole('link', { name: /conocer walinka/i });
    expect(informativeLinks.length).toBeGreaterThan(0);
    informativeLinks.forEach((link) => {
      expect(link.getAttribute('href')).toBe('#que-es-walinka');
    });
  });

  it('el CTA "Crear mi negocio gratis" del código construye el enlace con cada código distinto', async () => {
    resolveReferralCodeMock.mockResolvedValue({ valid: true, referrerName: 'Otra Persona' });

    const jsx = await ReferralLandingPage({ params: Promise.resolve({ code: 'otra-persona-abc12' }) });
    render(jsx);

    const registrationCtas = screen.getAllByRole('link', { name: /crear mi negocio gratis/i });
    expect(registrationCtas.length).toBe(3);
    registrationCtas.forEach((link) => {
      expect(link.getAttribute('href')).toBe(
        'https://go.ventalink.app/business-registration?ref=otra-persona-abc12'
      );
    });
  });

  it('código inválido (RPC responde valid:false): llama a notFound(), no renderiza ninguna invitación', async () => {
    resolveReferralCodeMock.mockResolvedValue({ valid: false });

    await expect(
      ReferralLandingPage({ params: Promise.resolve({ code: 'no-existe' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  describe('falla de resolución (la RPC lanza: red/config/runtime) — distinto de código inválido', () => {
    let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('NO llama a notFound(): deja propagar el error original para que lo capture el error boundary', async () => {
      resolveReferralCodeMock.mockRejectedValue(new Error('network error'));

      await expect(
        ReferralLandingPage({ params: Promise.resolve({ code: 'cualquier-cosa' }) })
      ).rejects.toThrow('network error');

      expect(notFoundMock).not.toHaveBeenCalled();
    });

    it('loguea server-side code, supabaseHost, errorMessage y errorCode — sin exponer la anon key', async () => {
      const rpcError = Object.assign(new Error('fetch failed'), { code: 'ECONNREFUSED' });
      resolveReferralCodeMock.mockRejectedValue(rpcError);
      supabaseUrlMock.current = 'https://real-project.supabase.co';

      await expect(
        ReferralLandingPage({ params: Promise.resolve({ code: 'jota-f92ee' }) })
      ).rejects.toThrow('fetch failed');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('wa_resolve_referral_code'),
        expect.objectContaining({
          code: 'jota-f92ee',
          supabaseHost: 'real-project.supabase.co',
          isDummySupabaseUrl: false,
          errorMessage: 'fetch failed',
          errorCode: 'ECONNREFUSED',
        })
      );

      const loggedPayload = JSON.stringify(consoleErrorSpy.mock.calls[0]);
      expect(loggedPayload).not.toMatch(/anon|apikey|eyJ/i);
    });

    it('detecta y reporta explícitamente cuando NEXT_PUBLIC_SUPABASE_URL sigue en el valor dummy de placeholder', async () => {
      resolveReferralCodeMock.mockRejectedValue(new Error('network error'));
      supabaseUrlMock.current = 'https://dummy.supabase.co';

      await expect(
        ReferralLandingPage({ params: Promise.resolve({ code: 'jota-f92ee' }) })
      ).rejects.toThrow('network error');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ isDummySupabaseUrl: true, supabaseHost: 'dummy.supabase.co' })
      );
    });
  });

  it('nunca renderiza PII (email o UUID) en ningún lado de la página', async () => {
    resolveReferralCodeMock.mockResolvedValue({ valid: true, referrerName: 'Jota' });

    const jsx = await ReferralLandingPage({ params: Promise.resolve({ code: 'jota-f92ee' }) });
    const { container } = render(jsx);

    expect(container.innerHTML).not.toMatch(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    expect(container.innerHTML).not.toMatch(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
    );
  });
});
