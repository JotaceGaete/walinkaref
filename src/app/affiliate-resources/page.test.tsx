import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import AffiliateResourcesPage from './page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/affiliate-resources',
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'jota@walinka.app', user_metadata: { full_name: 'Jota' } },
    loading: false,
    signOut: vi.fn(),
  }),
}));

const getMyReferralStatsMock = vi.fn();
vi.mock('@/services/referralService', () => ({
  getMyReferralStats: () => getMyReferralStatsMock(),
}));

describe('AffiliateResourcesPage (integración)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMyReferralStatsMock.mockResolvedValue({
      code: 'jota-f92ee',
      rewardAmount: 5,
      rewardCurrency: 'USD',
      requiredPaidMonths: 2,
      invitedCount: 7,
      oneMonthCount: 2,
      qualifiedCount: 1,
      pendingAmount: 0,
      availableAmount: 5,
      totalEarnedAmount: 5,
    });
  });

  it('CopyTemplates recibe el enlace real construido a partir de stats.code (ruta independiente, su propia llamada)', async () => {
    render(<AffiliateResourcesPage />);

    await waitFor(() => expect(getMyReferralStatsMock).toHaveBeenCalledTimes(1));
    expect(await screen.findByText(/ref\.walinka\.com\/jota-f92ee/)).toBeInTheDocument();
    expect(screen.queryByText(/juan-f92ee/)).not.toBeInTheDocument();
  });

  it('el badge "Referidos" del sidebar también muestra invitedCount real en esta página', async () => {
    render(<AffiliateResourcesPage />);

    await waitFor(() => expect(getMyReferralStatsMock).toHaveBeenCalledTimes(1));
    const sidebar = screen.getByRole('navigation');
    expect(await within(sidebar).findByText('7')).toBeInTheDocument();
    expect(within(sidebar).queryByText('14')).not.toBeInTheDocument();
  });
});
