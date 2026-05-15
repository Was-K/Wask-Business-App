import React from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';

const BusinessPedidos: React.FC = () => {
  const orders = [
    { id: 'PED-2401', client: 'AutoParts MX', items: 12, total: '$4,580.00', date: '13 May 2026', status: 'Pendiente' },
    { id: 'PED-2402', client: 'Refacciones Pro', items: 5, total: '$1,230.50', date: '12 May 2026', status: 'Procesando' },
    { id: 'PED-2403', client: 'MotoCenter SA', items: 8, total: '$2,890.00', date: '11 May 2026', status: 'Completado' },
    { id: 'PED-2404', client: 'TallerMax', items: 3, total: '$780.25', date: '10 May 2026', status: 'Cancelado' },
    { id: 'PED-2405', client: 'Distribuidora Norte', items: 20, total: '$8,450.00', date: '10 May 2026', status: 'Pendiente' },
    { id: 'PED-2406', client: 'CarService Plus', items: 7, total: '$2,100.75', date: '09 May 2026', status: 'Completado' },
  ];

  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    'Pendiente': { color: 'bg-amber-500/15 text-amber-400 border-amber-500/25', icon: <Clock className="w-3 h-3" /> },
    'Procesando': { color: 'bg-blue-500/15 text-blue-400 border-blue-500/25', icon: <Clock className="w-3 h-3" /> },
    'Completado': { color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', icon: <CheckCircle2 className="w-3 h-3" /> },
    'Cancelado': { color: 'bg-red-500/15 text-red-400 border-red-500/25', icon: <XCircle className="w-3 h-3" /> },
  };

  return (
    <BusinessLayout title="Pedidos" subtitle="Seguimiento y gestión de pedidos">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Pedidos', value: '156', color: 'text-white' },
            { label: 'Pendientes', value: '24', color: 'text-amber-400' },
            { label: 'Procesando', value: '8', color: 'text-blue-400' },
            { label: 'Completados', value: '124', color: 'text-emerald-400' },
          ].map((s, i) => (
            <div key={i} className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-5">
              <p className="text-xs text-white/40 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Pedidos Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {['ID', 'Cliente', 'Artículos', 'Total', 'Fecha', 'Estado', ''].map(col => (
                    <th key={col} className="px-6 py-3.5 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="group hover:bg-white/[0.03] transition-all duration-300 border-b border-white/[0.05] last:border-b-0">
                    <td className="px-6 py-4 text-sm font-mono text-blue-400/80">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-white/80 font-medium">{order.client}</td>
                    <td className="px-6 py-4 text-sm text-white/50">{order.items}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white/85">{order.total}</td>
                    <td className="px-6 py-4 text-sm text-white/40">{order.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[order.status]?.color}`}>
                        {statusConfig[order.status]?.icon}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-blue-500/10 rounded-lg text-white/30 hover:text-blue-400 transition-all duration-300 opacity-0 group-hover:opacity-100">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessPedidos;
