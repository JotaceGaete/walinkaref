'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const weeklyData = [
  { id: 'week-1', week: 'Sem 1', referidos: 2, calificados: 0 },
  { id: 'week-2', week: 'Sem 2', referidos: 5, calificados: 1 },
  { id: 'week-3', week: 'Sem 3', referidos: 3, calificados: 2 },
  { id: 'week-4', week: 'Sem 4', referidos: 7, calificados: 2 },
  { id: 'week-5', week: 'Sem 5', referidos: 4, calificados: 3 },
  { id: 'week-6', week: 'Sem 6', referidos: 6, calificados: 1 },
  { id: 'week-7', week: 'Sem 7', referidos: 3, calificados: 2 },
  { id: 'week-8', week: 'Sem 8', referidos: 4, calificados: 0 },
];

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-card-hover px-4 py-3">
        <p className="text-xs font-600 text-muted-foreground mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={`tooltip-${entry.name}`} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-foreground font-500">{entry.name}:</span>
            <span className="text-xs font-700 text-foreground font-tabular">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReferralBarChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={weeklyData} barGap={4} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.5, radius: 6 }} />
        <Bar dataKey="referidos" name="Referidos" fill="var(--primary)" radius={[4, 4, 0, 0]} opacity={0.8}>
          {weeklyData.map((entry) => (
            <Cell key={`cell-ref-${entry.id}`} fill="var(--primary)" />
          ))}
        </Bar>
        <Bar dataKey="calificados" name="Calificados" fill="var(--accent)" radius={[4, 4, 0, 0]}>
          {weeklyData.map((entry) => (
            <Cell key={`cell-cal-${entry.id}`} fill="var(--accent)" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}