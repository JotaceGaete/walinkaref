'use client';
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { ReferralPayout, ReferralPayoutStatus } from '@/services/referralService';

interface PayoutHistoryTableProps {
  payouts: ReferralPayout[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

const STATUS_LABELS: Record<ReferralPayoutStatus, string> = {
  requested: 'Solicitado',
  paid: 'Pagado',
  rejected: 'Rechazado',
};

// badge-pending/badge-paid ya existen en tailwind.css (mismo patrón que
// ReferralTable.tsx); para "rejected" se usa el token de color `danger` ya
// establecido en el resto de la app (ver AuthScreen.tsx) en vez de agregar
// una clase CSS nueva.
const STATUS_BADGE_CLASS: Record<ReferralPayoutStatus, string> = {
  requested: 'badge badge-pending',
  paid: 'badge badge-paid',
  rejected: 'badge bg-danger/10 text-danger',
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatMoney(amount: number, currency: string) {
  return `${currency} ${amount.toFixed(2)}`;
}

const PAYOUT_METHOD_LABELS: Record<string, string> = {
  bank_transfer: 'Transferencia bancaria',
};

export default function PayoutHistoryTable({
  payouts,
  loading,
  error,
  onRetry,
}: PayoutHistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div className="border-b border-border p-5 sm:p-6">
        <p className="text-xs font-700 uppercase tracking-[0.16em] text-primary">Historial</p>
        <h3 className="mt-1 text-lg font-800 tracking-tight text-foreground">Mis retiros</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {loading
            ? 'Cargando…'
            : `${payouts.length} retiro${payouts.length === 1 ? '' : 's'} solicitados`}
        </p>
      </div>

      {error ? (
        <div className="flex items-center gap-3 p-6">
          <AlertTriangle size={16} className="text-muted-foreground shrink-0" />
          <p className="flex-1 text-sm text-muted-foreground">
            No pudimos cargar tu historial de retiros.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="text-sm font-600 text-primary hover:underline shrink-0"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                  Fecha
                </th>
                <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                  Monto
                </th>
                <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                  Método
                </th>
                <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 3 }, (_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="px-5 py-3.5" colSpan={4}>
                      <div className="h-4 w-full max-w-xs rounded bg-muted animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-sm text-muted-foreground">
                    Todavía no solicitaste ningún retiro.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.payoutId} className="hover:bg-muted/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(p.requestedAt)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-700 text-foreground font-tabular">
                        {formatMoney(p.requestedAmount, p.currency)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">
                        {p.payoutMethod
                          ? (PAYOUT_METHOD_LABELS[p.payoutMethod] ?? p.payoutMethod)
                          : '—'}
                        {p.maskedAccountNumber ? ` · ${p.maskedAccountNumber}` : ''}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={STATUS_BADGE_CLASS[p.status]}>
                        {STATUS_LABELS[p.status]}
                      </span>
                      {p.status === 'paid' && p.externalReference && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Ref: {p.externalReference}
                        </p>
                      )}
                      {p.status === 'rejected' && p.rejectedReason && (
                        <p className="text-xs text-muted-foreground mt-1">{p.rejectedReason}</p>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
