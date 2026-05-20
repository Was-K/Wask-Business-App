import React, { useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { CheckCircle2, Clock } from 'lucide-react';
import { useApiResource } from '../../hooks/useApiResource';
import { businessService } from '../../services/businessService';
import { ENABLE_MOCKS } from '../../services/env';
import type { Business } from '../../types/api';

const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    companyName: 'Licorería El Pisco Sour',
    businessIdentifier: 'RUC-20100001',
    industry: 'Licorería',
    address: 'Miraflores, Lima',
    phone: '+51 987 000 001',
    verificationStatus: 'VERIFIED',
  },
  {
    id: '2',
    companyName: 'Bodega Las Viñas',
    businessIdentifier: 'RUC-20100002',
    industry: 'Bodega',
    address: 'San Isidro, Lima',
    verificationStatus: 'PENDING',
  },
];

const Proveedores: React.FC = () => {
  const fetcher = useCallback(() => businessService.getBusinesses(), []);
  const { data, loading, error, refetch } = useApiResource<Business[]>(fetcher);

  const businesses: Business[] =
    data && data.length > 0 ? data : ENABLE_MOCKS ? MOCK_BUSINESSES : [];

  const isEmpty = !loading && !error && businesses.length === 0;

  return (
    <AdminLayout
      title="Negocios registrados"
      subtitle="Licorerías, bodegas y tiendas activas en la plataforma"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <span className="text-sm text-white/40">
            {businesses.length} negocio{businesses.length !== 1 ? 's' : ''} registrado{businesses.length !== 1 ? 's' : ''}
          </span>
        </div>

        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={isEmpty}
          emptyMessage="No hay negocios registrados todavía."
          loadingMessage="Cargando negocios…"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((b) => {
              const verified = b.verificationStatus === 'VERIFIED';
              return (
                <div
                  key={b.id}
                  className="group bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{b.companyName}</h3>
                      <p className="text-xs text-white/50 mt-1 font-mono">{b.businessIdentifier}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${
                        verified
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {verified ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {verified ? 'Verificado' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-4 pb-4 border-b border-white/10 text-sm text-white/60">
                    {b.industry && <p>🏪 {b.industry}</p>}
                    {b.address && <p>📍 {b.address}</p>}
                    {b.phone && <p>📞 {b.phone}</p>}
                    {!b.industry && !b.address && !b.phone && (
                      <p className="text-white/40 italic text-xs">Sin datos adicionales</p>
                    )}
                  </div>

                  <button className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm transition-all duration-300">
                    Ver detalle
                  </button>
                </div>
              );
            })}
          </div>
        </AsyncSection>
      </div>
    </AdminLayout>
  );
};

export default Proveedores;
