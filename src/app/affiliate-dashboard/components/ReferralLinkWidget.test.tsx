import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ReferralLinkWidget from './ReferralLinkWidget';
import type { ReferralStats } from '@/services/referralService';

const baseStats: ReferralStats = {
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

describe('ReferralLinkWidget', () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('construye el enlace como https://ref.walinka.com/{stats.code}', () => {
    render(<ReferralLinkWidget stats={baseStats} loading={false} error={false} onRetry={vi.fn()} />);

    expect(screen.getByText('https://ref.walinka.com/juan-f92ee')).toBeInTheDocument();
  });

  it('el botón Copiar copia el enlace completo al portapapeles', () => {
    render(<ReferralLinkWidget stats={baseStats} loading={false} error={false} onRetry={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /copiar/i }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://ref.walinka.com/juan-f92ee');
    expect(screen.getByText(/copiado/i)).toBeInTheDocument();
  });

  it('no muestra QR y Compartir usa el fallback de portapapeles', async () => {
    render(<ReferralLinkWidget stats={baseStats} loading={false} error={false} onRetry={vi.fn()} />);

    expect(screen.queryByRole('button', { name: 'QR' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Compartir' }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://ref.walinka.com/juan-f92ee');
    expect(await screen.findByRole('button', { name: 'Compartido' })).toBeInTheDocument();
  });

  it('en error muestra el mensaje y el botón Reintentar, que llama a onRetry', () => {
    const onRetry = vi.fn();
    render(<ReferralLinkWidget stats={null} loading={false} error onRetry={onRetry} />);

    expect(screen.getByText(/no pudimos cargar tu enlace/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('usa rewardAmount/requiredPaidMonths reales en el texto, no "US$5"/"2 meses" fijos', () => {
    const customStats: ReferralStats = { ...baseStats, rewardAmount: 8, rewardCurrency: 'MXN', requiredPaidMonths: 3 };
    render(<ReferralLinkWidget stats={customStats} loading={false} error={false} onRetry={vi.fn()} />);

    expect(screen.getByText(/MXN 8\.00/)).toBeInTheDocument();
    expect(screen.getByText(/3 meses pagos/)).toBeInTheDocument();
  });
});
