import React, { useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { useApiResource } from '../../hooks/useApiResource';
import { analyticsService } from '../../services/analyticsService';

interface AnalyticsBundle {
  summary: unknown;
  orders: unknown;
  inventory: unknown;
}

function renderJsonBlock(value: unknown): string {
  if (value === null || value === undefined) return '—';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

const Reportes: React.FC = () => {
  const fetcher = useCallback(async (): Promise<AnalyticsBundle> => {
    const [summary, orders, inventory] = await Promise.allSettled([
      analyticsService.getAnalyticsSummary(),
      analyticsService.getOrderAnalytics(),
      analyticsService.getInventoryAnalytics(),
    ]);
    const result: AnalyticsBundle = {
      summary: summary.status === 'fulfilled' ? summary.value : null,
      orders: orders.status === 'fulfilled' ? orders.value : null,
      inventory: inventory.status === 'fulfilled' ? inventory.value : null,
    };
    if (!result.summary && !result.orders && !result.inventory) {
      const reason =
        summary.status === 'rejected' ? summary.reason :
        orders.status === 'rejected' ? orders.reason :
        inventory.status === 'rejected' ? inventory.reason : null;
      throw reason instanceof Error ? reason : new Error('No se pudieron cargar las analíticas');
    }
    return result;
  }, []);

  const { data, loading, error, refetch } = useApiResource<AnalyticsBundle>(fetcher);

  return (
    <AdminLayout
      title="Reportes y Análisis"
      subtitle="Datos analíticos desde el backend"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <button
            onClick={refetch}
            className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            Recargar Reportes
          </button>
        </div>

        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingMessage="Cargando reportes…"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { title: 'Resumen General', payload: data?.summary },
              { title: 'Órdenes', payload: data?.orders },
              { title: 'Inventario', payload: data?.inventory },
            ].map((section) => (
              <div
                key={section.title}
                className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
                {section.payload ? (
                  <pre className="text-xs text-white/70 bg-black/50 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
                    {renderJsonBlock(section.payload)}
                  </pre>
                ) : (
                  <p className="text-sm text-white/50">
                    Datos no disponibles desde API todavía.
                  </p>
                )}
              </div>
            ))}
          </div>
        </AsyncSection>
      </div>
    </AdminLayout>
  );
};

export default Reportes;
