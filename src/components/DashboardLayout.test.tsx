import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import DashboardLayout from './DashboardLayout';

const signOutMock = vi.fn().mockResolvedValue(undefined);
const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/affiliate-dashboard',
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'juan@walinka.app', user_metadata: {} },
    loading: false,
    signOut: signOutMock,
  }),
}));

describe('DashboardLayout — badge de "Referidos" en el sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.replaceState(null, '', '/affiliate-dashboard');
  });

  it('sin referralsCount (prop no pasada, p.ej. /affiliate-resources) no muestra ningún badge', () => {
    render(
      <DashboardLayout>
        <p>contenido</p>
      </DashboardLayout>
    );

    expect(screen.queryByText('14')).not.toBeInTheDocument();
    // El label "Referidos" existe, pero sin número al lado.
    const referidosLink = screen.getByText('Referidos').closest('a');
    expect(referidosLink).not.toHaveTextContent(/\d/);
  });

  it('con referralsCount=0 (invitedCount real de un afiliado sin referidos) muestra "0", nunca "14"', () => {
    render(
      <DashboardLayout referralsCount={0}>
        <p>contenido</p>
      </DashboardLayout>
    );

    const referidosLink = screen.getByText('Referidos').closest('a');
    expect(referidosLink).toHaveTextContent('0');
    expect(screen.queryByText('14')).not.toBeInTheDocument();
  });

  it('con referralsCount=34 (invitedCount real) muestra ese valor exacto, nunca "14"', () => {
    render(
      <DashboardLayout referralsCount={34}>
        <p>contenido</p>
      </DashboardLayout>
    );

    const referidosLink = screen.getByText('Referidos').closest('a');
    expect(referidosLink).toHaveTextContent('34');
    expect(screen.queryByText('14')).not.toBeInTheDocument();
  });

  it('con referralsCount=null (stats en error) oculta el badge en vez de mostrar un valor inventado', () => {
    render(
      <DashboardLayout referralsCount={null}>
        <p>contenido</p>
      </DashboardLayout>
    );

    const referidosLink = screen.getByText('Referidos').closest('a');
    expect(referidosLink).not.toHaveTextContent(/\d/);
  });

  it('expone destinos reales y semánticos para Dashboard, Referidos y Mi enlace', () => {
    render(<DashboardLayout>contenido</DashboardLayout>);
    const nav = screen.getByRole('navigation');

    expect(within(nav).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/affiliate-dashboard');
    expect(within(nav).getByRole('link', { name: /Referidos/ })).toHaveAttribute('href', '/affiliate-dashboard#referidos');
    expect(within(nav).getByRole('link', { name: 'Mi enlace' })).toHaveAttribute('href', '/affiliate-dashboard#mi-enlace');
  });

  it('mantiene exactamente un elemento activo al navegar entre secciones', () => {
    render(<DashboardLayout>contenido</DashboardLayout>);
    const nav = screen.getByRole('navigation');
    const dashboard = within(nav).getByRole('link', { name: 'Dashboard' });
    const referidos = within(nav).getByRole('link', { name: /Referidos/ });
    const miEnlace = within(nav).getByRole('link', { name: 'Mi enlace' });

    expect(dashboard).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getAllByRole('link').filter((link) => link.hasAttribute('aria-current'))).toHaveLength(1);

    fireEvent.click(referidos);
    expect(referidos).toHaveAttribute('aria-current', 'page');
    expect(dashboard).not.toHaveAttribute('aria-current');
    expect(within(nav).getAllByRole('link').filter((link) => link.hasAttribute('aria-current'))).toHaveLength(1);

    fireEvent.click(miEnlace);
    expect(miEnlace).toHaveAttribute('aria-current', 'page');
    expect(referidos).not.toHaveAttribute('aria-current');
    expect(within(nav).getAllByRole('link').filter((link) => link.hasAttribute('aria-current'))).toHaveLength(1);
  });

  it('no anuncia Recursos, Configuración ni notificaciones', () => {
    render(<DashboardLayout>contenido</DashboardLayout>);

    expect(screen.queryByText('Recursos')).not.toBeInTheDocument();
    expect(screen.queryByText('Configuración')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /notificaciones/i })).not.toBeInTheDocument();
  });

  it('Cerrar sesión conserva signOut y redirección al login', async () => {
    render(<DashboardLayout>contenido</DashboardLayout>);
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }));

    await waitFor(() => expect(signOutMock).toHaveBeenCalledTimes(1));
    expect(replaceMock).toHaveBeenCalledWith('/sign-up-login-screen');
  });
});
