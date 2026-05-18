import React, { useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { CheckCircle2 } from 'lucide-react';
import { useApiResource } from '../../hooks/useApiResource';
import { businessService } from '../../services/businessService';
import { ENABLE_MOCKS } from '../../services/env';
import type { Business } from '../../types/api';

const MOCK_BUSINESSES: Business[] = [
  { id: 'mock-1', companyName: 'Acme Corp', businessIdentifier: 'NIT-100', industry: 'Logística', approved: false },
  { id: 'mock-2', companyName: 'Delta SA', businessIdentifier: 'NIT-101', industry: 'Tecnología', approved: true },
];

const Solicitudes: React.FC = () => {
  const fetcher = useCallback(() => businessService.getBusinesses(), []);
  const { data, loading, error, refetch } = useApiResource<Business[]>(fetcher);

  const businesses: Business[] =
    data && data.length > 0
      ? data
      : ENABLE_MOCKS
        ? MOCK_BUSINESSES
        : [];

  const isEmpty = !loading && !error && businesses.length === 0;

  const handleApprove = async (id: string) => {
    try {
      await businessService.approveBusiness(id);
      refetch();
    } catch {
      // refetch will surface any error state next time the user retries
    }
  };

  return (
    <AdminLayout
      title="Gestión de Solicitudes"
      subtitle="Administra todas las solicitudes de registro de negocios"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Estado', 'Industria', 'Fecha', 'Identificador'].map((filter, idx) => (
              <div key={idx}>
                <label className="text-sm text-white/60 block mb-2">{filter}</label>
                <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300">
                  <option>Seleccionar...</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={isEmpty}
          emptyMessage="No hay solicitudes pendientes."
          loadingMessage="Cargando solicitudes…"
        >
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-semibold text-white">Solicitudes Recientes</h3>
              <p className="text-sm text-white/50 mt-1">
                {businesses.length} solicitudes registradas
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Identificador</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Industria</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white/70 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {businesses.map((b) => (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors duration-300">
                      <td className="px-6 py-4 text-sm font-semibold text-white/80">{b.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm text-white/70">{b.companyName}</td>
                      <td className="px-6 py-4 text-sm text-white/70">{b.businessIdentifier}</td>
                      <td className="px-6 py-4 text-sm text-white/70">{b.industry ?? '—'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                            b.approved
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }`}
                        >
                          {b.approved ? 'Aprobado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {!b.approved && (
                            <button
                              onClick={() => handleApprove(b.id)}
                              className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs font-semibold flex items-center gap-1 border border-green-500/30 transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Aprobar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AsyncSection>
      </div>
    </AdminLayout>
  );
};

export default Solicitudes;
