import React from 'react';
import { Play, Clock } from 'lucide-react';

const videos = [
  { id: 'vid-intro', title: 'Mira Walinka en 2 minutos', duration: '2:14', category: 'Introducción', color: 'from-primary to-blue-600' },
  { id: 'vid-catalog', title: 'Cómo crear un catálogo digital', duration: '4:32', category: 'Tutorial', color: 'from-accent to-emerald-600' },
  { id: 'vid-orders', title: 'Cómo recibe un pedido un negocio', duration: '3:18', category: 'Tutorial', color: 'from-indigo-500 to-purple-600' },
  { id: 'vid-whatsapp', title: 'WhatsApp + Walinka: integración completa', duration: '5:07', category: 'Integración', color: 'from-positive to-emerald-700' },
  { id: 'vid-pitch', title: 'Cómo presentar Walinka a un negocio', duration: '6:45', category: 'Para afiliados', color: 'from-warning to-orange-500' },
];

export default function VideoLibrary() {
  return (
    <div className="bg-card shadow-card rounded-2xl border border-border overflow-hidden mb-6">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-700 text-foreground">Biblioteca de videos</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Comparte estos videos o úsalos para entender mejor el producto
        </p>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {videos?.map((video) => (
          <div key={video?.id} className="group flex flex-col gap-3">
            {/* Video thumbnail placeholder */}
            <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${video?.color} aspect-video cursor-pointer group-hover:shadow-card-hover transition-all`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={16} className="text-white fill-white ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-foreground/60 rounded-md px-2 py-0.5">
                <Clock size={10} className="text-white" />
                <span className="text-[10px] text-white font-600">{video?.duration}</span>
              </div>
              <div className="absolute top-2 left-2">
                <span className="text-[9px] font-700 uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-md">
                  {video?.category}
                </span>
              </div>
            </div>
            <p className="text-sm font-600 text-foreground leading-snug">{video?.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}