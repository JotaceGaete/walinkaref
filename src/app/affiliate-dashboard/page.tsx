'use client';
import React, { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardKPIs from './components/DashboardKPIs';
import ReferralLinkWidget from './components/ReferralLinkWidget';
import ReferralTable from './components/ReferralTable';
import PayoutRequestCard from './components/PayoutRequestCard';
import PayoutHistoryTable from './components/PayoutHistoryTable';
import {
  getMyReferralStats,
  listMyReferrals,
  listMyReferralPayouts,
  type ReferralListItem,
  type ReferralPayout,
  type ReferralStats,
} from '@/services/referralService';

export default function AffiliateDashboardPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  const [referrals, setReferrals] = useState<ReferralListItem[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(false);

  const [payouts, setPayouts] = useState<ReferralPayout[]>([]);
  const [payoutsLoading, setPayoutsLoading] = useState(true);
  const [payoutsError, setPayoutsError] = useState(false);

  // Independiente de las demás cargas: si una sección falla, las otras 2
  // siguen funcionando -- ninguna tumba la página entera.
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

  const loadPayouts = useCallback(() => {
    setPayoutsLoading(true);
    setPayoutsError(false);
    listMyReferralPayouts({ limit: 20, offset: 0 })
      .then((data) => setPayouts(data))
      .catch((err) => {
        console.warn('[AffiliateDashboard] listMyReferralPayouts failed:', err?.message);
        setPayoutsError(true);
      })
      .finally(() => setPayoutsLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
    loadReferrals();
    loadPayouts();
  }, [loadStats, loadReferrals, loadPayouts]);

  // Tras una solicitud de retiro exitosa: refrescar stats (availableAmount/
  // pendingPayoutsByCurrency cambiaron) e historial (nueva fila) -- nunca
  // un update optimista local de estos datos financieros.
  const handlePayoutRequestSuccess = useCallback(() => {
    loadStats();
    loadPayouts();
  }, [loadStats, loadPayouts]);

  return (
    <DashboardLayout referralsCount={stats?.invitedCount}>
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

        {/* KPIs + retiros solicitados (wa_get_my_referral_stats) */}
        <DashboardKPIs stats={stats} loading={statsLoading} error={statsError} onRetry={loadStats} />

        {/* Link widget (mismo stats: comparte la llamada de arriba, sin duplicarla) */}
        <ReferralLinkWidget stats={stats} loading={statsLoading} error={statsError} onRetry={loadStats} />

        {/* Solicitar retiro (wa_request_referral_payout) -- el frontend nunca
            elige comisiones, solo envía el snapshot bancario. */}
        <PayoutRequestCard
          availableAmount={stats?.availableAmount ?? 0}
          onSuccess={handlePayoutRequestSuccess}
        />

        {/* Historial de retiros (wa_list_my_referral_payouts) */}
        <div className="mb-6">
          <PayoutHistoryTable
            payouts={payouts}
            loading={payoutsLoading}
            error={payoutsError}
            onRetry={loadPayouts}
          />
        </div>

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
