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

  it('CTA principal contiene exactamente ?ref={code} hacia go.ventalink.app/business-registration', async () => {
    resolveReferralCodeMock.mockResolvedValue({ valid: true, referrerName: 'Jota' });

    const jsx = await ReferralLandingPage({ params: Promise.resolve({ code: 'jota-f92ee' }) });
    const { container } = render(jsx);

    const signupLinks = Array.from(container.querySelectorAll('a[href^="https://go.ventalink.app"]'));
    // El hero y el CTA final apuntan directo al signup real.
    expect(signupLinks.length).toBeGreaterThanOrEqual(2);
    signupLinks.forEach((link) => {
      expect(link.getAttribute('href')).toBe(
        'https://go.ventalink.app/business-registration?ref=jota-f92ee'
      );
    });

    // El CTA del nav es un ancla interna al botón real del hero, no un link directo.
    const navAnchor = screen
      .getAllByRole('link', { name: /crear mi negocio gratis/i })
      .find((l) => l.getAttribute('href') === '#crear-negocio');
    expect(navAnchor).toBeDefined();
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
