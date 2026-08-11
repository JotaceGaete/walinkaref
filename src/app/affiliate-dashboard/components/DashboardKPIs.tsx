import React from 'react';
import { Users, CheckCircle, Clock, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const kpis = [
  {
    id: 'kpi-referidos',
    label: 'Referidos totales',
    value: '34',
    subtext: '+3 esta semana',
    icon: Users,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    trend: 'up',
    trendColor: 'text-positive',
    cardClass: 'border-border',
    colspan: 'col-span-1',
  },
  {
    id: 'kpi-calificados',
    label: 'Calificados',
    value: '11',
    subtext: 'US$55 acreditados',
    icon: CheckCircle,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    trend: 'up',
    trendColor: 'text-positive',
    cardClass: 'border-accent/20 bg-positive/5',
    colspan: 'col-span-1',
  },
  {
    id: 'kpi-pendientes',
    label: 'En progreso',
    value: '9',
    subtext: 'Completando 2 meses',
    icon: Clock,
    iconBg: 'bg-pending/10',
    iconColor: 'text-pending',
    trend: 'neutral',
    trendColor: 'text-pending',
    cardClass: 'border-border',
    colspan: 'col-span-1',
  },
  {
    id: 'kpi-disponible',
    label: 'Disponible',
    value: 'US$30',
    subtext: 'Listo para retirar',
    icon: DollarSign,
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    trend: 'up',
    trendColor: 'text-positive',
    cardClass: 'border-accent/20',
    colspan: 'col-span-1',
  },
  {
    id: 'kpi-total',
    label: 'Total ganado',
    value: 'US$55',
    subtext: 'Desde tu registro',
    icon: TrendingUp,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    trend: 'up',
    trendColor: 'text-positive',
    cardClass: 'border-border',
    colspan: 'col-span-1',
  },
];

export default function DashboardKPIs() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {kpis?.map((kpi) => {
        const Icon = kpi?.icon;
        return (
          <div
            key={kpi?.id}
            className={`bg-card shadow-card rounded-2xl p-5 border ${kpi?.cardClass} flex flex-col gap-3`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi?.iconBg}`}>
                <Icon size={16} className={kpi?.iconColor} />
              </div>
              {kpi?.trend === 'up' && (
                <TrendingUp size={14} className="text-positive" />
              )}
              {kpi?.trend === 'neutral' && (
                <AlertTriangle size={14} className="text-pending" />
              )}
            </div>
            <div>
              <p className="text-2xl font-800 text-foreground font-tabular leading-none mb-1">
                {kpi?.value}
              </p>
              <p className="text-xs font-500 text-muted-foreground">{kpi?.label}</p>
            </div>
            <p className={`text-xs font-600 ${kpi?.trendColor}`}>{kpi?.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}