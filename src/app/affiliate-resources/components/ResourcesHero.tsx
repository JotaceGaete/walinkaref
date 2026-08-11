import React from 'react';
import { BookOpen, Download } from 'lucide-react';

export default function ResourcesHero() {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-800 text-foreground">Recursos para afiliados</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Todo lo que necesitas para recomendar Walinka con confianza
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-xl border border-border text-xs font-600 text-muted-foreground">
            <BookOpen size={13} />
            24 recursos disponibles
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 btn-primary text-sm">
            <Download size={14} />
            Descargar todo
          </button>
        </div>
      </div>
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
        {[
          { id: 'rs-templates', label: 'Plantillas de texto', value: '8', icon: '📝' },
          { id: 'rs-banners', label: 'Banners descargables', value: '6', icon: '🖼️' },
          { id: 'rs-videos', label: 'Videos explicativos', value: '5', icon: '▶️' },
          { id: 'rs-guides', label: 'Guías de venta', value: '5', icon: '📚' },
        ]?.map((stat) => (
          <div
            key={stat?.id}
            className="bg-card shadow-card rounded-xl p-4 border border-border flex items-center gap-3"
          >
            <span className="text-xl">{stat?.icon}</span>
            <div>
              <p className="text-lg font-800 text-foreground font-tabular">{stat?.value}</p>
              <p className="text-xs text-muted-foreground">{stat?.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}