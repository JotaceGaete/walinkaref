import React from 'react';
import { TrendingUp, Users, CheckCircle, DollarSign } from 'lucide-react';

const mockReferrals = [
  { id: 'usr-91AE', progress: 2, status: 'qualified' },
  { id: 'usr-22F1', progress: 1, status: 'progress' },
  { id: 'usr-76BC', progress: 0, status: 'pending' },
  { id: 'usr-3D4F', progress: 2, status: 'qualified' },
  { id: 'usr-B8C2', progress: 1, status: 'progress' },
];

const statusConfig = {
  qualified: { label: '2/2 ✓', className: 'badge-qualified' },
  progress: { label: '1/2', className: 'badge-progress' },
  pending: { label: '0/2', className: 'badge-pending' },
};

export default function DashboardMockup() {
  return (
    <div className="w-full max-w-sm lg:max-w-md shadow-hero rounded-2xl overflow-hidden border border-border bg-card animate-scale-in">
      {/* Header bar */}
      <div className="gradient-hero px-5 py-4 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white/30" />
          <div className="w-3 h-3 rounded-full bg-white/30" />
          <div className="w-3 h-3 rounded-full bg-white/30" />
        </div>
        <div className="flex-1 mx-3">
          <div className="bg-white/10 rounded-md px-3 py-1 text-white/60 text-xs text-center">
            ref.walinka.com/dashboard
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 bg-background">
        <p className="text-xs font-600 text-muted-foreground uppercase tracking-widest mb-3">
          Mi desempeño
        </p>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-card shadow-card rounded-xl p-3 border border-border text-center">
            <div className="flex justify-center mb-1">
              <Users size={14} className="text-primary" />
            </div>
            <p className="text-xl font-800 text-foreground font-tabular">34</p>
            <p className="text-[10px] text-muted-foreground font-500">Referidos</p>
          </div>
          <div className="bg-card shadow-card rounded-xl p-3 border border-border text-center">
            <div className="flex justify-center mb-1">
              <CheckCircle size={14} className="text-accent" />
            </div>
            <p className="text-xl font-800 text-accent font-tabular">11</p>
            <p className="text-[10px] text-muted-foreground font-500">Calificados</p>
          </div>
          <div className="bg-card shadow-card rounded-xl p-3 border border-border text-center">
            <div className="flex justify-center mb-1">
              <DollarSign size={14} className="text-positive" />
            </div>
            <p className="text-xl font-800 text-positive font-tabular">$55</p>
            <p className="text-[10px] text-muted-foreground font-500">Ganado</p>
          </div>
        </div>

        {/* Link bar */}
        <div className="bg-secondary rounded-xl px-3 py-2.5 flex items-center gap-2 mb-4 border border-primary/10">
          <div className="w-5 h-5 rounded-md bg-primary flex items-center justify-center shrink-0">
            <TrendingUp size={10} className="text-white" />
          </div>
          <span className="text-xs text-primary font-600 truncate">
            ref.walinka.com/tu-nombre
          </span>
          <span className="ml-auto text-[10px] text-primary/60 font-500 whitespace-nowrap">
            Copiar
          </span>
        </div>

        {/* Referral list */}
        <div className="flex flex-col gap-2">
          {mockReferrals.map((ref) => {
            const config = statusConfig[ref.status as keyof typeof statusConfig];
            return (
              <div
                key={`mockup-${ref.id}`}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <Users size={11} className="text-muted-foreground" />
                  </div>
                  <span className="text-xs font-600 text-foreground font-tabular">
                    {ref.id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="progress-track w-14 h-1.5">
                    <div
                      className="progress-fill-green"
                      style={{ width: `${(ref.progress / 2) * 100}%` }}
                    />
                  </div>
                  <span className={`badge text-[10px] ${config.className}`}>
                    {config.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-muted border-t border-border flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">Actualizado hace 2 min</span>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
          <span className="text-[10px] text-accent font-600">En vivo</span>
        </div>
      </div>
    </div>
  );
}