import { beforeEach, describe, expect, it, vi } from 'vitest';

const { rpcMock } = vi.hoisted(() => ({ rpcMock: vi.fn() }));

vi.mock('@/lib/supabase', () => ({
  supabase: { rpc: rpcMock },
}));

import { getMyReferralStats, listMyReferrals } from './referralService';

describe('referralService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMyReferralStats', () => {
    it('llama a wa_get_my_referral_stats y retorna los datos', async () => {
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
});
