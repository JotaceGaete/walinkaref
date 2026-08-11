import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AffiliateDashboardPage from './page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/affiliate-dashboard',
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'juan@walinka.app', user_metadata: { full_name: 'Juan' } },
    loading: false,
    signOut: vi.fn(),
  }),
}));

const getMyReferralStatsMock = vi.fn();
const listMyReferralsMock = vi.fn();
vi.mock('@/services/referralService', () => ({
  getMyReferralStats: () => getMyReferralStatsMock(),
  listMyReferrals: (...args: unknown[]) => listMyReferralsMock(...args),
}));

describe('AffiliateDashboardPage (integración)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMyReferralStatsMock.mockResolvedValue({
      code: 'juan-f92ee',
      rewardAmount: 5,
      rewardCurrency: 'USD',
      requiredPaidMonths: 2,
      invitedCount: 34,
      oneMonthCount: 9,
      qualifiedCount: 11,
      pendingAmount: 0,
      availableAmount: 30,
      totalEarnedAmount: 55,
    });
    listMyReferralsMock.mockResolvedValue([
      { publicLabel: 'Usuario #91AE', createdAt: '2026-06-01T00:00:00Z', paidMonths: 2, qualified: true },
    ]);
  });

  it('nunca renderiza las métricas mock de Rocket sin respaldo real (clics, tasa, gráficos)', async () => {
    render(<AffiliateDashboardPage />);

    await waitFor(() => expect(screen.getByText('https://ref.walinka.com/juan-f92ee')).toBeInTheDocument());

    expect(screen.queryByText(/clics totales/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/tasa de registro/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/actividad semanal/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/tasa de calificación/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/conversión general/i)).not.toBeInTheDocument();
  });

  it('conecta stats y lista reales de vuelta a la UI (KPIs + tabla)', async () => {
    render(<AffiliateDashboardPage />);

    await waitFor(() => expect(getMyReferralStatsMock).toHaveBeenCalledTimes(1));
    expect(listMyReferralsMock).toHaveBeenCalledWith({ limit: 20, offset: 0 });

    expect(await screen.findByText('34')).toBeInTheDocument(); // invitedCount
    expect(await screen.findByText('Usuario #91AE')).toBeInTheDocument(); // de la lista
  });
});
