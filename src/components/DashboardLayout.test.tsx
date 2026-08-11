import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardLayout from './DashboardLayout';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/affiliate-dashboard',
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1', email: 'juan@walinka.app', user_metadata: {} },
    loading: false,
    signOut: vi.fn(),
  }),
}));

describe('DashboardLayout — badge de "Referidos" en el sidebar', () => {
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
});
