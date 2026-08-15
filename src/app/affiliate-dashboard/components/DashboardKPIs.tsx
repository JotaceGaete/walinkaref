import React from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  Hourglass,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Send,
} from 'lucide-react';
import type { ReferralStats } from '@/services/referralService';

interface DashboardKPIsProps {
  stats: ReferralStats | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

function formatMoney(amount: number | undefined, currency: string | undefined) {
  const value = Number(amount ?? 0);
  return `${currency || 'USD'} ${value.toFixed(2)}`;
}

export default function DashboardKPIs({ stats, loading, error, onRetry }: DashboardKPIsProps) {
  if (error) {
    return (
      <div className="flex items-center gap-3 bg-card shadow-card rounded-2xl border border-border p-5 mb-6">
        <AlertTriangle size={16} className="text-muted-foreground shrink-0" />
        <p className="flex-1 text-sm text-muted-foreground">No pudimos cargar tus métricas.</p>
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-600 text-primary hover:underline shrink-0"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const requiredPaidMonths = stats?.requiredPaidMonths ?? 2;

  const kpis = [
    {
      id: 'kpi-referidos',
      label: 'Referidos totales',
      value: stats?.invitedCount ?? 0,
      subtext: 'Se registraron con tu enlace',
      icon: Users,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      cardClass: 'border-border',
    },
    {
      id: 'kpi-progreso',
      label: 'En progreso',
      value: stats?.oneMonthCount ?? 0,
      subtext: `1 de ${requiredPaidMonths} meses`,
      icon: Clock,
      iconBg: 'bg-pending/10',
      iconColor: 'text-pending',
      cardClass: 'border-border',
    },
    {
      id: 'kpi-calificados',
      label: 'Calificados',
      value: stats?.qualifiedCount ?? 0,
      subtext: `${requiredPaidMonths} de ${requiredPaidMonths} meses`,
      icon: CheckCircle,
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      cardClass: 'border-accent/20 bg-positive/5',
    },
    {
      id: 'kpi-pendiente',
      label: 'Pendiente',
      value: stats ? formatMoney(stats.pendingAmount, stats.rewardCurrency) : '—',
      subtext: 'En espera de aprobación',
      icon: Hourglass,
      iconBg: 'bg-pending/10',
      iconColor: 'text-pending',
      cardClass: 'border-border',
    },
    {
      id: 'kpi-total',
      label: 'Total ganado',
      value: stats ? formatMoney(stats.totalEarnedAmount, stats.rewardCurrency) : '—',
      subtext: stats
        ? `Ganas ${formatMoney(stats.rewardAmount, stats.rewardCurrency)} por calificado`
        : '',
      icon: TrendingUp,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      cardClass: 'border-border',
    },
  ];

  // pendingPayoutsByCurrency es multimoneda: cada elemento se muestra por
  // separado, NUNCA se suman entre sí (un afiliado puede tener retiros
  // 'requested' en más de una moneda a la vez -- ver wa_get_my_referral_stats
  // en el repo saas). Se oculta la sección completa si no hay nada
  // 'requested' en este momento, en vez de mostrar un "0" que podría
  // confundirse con una suma.
  const pendingPayouts = stats?.pendingPayoutsByCurrency ?? [];

  return (
    <>
      <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(18rem,1.35fr)_minmax(0,2fr)]">
        <div
          id="kpi-disponible"
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary p-6 text-primary-foreground shadow-card sm:p-7"
        >
          <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-card/10" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-700 uppercase tracking-[0.16em] text-primary-foreground/70">
                  Saldo disponible
                </p>
                {loading ? (
                  <div className="mt-4 h-10 w-44 animate-pulse rounded-lg bg-card/20" />
                ) : (
                  <p className="mt-3 text-3xl font-800 tracking-tight font-tabular sm:text-4xl">
                    {stats ? formatMoney(stats.availableAmount, stats.rewardCurrency) : '—'}
                  </p>
                )}
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-card/15">
                <Wallet size={20} />
              </div>
            </div>
            <div>
              <p className="text-sm font-600">Listo para retirar</p>
              <p className="mt-1 text-xs leading-relaxed text-primary-foreground/70">
                Comparte tu enlace para seguir creciendo o solicita el saldo disponible.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 overflow-hidden rounded-3xl border border-border bg-card shadow-card sm:grid-cols-3">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.id}
                className={`flex min-h-36 flex-col justify-between gap-4 p-4 sm:p-5 ${index % 2 !== 0 ? 'border-l border-border' : ''} ${index >= 2 ? 'border-t border-border sm:border-t-0' : ''} ${index >= 3 ? 'sm:border-t sm:border-border' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.iconBg}`}
                  >
                    <Icon size={16} className={kpi.iconColor} />
                  </div>
                </div>
                <div>
                  {loading ? (
                    <div className="h-7 w-16 rounded-lg bg-muted animate-pulse mb-1" />
                  ) : (
                    <p className="mb-1 text-xl font-800 leading-none text-foreground font-tabular sm:text-2xl">
                      {kpi.value}
                    </p>
                  )}
                  <p className="text-sm font-500 text-muted-foreground sm:text-xs">{kpi.label}</p>
                </div>
                {!loading && kpi.subtext && (
                  <p className="text-[13px] font-600 leading-relaxed text-muted-foreground sm:text-xs">
                    {kpi.subtext}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="h-20 rounded-2xl bg-muted animate-pulse mb-6" />
      ) : pendingPayouts.length > 0 ? (
        <div className="mb-6 rounded-2xl border border-pending/20 bg-pending/5 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-pending/10">
              <Send size={16} className="text-pending" />
            </div>
            <div>
              <p className="text-sm font-700 text-foreground">Retiros solicitados</p>
              <p className="text-xs text-muted-foreground">En revisión por el equipo Walinka</p>
            </div>
          </div>
          {/* Una línea por moneda -- nunca un total combinado. */}
          <div className="flex flex-wrap gap-3">
            {pendingPayouts.map((p) => (
              <div key={p.currency} className="px-4 py-2 rounded-xl bg-muted">
                <p className="text-lg font-800 text-foreground font-tabular leading-none">
                  {formatMoney(p.amount, p.currency)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
