import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import ReferralTable from './ReferralTable';
import type { ReferralListItem } from '@/services/referralService';

const referrals: ReferralListItem[] = [
  {
    publicLabel: 'Usuario #91AE',
    createdAt: '2026-06-01T00:00:00Z',
    paidMonths: 2,
    qualified: true,
  },
  {
    publicLabel: 'Usuario #22F1',
    createdAt: '2026-06-15T00:00:00Z',
    paidMonths: 1,
    qualified: false,
  },
  {
    publicLabel: 'Usuario #76BC',
    createdAt: '2026-07-10T00:00:00Z',
    paidMonths: 0,
    qualified: false,
  },
];

describe('ReferralTable', () => {
  it('renderiza los datos reales de wa_list_my_referrals (usuario, progreso, estado)', () => {
    render(
      <ReferralTable
        referrals={referrals}
        loading={false}
        error={false}
        onRetry={vi.fn()}
        requiredPaidMonths={2}
      />
    );

    const table = screen.getByRole('table');
    expect(within(table).getByText('Usuario #91AE')).toBeInTheDocument();
    expect(within(table).getByText('Usuario #22F1')).toBeInTheDocument();
    expect(within(table).getByText('Usuario #76BC')).toBeInTheDocument();
    expect(within(table).getByText('Calificado')).toBeInTheDocument();
    expect(within(table).getByText('En progreso')).toBeInTheDocument();
    expect(within(table).getByText('Nuevo')).toBeInTheDocument();
  });

  it('el progreso usa requiredPaidMonths real, no "2" hardcodeado', () => {
    const partial: ReferralListItem[] = [
      {
        publicLabel: 'Usuario #AAAA',
        createdAt: '2026-06-01T00:00:00Z',
        paidMonths: 1,
        qualified: false,
      },
    ];
    render(
      <ReferralTable
        referrals={partial}
        loading={false}
        error={false}
        onRetry={vi.fn()}
        requiredPaidMonths={3}
      />
    );

    expect(within(screen.getByRole('table')).getByText('1/3')).toBeInTheDocument();
    expect(screen.queryByText('1/2')).not.toBeInTheDocument();
  });

  it('conserva tabla desktop y representación mobile con los mismos datos, estado y progreso', () => {
    render(
      <ReferralTable
        referrals={referrals}
        loading={false}
        error={false}
        onRetry={vi.fn()}
        requiredPaidMonths={2}
      />
    );

    const desktop = screen.getByRole('table');
    const mobile = screen.getByRole('list', { name: /referidos en vista móvil/i });

    expect(desktop).toBeInTheDocument();
    expect(mobile).toBeInTheDocument();
    expect(within(desktop).getByText('Usuario #22F1')).toBeInTheDocument();
    expect(within(mobile).getByText('Usuario #22F1')).toBeInTheDocument();
    expect(within(desktop).getByText('1/2')).toBeInTheDocument();
    expect(within(mobile).getByText('1/2 meses')).toBeInTheDocument();
    expect(within(mobile).getByText('En progreso')).toBeInTheDocument();
    expect(within(mobile).getAllByText(/se unió/i)).toHaveLength(referrals.length);
  });

  it('estado vacío: sin referidos, muestra el mensaje de "todavía no tienes referidos"', () => {
    render(
      <ReferralTable
        referrals={[]}
        loading={false}
        error={false}
        onRetry={vi.fn()}
        requiredPaidMonths={2}
      />
    );

    expect(screen.getAllByText(/todavía no tienes referidos/i).length).toBeGreaterThan(0);
  });

  it('en error muestra el mensaje y el botón Reintentar, que llama a onRetry', () => {
    const onRetry = vi.fn();
    render(
      <ReferralTable
        referrals={[]}
        loading={false}
        error
        onRetry={onRetry}
        requiredPaidMonths={2}
      />
    );

    expect(screen.getByText(/no pudimos cargar tus referidos/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('no muestra PII que la RPC no entrega: ni país, ni email, ni monto por referido', () => {
    render(
      <ReferralTable
        referrals={referrals}
        loading={false}
        error={false}
        onRetry={vi.fn()}
        requiredPaidMonths={2}
      />
    );

    expect(screen.queryByText(/país/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pago esperado/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/recompensa/i)).not.toBeInTheDocument();
  });
});
