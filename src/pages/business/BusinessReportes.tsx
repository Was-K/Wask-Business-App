import React, { useCallback } from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { useApiResource } from '../../hooks/useApiResource';
import { analyticsService } from '../../services/analyticsService';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ReportKpi {
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}

const BusinessReportes: React.FC = () => {
  const fetcher = useCallback(() => analyticsService.getAnalyticsSummary(), []);
  const { data, loading, error, refetch } = useApiResource(fetcher);

  const kpis: ReportKpi[] = data
    ? [
        { label: 'Ingresos Promedio', value: `S/ ${Number((data as Record<string, unknown>)['averageMonthlyRevenue'] ?? 0).toLocaleString('es-PE')}`, sub: 'Mensual', color: 'text-emerald-400', bg: 'bg-emerald-500/12 border-emerald-500/20' },
        { label: 'Crecimiento', value: `${(data as Record<string, unknown>)['growthRate'] ?? '—'}%`, sub: 'Interanual', color: 'text-blue-400', bg: 'bg-blue-500/12 border-blue-500/20' },
        { label: 'Margen Bruto', value: `${(data as Record<string, unknown>)['grossMargin'] ?? '—'}%`, sub: 'Este trimestre', color: 'text-violet-400', bg: 'bg-violet-500/12 border-violet-500/20' },
        { label: 'Tasa Retención', value: `${(data as Record<string, unknown>)['retentionRate'] ?? '—'}%`, sub: 'Clientes activos', color: 'text-cyan-400', bg: 'bg-cyan-500/12 border-cyan-500/20' },
      ]
    : [];

  const isEmpty = !loading && !error && !data;

  return (
    <BusinessLayout title="Reportes" subtitle="Análisis y métricas de tu negocio">
      <AsyncSection
        loading={loading}
        error={error}
        onRetry={refetch}
        isEmpty={isEmpty}
        emptyMessage="No hay datos de reportes disponibles aún."
        loadingMessage="Cargando reportes…"
      >
        <div className="space-y-6">
          {/* KPI Grid */}
          {kpis.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, idx) => (
                <div key={idx} className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.15] transition-all duration-300">
                  <div className={`w-9 h-9 rounded-lg ${kpi.bg} border flex items-center justify-center mb-3`}>
                    <TrendingUp className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                  <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
                  <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-[11px] text-white/30 mt-1">{kpi.sub}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-8 text-center">
              <BarChart3 className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-sm text-white/40">Métricas de reportes aún no disponibles.</p>
            </div>
          )}

          {/* Generate report — disabled until endpoint exists */}
          <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/12 border border-blue-500/15 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Generar reporte PDF</h3>
                  <p className="text-xs text-white/35">Exporta el historial de tu negocio</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select className="px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white/70 outline-none appearance-none cursor-pointer">
                  <option>Ventas</option>
                  <option>Inventario</option>
                  <option>Pedidos</option>
                </select>
                <button
                  disabled
                  title="Próximamente"
                  className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.06] text-white/30 text-sm font-semibold rounded-xl border border-white/[0.1] cursor-not-allowed"
                >
                  Próximamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </AsyncSection>
    </BusinessLayout>
  );
};

export default BusinessReportes;
