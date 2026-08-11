import React from 'react';
import { BookOpen, Download } from 'lucide-react';
import { templates } from './CopyTemplates';
import { banners } from './BannerAssets';
import { videos } from './VideoLibrary';

// Derivado de los arrays reales de cada sección — nunca un conteo fijo que
// pueda desincronizarse si se agrega o quita una plantilla/banner/video.
const totalResources = templates.length + banners.length + videos.length;

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
            {totalResources} recursos disponibles
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 btn-primary text-sm">
            <Download size={14} />
            Descargar todo
          </button>
        </div>
      </div>
      {/* Quick stats — value deriva de .length de cada array real, no de un número fijo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {[
          { id: 'rs-templates', label: 'Plantillas de texto', value: String(templates.length), icon: '📝' },
          { id: 'rs-banners', label: 'Banners descargables', value: String(banners.length), icon: '🖼️' },
          { id: 'rs-videos', label: 'Videos explicativos', value: String(videos.length), icon: '▶️' },
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