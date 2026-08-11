'use client';
import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Share2, QrCode, AlertTriangle } from 'lucide-react';
import type { ReferralStats } from '@/services/referralService';

interface ReferralLinkWidgetProps {
  stats: ReferralStats | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

function formatMoney(amount: number | undefined, currency: string | undefined) {
  const value = Number(amount ?? 0);
  return `${currency || 'USD'} ${value.toFixed(2)}`;
}

export default function ReferralLinkWidget({ stats, loading, error, onRetry }: ReferralLinkWidgetProps) {
  const [copied, setCopied] = useState(false);

  if (error) {
    return (
      <div className="bg-card shadow-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle size={16} className="text-muted-foreground shrink-0" />
          <p className="flex-1 text-sm text-muted-foreground">No pudimos cargar tu enlace de afiliado.</p>
          <button
            type="button"
            onClick={onRetry}
            className="text-sm font-600 text-primary hover:underline shrink-0"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const affiliateLink = stats?.code ? `ref.walinka.com/${stats.code}` : '';

  const handleCopy = () => {
    if (!affiliateLink) return;
    navigator.clipboard?.writeText(`https://${affiliateLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-card shadow-card rounded-2xl border border-border p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground mb-1">
            Tu enlace de afiliado
          </p>
          <p className="text-sm text-muted-foreground">
            Comparte este enlace para rastrear tus referidos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-600 text-muted-foreground border border-border rounded-lg hover:bg-muted transition-all">
            <QrCode size={14} />
            QR
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-600 text-primary bg-secondary rounded-lg hover:bg-primary/15 transition-all border border-primary/10">
            <Share2 size={14} />
            Compartir
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-0 bg-background border border-border rounded-xl overflow-hidden">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 min-w-0">
          <ExternalLink size={14} className="text-muted-foreground shrink-0" />
          {loading ? (
            <div className="h-4 w-48 rounded bg-muted animate-pulse" />
          ) : (
            <span className="text-sm font-600 text-foreground font-tabular truncate">
              https://{affiliateLink}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          disabled={!affiliateLink}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-600 transition-all duration-200 border-l border-border shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
            copied
              ? 'bg-positive/10 text-positive' :'bg-muted text-foreground hover:bg-secondary hover:text-primary'
          }`}
        >
          {copied ? (
            <>
              <Check size={14} />
              Copiado
            </>
          ) : (
            <>
              <Copy size={14} />
              Copiar
            </>
          )}
        </button>
      </div>
      {/* Condiciones reales del programa (rewardAmount/rewardCurrency/requiredPaidMonths
          vienen de wa_get_my_referral_stats() — nunca hardcodeadas). Reemplaza las
          métricas mock de clics/tasa de registro que Affiliate Core no expone hoy. */}
      {stats && (
        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
          Ganas <span className="font-600 text-foreground">{formatMoney(stats.rewardAmount, stats.rewardCurrency)}</span> cuando
          tu referido completa <span className="font-600 text-foreground">{stats.requiredPaidMonths} meses pagos</span> consecutivos.
        </p>
      )}
    </div>
  );
}
