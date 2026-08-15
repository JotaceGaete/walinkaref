import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));

vi.mock('@/lib/supabase', () => ({
  supabase: { rpc: rpcMock },
}));

import {
  getMyReferralStats,
  listMyReferrals,
  listMyReferralPayouts,
  requestReferralPayout,
  type PayoutMethodSnapshot,
} from './referralService';

describe('referralService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMyReferralStats', () => {
    it('llama a wa_get_my_referral_stats y retorna los datos, incluido pendingPayoutsByCurrency', async () => {
      const stats = {
        code: 'juan-f92ee',
        rewardAmount: 5,
        rewardCurrency: 'USD',
        requiredPaidMonths: 2,
        invitedCount: 3,
        oneMonthCount: 1,
        qualifiedCount: 1,
        pendingAmount: 0,
        availableAmount: 5,
        totalEarnedAmount: 5,
        pendingPayoutsByCurrency: [
          { currency: 'CLP', amount: 5000 },
          { currency: 'USD', amount: 10 },
        ],
      };
      rpcMock.mockResolvedValue({ data: stats, error: null });

      const result = await getMyReferralStats();

      expect(rpcMock).toHaveBeenCalledWith('wa_get_my_referral_stats');
      expect(result).toEqual(stats);
    });

    it('propaga el error de Supabase en vez de silenciarlo', async () => {
      rpcMock.mockResolvedValue({ data: null, error: { message: 'boom' } });

      await expect(getMyReferralStats()).rejects.toEqual({ message: 'boom' });
    });
  });

  describe('listMyReferrals', () => {
    it('llama a wa_list_my_referrals con los parámetros correctos', async () => {
      rpcMock.mockResolvedValue({ data: [], error: null });

      await listMyReferrals({ limit: 10, offset: 5 });

      expect(rpcMock).toHaveBeenCalledWith('wa_list_my_referrals', { p_limit: 10, p_offset: 5 });
    });

    it('usa límites por defecto cuando no se pasan argumentos', async () => {
      rpcMock.mockResolvedValue({ data: [], error: null });

      await listMyReferrals();

      expect(rpcMock).toHaveBeenCalledWith('wa_list_my_referrals', { p_limit: 20, p_offset: 0 });
    });

    it('retorna la lista tal como la entrega la RPC', async () => {
      const items = [
        { publicLabel: 'Usuario #91AE', createdAt: '2026-06-01T00:00:00Z', paidMonths: 2, qualified: true },
      ];
      rpcMock.mockResolvedValue({ data: items, error: null });

      const result = await listMyReferrals();

      expect(result).toEqual(items);
    });

    it('propaga el error de Supabase en vez de silenciarlo', async () => {
      rpcMock.mockResolvedValue({ data: null, error: { message: 'boom' } });

      await expect(listMyReferrals()).rejects.toEqual({ message: 'boom' });
    });
  });

  describe('requestReferralPayout', () => {
    const validSnapshot: PayoutMethodSnapshot = {
      method: 'bank_transfer',
      country: 'CL',
      holder_name: 'Juan Perez',
      bank_name: 'Banco Estado',
      account_type: 'checking',
      account_number: '1234567890',
    };

    it('llama a wa_request_referral_payout con el snapshot exacto en p_payout_method_snapshot', async () => {
      rpcMock.mockResolvedValue({ data: { requested: true, payouts: [] }, error: null });

      await requestReferralPayout(validSnapshot);

      expect(rpcMock).toHaveBeenCalledWith('wa_request_referral_payout', {
        p_payout_method_snapshot: validSnapshot,
      });
    });

    it('retorna la respuesta de éxito con payouts creados tal como la entrega la RPC', async () => {
      const response = {
        requested: true,
        payouts: [{ currency: 'USD', created: true, amount: 10, payoutId: 'p-1', commissionCount: 2 }],
      };
      rpcMock.mockResolvedValue({ data: response, error: null });

      const result = await requestReferralPayout(validSnapshot);

      expect(result).toEqual(response);
    });

    it('retorna requested:false con reason invalid_payout_method_snapshot tal cual', async () => {
      const response = { requested: false, reason: 'invalid_payout_method_snapshot' };
      rpcMock.mockResolvedValue({ data: response, error: null });

      const result = await requestReferralPayout(validSnapshot);

      expect(result).toEqual(response);
    });

    it('propaga el error de Supabase en vez de silenciarlo', async () => {
      rpcMock.mockResolvedValue({ data: null, error: { message: 'boom' } });

      await expect(requestReferralPayout(validSnapshot)).rejects.toEqual({ message: 'boom' });
    });
  });

  describe('listMyReferralPayouts', () => {
    it('llama a wa_list_my_referral_payouts con los parámetros correctos', async () => {
      rpcMock.mockResolvedValue({ data: [], error: null });

      await listMyReferralPayouts({ limit: 10, offset: 5 });

      expect(rpcMock).toHaveBeenCalledWith('wa_list_my_referral_payouts', { p_limit: 10, p_offset: 5 });
    });

    it('usa límites por defecto cuando no se pasan argumentos', async () => {
      rpcMock.mockResolvedValue({ data: [], error: null });

      await listMyReferralPayouts();

      expect(rpcMock).toHaveBeenCalledWith('wa_list_my_referral_payouts', { p_limit: 20, p_offset: 0 });
    });

    it('retorna el historial tal como lo entrega la RPC, con maskedAccountNumber, nunca datos completos', async () => {
      const items = [
        {
          payoutId: 'p-1',
          status: 'paid',
          requestedAmount: 5,
          currency: 'USD',
          requestedAt: '2026-06-01T00:00:00Z',
          paidAt: '2026-06-02T00:00:00Z',
          rejectedAt: null,
          externalReference: 'TXN-1',
          rejectedReason: null,
          payoutMethod: 'bank_transfer',
          maskedAccountNumber: '••••••7890',
        },
      ];
      rpcMock.mockResolvedValue({ data: items, error: null });

      const result = await listMyReferralPayouts();

      expect(result).toEqual(items);
    });

    it('propaga el error de Supabase en vez de silenciarlo', async () => {
      rpcMock.mockResolvedValue({ data: null, error: { message: 'boom' } });

      await expect(listMyReferralPayouts()).rejects.toEqual({ message: 'boom' });
    });
  });
});
