import React from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const BusinessVentas: React.FC = () => {
  const salesData = [
    { month: 'Enero', revenue: '$12,340', orders: 45, avg: '$274.22', growth: '+8.2%', up: true },
    { month: 'Febrero', revenue: '$14,890', orders: 52, avg: '$286.35', growth: '+20.7%', up: true },
    { month: 'Marzo', revenue: '$11,200', orders: 38, avg: '$294.74', growth: '-24.8%', up: false },
    { month: 'Abril', revenue: '$16,750', orders: 61, avg: '$274.59', growth: '+49.6%', up: true },
    { month: 'Mayo', revenue: '$18,420', orders: 67, avg: '$274.93', growth: '+10.0%', up: true },
  ];

  const topProducts = [
    { name: 'Aceite Sintético 5W-30', units: 234, revenue: '$10,057' },
    { name: 'Batería AGM 12V', units: 89, revenue: '$16,465' },
    { name: 'Kit de Embrague', units: 45, revenue: '$14,400' },
    { name: 'Filtro de Aire K&N', units: 178, revenue: '$12,015' },
    { name: 'Amortiguador Sport', units: 67, revenue: '$10,502' },
  ];

  return (
    <BusinessLayout title="Ventas" subtitle="Análisis de ventas y rendimiento comercial">
      <div className="space-y-6">
        {/* Revenue Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/12 border border-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-white/40">Ingresos Totales</p>
            </div>
            <p className="text-3xl font-bold text-white">$73,600</p>
            <p className="text-xs text-emerald-400 mt-1">+15.3% vs año anterior</p>
          </div>
          <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/12 border border-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-xs text-white/40">Pedidos Completados</p>
            </div>
            <p className="text-3xl font-bold text-white">263</p>
            <p className="text-xs text-blue-400 mt-1">67 este mes</p>
          </div>
          <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/12 border border-violet-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-xs text-white/40">Ticket Promedio</p>
            </div>
            <p className="text-3xl font-bold text-white">$279.85</p>
            <p className="text-xs text-violet-400 mt-1">+2.1% vs mes anterior</p>
          </div>
        </div>

        {/* Monthly Sales Table */}
        <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Ventas Mensuales</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {['Mes', 'Ingresos', 'Pedidos', 'Ticket Promedio', 'Crecimiento'].map(col => (
                    <th key={col} className="px-6 py-3.5 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesData.map(row => (
                  <tr key={row.month} className="hover:bg-white/[0.03] transition-all duration-300 border-b border-white/[0.05] last:border-b-0">
                    <td className="px-6 py-4 text-sm font-medium text-white/80">{row.month}</td>
                    <td className="px-6 py-4 text-sm font-bold text-white">{row.revenue}</td>
                    <td className="px-6 py-4 text-sm text-white/50">{row.orders}</td>
                    <td className="px-6 py-4 text-sm text-white/60">{row.avg}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-sm font-semibold ${row.up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {row.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {row.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Productos Más Vendidos</h3>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] transition-all duration-300">
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-lg bg-blue-500/12 border border-blue-500/15 flex items-center justify-center text-xs font-bold text-blue-400">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-medium text-white/80">{product.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-white/40">{product.units} uds</span>
                  <span className="text-sm font-bold text-emerald-400">{product.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessVentas;
