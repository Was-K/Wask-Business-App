import React, { useCallback, useState } from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { useApiResource } from '../../hooks/useApiResource';
import { inventoryService } from '../../services/inventoryService';
import { ENABLE_MOCKS } from '../../services/env';
import { Warehouse, Search, Filter, Plus, X, AlertCircle } from 'lucide-react';
import type { InventoryItem } from '../../types/api';

const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'i1', productId: 'p1', warehouseId: 'w1', availableStock: 145, reservedStock: 5, minimumStock: 20, product: { id: 'p1', sku: 'SKU-001', name: 'Pisco Quebranta 500ml', category: 'Pisco', businessId: 'mock', price: 45, status: 'ACTIVE' }, warehouse: { id: 'w1', name: 'Almacén principal' } },
  { id: 'i2', productId: 'p2', warehouseId: 'w1', availableStock: 8, reservedStock: 0, minimumStock: 20, product: { id: 'p2', sku: 'SKU-002', name: 'Vino Tinto Reserva', category: 'Vino', businessId: 'mock', price: 32, status: 'ACTIVE' }, warehouse: { id: 'w1', name: 'Almacén principal' } },
  { id: 'i3', productId: 'p3', warehouseId: 'w1', availableStock: 0, reservedStock: 0, minimumStock: 10, product: { id: 'p3', sku: 'SKU-003', name: 'Cerveza Artesanal IPA', category: 'Cerveza', businessId: 'mock', price: 12, status: 'ACTIVE' }, warehouse: { id: 'w1', name: 'Almacén principal' } },
];

function stockStatus(item: InventoryItem): { label: string; className: string } {
  if (item.availableStock <= 0) return { label: 'Agotado', className: 'bg-red-500/15 text-red-400 border-red-500/25' };
  if (item.minimumStock && item.availableStock <= item.minimumStock) return { label: 'Stock bajo', className: 'bg-amber-500/15 text-amber-400 border-amber-500/25' };
  return { label: 'Óptimo', className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' };
}

const BusinessInventario: React.FC = () => {
  const fetcher = useCallback(() => inventoryService.getMyInventory(), []);
  const { data, loading, error, refetch } = useApiResource<InventoryItem[]>(fetcher);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseCode, setWarehouseCode] = useState('');
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [warehouseError, setWarehouseError] = useState<string | null>(null);

  const inventory: InventoryItem[] =
    data && data.length > 0 ? data : ENABLE_MOCKS ? MOCK_INVENTORY : [];

  const isEmpty = !loading && !error && inventory.length === 0;

  const filtered = inventory.filter((item) => {
    const name = item.product?.name ?? '';
    const sku = item.product?.sku ?? '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sku.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'Todos') return true;
    return stockStatus(item).label === activeFilter;
  });

  const handleCreateWarehouse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWarehouseError(null);
    setWarehouseLoading(true);
    try {
      await inventoryService.createWarehouse({ name: warehouseName, code: warehouseCode });
      setShowWarehouseModal(false);
      setWarehouseName('');
      setWarehouseCode('');
      refetch();
    } catch (err) {
      setWarehouseError(err instanceof Error ? err.message : 'Error al crear almacén');
    } finally {
      setWarehouseLoading(false);
    }
  };

  return (
    <BusinessLayout title="Inventario" subtitle="Control de existencias de tu negocio">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl focus-within:ring-2 focus-within:ring-white/20 transition-all">
              <Search className="w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Buscar por nombre o SKU…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white placeholder-white/35 w-48"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white/70 outline-none appearance-none cursor-pointer hover:bg-white/[0.1] transition-all"
              >
                <option value="Todos">Todos</option>
                <option value="Óptimo">Óptimo</option>
                <option value="Stock bajo">Stock bajo</option>
                <option value="Agotado">Agotado</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowWarehouseModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Crear almacén
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total SKUs', value: inventory.length, icon: Warehouse },
            { label: 'Stock bajo', value: inventory.filter((i) => stockStatus(i).label === 'Stock bajo').length, color: 'text-amber-400' },
            { label: 'Agotados', value: inventory.filter((i) => stockStatus(i).label === 'Agotado').length, color: 'text-red-400' },
          ].map((card, idx) => (
            <div key={idx} className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-5">
              <p className="text-xs text-white/40 mb-1">{card.label}</p>
              <p className={`text-2xl font-bold ${card.color ?? 'text-white'}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={isEmpty}
          emptyMessage="No hay ítems de inventario. Crea un almacén y agrega productos."
          loadingMessage="Cargando inventario…"
        >
          <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    {['SKU', 'Producto', 'Almacén', 'Disponible', 'Reservado', 'Mínimo', 'Estado'].map((col) => (
                      <th key={col} className="px-5 py-3.5 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const status = stockStatus(item);
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.03] transition-all border-b border-white/[0.05] last:border-b-0">
                        <td className="px-5 py-4 text-sm font-mono text-blue-400/80">{item.product?.sku ?? '—'}</td>
                        <td className="px-5 py-4 text-sm font-medium text-white/80">{item.product?.name ?? '—'}</td>
                        <td className="px-5 py-4 text-sm text-white/50">{item.warehouse?.name ?? '—'}</td>
                        <td className="px-5 py-4 text-sm font-bold text-white/90">{item.availableStock}</td>
                        <td className="px-5 py-4 text-sm text-white/40">{item.reservedStock ?? 0}</td>
                        <td className="px-5 py-4 text-sm text-white/40">{item.minimumStock ?? '—'}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </AsyncSection>
      </div>

      {/* Warehouse modal */}
      {showWarehouseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-semibold text-white">Crear almacén</h3>
              <button onClick={() => setShowWarehouseModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {warehouseError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 mb-4">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs">{warehouseError}</p>
              </div>
            )}
            <form onSubmit={handleCreateWarehouse} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Nombre *</label>
                <input
                  value={warehouseName}
                  onChange={(e) => setWarehouseName(e.target.value)}
                  placeholder="Almacén principal"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Código *</label>
                <input
                  value={warehouseCode}
                  onChange={(e) => setWarehouseCode(e.target.value)}
                  placeholder="MAIN"
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowWarehouseModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white transition-all text-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={warehouseLoading}
                  className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all disabled:opacity-50">
                  {warehouseLoading ? 'Creando…' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BusinessLayout>
  );
};

export default BusinessInventario;
