/**
 * Capa delgada sobre las RPC de lectura del Affiliate Core
 * (wa_get_my_referral_stats, wa_list_my_referrals — mismo proyecto Supabase
 * que go.ventalink.app). Ninguna lógica de negocio vive acá: toda la
 * agregación, calificación y límites de paginación ya están resueltos
 * server-side. El único código nuevo es el mapeo de tipos.
 */
import { supabase } from '@/lib/supabase';

export interface ReferralStats {
  code: string;
  rewardAmount: number;
  rewardCurrency: string;
  requiredPaidMonths: number;
  invitedCount: number;
  oneMonthCount: number;
  qualifiedCount: number;
  pendingAmount: number;
  availableAmount: number;
  totalEarnedAmount: number;
}

export interface ReferralListItem {
  publicLabel: string;
  createdAt: string;
  paidMonths: number;
  qualified: boolean;
}

export interface ReferralCodeResolution {
  valid: boolean;
  referrerName?: string;
}

/**
 * Resolución pública de un código de referido (para la landing dinámica
 * ref.walinka.com/{code}). wa_resolve_referral_code está grant-eada a
 * `anon` — se puede llamar sin sesión, desde un Server Component. Nunca
 * expone email/UUID/negocio, solo {valid, referrerName?}.
 */
export async function resolveReferralCode(code: string): Promise<ReferralCodeResolution> {
  const { data, error } = await supabase.rpc('wa_resolve_referral_code', { p_code: code });
  if (error) throw error;
  return data as ReferralCodeResolution;
}

/** Resumen agregado del programa de afiliados para el usuario autenticado. */
export async function getMyReferralStats(): Promise<ReferralStats> {
  const { data, error } = await supabase.rpc('wa_get_my_referral_stats');
  if (error) throw error;
  return data as ReferralStats;
}

/** Lista paginada de los referidos del usuario autenticado (sin PII). */
export async function listMyReferrals(
  { limit = 20, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<ReferralListItem[]> {
  const { data, error } = await supabase.rpc('wa_list_my_referrals', {
    p_limit: limit,
    p_offset: offset,
  });
  if (error) throw error;
  return (data ?? []) as ReferralListItem[];
}
