import React from 'react';
import { Users, CheckCircle, Clock, Hourglass, Wallet, TrendingUp, AlertTriangle } from 'lucide-react';
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
      id: 'kpi-disponible',
      label: 'Disponible',
      value: stats ? formatMoney(stats.availableAmount, stats.rewardCurrency) : '—',
      subtext: 'Listo para retirar',
      icon: Wallet,
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
      cardClass: 'border-accent/20',
    },
    {
      id: 'kpi-total',
      label: 'Total ganado',
      value: stats ? formatMoney(stats.totalEarnedAmount, stats.rewardCurrency) : '—',
      subtext: stats ? `Ganas ${formatMoney(stats.rewardAmount, stats.rewardCurrency)} por calificado` : '',
      icon: TrendingUp,
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      cardClass: 'border-border',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            className={`bg-card shadow-card rounded-2xl p-5 border ${kpi.cardClass} flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.iconBg}`}>
                <Icon size={16} className={kpi.iconColor} />
              </div>
            </div>
            <div>
              {loading ? (
                <div className="h-7 w-16 rounded-lg bg-muted animate-pulse mb-1" />
              ) : (
                <p className="text-2xl font-800 text-foreground font-tabular leading-none mb-1">
                  {kpi.value}
                </p>
              )}
              <p className="text-xs font-500 text-muted-foreground">{kpi.label}</p>
            </div>
            {!loading && kpi.subtext && (
              <p className="text-xs font-600 text-muted-foreground">{kpi.subtext}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
