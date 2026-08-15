import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AffiliateSettingsPage from './page';

const replaceMock = vi.fn();
const signOutMock = vi.fn().mockResolvedValue(undefined);
const getMyReferralStatsMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/affiliate-settings',
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'private-user-id-must-not-render',
      email: 'afiliada@walinka.app',
      user_metadata: { full_name: 'Ana Afiliada' },
    },
    loading: false,
    signOut: signOutMock,
  }),
}));

vi.mock('@/services/referralService', () => ({
  getMyReferralStats: () => getMyReferralStatsMock(),
}));

const stats = {
  code: 'ana-ref',
  rewardAmount: 5,
  rewardCurrency: 'USD',
  requiredPaidMonths: 2,
  invitedCount: 4,
  oneMonthCount: 1,
  qualifiedCount: 2,
  pendingAmount: 5,
  availableAmount: 42.5,
  totalEarnedAmount: 50,
  pendingPayoutsByCurrency: [
    { currency: 'CLP', amount: 5000 },
    { currency: 'USD', amount: 10 },
  ],
};

describe('AffiliateSettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState(null, '', '/affiliate-settings');
    getMyReferralStatsMock.mockResolvedValue(stats);
  });

  it('renderiza con la sesión y muestra nombre/email reales sin exponer user_id', async () => {
    render(<AffiliateSettingsPage />);

    expect(screen.getByRole('heading', { name: 'Configuración' })).toBeInTheDocument();
    expect(screen.getAllByText('Ana Afiliada').length).toBeGreaterThan(0);
    expect(screen.getAllByText('afiliada@walinka.app').length).toBeGreaterThan(0);
    expect(screen.queryByText('private-user-id-must-not-render')).not.toBeInTheDocument();
    await waitFor(() => expect(getMyReferralStatsMock).toHaveBeenCalledTimes(1));
  });

  it('muestra moneda, saldo y retiros pendientes reales separados por moneda', async () => {
    render(<AffiliateSettingsPage />);

    expect(await screen.findByText('USD', { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText(/42,50.*USD/)).toBeInTheDocument();
    const pendingList = screen.getByRole('list', { name: 'Retiros pendientes por moneda' });
    expect(within(pendingList).getByText(/5000.*CLP/)).toBeInTheDocument();
    expect(within(pendingList).getByText(/10,00.*USD/)).toBeInTheDocument();
  });

  it('Configuración es el único item activo y Recursos sigue oculto', async () => {
    render(<AffiliateSettingsPage />);
    await screen.findByText(/42,50.*USD/);

    const nav = screen.getByRole('navigation');
    const settingsLink = within(nav).getByRole('link', { name: 'Configuración' });
    expect(settingsLink).toHaveAttribute('href', '/affiliate-settings');
    expect(settingsLink).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getAllByRole('link').filter((link) => link.hasAttribute('aria-current'))).toEqual([settingsLink]);
    expect(within(nav).queryByText('Recursos')).not.toBeInTheDocument();
  });

  it('no presenta inputs bancarios ni escribe configuración en storage', async () => {
    const localStorageSpy = vi.spyOn(Storage.prototype, 'setItem');
    render(<AffiliateSettingsPage />);
    await screen.findByText(/42,50.*USD/);

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    expect(screen.queryByText(/número de cuenta/i)?.closest('input')).toBeNull();
    expect(localStorageSpy).not.toHaveBeenCalled();
    localStorageSpy.mockRestore();
  });

  it('presenta país no configurado e información correcta para Chile y Argentina', async () => {
    render(<AffiliateSettingsPage />);
    await screen.findByText(/42,50.*USD/);

    expect(screen.getByText(/el país de pago se configurará cuando actives tu método de retiro/i)).toBeInTheDocument();
    expect(screen.getByText('Chile')).toBeInTheDocument();
    expect(screen.getByText(/los retiros se procesarán mediante transferencia bancaria/i)).toBeInTheDocument();
    expect(screen.getByText('Argentina')).toBeInTheDocument();
    expect(screen.getByText(/transferencia a una cuenta compatible/i)).toBeInTheDocument();
    expect(screen.getByText(/CUIT\/CUIL/)).toBeInTheDocument();
    expect(screen.getByText(/CBU\/CVU/)).toBeInTheDocument();
  });

  it('Cerrar sesión usa la función real del contexto y redirige al login', async () => {
    render(<AffiliateSettingsPage />);
    const security = screen.getByRole('heading', { name: 'Seguridad' }).closest('section');
    fireEvent.click(within(security as HTMLElement).getByRole('button', { name: 'Cerrar sesión' }));

    await waitFor(() => expect(signOutMock).toHaveBeenCalledTimes(1));
    expect(replaceMock).toHaveBeenCalledWith('/sign-up-login-screen');
  });

  it('muestra loading controlado mientras stats está pendiente', () => {
    getMyReferralStatsMock.mockReturnValue(new Promise(() => {}));
    render(<AffiliateSettingsPage />);

    expect(screen.getByRole('status')).toHaveTextContent(/cargando información de pagos/i);
  });

  it('muestra error controlado y permite reintentar', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    getMyReferralStatsMock.mockRejectedValueOnce(new Error('network'));
    render(<AffiliateSettingsPage />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/no pudimos cargar tu información de pagos/i);
    fireEvent.click(within(alert).getByRole('button', { name: 'Reintentar' }));
    await waitFor(() => expect(getMyReferralStatsMock).toHaveBeenCalledTimes(2));
    warnSpy.mockRestore();
  });

  it('si la RPC retorna sin stats, no rompe la página', async () => {
    getMyReferralStatsMock.mockResolvedValue(null);
    render(<AffiliateSettingsPage />);

    expect(await screen.findByText('No hay información financiera disponible.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Perfil' })).toBeInTheDocument();
  });
});
