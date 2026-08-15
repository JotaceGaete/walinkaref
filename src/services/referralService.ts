/**
 * Capa delgada sobre las RPC de lectura/escritura del Affiliate Core
 * (wa_get_my_referral_stats, wa_list_my_referrals, wa_request_referral_payout,
 * wa_list_my_referral_payouts — mismo proyecto Supabase que go.ventalink.app).
 * Ninguna lógica de negocio vive acá: toda la agregación, calificación,
 * selección de comisiones, límites de paginación y masking de datos
 * bancarios ya están resueltos server-side (ver
 * supabase/migrations/20260815100000_referral_payout_requests.sql y
 * 20260816100000_referral_payout_read_api.sql en el repo saas). El único
 * código nuevo acá es el mapeo de tipos.
 */
import { supabase } from '@/lib/supabase';

export interface PendingPayoutByCurrency {
  currency: string;
  amount: number;
}

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
  /**
   * Suma de requested_amount de retiros status='requested', agrupada por
   * moneda — NUNCA sumada entre monedas distintas (wa_get_my_referral_stats
   * lo devuelve así deliberadamente: un afiliado puede tener retiros
   * pendientes en más de una moneda). [] si no hay ningún retiro
   * 'requested', nunca null/undefined (la RPC siempre incluye la clave).
   */
  pendingPayoutsByCurrency: PendingPayoutByCurrency[];
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
 * Snapshot del método de cobro que exige wa_request_referral_payout().
 * Único method soportado hoy: 'bank_transfer'. Campos obligatorios no
 * vacíos según wa_validate_referral_payout_method_snapshot() (repo saas,
 * 20260815100000): method/country/holder_name/bank_name/account_type/
 * account_number. holder_tax_id y email son opcionales a propósito.
 */
export interface PayoutMethodSnapshot {
  method: 'bank_transfer';
  country: string;
  holder_name: string;
  holder_tax_id?: string;
  bank_name: string;
  account_type: string;
  account_number: string;
  email?: string;
}

export type ReferralPayoutStatus = 'requested' | 'paid' | 'rejected';

/** Fila del historial devuelta por wa_list_my_referral_payouts() — ya sin datos bancarios completos (masking server-side). */
export interface ReferralPayout {
  payoutId: string;
  status: ReferralPayoutStatus;
  requestedAmount: number;
  currency: string;
  requestedAt: string;
  paidAt: string | null;
  rejectedAt: string | null;
  externalReference: string | null;
  rejectedReason: string | null;
  payoutMethod: string | null;
  maskedAccountNumber: string | null;
}

/** Un grupo (por moneda) dentro de la respuesta de wa_request_referral_payout(). */
export interface RequestReferralPayoutResultItem {
  currency: string;
  created: boolean;
  /** Solo presente cuando created=false: el grupo no alcanzó referral_program_terms.min_payout_amount. */
  reason?: 'below_minimum';
  amount: number;
  /** Solo presente cuando created=true. */
  payoutId?: string;
  /** Solo presente cuando created=true. */
  commissionCount?: number;
}

/** Respuesta real de wa_request_referral_payout() — ver 20260815100000_referral_payout_requests.sql. */
export interface RequestReferralPayoutResponse {
  requested: boolean;
  /**
   * Solo presente cuando requested=false (snapshot inválido) o cuando
   * requested=true pero no se generó ningún payout (payouts=[]).
   */
  reason?: 'invalid_payout_method_snapshot' | 'nothing_to_withdraw';
  /** Ausente cuando requested=false. */
  payouts?: RequestReferralPayoutResultItem[];
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

/**
 * Solicita el retiro de todas las comisiones approved libres del usuario
 * autenticado, agrupadas por moneda por la propia RPC. El frontend NUNCA
 * elige qué comisiones incluir — eso lo resuelve wa_request_referral_payout()
 * server-side (FOR UPDATE SKIP LOCKED, agrupación por moneda,
 * min_payout_amount). Acá solo se pasa el snapshot del método de cobro.
 */
export async function requestReferralPayout(
  snapshot: PayoutMethodSnapshot
): Promise<RequestReferralPayoutResponse> {
  const { data, error } = await supabase.rpc('wa_request_referral_payout', {
    p_payout_method_snapshot: snapshot,
  });
  if (error) throw error;
  return data as RequestReferralPayoutResponse;
}

/**
 * Historial paginado de retiros del usuario autenticado. La RPC ya
 * devuelve los datos bancarios reducidos (payoutMethod + maskedAccountNumber
 * únicamente) — este servicio nunca consulta referral_payout_requests
 * directamente ni intenta reconstruir el número de cuenta completo.
 */
export async function listMyReferralPayouts(
  { limit = 20, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<ReferralPayout[]> {
  const { data, error } = await supabase.rpc('wa_list_my_referral_payouts', {
    p_limit: limit,
    p_offset: offset,
  });
  if (error) throw error;
  return (data ?? []) as ReferralPayout[];
}
