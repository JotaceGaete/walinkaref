'use client';
import React from 'react';
import { Download, ImageIcon } from 'lucide-react';

const banners = [
  { id: 'banner-sq-1', label: 'Banner cuadrado', size: '1080×1080', format: 'PNG', use: 'Instagram · WhatsApp', color: 'from-primary to-blue-600' },
  { id: 'banner-story-1', label: 'Story vertical', size: '1080×1920', format: 'PNG', use: 'Instagram Stories', color: 'from-accent to-emerald-600' },
  { id: 'banner-web-1', label: 'Banner web ancho', size: '1200×628', format: 'PNG', use: 'Facebook · LinkedIn', color: 'from-primary to-accent' },
  { id: 'banner-sq-2', label: 'Banner cuadrado oscuro', size: '1080×1080', format: 'PNG', use: 'Instagram · WhatsApp', color: 'from-slate-800 to-slate-900' },
  { id: 'banner-story-2', label: 'Story con CTA', size: '1080×1920', format: 'PNG', use: 'Instagram Stories', color: 'from-indigo-500 to-purple-600' },
  { id: 'banner-email-1', label: 'Header de email', size: '600×200', format: 'PNG', use: 'Email marketing', color: 'from-primary to-blue-800' },
];

export default function BannerAssets() {
  return (
    <div className="bg-card shadow-card rounded-2xl border border-border overflow-hidden mb-6">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-lg font-700 text-foreground">Banners descargables</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Imágenes listas para usar en redes sociales y email
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 btn-outline text-sm">
          <Download size={14} />
          Descargar todos
        </button>
      </div>
      <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {banners?.map((banner) => (
          <div
            key={banner?.id}
            className="group flex flex-col gap-2"
          >
            {/* Preview */}
            <div className={`relative rounded-xl overflow-hidden border border-border aspect-square bg-gradient-to-br ${banner?.color} flex items-center justify-center cursor-pointer group-hover:shadow-card-hover transition-all`}>
              <div className="text-center">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mx-auto mb-2">
                  <ImageIcon size={16} className="text-white" />
                </div>
                <p className="text-[9px] text-white/80 font-600 px-2 leading-tight">
                  WalinkaRef
                </p>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                <button className="flex items-center gap-1.5 px-3 py-2 bg-card rounded-lg text-xs font-600 text-foreground shadow-card">
                  <Download size={12} />
                  Descargar
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-600 text-foreground leading-tight">{banner?.label}</p>
              <p className="text-[10px] text-muted-foreground">{banner?.size} · {banner?.format}</p>
              <p className="text-[10px] text-muted-foreground">{banner?.use}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}