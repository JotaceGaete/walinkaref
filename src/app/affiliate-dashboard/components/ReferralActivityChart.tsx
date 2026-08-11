'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const ReferralBarChart = dynamic(() => import('./ReferralBarChart'), { ssr: false });

export default function ReferralActivityChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
      <div className="lg:col-span-2 bg-card shadow-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-700 text-foreground">Actividad semanal</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Referidos registrados por semana</p>
          </div>
          <select className="text-xs font-600 text-muted-foreground bg-muted border border-border rounded-lg px-3 py-1.5 outline-none cursor-pointer">
            <option>Últimas 8 semanas</option>
            <option>Últimas 12 semanas</option>
          </select>
        </div>
        <ReferralBarChart />
      </div>
      <div className="bg-card shadow-card rounded-2xl border border-border p-6 flex flex-col">
        <h3 className="text-base font-700 text-foreground mb-1">Tasa de calificación</h3>
        <p className="text-xs text-muted-foreground mb-6">De referidos a clientes calificados</p>

        <div className="flex-1 flex flex-col justify-center gap-5">
          {[
            { id: 'conv-registrados', label: 'Registrados', value: 34, max: 34, color: 'progress-fill-blue' },
            { id: 'conv-progreso', label: 'En progreso (1/2)', value: 9, max: 34, color: 'progress-fill-blue' },
            { id: 'conv-calificados', label: 'Calificados (2/2)', value: 11, max: 34, color: 'progress-fill-green' },
          ]?.map((item) => (
            <div key={item?.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-500 text-foreground">{item?.label}</span>
                <span className="text-sm font-700 text-foreground font-tabular">{item?.value}</span>
              </div>
              <div className="progress-track h-2">
                <div
                  className={item?.color}
                  style={{ width: `${(item?.value / item?.max) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((item?.value / item?.max) * 100)}% del total
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Conversión general</span>
            <span className="text-base font-800 text-accent font-tabular">32.4%</span>
          </div>
        </div>
      </div>
    </div>
  );
}