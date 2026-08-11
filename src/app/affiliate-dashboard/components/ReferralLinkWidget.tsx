'use client';
import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Share2, QrCode } from 'lucide-react';

const affiliateLink = 'ref.walinka.com/juan-f92ee';

export default function ReferralLinkWidget() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
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
        <div className="flex-1 flex items-center gap-3 px-4 py-3">
          <ExternalLink size={14} className="text-muted-foreground shrink-0" />
          <span className="text-sm font-600 text-foreground font-tabular truncate">
            https://{affiliateLink}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-600 transition-all duration-200 border-l border-border ${
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
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
        {[
          { label: 'Clics totales', value: '218', id: 'link-stat-clicks' },
          { label: 'Tasa de registro', value: '15.6%', id: 'link-stat-rate' },
          { label: 'Última actividad', value: 'Hace 1h', id: 'link-stat-last' },
        ]?.map((stat) => (
          <div key={stat?.id} className="text-center">
            <p className="text-lg font-800 text-foreground font-tabular">{stat?.value}</p>
            <p className="text-xs text-muted-foreground">{stat?.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}