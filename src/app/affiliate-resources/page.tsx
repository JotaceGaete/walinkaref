import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ResourcesHero from './components/ResourcesHero';
import CopyTemplates from './components/CopyTemplates';
import BannerAssets from './components/BannerAssets';
import VideoLibrary from './components/VideoLibrary';
import QuickSalesGuide from './components/QuickSalesGuide';
import ResourcesFAQ from './components/ResourcesFAQ';

export default function AffiliateResourcesPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 max-w-screen-2xl mx-auto">
        <ResourcesHero />
        <CopyTemplates />
        <BannerAssets />
        <VideoLibrary />
        <QuickSalesGuide />
        <ResourcesFAQ />
      </div>
    </DashboardLayout>
  );
}