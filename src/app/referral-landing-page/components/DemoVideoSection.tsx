import React from 'react';
import { Play, Clock } from 'lucide-react';

export default function DemoVideoSection() {
  return (
    <section id="demo" className="py-16 lg:py-24 bg-card border-y border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-600 uppercase tracking-widest text-primary mb-3">
              Demo
            </p>
            <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
              Mira cómo funciona en 2 minutos
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Sin rodeos. En este video verás cómo un negocio real crea su catálogo, recibe un pedido y lo gestiona desde Walinka.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { id: 'demo-feat-1', text: 'Crear un producto con foto y precio' },
                { id: 'demo-feat-2', text: 'Compartir el catálogo por WhatsApp' },
                { id: 'demo-feat-3', text: 'Recibir y confirmar un pedido' },
                { id: 'demo-feat-4', text: 'Ver el historial del cliente' },
              ]?.map((item) => (
                <div key={item?.id} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                    <Play size={9} className="text-accent fill-accent ml-0.5" />
                  </div>
                  <span className="text-sm text-foreground font-500">{item?.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Video placeholder */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-hero border border-border bg-gradient-to-br from-primary to-blue-800 aspect-video flex items-center justify-center cursor-pointer group">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-white fill-white ml-1" />
                </div>
                <p className="text-white font-600 text-base">Ver demo</p>
                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <Clock size={12} className="text-white/70" />
                  <p className="text-white/70 text-sm">2 minutos</p>
                </div>
              </div>
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
            </div>
            {/* Badge */}
            <div className="absolute -bottom-3 left-6 bg-card shadow-card-hover border border-border rounded-xl px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
              <span className="text-xs font-600 text-foreground">Demo real · No hay edición</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}