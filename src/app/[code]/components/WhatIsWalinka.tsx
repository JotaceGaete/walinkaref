import React from 'react';
import { Smartphone, ShoppingBag, MessageCircle, Users } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


export default function WhatIsWalinka() {
  return (
    <section id="que-es-walinka" className="py-16 lg:py-20 bg-card border-y border-border">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            {/* Text */}
            <div className="flex-1">
              <p className="text-xs font-600 uppercase tracking-widest mb-3" style={{ color: '#7C3AED' }}>
                ¿Qué es Walinka?
              </p>
              <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-5 leading-tight">
                La plataforma de ventas para pequeños negocios
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                Walinka es una herramienta sencilla que te permite tener un catálogo digital, recibir pedidos organizados por WhatsApp y llevar el registro de tus clientes — todo desde un solo lugar, sin necesitar conocimientos técnicos.
              </p>
              <p className="text-muted-foreground text-base leading-relaxed">
                Más de 2,400 negocios en Latinoamérica ya usan Walinka para vender más fácil y crecer sin complicaciones.
              </p>
            </div>

            {/* Feature pills bento */}
            <div className="flex-1 grid grid-cols-2 gap-3 w-full max-w-sm">
              {[
                { icon: Smartphone, label: 'Catálogo digital', desc: 'Tus productos siempre actualizados', color: 'bg-violet-50 text-violet-600 border-violet-100' },
                { icon: ShoppingBag, label: 'Pedidos organizados', desc: 'Sin caos en WhatsApp', color: 'bg-pink-50 text-pink-600 border-pink-100' },
                { icon: MessageCircle, label: 'WhatsApp nativo', desc: 'Donde ya están tus clientes', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                { icon: Users, label: 'CRM incluido', desc: 'Historial de cada cliente', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
              ]?.map((item, i) => {
                const Icon = item?.icon;
                return (
                  <div key={`ww-${i}`} className={`rounded-2xl border p-4 ${item?.color?.split(' ')?.[0]} ${item?.color?.split(' ')?.[2]}`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${item?.color?.split(' ')?.[0]?.replace('50', '100')}`}>
                      <Icon size={18} className={item?.color?.split(' ')?.[1]} />
                    </div>
                    <p className="text-sm font-700 text-foreground mb-0.5">{item?.label}</p>
                    <p className="text-xs text-muted-foreground">{item?.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
