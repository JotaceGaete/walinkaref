import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import DashboardKPIs from './DashboardKPIs';
import type { ReferralStats } from '@/services/referralService';

const baseStats: ReferralStats = {
  code: 'juan-f92ee',
  rewardAmount: 5,
  rewardCurrency: 'USD',
  requiredPaidMonths: 2,
  invitedCount: 34,
  oneMonthCount: 9,
  qualifiedCount: 11,
  pendingAmount: 12.5,
  availableAmount: 30,
  totalEarnedAmount: 55,
};

describe('DashboardKPIs', () => {
  it('muestra los 6 valores reales mapeados desde wa_get_my_referral_stats()', () => {
    render(<DashboardKPIs stats={baseStats} loading={false} error={false} onRetry={vi.fn()} />);

    expect(screen.getByText('34')).toBeInTheDocument(); // invitedCount
    expect(screen.getByText('11')).toBeInTheDocument(); // qualifiedCount
    expect(screen.getByText('9')).toBeInTheDocument(); // oneMonthCount
    expect(screen.getByText('USD 12.50')).toBeInTheDocument(); // pendingAmount
    expect(screen.getByText('USD 30.00')).toBeInTheDocument(); // availableAmount
    expect(screen.getByText('USD 55.00')).toBeInTheDocument(); // totalEarnedAmount
  });

  it('no hardcodea "US$5" ni "2 meses": usa rewardAmount/requiredPaidMonths reales', () => {
    const customStats: ReferralStats = {
      ...baseStats,
      rewardAmount: 8,
      rewardCurrency: 'MXN',
      requiredPaidMonths: 3,
    };
    render(<DashboardKPIs stats={customStats} loading={false} error={false} onRetry={vi.fn()} />);

    expect(screen.getByText(/1 de 3 meses/)).toBeInTheDocument();
    expect(screen.getByText(/3 de 3 meses/)).toBeInTheDocument();
    expect(screen.getByText(/Ganas MXN 8\.00 por calificado/)).toBeInTheDocument();
  });

  it('en error muestra el mensaje y el botón Reintentar, que llama a onRetry', () => {
    const onRetry = vi.fn();
    render(<DashboardKPIs stats={null} loading={false} error onRetry={onRetry} />);

    expect(screen.getByText(/no pudimos cargar tus métricas/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
