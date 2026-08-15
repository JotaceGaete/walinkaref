'use client';
import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Share2, AlertTriangle } from 'lucide-react';
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

export default function ReferralLinkWidget({
  stats,
  loading,
  error,
  onRetry,
}: ReferralLinkWidgetProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  if (error) {
    return (
      <div className="bg-card shadow-card rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle size={16} className="text-muted-foreground shrink-0" />
          <p className="flex-1 text-sm text-muted-foreground">
            No pudimos cargar tu enlace de afiliado.
          </p>
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

  const handleShare = async () => {
    if (!affiliateLink) return;
    const url = `https://${affiliateLink}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Walinka',
          text: 'Conoce Walinka con mi enlace de afiliado',
          url,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2500);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(url);
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  return (
    <div className="relative mb-8 overflow-hidden rounded-3xl border border-primary/20 bg-card p-5 shadow-card sm:p-7">
      <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-700 uppercase tracking-[0.16em] text-primary">
            Tu acción principal
          </p>
          <h2 className="text-xl font-800 tracking-tight text-foreground">Mi enlace de afiliado</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Compártelo para que cada registro quede asociado a tu cuenta.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            disabled={!affiliateLink}
            className="flex items-center justify-center gap-2 rounded-xl border border-primary/15 bg-secondary px-4 py-2.5 text-sm font-700 text-primary transition-all hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {shared ? <Check size={14} /> : <Share2 size={14} />}
            {shared ? 'Compartido' : 'Compartir'}
          </button>
        </div>
      </div>
      <div className="mt-5 flex flex-col overflow-hidden rounded-2xl border border-border bg-background sm:flex-row sm:items-stretch">
        <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-4 sm:px-5">
          <ExternalLink size={14} className="text-muted-foreground shrink-0" />
          {loading ? (
            <div className="h-4 w-48 rounded bg-muted animate-pulse" />
          ) : (
            <span className="truncate text-sm font-700 text-foreground font-tabular sm:text-base">
              https://{affiliateLink}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          disabled={!affiliateLink}
          className={`flex shrink-0 items-center justify-center gap-2 border-t border-border px-6 py-3.5 text-sm font-700 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm:border-l sm:border-t-0 ${
            copied
              ? 'bg-positive/10 text-positive'
              : 'bg-muted text-foreground hover:bg-secondary hover:text-primary'
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
        <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          Ganas{' '}
          <span className="font-600 text-foreground">
            {formatMoney(stats.rewardAmount, stats.rewardCurrency)}
          </span>{' '}
          cuando tu referido completa{' '}
          <span className="font-600 text-foreground">{stats.requiredPaidMonths} meses pagos</span>{' '}
          consecutivos.
        </p>
      )}
    </div>
  );
}
