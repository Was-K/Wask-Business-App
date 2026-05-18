import React, { useCallback } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { Edit, Trash2, Eye } from 'lucide-react';
import { useApiResource } from '../../hooks/useApiResource';
import { productsService } from '../../services/productsService';
import { ENABLE_MOCKS } from '../../services/env';
import type { Product } from '../../types/api';

const MOCK_PRODUCTS: Product[] = [
  { id: 'PROD-001', sku: 'SKU-001', name: 'Server Component Kit', category: 'Hardware', supplierId: 'mock', price: 1299, status: 'ACTIVE', minimumStock: 20 },
  { id: 'PROD-002', sku: 'SKU-002', name: 'Network Switch 48P', category: 'Networking', supplierId: 'mock', price: 2450, status: 'ACTIVE', minimumStock: 20 },
  { id: 'PROD-003', sku: 'SKU-003', name: 'Enterprise SSD 2TB', category: 'Storage', supplierId: 'mock', price: 899, status: 'ARCHIVED', minimumStock: 5 },
];

function statusLabel(status: Product['status']) {
  switch (status) {
    case 'ACTIVE':
      return { label: 'Activo', className: 'bg-green-500/20 text-green-400 border-green-500/30' };
    case 'DRAFT':
      return { label: 'Borrador', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    case 'ARCHIVED':
      return { label: 'Archivado', className: 'bg-red-500/20 text-red-400 border-red-500/30' };
    default:
      return { label: status, className: 'bg-white/10 text-white/60 border-white/20' };
  }
}

function formatPrice(p: number | undefined): string {
  if (p === undefined || p === null) return '—';
  return `$${Number(p).toLocaleString('es-ES', { maximumFractionDigits: 2 })}`;
}

const Productos: React.FC = () => {
  const fetcher = useCallback(() => productsService.getProducts(), []);
  const { data, loading, error, refetch } = useApiResource<Product[]>(fetcher);

  const products: Product[] =
    data && data.length > 0
      ? data
      : ENABLE_MOCKS
        ? MOCK_PRODUCTS
        : [];

  const isEmpty = !loading && !error && products.length === 0;

  return (
    <AdminLayout
      title="Catálogo de Productos"
      subtitle="Gestiona el inventario y especificaciones de productos"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
            + Nuevo Producto
          </button>
        </div>

        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={isEmpty}
          emptyMessage="No hay productos registrados todavía."
          loadingMessage="Cargando productos…"
        >
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">SKU</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">Nombre del Producto</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">Categoría</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">Precio</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">Stock Mínimo</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">Estado</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white/70 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((product) => {
                    const status = statusLabel(product.status);
                    return (
                      <tr key={product.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-white/80">{product.sku}</td>
                        <td className="px-6 py-4 text-sm text-white/70">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-white/70">{product.category}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-white/80">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/70">
                            {product.minimumStock ?? '—'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-red-500/10 rounded-lg transition-all text-white/60 hover:text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
    </AdminLayout>
  );
};

export default Productos;
