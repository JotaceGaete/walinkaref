'use client';
import React, { useState } from 'react';
import { Copy, Check, MessageCircle, Mail, AlertTriangle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

const REFERRAL_LINK_PLACEHOLDER = '{{REFERRAL_LINK}}';

// El texto de cada plantilla usa REFERRAL_LINK_PLACEHOLDER en vez de un
// enlace literal — se resuelve al enlace real del usuario logueado recién
// en el render (ver CopyTemplates más abajo). Nunca se muestra ni se copia
// un enlace ajeno.
export const templates = [
  {
    id: 'tpl-whatsapp-1',
    channel: 'WhatsApp',
    icon: MessageCircle,
    label: 'WhatsApp — Contacto directo',
    text: `Hola [nombre], ¿cómo estás? Te quería compartir algo que puede servirte para tu negocio. Se llama Walinka — es una plataforma para que puedas tener tu catálogo digital y recibir pedidos por WhatsApp sin complicaciones. Tiene prueba gratuita y está en español. ¿Le das un vistazo? ${REFERRAL_LINK_PLACEHOLDER}`,
  },
  {
    id: 'tpl-whatsapp-2',
    channel: 'WhatsApp',
    icon: MessageCircle,
    label: 'WhatsApp — Seguimiento',
    text: `Hola [nombre], hace unos días te compartí Walinka. ¿Pudiste revisarlo? Si tienes dudas con gusto te explico cómo funciona. Muchos negocios como el tuyo ya lo están usando para vender más fácil por WhatsApp.`,
  },
  {
    id: 'tpl-instagram-1',
    channel: 'Instagram',
    icon: null,
    label: 'Instagram — Bio/Story',
    text: `¿Tienes un negocio y todavía anotas los pedidos a mano? 📋 Walinka te permite tener tu catálogo online y recibir pedidos directo por WhatsApp. Sin comisiones por venta, sin complicaciones técnicas. Pruébalo gratis 👇 ${REFERRAL_LINK_PLACEHOLDER}`,
  },
  {
    id: 'tpl-instagram-2',
    channel: 'Instagram',
    icon: null,
    label: 'Instagram — Post educativo',
    text: `3 razones por las que los negocios pequeños usan Walinka:\n\n✅ Catálogo digital sin saber de tecnología\n✅ Pedidos por WhatsApp en automático\n✅ Control de stock desde el celular\n\nPrueba gratis en el link de mi bio.`,
  },
  {
    id: 'tpl-email-1',
    channel: 'Email',
    icon: Mail,
    label: 'Email — Introducción',
    text: `Asunto: Una herramienta que puede ayudar a tu negocio\n\nHola [nombre],\n\nTe escribo porque encontré una plataforma llamada Walinka que creo que puede ser útil para lo que haces.\n\nWalinka permite a pequeños negocios tener un catálogo digital, recibir pedidos por WhatsApp y gestionar clientes desde un solo lugar. No requiere conocimientos técnicos y tiene prueba gratuita.\n\nPuedes verlo aquí: ${REFERRAL_LINK_PLACEHOLDER}\n\nCualquier duda, con gusto te ayudo.\n\nSaludos,\n[Tu nombre]`,
  },
  {
    id: 'tpl-email-2',
    channel: 'Email',
    icon: Mail,
    label: 'Email — Seguimiento',
    text: `Asunto: ¿Pudiste revisar Walinka?\n\nHola [nombre],\n\nHace unos días te compartí información sobre Walinka. ¿Tuviste oportunidad de revisarlo?\n\nSi tienes alguna pregunta sobre cómo funciona o si aplica para tu tipo de negocio, con gusto te respondo.\n\nEl enlace nuevamente: ${REFERRAL_LINK_PLACEHOLDER}\n\nSaludos,\n[Tu nombre]`,
  },
];

const channelColors: Record<string, string> = {
  WhatsApp: 'bg-positive/10 text-positive',
  Instagram: 'bg-pink-50 text-pink-600',
  Email: 'bg-secondary text-primary',
};

interface CopyTemplatesProps {
  /** https://ref.walinka.com/{code} real del usuario logueado, o null
      mientras no está disponible (cargando o error). */
  referralLink: string | null;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

export default function CopyTemplates({ referralLink, loading, error, onRetry }: CopyTemplatesProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeChannel, setActiveChannel] = useState<string>('WhatsApp');

  const handleCopy = (id: string, resolvedText: string) => {
    if (!referralLink) return;
    navigator.clipboard.writeText(resolvedText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const channels = ['WhatsApp', 'Instagram', 'Email'];
  const filtered = templates.filter((t) => t.channel === activeChannel);

  return (
    <div className="bg-card shadow-card rounded-2xl border border-border overflow-hidden mb-6">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-700 text-foreground">Plantillas de texto</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Copia, personaliza y comparte. Reemplaza [nombre] con el nombre real.
            </p>
          </div>
          {!error && (
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              {channels.map((ch) => (
                <button
                  key={`ch-${ch}`}
                  onClick={() => setActiveChannel(ch)}
                  className={`px-4 py-2 text-xs font-600 rounded-lg transition-all ${
                    activeChannel === ch
                      ? 'bg-card shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-3 p-6">
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
      ) : loading || !referralLink ? (
        // Nunca se renderiza un enlace ficticio: mientras el código real no
        // está listo, se muestra un esqueleto en vez del texto de la plantilla.
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div
              key={`tpl-skeleton-${i}`}
              className="bg-background rounded-xl border border-border p-5 flex flex-col gap-3"
            >
              <div className="h-4 w-40 rounded bg-muted animate-pulse" />
              <div className="h-24 rounded-lg bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((tpl) => {
            const TplIcon = tpl.icon;
            const resolvedText = tpl.text.replaceAll(REFERRAL_LINK_PLACEHOLDER, referralLink);
            return (
              <div
                key={tpl.id}
                className="bg-background rounded-xl border border-border p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${channelColors[tpl.channel]}`}>
                      {TplIcon ? <TplIcon size={13} /> : <Icon name="Instagram" size={13} />}
                    </div>
                    <span className="text-sm font-600 text-foreground">{tpl.label}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(tpl.id, resolvedText)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-600 transition-all ${
                      copiedId === tpl.id
                        ? 'bg-positive/10 text-positive' :'bg-muted text-muted-foreground hover:bg-secondary hover:text-primary'
                    }`}
                  >
                    {copiedId === tpl.id ? <Check size={12} /> : <Copy size={12} />}
                    {copiedId === tpl.id ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <div className="bg-card rounded-lg border border-border p-3 flex-1">
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                    {resolvedText}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
