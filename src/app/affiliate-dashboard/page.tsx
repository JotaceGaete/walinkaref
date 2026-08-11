import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardKPIs from './components/DashboardKPIs';
import ReferralLinkWidget from './components/ReferralLinkWidget';
import ReferralActivityChart from './components/ReferralActivityChart';
import ReferralTable from './components/ReferralTable';

export default function AffiliateDashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-800 text-foreground">Panel de afiliado</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Ciclo actual: Agosto 2026 · Actualizado hace 3 minutos
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-positive/10 rounded-full border border-positive/20">
              <div className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse-soft" />
              <span className="text-xs font-600 text-positive">Afiliado activo</span>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <DashboardKPIs />

        {/* Link widget */}
        <ReferralLinkWidget />

        {/* Chart + secondary stats */}
        <ReferralActivityChart />

        {/* Referral table */}
        <ReferralTable />
      </div>
    </DashboardLayout>
  );
}