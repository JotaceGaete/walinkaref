'use client';
import React, { useState } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

type ReferralStatus = 'qualified' | 'progress' | 'pending';

interface Referral {
  id: string;
  userId: string;
  registeredDate: string;
  monthsPaid: number;
  status: ReferralStatus;
  expectedPayout: string | null;
  reward: number;
  country: string;
}

const mockReferrals: Referral[] = [
  { id: 'ref-001', userId: 'usr-91AE', registeredDate: '2026-06-01', monthsPaid: 2, status: 'qualified', expectedPayout: '2026-08-01', reward: 5, country: 'MX' },
  { id: 'ref-002', userId: 'usr-22F1', registeredDate: '2026-06-15', monthsPaid: 1, status: 'progress', expectedPayout: '2026-09-15', reward: 0, country: 'CO' },
  { id: 'ref-003', userId: 'usr-76BC', registeredDate: '2026-07-10', monthsPaid: 0, status: 'pending', expectedPayout: null, reward: 0, country: 'PE' },
  { id: 'ref-004', userId: 'usr-3D4F', registeredDate: '2026-05-20', monthsPaid: 2, status: 'qualified', expectedPayout: '2026-07-20', reward: 5, country: 'MX' },
  { id: 'ref-005', userId: 'usr-B8C2', registeredDate: '2026-07-01', monthsPaid: 1, status: 'progress', expectedPayout: '2026-09-01', reward: 0, country: 'AR' },
  { id: 'ref-006', userId: 'usr-C7D1', registeredDate: '2026-05-05', monthsPaid: 2, status: 'qualified', expectedPayout: '2026-07-05', reward: 5, country: 'CL' },
  { id: 'ref-007', userId: 'usr-F2A8', registeredDate: '2026-07-20', monthsPaid: 0, status: 'pending', expectedPayout: null, reward: 0, country: 'EC' },
  { id: 'ref-008', userId: 'usr-9E3B', registeredDate: '2026-06-28', monthsPaid: 1, status: 'progress', expectedPayout: '2026-08-28', reward: 0, country: 'MX' },
  { id: 'ref-009', userId: 'usr-A1F4', registeredDate: '2026-04-15', monthsPaid: 2, status: 'qualified', expectedPayout: '2026-06-15', reward: 5, country: 'CO' },
  { id: 'ref-010', userId: 'usr-D6C9', registeredDate: '2026-07-25', monthsPaid: 0, status: 'pending', expectedPayout: null, reward: 0, country: 'PE' },
  { id: 'ref-011', userId: 'usr-E5B2', registeredDate: '2026-05-30', monthsPaid: 2, status: 'qualified', expectedPayout: '2026-07-30', reward: 5, country: 'MX' },
  { id: 'ref-012', userId: 'usr-7G4H', registeredDate: '2026-06-10', monthsPaid: 1, status: 'progress', expectedPayout: '2026-08-10', reward: 0, country: 'AR' },
];

const statusConfig: Record<ReferralStatus, { label: string; className: string; progressLabel: string }> = {
  qualified: { label: 'Calificado', className: 'badge-qualified', progressLabel: '2/2 ✓' },
  progress: { label: 'En progreso', className: 'badge-progress', progressLabel: '1/2' },
  pending: { label: 'Pendiente', className: 'badge-pending', progressLabel: '0/2' },
};

const countryFlags: Record<string, string> = {
  MX: '🇲🇽', CO: '🇨🇴', PE: '🇵🇪', AR: '🇦🇷', CL: '🇨🇱', EC: '🇪🇨',
};

export default function ReferralTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ReferralStatus>('all');
  const [sortField, setSortField] = useState<'registeredDate' | 'monthsPaid' | 'status'>('registeredDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = mockReferrals
    .filter((r) => {
      const matchSearch = r.userId.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'registeredDate') cmp = a.registeredDate.localeCompare(b.registeredDate);
      if (sortField === 'monthsPaid') cmp = a.monthsPaid - b.monthsPaid;
      if (sortField === 'status') cmp = a.status.localeCompare(b.status);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const totalPages = Math.ceil(filtered.length / perPage);
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
          <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} referidos totales</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar ID..."
              className="pl-8 pr-3 py-2 text-xs bg-background border border-border rounded-xl w-36 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
            {(['all', 'qualified', 'progress', 'pending'] as const).map((s) => (
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                ID usuario
              </th>
              <th
                className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => handleSort('registeredDate')}
              >
                <div className="flex items-center gap-1">
                  Registro <SortIcon field="registeredDate" />
                </div>
              </th>
              <th
                className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider cursor-pointer select-none hover:text-foreground transition-colors"
                onClick={() => handleSort('monthsPaid')}
              >
                <div className="flex items-center gap-1">
                  Progreso <SortIcon field="monthsPaid" />
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
              <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                País
              </th>
              <th className="text-left px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                Pago esperado
              </th>
              <th className="text-right px-5 py-3 text-xs font-600 text-muted-foreground uppercase tracking-wider">
                Recompensa
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                  No hay referidos que coincidan con tu búsqueda
                </td>
              </tr>
            ) : (
              paginated.map((ref) => {
                const config = statusConfig[ref.status];
                return (
                  <tr
                    key={ref.id}
                    className="hover:bg-muted/40 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-700 text-foreground font-tabular">
                        {ref.userId}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">
                        {ref.registeredDate}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="progress-track w-20 h-1.5">
                          <div
                            className={ref.status === 'qualified' ? 'progress-fill-green' : 'progress-fill-blue'}
                            style={{ width: `${(ref.monthsPaid / 2) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-700 text-foreground font-tabular">
                          {config.progressLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${config.className}`}>
                        {config.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-base" title={ref.country}>
                        {countryFlags[ref.country] ?? '🌐'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-muted-foreground">
                        {ref.expectedPayout ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {ref.reward > 0 ? (
                        <span className="text-sm font-800 text-accent font-tabular">
                          US${ref.reward}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground font-tabular">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
    </div>
  );
}