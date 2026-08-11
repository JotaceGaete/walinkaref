'use client';
import React, { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardKPIs from './components/DashboardKPIs';
import ReferralLinkWidget from './components/ReferralLinkWidget';
import ReferralTable from './components/ReferralTable';
import {
  getMyReferralStats,
  listMyReferrals,
  type ReferralListItem,
  type ReferralStats,
} from '@/services/referralService';

export default function AffiliateDashboardPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  const [referrals, setReferrals] = useState<ReferralListItem[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(false);

  // Independiente de loadReferrals: si stats falla, la tabla de referidos
  // sigue funcionando (y viceversa) — ninguna sección tumba la página entera.
  const loadStats = useCallback(() => {
    setStatsLoading(true);
    setStatsError(false);
    getMyReferralStats()
      .then((data) => setStats(data))
      .catch((err) => {
        console.warn('[AffiliateDashboard] getMyReferralStats failed:', err?.message);
        setStatsError(true);
      })
      .finally(() => setStatsLoading(false));
  }, []);

  const loadReferrals = useCallback(() => {
    setListLoading(true);
    setListError(false);
    listMyReferrals({ limit: 20, offset: 0 })
      .then((data) => setReferrals(data))
      .catch((err) => {
        console.warn('[AffiliateDashboard] listMyReferrals failed:', err?.message);
        setListError(true);
      })
      .finally(() => setListLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
    loadReferrals();
  }, [loadStats, loadReferrals]);

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-800 text-foreground">Panel de afiliado</h1>
            <p className="text-sm text-muted-foreground mt-1">Programa de afiliados Walinka</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-positive/10 rounded-full border border-positive/20">
              <div className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse-soft" />
              <span className="text-xs font-600 text-positive">Afiliado activo</span>
            </div>
          </div>
        </div>

        {/* KPIs (wa_get_my_referral_stats) */}
        <DashboardKPIs stats={stats} loading={statsLoading} error={statsError} onRetry={loadStats} />

        {/* Link widget (mismo stats: comparte la llamada de arriba, sin duplicarla) */}
        <ReferralLinkWidget stats={stats} loading={statsLoading} error={statsError} onRetry={loadStats} />

        {/* Tabla de referidos (wa_list_my_referrals) */}
        <ReferralTable
          referrals={referrals}
          loading={listLoading}
          error={listError}
          onRetry={loadReferrals}
          requiredPaidMonths={stats?.requiredPaidMonths ?? 2}
        />
      </div>
    </DashboardLayout>
  );
}
