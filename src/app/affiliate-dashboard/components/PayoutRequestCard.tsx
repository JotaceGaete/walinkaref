'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Landmark, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import {
  requestReferralPayout,
  type PayoutMethodSnapshot,
  type RequestReferralPayoutResponse,
} from '@/services/referralService';

interface PayoutRequestFormData {
  country: string;
  holder_name: string;
  holder_tax_id: string;
  bank_name: string;
  account_type: string;
  account_number: string;
  email: string;
}

interface PayoutRequestCardProps {
  /** availableAmount de wa_get_my_referral_stats() -- solo para habilitar/deshabilitar el botón, nunca para decidir qué se retira (eso lo resuelve la RPC). */
  availableAmount: number;
  /** Moneda real asociada al saldo; se omite si stats todavía no cargó. */
  availableCurrency?: string;
  /** Se llama tras un éxito real (al menos 1 payout creado) para refrescar stats + historial en el componente padre. */
  onSuccess: () => void;
}

type FeedbackState = { type: 'success' | 'info' | 'error'; message: string } | null;

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(2)}`;
}

const DEFAULT_VALUES: PayoutRequestFormData = {
  country: '',
  holder_name: '',
  holder_tax_id: '',
  bank_name: '',
  account_type: '',
  account_number: '',
  email: '',
};

export default function PayoutRequestCard({
  availableAmount,
  availableCurrency,
  onSuccess,
}: PayoutRequestCardProps) {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PayoutRequestFormData>({ defaultValues: DEFAULT_VALUES });

  const canRequest = availableAmount > 0;

  const handleResult = (result: RequestReferralPayoutResponse) => {
    if (!result.requested) {
      // invalid_payout_method_snapshot -- no debería pasar casi nunca porque
      // el formulario ya valida los mismos campos obligatorios que el
      // backend, pero la RPC es la fuente de verdad final.
      setFeedback({
        type: 'error',
        message: 'Revisa los datos bancarios: hay campos obligatorios vacíos o inválidos.',
      });
      return;
    }

    const created = (result.payouts ?? []).filter((p) => p.created);

    // Nunca mostrar éxito si no se creó ningún payout real.
    if (created.length === 0) {
      if (result.reason === 'nothing_to_withdraw') {
        setFeedback({
          type: 'info',
          message: 'No tienes comisiones disponibles para retirar en este momento.',
        });
        return;
      }
      const belowMinimum = (result.payouts ?? []).find((p) => p.reason === 'below_minimum');
      setFeedback({
        type: 'info',
        message: belowMinimum
          ? `Tu saldo en ${belowMinimum.currency} todavía no alcanza el mínimo para retirar.`
          : 'No se generó ningún retiro con el saldo disponible en este momento.',
      });
      return;
    }

    reset(DEFAULT_VALUES);
    setFeedback({
      type: 'success',
      message:
        created.length === 1
          ? `Solicitud enviada por ${formatMoney(created[0].amount, created[0].currency)}. La revisaremos pronto.`
          : `Se generaron ${created.length} solicitudes de retiro (una por moneda). Las revisaremos pronto.`,
    });
    onSuccess();
  };

  const onSubmit = async (formData: PayoutRequestFormData) => {
    if (submitting) return; // evita doble llamada aunque el botón se dispare 2 veces (doble click/teclado)
    setSubmitting(true);
    setFeedback(null);

    // Snapshot autocontenido -- nunca se persiste en localStorage/
    // sessionStorage/cookies/URL, nunca se loguea (ni siquiera en el catch
    // de abajo, que solo reporta err?.message, mismo patrón que el resto
    // del dashboard).
    const snapshot: PayoutMethodSnapshot = {
      method: 'bank_transfer',
      country: formData.country.trim(),
      holder_name: formData.holder_name.trim(),
      bank_name: formData.bank_name.trim(),
      account_type: formData.account_type.trim(),
      account_number: formData.account_number.trim(),
      ...(formData.holder_tax_id.trim() ? { holder_tax_id: formData.holder_tax_id.trim() } : {}),
      ...(formData.email.trim() ? { email: formData.email.trim() } : {}),
    };

    try {
      const result = await requestReferralPayout(snapshot);
      handleResult(result);
    } catch (err) {
      console.warn(
        '[PayoutRequestCard] requestReferralPayout failed:',
        (err as { message?: string })?.message
      );
      setFeedback({
        type: 'error',
        message: 'No pudimos conectar con el servidor. Intenta nuevamente.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
      <div className="mb-5 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-accent/10">
            <Landmark size={16} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-800 tracking-tight text-foreground">Solicitar retiro</h3>
            <p className="text-xs text-muted-foreground">Transferencia bancaria</p>
          </div>
        </div>
        <div className="rounded-xl bg-positive/10 px-4 py-2 sm:text-right">
          <p className="text-[11px] font-700 uppercase tracking-wider text-positive">
            Saldo disponible
          </p>
          <p className="mt-0.5 text-base font-800 text-foreground font-tabular">
            {availableCurrency ? `${availableCurrency} ` : ''}
            {availableAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={`flex items-start gap-3 rounded-xl p-4 mb-5 ${
            feedback.type === 'success'
              ? 'bg-positive/10 border border-positive/20'
              : feedback.type === 'error'
                ? 'bg-danger/10 border border-danger/20'
                : 'bg-pending/10 border border-pending/20'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={16} className="text-positive mt-0.5 shrink-0" />
          ) : feedback.type === 'error' ? (
            <AlertCircle size={16} className="text-danger mt-0.5 shrink-0" />
          ) : (
            <Info size={16} className="text-pending mt-0.5 shrink-0" />
          )}
          <p
            className={`text-sm ${
              feedback.type === 'success'
                ? 'text-positive'
                : feedback.type === 'error'
                  ? 'text-danger'
                  : 'text-pending'
            }`}
          >
            {feedback.message}
          </p>
        </div>
      )}

      {!canRequest ? (
        <div className="rounded-2xl bg-background p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Todavía no tienes saldo disponible para retirar. Cuando un referido complete la
            condición del programa, vas a poder solicitar tu retiro acá.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-600 text-foreground mb-1.5"
                htmlFor="payout-country"
              >
                País
              </label>
              <input
                id="payout-country"
                type="text"
                placeholder="CL"
                {...register('country', { required: 'El país es obligatorio' })}
                className={`input-field ${errors.country ? 'input-field-error' : ''}`}
              />
              {errors.country && (
                <p className="text-xs text-danger mt-1.5">{errors.country.message}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-600 text-foreground mb-1.5"
                htmlFor="payout-holder-name"
              >
                Nombre del titular
              </label>
              <input
                id="payout-holder-name"
                type="text"
                {...register('holder_name', { required: 'El nombre del titular es obligatorio' })}
                className={`input-field ${errors.holder_name ? 'input-field-error' : ''}`}
              />
              {errors.holder_name && (
                <p className="text-xs text-danger mt-1.5">{errors.holder_name.message}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-600 text-foreground mb-1.5"
                htmlFor="payout-holder-tax-id"
              >
                RUT / identificación tributaria{' '}
                <span className="text-muted-foreground font-400">(opcional)</span>
              </label>
              <input
                id="payout-holder-tax-id"
                type="text"
                {...register('holder_tax_id')}
                className="input-field"
              />
            </div>

            <div>
              <label
                className="block text-sm font-600 text-foreground mb-1.5"
                htmlFor="payout-bank-name"
              >
                Banco
              </label>
              <input
                id="payout-bank-name"
                type="text"
                {...register('bank_name', { required: 'El banco es obligatorio' })}
                className={`input-field ${errors.bank_name ? 'input-field-error' : ''}`}
              />
              {errors.bank_name && (
                <p className="text-xs text-danger mt-1.5">{errors.bank_name.message}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-600 text-foreground mb-1.5"
                htmlFor="payout-account-type"
              >
                Tipo de cuenta
              </label>
              <select
                id="payout-account-type"
                {...register('account_type', { required: 'El tipo de cuenta es obligatorio' })}
                className={`input-field ${errors.account_type ? 'input-field-error' : ''}`}
                defaultValue=""
              >
                <option value="" disabled>
                  Selecciona un tipo
                </option>
                <option value="checking">Cuenta corriente</option>
                <option value="savings">Cuenta de ahorro</option>
                <option value="vista">Cuenta vista / RUT</option>
              </select>
              {errors.account_type && (
                <p className="text-xs text-danger mt-1.5">{errors.account_type.message}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-600 text-foreground mb-1.5"
                htmlFor="payout-account-number"
              >
                Número de cuenta
              </label>
              <input
                id="payout-account-number"
                type="text"
                inputMode="numeric"
                {...register('account_number', { required: 'El número de cuenta es obligatorio' })}
                className={`input-field ${errors.account_number ? 'input-field-error' : ''}`}
              />
              {errors.account_number && (
                <p className="text-xs text-danger mt-1.5">{errors.account_number.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                className="block text-sm font-600 text-foreground mb-1.5"
                htmlFor="payout-email"
              >
                Email de contacto <span className="text-muted-foreground font-400">(opcional)</span>
              </label>
              <input
                id="payout-email"
                type="email"
                {...register('email')}
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-1 flex w-full items-center justify-center gap-2 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:self-start sm:px-7"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando...
              </>
            ) : (
              'Solicitar retiro'
            )}
          </button>
        </form>
      )}
    </div>
  );
}
