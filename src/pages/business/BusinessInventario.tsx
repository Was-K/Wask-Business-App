import React from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { Warehouse, Search, Filter, ArrowUpDown } from 'lucide-react';

const BusinessInventario: React.FC = () => {
  const inventoryItems = [
    { sku: 'SKU-001', name: 'Aceite Sintético 5W-30', location: 'Almacén A', qty: 145, minQty: 50, status: 'Óptimo' },
    { sku: 'SKU-002', name: 'Filtro de Aire K&N', location: 'Almacén B', qty: 8, minQty: 20, status: 'Bajo' },
    { sku: 'SKU-003', name: 'Pastillas de Freno', location: 'Almacén A', qty: 0, minQty: 15, status: 'Agotado' },
    { sku: 'SKU-004', name: 'Batería AGM 12V', location: 'Almacén C', qty: 32, minQty: 10, status: 'Óptimo' },
    { sku: 'SKU-005', name: 'Kit de Embrague', location: 'Almacén B', qty: 5, minQty: 8, status: 'Bajo' },
    { sku: 'SKU-006', name: 'Amortiguador Sport', location: 'Almacén A', qty: 67, minQty: 20, status: 'Óptimo' },
    { sku: 'SKU-007', name: 'Correa de Distribución', location: 'Almacén C', qty: 23, minQty: 25, status: 'Bajo' },
    { sku: 'SKU-008', name: 'Radiador de Aluminio', location: 'Almacén B', qty: 41, minQty: 15, status: 'Óptimo' },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case 'Óptimo': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25';
      case 'Bajo': return 'bg-amber-500/15 text-amber-400 border-amber-500/25';
      case 'Agotado': return 'bg-red-500/15 text-red-400 border-red-500/25';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const [activeFilter, setActiveFilter] = React.useState('Todos');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredInventory = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    
    if (activeFilter === 'Todos') return true;
    return item.status === activeFilter;
  });

  return (
    <BusinessLayout title="Inventario" subtitle="Control y seguimiento de existencias">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl focus-within:ring-2 focus-within:ring-white/20 transition-all duration-300">
              <Search className="w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o SKU..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white placeholder-white/35 w-48" 
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Filter className="w-4 h-4 text-white/40" />
              </div>
              <select 
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white/70 outline-none appearance-none cursor-pointer hover:bg-white/[0.1] transition-all duration-300"
              >
                <option value="Todos">Todos los Estados</option>
                <option value="Óptimo">Óptimo (En Stock)</option>
                <option value="Bajo">Bajo Stock</option>
                <option value="Agotado">Agotado</option>
              </select>
            </div>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
            + Ajuste de Inventario
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total SKUs', value: inventoryItems.length.toString(), icon: Warehouse },
            { label: 'Stock Bajo', value: inventoryItems.filter(i => i.status === 'Bajo').length.toString(), color: 'text-amber-400' },
            { label: 'Agotados', value: inventoryItems.filter(i => i.status === 'Agotado').length.toString(), color: 'text-red-400' },
          ].map((item, idx) => (
            <div key={idx} className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-5">
              <p className="text-xs text-white/40 mb-1">{item.label}</p>
              <p className={`text-2xl font-bold ${item.color || 'text-white'}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  {['SKU', 'Producto', 'Ubicación', 'Cantidad', 'Mín. Requerido', 'Estado'].map(col => (
                    <th key={col} className="px-6 py-3.5 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                      <button className="flex items-center gap-1 hover:text-white/70 transition-colors">
                        {col} <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.sku} className="group hover:bg-white/[0.03] transition-all duration-300 border-b border-white/[0.05] last:border-b-0">
                    <td className="px-6 py-4 text-sm font-mono text-blue-400/80">{item.sku}</td>
                    <td className="px-6 py-4 text-sm text-white/80 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-white/50">{item.location}</td>
                    <td className="px-6 py-4 text-sm font-bold text-white/90">{item.qty}</td>
                    <td className="px-6 py-4 text-sm text-white/40">{item.minQty}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(item.status)}`}>
                        {item.status}
                      </span>
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

export default BusinessInventario;
