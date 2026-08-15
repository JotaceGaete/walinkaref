import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PayoutRequestCard from './PayoutRequestCard';

const requestReferralPayoutMock = vi.fn();
vi.mock('@/services/referralService', () => ({
  requestReferralPayout: (...args: unknown[]) => requestReferralPayoutMock(...args),
}));

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('País'), { target: { value: 'CL' } });
  fireEvent.change(screen.getByLabelText('Nombre del titular'), { target: { value: 'Juan Perez' } });
  fireEvent.change(screen.getByLabelText('Banco'), { target: { value: 'Banco Estado' } });
  fireEvent.change(screen.getByLabelText('Tipo de cuenta'), { target: { value: 'checking' } });
  fireEvent.change(screen.getByLabelText('Número de cuenta'), { target: { value: '1234567890' } });
}

describe('PayoutRequestCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sin saldo disponible (availableAmount=0), no muestra el formulario', () => {
    render(<PayoutRequestCard availableAmount={0} onSuccess={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /solicitar retiro/i })).not.toBeInTheDocument();
    expect(screen.getByText(/todavía no tienes saldo disponible/i)).toBeInTheDocument();
  });

  it('no llama a la RPC si faltan campos obligatorios', async () => {
    render(<PayoutRequestCard availableAmount={30} onSuccess={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /solicitar retiro/i }));

    await waitFor(() => expect(screen.getAllByText(/obligatorio/i).length).toBeGreaterThan(0));
    expect(requestReferralPayoutMock).not.toHaveBeenCalled();
  });

  it('doble submit (doble click/enter) resulta en una sola llamada a la RPC', async () => {
    let resolvePromise: (value: unknown) => void = () => {};
    requestReferralPayoutMock.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    const { container } = render(<PayoutRequestCard availableAmount={30} onSuccess={vi.fn()} />);
    fillValidForm();

    const form = container.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);
    // Espera a que el primer submit realmente haya llegado a llamar la RPC
    // (submitting ya está en true en ese punto) antes de disparar el
    // segundo, para simular el intervalo real entre dos clicks del usuario.
    await waitFor(() => expect(requestReferralPayoutMock).toHaveBeenCalledTimes(1));
    fireEvent.submit(form);

    resolvePromise({ requested: true, payouts: [{ currency: 'USD', created: true, amount: 10, payoutId: 'p-1' }] });
    await waitFor(() => expect(screen.getByText(/solicitud enviada/i)).toBeInTheDocument());

    expect(requestReferralPayoutMock).toHaveBeenCalledTimes(1);
  });

  it('reason invalid_payout_method_snapshot muestra el error correspondiente', async () => {
    requestReferralPayoutMock.mockResolvedValue({ requested: false, reason: 'invalid_payout_method_snapshot' });
    render(<PayoutRequestCard availableAmount={30} onSuccess={vi.fn()} />);
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: /solicitar retiro/i }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/revisa los datos bancarios/i));
  });

  it('reason nothing_to_withdraw muestra el mensaje correspondiente, sin marcar éxito', async () => {
    requestReferralPayoutMock.mockResolvedValue({ requested: true, reason: 'nothing_to_withdraw', payouts: [] });
    const onSuccess = vi.fn();
    render(<PayoutRequestCard availableAmount={30} onSuccess={onSuccess} />);
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: /solicitar retiro/i }));

    await waitFor(() => expect(screen.getByText(/no tienes comisiones disponibles para retirar/i)).toBeInTheDocument());
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('payout con reason below_minimum muestra el mensaje correspondiente, sin marcar éxito', async () => {
    requestReferralPayoutMock.mockResolvedValue({
      requested: true,
      payouts: [{ currency: 'USD', created: false, reason: 'below_minimum', amount: 3 }],
    });
    const onSuccess = vi.fn();
    render(<PayoutRequestCard availableAmount={30} onSuccess={onSuccess} />);
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: /solicitar retiro/i }));

    await waitFor(() =>
      expect(screen.getByText(/tu saldo en usd todavía no alcanza el mínimo/i)).toBeInTheDocument()
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('éxito real (al menos un payout created) muestra confirmación y llama a onSuccess', async () => {
    requestReferralPayoutMock.mockResolvedValue({
      requested: true,
      payouts: [{ currency: 'USD', created: true, amount: 10, payoutId: 'p-1', commissionCount: 2 }],
    });
    const onSuccess = vi.fn();
    render(<PayoutRequestCard availableAmount={30} onSuccess={onSuccess} />);
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: /solicitar retiro/i }));

    await waitFor(() => expect(screen.getByText(/solicitud enviada por usd 10\.00/i)).toBeInTheDocument());
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('tras el éxito, limpia el formulario', async () => {
    requestReferralPayoutMock.mockResolvedValue({
      requested: true,
      payouts: [{ currency: 'USD', created: true, amount: 10, payoutId: 'p-1' }],
    });
    render(<PayoutRequestCard availableAmount={30} onSuccess={vi.fn()} />);
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: /solicitar retiro/i }));

    await waitFor(() => expect(screen.getByText(/solicitud enviada/i)).toBeInTheDocument());
    expect(screen.getByLabelText('País')).toHaveValue('');
    expect(screen.getByLabelText('Nombre del titular')).toHaveValue('');
    expect(screen.getByLabelText('Número de cuenta')).toHaveValue('');
  });

  it('error de red muestra un mensaje genérico y nunca loguea el snapshot bancario', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    requestReferralPayoutMock.mockRejectedValue(new Error('network fail'));
    render(<PayoutRequestCard availableAmount={30} onSuccess={vi.fn()} />);
    fillValidForm();

    fireEvent.click(screen.getByRole('button', { name: /solicitar retiro/i }));

    await waitFor(() =>
      expect(screen.getByText(/no pudimos conectar con el servidor/i)).toBeInTheDocument()
    );

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    const loggedArgs = consoleWarnSpy.mock.calls[0];
    const loggedText = loggedArgs.map((a) => String(a)).join(' ');
    expect(loggedText).not.toContain('Juan Perez');
    expect(loggedText).not.toContain('Banco Estado');
    expect(loggedText).not.toContain('1234567890');

    consoleWarnSpy.mockRestore();
  });
});
