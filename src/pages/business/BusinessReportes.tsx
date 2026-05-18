import React from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';

const BusinessReportes: React.FC = () => {
  const reports = [
    { name: 'Reporte de Ventas Mensual', type: 'Ventas', date: '01 May 2026', size: '2.4 MB', status: 'Listo' },
    { name: 'Análisis de Inventario Q1', type: 'Inventario', date: '28 Apr 2026', size: '1.8 MB', status: 'Listo' },
    { name: 'Rendimiento de Entregas', type: 'Logística', date: '25 Apr 2026', size: '3.1 MB', status: 'Listo' },
    { name: 'Proyección de Demanda', type: 'Análisis', date: '20 Apr 2026', size: '1.2 MB', status: 'Generando' },
    { name: 'Reporte Fiscal Trimestral', type: 'Finanzas', date: '15 Apr 2026', size: '4.5 MB', status: 'Listo' },
  ];

  const kpis = [
    { label: 'Ingresos Promedio', value: '$14,720', sub: 'Mensual', color: 'text-emerald-400', bg: 'bg-emerald-500/12 border-emerald-500/20' },
    { label: 'Crecimiento', value: '+15.3%', sub: 'Interanual', color: 'text-blue-400', bg: 'bg-blue-500/12 border-blue-500/20' },
    { label: 'Margen Bruto', value: '34.2%', sub: 'Este trimestre', color: 'text-violet-400', bg: 'bg-violet-500/12 border-violet-500/20' },
    { label: 'Tasa de Retención', value: '92.8%', sub: 'Clientes activos', color: 'text-cyan-400', bg: 'bg-cyan-500/12 border-cyan-500/20' },
  ];

  return (
    <BusinessLayout title="Reportes" subtitle="Reportes y análisis de tu negocio">
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-5 group hover:border-white/[0.15] transition-all duration-300">
              <div className={`w-9 h-9 rounded-lg ${kpi.bg} border flex items-center justify-center mb-3`}>
                <TrendingUp className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className="text-xs text-white/40 mb-1">{kpi.label}</p>
              <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[11px] text-white/30 mt-1">{kpi.sub}</p>
            </div>
          ))}
        </div>

        {/* Generate Report */}
        <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/12 border border-blue-500/15 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Generar Nuevo Reporte</h3>
                <p className="text-xs text-white/35">Selecciona el tipo y período</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white/70 outline-none appearance-none cursor-pointer">
                <option>Ventas</option>
                <option>Inventario</option>
                <option>Logística</option>
                <option>Finanzas</option>
              </select>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                <Calendar className="w-4 h-4" />
                Generar
              </button>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Reportes Disponibles</h3>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {reports.map((report, idx) => (
              <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white/50" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/80">{report.name}</p>
                    <p className="text-xs text-white/30">{report.type} • {report.date} • {report.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                    report.status === 'Listo' 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' 
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                  }`}>
                    {report.status}
                  </span>
                  {report.status === 'Listo' && (
                    <button className="p-2 hover:bg-blue-500/10 rounded-lg text-white/30 hover:text-blue-400 transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessReportes;
