import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { RequestTable } from '../../components/admin/RequestTable';

const Solicitudes: React.FC = () => {
  return (
    <AdminLayout
      title="Gestión de Solicitudes"
      subtitle="Administra todas las solicitudes de compra y pedidos"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['Estado', 'Proveedor', 'Fecha', 'Rango de Precio'].map((filter, idx) => (
              <div key={idx}>
                <label className="text-sm text-white/60 block mb-2">{filter}</label>
                <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300">
                  <option>Seleccionar...</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Requests Table */}
        <RequestTable />
      </div>
    </AdminLayout>
  );
};

export default Solicitudes;
