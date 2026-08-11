'use client';
import React, { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ResourcesHero from './components/ResourcesHero';
import CopyTemplates from './components/CopyTemplates';
import BannerAssets from './components/BannerAssets';
import VideoLibrary from './components/VideoLibrary';
import QuickSalesGuide from './components/QuickSalesGuide';
import ResourcesFAQ from './components/ResourcesFAQ';
import { getMyReferralStats, type ReferralStats } from '@/services/referralService';

export default function AffiliateResourcesPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  // Ruta independiente de /affiliate-dashboard: no hay estado compartido
  // entre páginas, así que esta es su propia (única) llamada a
  // wa_get_my_referral_stats() para resolver el código real del afiliado.
  const loadStats = useCallback(() => {
    setStatsLoading(true);
    setStatsError(false);
    getMyReferralStats()
      .then((data) => setStats(data))
      .catch((err) => {
        console.warn('[AffiliateResources] getMyReferralStats failed:', err?.message);
        setStatsError(true);
      })
      .finally(() => setStatsLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const referralLink = stats?.code ? `https://ref.walinka.com/${stats.code}` : null;

  return (
    <DashboardLayout referralsCount={stats?.invitedCount}>
      <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
        <ResourcesHero />
        <CopyTemplates
          referralLink={referralLink}
          loading={statsLoading}
          error={statsError}
          onRetry={loadStats}
        />
        <BannerAssets />
        <VideoLibrary />
        <QuickSalesGuide />
        <ResourcesFAQ />
      </div>
    </DashboardLayout>
  );
}
