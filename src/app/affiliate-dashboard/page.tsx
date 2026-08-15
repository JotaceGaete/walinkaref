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
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Page header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-700 uppercase tracking-[0.18em] text-primary">
              Programa de afiliados
            </p>
            <h1 className="text-2xl font-800 tracking-tight text-foreground sm:text-3xl">
              Panel de afiliado
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Comparte tu enlace, sigue el progreso de tus referidos y administra tus retiros.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-positive/10 rounded-full border border-positive/20">
              <div className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse-soft" />
              <span className="text-xs font-600 text-positive">Afiliado activo</span>
            </div>
          </div>
        </div>

        {/* KPIs + retiros solicitados (wa_get_my_referral_stats) */}
        <DashboardKPIs
          stats={stats}
          loading={statsLoading}
          error={statsError}
          onRetry={loadStats}
        />

        {/* Link widget (mismo stats: comparte la llamada de arriba, sin duplicarla) */}
        <section id="mi-enlace" className="scroll-mt-6">
          <ReferralLinkWidget
            stats={stats}
            loading={statsLoading}
            error={statsError}
            onRetry={loadStats}
          />
        </section>

        {/* Solicitar retiro (wa_request_referral_payout) -- el frontend nunca
            elige comisiones, solo envía el snapshot bancario. */}
        {/* Tabla de referidos (wa_list_my_referrals) */}
        <section id="referidos" className="mb-10 scroll-mt-6">
          <ReferralTable
            referrals={referrals}
            loading={listLoading}
            error={listError}
            onRetry={loadReferrals}
            requiredPaidMonths={stats?.requiredPaidMonths ?? 2}
          />
        </section>

        <section aria-labelledby="payouts-heading" className="scroll-mt-6">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-700 uppercase tracking-[0.16em] text-primary">
                Tus ganancias
              </p>
              <h2
                id="payouts-heading"
                className="mt-1 text-xl font-800 tracking-tight text-foreground"
              >
                Retiros
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Solicita un retiro y consulta su estado en un solo lugar.
            </p>
          </div>
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
            <PayoutRequestCard
              availableAmount={stats?.availableAmount ?? 0}
              availableCurrency={stats?.rewardCurrency}
              onSuccess={handlePayoutRequestSuccess}
            />
            <PayoutHistoryTable
              payouts={payouts}
              loading={payoutsLoading}
              error={payoutsError}
              onRetry={loadPayouts}
            />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
