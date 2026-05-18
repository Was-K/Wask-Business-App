import React, { useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApiResource } from '../../hooks/useApiResource';
import { suppliersService } from '../../services/suppliersService';
import { ENABLE_MOCKS } from '../../services/env';
import type { Supplier } from '../../types/api';

const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', supplierName: 'TechSupply Corp', businessIdentifier: 'NIT-001', verified: true },
  { id: '2', supplierName: 'Global Industries', businessIdentifier: 'NIT-002', verified: false },
];

function extractContact(supplier: Supplier, key: string): string | undefined {
  const company = supplier.companyData as Record<string, unknown> | undefined;
  if (!company) return undefined;
  const v = company[key];
  return typeof v === 'string' ? v : undefined;
}

const Proveedores: React.FC = () => {
  const fetcher = useCallback(() => suppliersService.getSuppliers(), []);
  const { data, loading, error, refetch } = useApiResource<Supplier[]>(fetcher);

  const suppliers: Supplier[] =
    data && data.length > 0
      ? data
      : ENABLE_MOCKS
        ? MOCK_SUPPLIERS
        : [];

  const isEmpty = !loading && !error && suppliers.length === 0;

  return (
    <AdminLayout
      title="Gestión de Proveedores"
      subtitle="Administra relaciones con proveedores y catalogo de productos"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
            + Nuevo Proveedor
          </button>
        </div>

        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={isEmpty}
          emptyMessage="No hay proveedores registrados todavía."
          loadingMessage="Cargando proveedores…"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => {
              const phone = extractContact(supplier, 'phone');
              const email = extractContact(supplier, 'email');
              const location = extractContact(supplier, 'location');
              const verified = supplier.verified === true;

              return (
                <div
                  key={supplier.id}
                  className="group bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{supplier.supplierName}</h3>
                      <p className="text-xs text-white/50 mt-1">{supplier.businessIdentifier}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        verified
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {verified ? <CheckCircle2 className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                      {verified ? 'Verificado' : 'Pendiente'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b border-white/10 text-sm text-white/70">
                    {location && <p>📍 {location}</p>}
                    {phone && <p>📞 {phone}</p>}
                    {email && <p>✉️ {email}</p>}
                    {!location && !phone && !email && (
                      <p className="text-white/40 italic">Sin datos de contacto disponibles</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-300">
                      Ver Perfil
                    </button>
                    {!verified && (
                      <button
                        onClick={async () => {
                          try {
                            await suppliersService.verifySupplier(supplier.id);
                            refetch();
                          } catch {
                            // Error already surfaced via state on next refetch.
                          }
                        }}
                        className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-medium transition-all duration-300"
                      >
                        Verificar
                      </button>
                    )}
                  </div>
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
