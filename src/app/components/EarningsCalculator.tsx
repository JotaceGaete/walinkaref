'use client';
import React, { useState } from 'react';
import { TrendingUp, Users } from 'lucide-react';

const presets = [
  { id: 'preset-5', clients: 5, label: '5 clientes' },
  { id: 'preset-20', clients: 20, label: '20 clientes' },
  { id: 'preset-50', clients: 50, label: '50 clientes' },
];

export default function EarningsCalculator() {
  const [clients, setClients] = useState(10);
  const rewardPerClient = 5;
  const earnings = clients * rewardPerClient;

  return (
    <section id="calculadora" className="py-20 lg:py-28 bg-background">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-600 uppercase tracking-widest text-primary mb-3">
              Calculadora
            </p>
            <h2 className="text-3xl lg:text-4xl font-800 text-foreground mb-4">
              ¿Cuánto podrías ganar?
            </h2>
            <p className="text-muted-foreground text-lg">
              Mueve el control para estimar tu recompensa.{' '}
              <span className="font-600 text-foreground">US$5 por cada cliente calificado</span>{' '}
              (2 meses pagos).
            </p>
          </div>

          <div className="bg-card shadow-card rounded-2xl border border-border p-8 lg:p-10">
            {/* Slider */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-600 text-foreground flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  Clientes calificados
                </label>
                <span className="text-2xl font-800 text-primary font-tabular">{clients}</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={clients}
                onChange={(e) => setClients(Number(e?.target?.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #0F4C81 0%, #0F4C81 ${clients}%, #E2E8F0 ${clients}%, #E2E8F0 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>1</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            {/* Result */}
            <div className="bg-gradient-to-br from-secondary to-background rounded-2xl p-6 border border-primary/10 mb-6 text-center">
              <p className="text-sm font-600 text-muted-foreground mb-2">Tu recompensa estimada</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-800 text-gradient-accent font-tabular">
                  US${earnings}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {clients} clientes × US$5 = US${earnings}
              </p>
            </div>

            {/* Preset buttons */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {presets?.map((preset) => (
                <button
                  key={preset?.id}
                  onClick={() => setClients(preset?.clients)}
                  className={`px-4 py-2 rounded-xl text-sm font-600 transition-all duration-150 ${
                    clients === preset?.clients
                      ? 'bg-primary text-primary-foreground shadow-card'
                      : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-primary'
                  }`}
                >
                  {preset?.label} → US${preset?.clients * rewardPerClient}
                </button>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 bg-muted rounded-xl p-4">
              <TrendingUp size={16} className="text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-600 text-foreground">Estimación referencial.</span>{' '}
                La recompensa se acredita únicamente cuando el cliente referido completa 2 meses de suscripción paga.
                No garantizamos ningún ingreso mínimo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}