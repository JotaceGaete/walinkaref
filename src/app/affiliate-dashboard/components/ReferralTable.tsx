'use client';
import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import type { ReferralListItem } from '@/services/referralService';

type DerivedStatus = 'qualified' | 'progress' | 'new';

interface ReferralTableProps {
  referrals: ReferralListItem[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  requiredPaidMonths: number;
}

function deriveStatus(referral: ReferralListItem): DerivedStatus {
  if (referral.qualified) return 'qualified';
  if (referral.paidMonths > 0) return 'progress';
  return 'new';
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

const statusConfig: Record<DerivedStatus, { label: string; className: string }> = {
  qualified: { label: 'Calificado', className: 'badge-qualified' },
  progress: { label: 'En progreso', className: 'badge-progress' },
  new: { label: 'Nuevo', className: 'badge-pending' },
};

export default function ReferralTable({
  referrals,
  loading,
  error,
  onRetry,
  requiredPaidMonths,
}: ReferralTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DerivedStatus>('all');
  const [sortField, setSortField] = useState<'createdAt' | 'paidMonths' | 'status'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = referrals
    .filter((r) => {
      const matchSearch = r.publicLabel.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || deriveStatus(r) === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt);
      if (sortField === 'paidMonths') cmp = a.paidMonths - b.paidMonths;
      if (sortField === 'status') cmp = deriveStatus(a).localeCompare(deriveStatus(b));
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field)
      return <ChevronUp size={12} className="text-muted-foreground opacity-30" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="text-primary" />
    ) : (
      <ChevronDown size={12} className="text-primary" />
    );
  };

  return (
    <div className="bg-card shadow-card rounded-2xl border border-border overflow-hidden">
      {/* Table header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border">
        <div>
          <h3 className="text-base font-700 text-foreground">Mis referidos</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {loading ? 'Cargando…' : `${filtered.length} referidos totales`}
          </p>
        </div>
        {!error && (
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Buscar usuario..."
                className="pl-8 pr-3 py-2 text-xs bg-background border border-border rounded-xl w-36 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            {/* Status filter */}
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              {(['all', 'qualified', 'progress', 'new'] as const).map((s) => (
                <button
                  key={`filter-${s}`}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-600 rounded-lg transition-all ${
                    statusFilter === s
                      ? 'bg-card shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s === 'all' ? 'Todos' : statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error ? (
        <div className="flex items-center gap-3 p-6">
          <AlertTriangle size={16} className="text-muted-foreground shrink-0" />
          <p className="flex-1 text-sm text-muted-foreground">No pudimos cargar tus referidos.</p>
          <button
            type="button"
            onClick={onRetry}
            className="text-sm font-600 text-primary hover:underline shrink-0"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                    Usuario
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      Se unió <SortIcon field="createdAt" />
                    </div>
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors"
                    onClick={() => handleSort('paidMonths')}
                  >
                    <div className="flex items-center gap-1">
                      Progreso <SortIcon field="paidMonths" />
                    </div>
                  </th>
                  <th
                    className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Estado <SortIcon field="status" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  Array.from({ length: 5 }, (_, i) => (
                    <tr key={`skeleton-${i}`}>
                      <td className="px-5 py-3.5" colSpan={4}>
                        <div className="h-4 w-full max-w-xs rounded bg-muted animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : referrals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-sm text-muted-foreground">
                      Todavía no tienes referidos. Comparte tu enlace para empezar.
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-sm text-muted-foreground">
                      No hay referidos que coincidan con tu búsqueda
                    </td>
                  </tr>
                ) : (
                  paginated.map((r, idx) => {
                    const status = deriveStatus(r);
                    const config = statusConfig[status];
                    return (
                      <tr
                        key={`${r.publicLabel}-${idx}`}
                        className="hover:bg-muted/40 transition-colors group"
                      >
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-700 text-foreground font-tabular">
                            {r.publicLabel}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(r.createdAt)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="progress-track w-20 h-1.5">
                              <div
                                className={status === 'qualified' ? 'progress-fill-green' : 'progress-fill-blue'}
                                style={{
                                  width: `${Math.min(100, (r.paidMonths / requiredPaidMonths) * 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-700 text-foreground font-tabular">
                              {r.paidMonths}/{requiredPaidMonths}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`badge ${config.className}`}>{config.label}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-border bg-muted/20">
              <p className="text-xs text-muted-foreground">
                Mostrando {Math.min((page - 1) * perPage + 1, filtered.length)}–
                {Math.min(page * perPage, filtered.length)} de {filtered.length} referidos
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} className="text-foreground" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={`page-${p}`}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs font-600 rounded-lg transition-all ${
                      page === p
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} className="text-foreground" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
