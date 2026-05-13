import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Download, Filter } from 'lucide-react';

const Reportes: React.FC = () => {
  const reports = [
    {
      id: 1,
      name: 'Reporte de Ventas Mensual',
      date: '2024-05-01',
      type: 'Ventas',
      size: '2.4 MB',
      status: 'Completado',
    },
    {
      id: 2,
      name: 'Análisis de Inventario',
      date: '2024-05-05',
      type: 'Inventario',
      size: '1.8 MB',
      status: 'Completado',
    },
    {
      id: 3,
      name: 'Reporte de Proveedores',
      date: '2024-05-10',
      type: 'Proveedores',
      size: '3.2 MB',
      status: 'Completado',
    },
    {
      id: 4,
      name: 'Análisis de Tendencias',
      date: '2024-05-12',
      type: 'Análisis',
      size: '4.1 MB',
      status: 'En Procesamiento',
    },
  ];

  return (
    <AdminLayout
      title="Reportes y Análisis"
      subtitle="Visualiza y descarga reportes generados"
    >
      <div className="space-y-6">
        {/* Filters and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-white/60" />
            <select className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50">
              <option>Todos los Reportes</option>
              <option>Ventas</option>
              <option>Inventario</option>
              <option>Proveedores</option>
            </select>
          </div>
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
            Generar Nuevo Reporte
          </button>
        </div>

        {/* Reports List */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/10">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-6 hover:bg-white/5 transition-colors duration-300 flex items-center justify-between group"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{report.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        report.status === 'Completado'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/50">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{new Date(report.date).toLocaleDateString('es-ES')}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>

                {report.status === 'Completado' && (
                  <button className="ml-4 p-3 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Report Templates */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Plantillas de Reportes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              'Reporte Diario',
              'Reporte Semanal',
              'Reporte Mensual',
              'Reporte Personalizado',
            ].map((template, idx) => (
              <button
                key={idx}
                className="p-6 bg-black/40 border border-white/10 rounded-2xl hover:border-white/20 hover:bg-white/5 transition-all duration-300 text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {['📊', '📈', '📉', '⚙️'][idx]}
                </div>
                <p className="text-sm font-semibold text-white">{template}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reportes;
