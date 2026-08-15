import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
const listMyReferralPayoutsMock = vi.fn();
const requestReferralPayoutMock = vi.fn();
vi.mock('@/services/referralService', () => ({
  getMyReferralStats: () => getMyReferralStatsMock(),
  listMyReferrals: (...args: unknown[]) => listMyReferralsMock(...args),
  listMyReferralPayouts: (...args: unknown[]) => listMyReferralPayoutsMock(...args),
  requestReferralPayout: (...args: unknown[]) => requestReferralPayoutMock(...args),
}));

const baseStats = {
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
  pendingPayoutsByCurrency: [],
};

describe('AffiliateDashboardPage (integración)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMyReferralStatsMock.mockResolvedValue(baseStats);
    listMyReferralsMock.mockResolvedValue([
      { publicLabel: 'Usuario #91AE', createdAt: '2026-06-01T00:00:00Z', paidMonths: 2, qualified: true },
    ]);
    listMyReferralPayoutsMock.mockResolvedValue([
      {
        payoutId: 'p-1',
        status: 'requested',
        requestedAmount: 10,
        currency: 'USD',
        requestedAt: '2026-06-01T00:00:00Z',
        paidAt: null,
        rejectedAt: null,
        externalReference: null,
        rejectedReason: null,
        payoutMethod: 'bank_transfer',
        maskedAccountNumber: '••••••7890',
      },
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

    // "34" aparece dos veces a propósito ahora (KPI + badge del sidebar);
    // se acota al contenido principal para no ambigüar con el badge.
    const main = screen.getByRole('main');
    expect(await within(main).findByText('34')).toBeInTheDocument(); // invitedCount
    expect(await within(main).findByText('Usuario #91AE')).toBeInTheDocument(); // de la lista
    expect(document.getElementById('mi-enlace')).toBeInTheDocument();
    expect(document.getElementById('referidos')).toBeInTheDocument();
  });

  it('el badge "Referidos" del sidebar muestra invitedCount real (34), nunca el "14" fijo de Rocket', async () => {
    render(<AffiliateDashboardPage />);

    await waitFor(() => expect(getMyReferralStatsMock).toHaveBeenCalledTimes(1));

    const sidebar = screen.getByRole('navigation');
    expect(await within(sidebar).findByText('34')).toBeInTheDocument();
    expect(within(sidebar).queryByText('14')).not.toBeInTheDocument();
  });

  it('con invitedCount=0 real, el badge muestra "0" en vez de ocultarse o mostrar "14"', async () => {
    getMyReferralStatsMock.mockResolvedValue({
      code: 'nueva-afiliada',
      rewardAmount: 5,
      rewardCurrency: 'USD',
      requiredPaidMonths: 2,
      invitedCount: 0,
      oneMonthCount: 0,
      qualifiedCount: 0,
      pendingAmount: 0,
      availableAmount: 0,
      totalEarnedAmount: 0,
      pendingPayoutsByCurrency: [],
    });
    listMyReferralsMock.mockResolvedValue([]);

    render(<AffiliateDashboardPage />);

    const sidebar = screen.getByRole('navigation');
    const referidosLink = await within(sidebar).findByText('Referidos');
    await waitFor(() => expect(referidosLink.closest('a')).toHaveTextContent('0'));
    expect(within(sidebar).queryByText('14')).not.toBeInTheDocument();
  });

  it('carga el historial de retiros real (wa_list_my_referral_payouts) y lo muestra', async () => {
    render(<AffiliateDashboardPage />);

    await waitFor(() => expect(listMyReferralPayoutsMock).toHaveBeenCalledWith({ limit: 20, offset: 0 }));
    expect(await screen.findByText('••••••7890', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Solicitado')).toBeInTheDocument();
  });

  it('una solicitud de retiro exitosa refresca tanto stats como el historial de retiros', async () => {
    render(<AffiliateDashboardPage />);

    await waitFor(() => expect(getMyReferralStatsMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(listMyReferralPayoutsMock).toHaveBeenCalledTimes(1));

    fireEvent.change(screen.getByLabelText('País'), { target: { value: 'CL' } });
    fireEvent.change(screen.getByLabelText('Nombre del titular'), { target: { value: 'Juan Perez' } });
    fireEvent.change(screen.getByLabelText('Banco'), { target: { value: 'Banco Estado' } });
    fireEvent.change(screen.getByLabelText('Tipo de cuenta'), { target: { value: 'checking' } });
    fireEvent.change(screen.getByLabelText('Número de cuenta'), { target: { value: '1234567890' } });

    requestReferralPayoutMock.mockResolvedValue({
      requested: true,
      payouts: [{ currency: 'USD', created: true, amount: 10, payoutId: 'p-2' }],
    });

    fireEvent.click(screen.getByRole('button', { name: /solicitar retiro/i }));

    await waitFor(() => expect(screen.getByText(/solicitud enviada/i)).toBeInTheDocument());
    await waitFor(() => expect(getMyReferralStatsMock).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(listMyReferralPayoutsMock).toHaveBeenCalledTimes(2));
  });
});
