import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, AlertTriangle, DollarSign, Package, Clock } from 'lucide-react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { StatsCard } from '../../components/business/StatsCard';
import { AsyncSection } from '../../components/AsyncSection';
import { useApiResource } from '../../hooks/useApiResource';
import { dashboardService } from '../../services/dashboardService';
import { productsService } from '../../services/productsService';
import { ENABLE_MOCKS } from '../../services/env';
import type { DashboardSummary, Product } from '../../types/api';

function formatCurrency(val: number | undefined): string {
  if (val === undefined || val === null) return '—';
  return `S/ ${Number(val).toLocaleString('es-PE', { maximumFractionDigits: 2 })}`;
}

function approvalBadge(status?: string) {
  switch (status) {
    case 'APPROVED': return 'bg-green-500/15 text-green-400 border-green-500/25';
    case 'REJECTED': return 'bg-red-500/15 text-red-400 border-red-500/25';
    default: return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25';
  }
}
function approvalLabel(status?: string) {
  switch (status) {
    case 'APPROVED': return 'Aprobado';
    case 'REJECTED': return 'Rechazado';
    default: return 'Pendiente';
  }
}

const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    const [summary, products] = await Promise.allSettled([
      dashboardService.getDashboardSummary(),
      productsService.getProducts({ pageSize: 6 }),
    ]);
    return {
      summary: summary.status === 'fulfilled' ? summary.value : null,
      products: products.status === 'fulfilled' ? products.value : [],
    };
  }, []);

  const { data, loading, error, refetch } = useApiResource(fetchDashboard);

  const summary: DashboardSummary | null = data?.summary ?? null;
  const products: Product[] = data?.products ?? [];

  const isEmpty = !loading && !error && products.length === 0;

  const MOCK_SUMMARY: DashboardSummary = ENABLE_MOCKS && !summary
    ? { totalOrders: 0, pendingOrders: 0, totalProducts: 0, lowStockItems: 0, totalRevenue: 0, productsPendingApproval: 0 }
    : summary ?? {};

  const s = summary ?? (ENABLE_MOCKS ? MOCK_SUMMARY : {});

  return (
    <BusinessLayout
      title="Dashboard"
      subtitle="Resumen de tu negocio en Wask"
    >
      <AsyncSection
        loading={loading}
        error={error}
        onRetry={refetch}
        loadingMessage="Cargando dashboard…"
      >
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <StatsCard
            icon={DollarSign}
            label="Ventas totales"
            value={typeof s.totalRevenue === 'number' ? s.totalRevenue : 0}
            prefix="S/ "
            change={typeof s.totalRevenue === 'number' ? '' : 'Sin datos'}
            changeType="up"
            accentColor="emerald"
          />
          <StatsCard
            icon={ShoppingBag}
            label="Pedidos pendientes"
            value={typeof s.pendingOrders === 'number' ? s.pendingOrders : 0}
            change={typeof s.pendingOrders === 'number' ? '' : 'Sin datos'}
            changeType="neutral"
            accentColor="violet"
          />
          <StatsCard
            icon={Package}
            label="Productos activos"
            value={typeof s.totalProducts === 'number' ? s.totalProducts : 0}
            change={typeof s.totalProducts === 'number' ? '' : 'Sin datos'}
            changeType="neutral"
            accentColor="blue"
          />
          <StatsCard
            icon={Clock}
            label="Pendientes de aprobación"
            value={typeof s.productsPendingApproval === 'number' ? s.productsPendingApproval : 0}
            change={typeof s.productsPendingApproval === 'number' ? '' : 'Sin datos'}
            changeType="neutral"
            accentColor="cyan"
          />
          <StatsCard
            icon={AlertTriangle}
            label="Stock bajo"
            value={typeof s.lowStockItems === 'number' ? s.lowStockItems : 0}
            change={typeof s.lowStockItems === 'number' ? '' : 'Sin datos'}
            changeType="down"
            accentColor="cyan"
          />
        </div>

        {/* Products table */}
        <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Productos recientes</h3>
            <button
              onClick={() => navigate('/business/productos')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ver todos →
            </button>
          </div>

          {isEmpty ? (
            <div className="px-6 py-12 text-center">
              <Package className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40 mb-4">
                Aún no tienes productos registrados.
              </p>
              <button
                onClick={() => navigate('/business/productos')}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-all"
              >
                + Agregar primer producto
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    {['Producto', 'Categoría', 'Precio', 'Estado', 'Aprobación'].map((col) => (
                      <th key={col} className="px-6 py-3.5 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.03] transition-all border-b border-white/[0.05] last:border-b-0">
                      <td className="px-6 py-4 text-sm font-medium text-white/80">{p.name}</td>
                      <td className="px-6 py-4 text-sm text-white/50">{p.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-white/85">{formatCurrency(Number(p.price))}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-white/50">{p.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${approvalBadge(p.approvalStatus)}`}>
                          {approvalLabel(p.approvalStatus)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </AsyncSection>
    </BusinessLayout>
  );
};

export default BusinessDashboard;
