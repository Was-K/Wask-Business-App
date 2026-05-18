import React, { useCallback } from 'react';
import { TrendingUp, Users, Package, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { RequestTable } from '../../components/admin/RequestTable';
import { AsyncSection } from '../../components/AsyncSection';
import { useApiResource } from '../../hooks/useApiResource';
import { dashboardService } from '../../services/dashboardService';
import { ENABLE_MOCKS } from '../../services/env';
import type { AdminOverview, DashboardSummary } from '../../types/api';

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
}

function pickNumber(...candidates: Array<unknown>): number | null {
  for (const c of candidates) {
    if (typeof c === 'number' && Number.isFinite(c)) return c;
  }
  return null;
}

function formatNumber(n: number | null, prefix = ''): string {
  if (n === null) return '—';
  return `${prefix}${n.toLocaleString('es-ES')}`;
}

const MOCK_STATS: StatCard[] = [
  { icon: <Package className="w-6 h-6" />, label: 'Solicitudes Totales', value: '1,247', change: '+12.5%', changeType: 'up' },
  { icon: <AlertCircle className="w-6 h-6" />, label: 'Pendientes', value: '48', change: '-3.2%', changeType: 'down' },
  { icon: <Users className="w-6 h-6" />, label: 'Proveedores', value: '89', change: '+5.1%', changeType: 'up' },
  { icon: <TrendingUp className="w-6 h-6" />, label: 'Ingresos (Este Mes)', value: '$45.2K', change: '+8.9%', changeType: 'up' },
];

function buildStats(
  summary: DashboardSummary | null,
  overview: AdminOverview | null,
): StatCard[] {
  return [
    {
      icon: <Package className="w-6 h-6" />,
      label: 'Solicitudes Totales',
      value: formatNumber(pickNumber(summary?.totalOrders, overview?.totalUsers)),
      change: 'API',
      changeType: 'neutral',
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      label: 'Pendientes',
      value: formatNumber(pickNumber(summary?.pendingOrders, overview?.pendingApprovals)),
      change: 'API',
      changeType: 'neutral',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Proveedores',
      value: formatNumber(pickNumber(summary?.totalSuppliers, overview?.totalSuppliers)),
      change: 'API',
      changeType: 'neutral',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Ingresos (Este Mes)',
      value: formatNumber(pickNumber(summary?.totalRevenue), '$'),
      change: 'API',
      changeType: 'neutral',
    },
  ];
}

const Dashboard: React.FC = () => {
  // Fetch both in parallel; if either returns data we render what we have.
  const fetchDashboard = useCallback(async () => {
    const [summary, overview] = await Promise.allSettled([
      dashboardService.getDashboardSummary(),
      dashboardService.getAdminOverview(),
    ]);
    const summaryData = summary.status === 'fulfilled' ? summary.value : null;
    const overviewData = overview.status === 'fulfilled' ? overview.value : null;
    if (!summaryData && !overviewData) {
      const reason =
        summary.status === 'rejected' ? summary.reason : overview.status === 'rejected' ? overview.reason : null;
      throw reason instanceof Error ? reason : new Error('No se pudo cargar el dashboard');
    }
    return { summary: summaryData, overview: overviewData };
  }, []);

  const { data, loading, error, refetch } = useApiResource(fetchDashboard);
  const summaryData = data?.summary ?? null;
  const overviewData = data?.overview ?? null;

  const stats: StatCard[] =
    ENABLE_MOCKS && !summaryData && !overviewData
      ? MOCK_STATS
      : buildStats(summaryData, overviewData);

  const handleRetry = () => {
    refetch();
  };

  const getChangeColor = (changeType: 'up' | 'down' | 'neutral') => {
    switch (changeType) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-white/50';
    }
  };

  return (
    <AdminLayout title="Panel de Control Admin" subtitle="Bienvenido a tu dashboard">
      <AsyncSection
        loading={loading}
        error={error}
        onRetry={handleRetry}
        loadingMessage="Cargando métricas del dashboard…"
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 text-white/70 group-hover:text-white group-hover:bg-white/20 transition-all duration-300">
                  {stat.icon}
                </div>
                <p className="text-sm text-white/60 mb-2">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                <p className={`text-sm font-semibold ${getChangeColor(stat.changeType)}`}>
                  {stat.change === 'API' ? 'Datos desde la API' : `${stat.change} vs mes anterior`}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Requests Section */}
        <div className="mb-8">
          <RequestTable />
        </div>

        {/* Note when data isn't available from API */}
        {!summaryData && !overviewData && !ENABLE_MOCKS && (
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 text-white/60 text-sm">
            Datos no disponibles desde API todavía.
          </div>
        )}
      </AsyncSection>
    </AdminLayout>
  );
};

export default Dashboard;
