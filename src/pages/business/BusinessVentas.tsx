import React, { useCallback } from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { useApiResource } from '../../hooks/useApiResource';
import { analyticsService } from '../../services/analyticsService';
import { ENABLE_MOCKS } from '../../services/env';
import { DollarSign, TrendingUp } from 'lucide-react';

interface SalesSummary {
  totalRevenue?: number;
  completedOrders?: number;
  averageTicket?: number;
  [key: string]: unknown;
}

interface MonthlySale {
  month?: string;
  revenue?: number;
  orders?: number;
  averageTicket?: number;
  [key: string]: unknown;
}

interface TopProduct {
  name?: string;
  units?: number;
  revenue?: number;
  [key: string]: unknown;
}

const BusinessVentas: React.FC = () => {
  const fetchAnalytics = useCallback(async () => {
    const [summary, orders] = await Promise.allSettled([
      analyticsService.getAnalyticsSummary(),
      analyticsService.getOrderAnalytics(),
    ]);
    return {
      summary: summary.status === 'fulfilled' ? (summary.value as SalesSummary) : null,
      orders: orders.status === 'fulfilled' ? orders.value : null,
    };
  }, []);

  const { data, loading, error, refetch } = useApiResource(fetchAnalytics);

  const s = data?.summary ?? null;
  const ordersData = data?.orders as { monthly?: MonthlySale[]; topProducts?: TopProduct[] } | null;

  const isEmpty = !loading && !error && !s;

  function formatCurrency(val: number | undefined) {
    if (val === undefined || val === null) return '—';
    return `S/ ${Number(val).toLocaleString('es-PE', { maximumFractionDigits: 2 })}`;
  }

  return (
    <BusinessLayout title="Ventas" subtitle="Análisis de ventas y rendimiento comercial">
      <AsyncSection
        loading={loading}
        error={error}
        onRetry={refetch}
        isEmpty={isEmpty && !ENABLE_MOCKS}
        emptyMessage="No hay datos de ventas disponibles aún."
        loadingMessage="Cargando métricas de ventas…"
      >
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/12 border border-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs text-white/40">Ingresos Totales</p>
              </div>
              <p className="text-3xl font-bold text-white">{formatCurrency(s?.totalRevenue as number | undefined)}</p>
            </div>
            <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/12 border border-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-xs text-white/40">Pedidos Completados</p>
              </div>
              <p className="text-3xl font-bold text-white">
                {s?.completedOrders !== undefined ? String(s.completedOrders) : '—'}
              </p>
            </div>
            <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/12 border border-violet-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-violet-400" />
                </div>
                <p className="text-xs text-white/40">Ticket Promedio</p>
              </div>
              <p className="text-3xl font-bold text-white">{formatCurrency(s?.averageTicket as number | undefined)}</p>
            </div>
          </div>

          {/* Monthly table */}
          {ordersData?.monthly && ordersData.monthly.length > 0 ? (
            <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white">Ventas Mensuales</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                      {['Mes', 'Ingresos', 'Pedidos', 'Ticket Promedio'].map((col) => (
                        <th key={col} className="px-6 py-3.5 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ordersData.monthly.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.03] transition-all border-b border-white/[0.05] last:border-b-0">
                        <td className="px-6 py-4 text-sm font-medium text-white/80">{row.month ?? `Mes ${idx + 1}`}</td>
                        <td className="px-6 py-4 text-sm font-bold text-white">{formatCurrency(row.revenue)}</td>
                        <td className="px-6 py-4 text-sm text-white/50">{row.orders ?? '—'}</td>
                        <td className="px-6 py-4 text-sm text-white/60">{formatCurrency(row.averageTicket)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 text-center text-white/40 text-sm">
              Datos de ventas mensuales aún no disponibles.
            </div>
          )}

          {/* Top products */}
          {ordersData?.topProducts && ordersData.topProducts.length > 0 && (
            <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white">Productos Más Vendidos</h3>
              </div>
              <div className="divide-y divide-white/[0.05]">
                {ordersData.topProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-all">
                    <div className="flex items-center gap-4">
                      <span className="w-7 h-7 rounded-lg bg-blue-500/12 border border-blue-500/15 flex items-center justify-center text-xs font-bold text-blue-400">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-white/80">{product.name ?? '—'}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-xs text-white/40">{product.units ?? 0} uds</span>
                      <span className="text-sm font-bold text-emerald-400">{formatCurrency(product.revenue as number | undefined)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AsyncSection>
    </BusinessLayout>
  );
};

export default BusinessVentas;
