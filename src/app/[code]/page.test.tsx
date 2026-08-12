import { beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('ReferralLandingPage (app/[code]/page.tsx)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it('código inexistente / falla de resolución (la RPC lanza): también resulta en notFound(), sin reventar la página', async () => {
    resolveReferralCodeMock.mockRejectedValue(new Error('network error'));

    await expect(
      ReferralLandingPage({ params: Promise.resolve({ code: 'cualquier-cosa' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND');

    expect(notFoundMock).toHaveBeenCalledTimes(1);
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
