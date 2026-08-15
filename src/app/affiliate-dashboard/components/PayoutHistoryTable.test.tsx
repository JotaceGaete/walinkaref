import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import PayoutHistoryTable from './PayoutHistoryTable';
import type { ReferralPayout } from '@/services/referralService';

const requested: ReferralPayout = {
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
};

const paid: ReferralPayout = {
  payoutId: 'p-2',
  status: 'paid',
  requestedAmount: 20,
  currency: 'USD',
  requestedAt: '2026-05-01T00:00:00Z',
  paidAt: '2026-05-03T00:00:00Z',
  rejectedAt: null,
  externalReference: 'TXN-99',
  rejectedReason: null,
  payoutMethod: 'bank_transfer',
  maskedAccountNumber: '••••••1234',
};

const rejected: ReferralPayout = {
  payoutId: 'p-3',
  status: 'rejected',
  requestedAmount: 5000,
  currency: 'CLP',
  requestedAt: '2026-04-01T00:00:00Z',
  paidAt: null,
  rejectedAt: '2026-04-02T00:00:00Z',
  externalReference: null,
  rejectedReason: 'Datos bancarios inválidos',
  payoutMethod: 'bank_transfer',
  maskedAccountNumber: '••••••5678',
};

describe('PayoutHistoryTable', () => {
  it('muestra un retiro requested con la etiqueta "Solicitado"', () => {
    render(
      <PayoutHistoryTable payouts={[requested]} loading={false} error={false} onRetry={vi.fn()} />
    );

    const table = screen.getByRole('table');
    expect(within(table).getByText('Solicitado')).toBeInTheDocument();
    expect(within(table).getByText('USD 10.00')).toBeInTheDocument();
  });

  it('muestra un retiro paid con la etiqueta "Pagado" y su externalReference', () => {
    render(<PayoutHistoryTable payouts={[paid]} loading={false} error={false} onRetry={vi.fn()} />);

    const table = screen.getByRole('table');
    expect(within(table).getByText('Pagado')).toBeInTheDocument();
    expect(within(table).getByText(/TXN-99/)).toBeInTheDocument();
  });

  it('muestra un retiro rejected con la etiqueta "Rechazado" y su rejectedReason', () => {
    render(
      <PayoutHistoryTable payouts={[rejected]} loading={false} error={false} onRetry={vi.fn()} />
    );

    const table = screen.getByRole('table');
    expect(within(table).getByText('Rechazado')).toBeInTheDocument();
    expect(within(table).getByText('Datos bancarios inválidos')).toBeInTheDocument();
  });

  it('muestra el número de cuenta enmascarado, nunca el completo', () => {
    render(
      <PayoutHistoryTable payouts={[requested]} loading={false} error={false} onRetry={vi.fn()} />
    );

    expect(within(screen.getByRole('table')).getByText(/••••••7890/)).toBeInTheDocument();
  });

  it('conserva tabla desktop y cards mobile con monto, estado, masking y detalles condicionales', () => {
    render(
      <PayoutHistoryTable
        payouts={[requested, paid, rejected]}
        loading={false}
        error={false}
        onRetry={vi.fn()}
      />
    );

    const desktop = screen.getByRole('table');
    const mobile = screen.getByRole('list', { name: /retiros en vista móvil/i });

    expect(desktop).toBeInTheDocument();
    expect(mobile).toBeInTheDocument();
    expect(within(mobile).getByText('USD 10.00')).toBeInTheDocument();
    expect(within(mobile).getByText('Solicitado')).toBeInTheDocument();
    expect(within(mobile).getByText(/••••••7890/)).toBeInTheDocument();
    expect(within(mobile).getByText('TXN-99')).toBeInTheDocument();
    expect(within(mobile).getByText('Datos bancarios inválidos')).toBeInTheDocument();
    expect(within(desktop).getByText(/••••••7890/)).toBeInTheDocument();
  });

  it('nunca renderiza holder_tax_id ni ningún dato bancario sin enmascarar (el tipo ReferralPayout no lo expone)', () => {
    render(
      <PayoutHistoryTable
        payouts={[requested, paid, rejected]}
        loading={false}
        error={false}
        onRetry={vi.fn()}
      />
    );

    // El tipo ReferralPayout no tiene campo holder_tax_id/account_number:
    // esta prueba documenta que el HTML resultante nunca contiene un número
    // de cuenta completo (sin el prefijo de máscara "••••••").
    const html = document.body.innerHTML;
    expect(html).not.toMatch(/\b\d{6,}\b/); // ningún número largo sin enmascarar
  });

  it('estado vacío: sin retiros muestra el mensaje correspondiente', () => {
    render(<PayoutHistoryTable payouts={[]} loading={false} error={false} onRetry={vi.fn()} />);

    expect(screen.getAllByText(/todavía no solicitaste ningún retiro/i).length).toBeGreaterThan(0);
  });

  it('loading: muestra el estado de carga', () => {
    render(<PayoutHistoryTable payouts={[]} loading error={false} onRetry={vi.fn()} />);

    expect(screen.getByText('Cargando…')).toBeInTheDocument();
  });

  it('error: muestra el mensaje y el botón Reintentar, que llama a onRetry', () => {
    const onRetry = vi.fn();
    render(<PayoutHistoryTable payouts={[]} loading={false} error onRetry={onRetry} />);

    expect(screen.getByText(/no pudimos cargar tu historial/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
