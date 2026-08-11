/**
 * Origen canónico de WalinkaRef. Cada app de auth (ref.walinka.com,
 * go.ventalink.app) resuelve su propio callback — este archivo nunca
 * debe apuntar a go.ventalink.app.
 */
const SITE_ORIGIN = 'https://ref.walinka.com';

function isLocalhostHostname(hostname: string): boolean {
  const host = hostname.trim().toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost');
}

/**
 * URL de callback para OAuth (Google) y confirmación de email de WalinkaRef.
 * En producción siempre resuelve a ref.walinka.com/auth/callback; en local o
 * previews de Vercel, al propio origen actual.
 */
export function getAuthRedirectUrl(): string {
  if (typeof window === 'undefined' || !window.location?.origin) {
    return `${SITE_ORIGIN}/auth/callback`;
  }
  const hostname = window.location.hostname.trim().toLowerCase();
  if (isLocalhostHostname(hostname) || hostname.endsWith('.vercel.app')) {
    const origin = window.location.origin.replace(/\/$/, '');
    return `${origin}/auth/callback`;
  }
  return `${SITE_ORIGIN}/auth/callback`;
}
