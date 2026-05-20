import React, { useCallback, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useApiResource } from '../../hooks/useApiResource';
import { productsService } from '../../services/productsService';
import { ENABLE_MOCKS } from '../../services/env';
import type { Product, ProductApprovalStatus } from '../../types/api';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'PROD-001',
    sku: 'SKU-001',
    name: 'Pisco Quebranta 500ml',
    category: 'Pisco',
    businessId: 'mock-biz',
    price: 45,
    status: 'DRAFT',
    approvalStatus: 'PENDING',
  },
  {
    id: 'PROD-002',
    sku: 'SKU-002',
    name: 'Cerveza Artesanal IPA',
    category: 'Cerveza',
    businessId: 'mock-biz',
    price: 12,
    status: 'ACTIVE',
    approvalStatus: 'APPROVED',
  },
];

const FILTER_OPTIONS: Array<{ label: string; value: ProductApprovalStatus | 'ALL' }> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Pendientes', value: 'PENDING' },
  { label: 'Aprobados', value: 'APPROVED' },
  { label: 'Rechazados', value: 'REJECTED' },
];

function approvalBadge(status?: ProductApprovalStatus) {
  switch (status) {
    case 'APPROVED':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'REJECTED':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  }
}

function approvalLabel(status?: ProductApprovalStatus) {
  switch (status) {
    case 'APPROVED': return 'Aprobado';
    case 'REJECTED': return 'Rechazado';
    default: return 'Pendiente';
  }
}

function formatPrice(p: number | string | undefined): string {
  if (p === undefined || p === null) return '—';
  return `S/ ${Number(p).toLocaleString('es-PE', { maximumFractionDigits: 2 })}`;
}

const Productos: React.FC = () => {
  const [filter, setFilter] = useState<ProductApprovalStatus | 'ALL'>('PENDING');
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetcher = useCallback(
    () => filter === 'PENDING'
      ? productsService.getPendingProducts()
      : productsService.getProducts(filter !== 'ALL' ? { approvalStatus: filter as ProductApprovalStatus } : undefined),
    [filter],
  );

  const { data, loading, error, refetch } = useApiResource<Product[]>(fetcher);

  const products: Product[] =
    data && data.length > 0 ? data : ENABLE_MOCKS ? MOCK_PRODUCTS : [];

  const isEmpty = !loading && !error && products.length === 0;

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await productsService.approveProduct(id);
      refetch();
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await productsService.rejectProduct(rejectTarget, rejectReason || 'No cumple los requisitos del marketplace.');
      setRejectTarget(null);
      setRejectReason('');
      refetch();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Productos por Aprobar"
      subtitle="Revisa y gestiona los productos enviados por los negocios"
    >
      <div className="space-y-6">
        {/* Reject modal */}
        {rejectTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 w-full max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Rechazar producto</h3>
              </div>
              <p className="text-sm text-white/60 mb-4">
                El negocio verá este motivo y podrá corregir el producto.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Motivo del rechazo (opcional)"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm resize-none"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setRejectTarget(null); setRejectReason(''); }}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all text-sm font-semibold disabled:opacity-50"
                >
                  {actionLoading ? 'Rechazando…' : 'Confirmar rechazo'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                filter === opt.value
                  ? 'bg-white text-black border-white'
                  : 'bg-white/[0.06] text-white/60 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={isEmpty}
          emptyMessage="No hay productos en esta categoría."
          loadingMessage="Cargando productos…"
        >
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {['SKU', 'Producto', 'Categoría', 'Precio', 'Negocio', 'Aprobación', 'Acciones'].map((col) => (
                      <th key={col} className="px-5 py-4 text-left text-xs font-semibold text-white/70 uppercase">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 text-sm font-mono text-white/70">{product.sku}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-white/80">{product.name}</p>
                        {product.rejectionReason && (
                          <p className="text-xs text-red-400/70 mt-0.5 max-w-[200px] truncate">
                            {product.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-white/60">{product.category}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-white/80">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-5 py-4 text-sm text-white/60">
                        {product.business?.companyName ?? product.businessId.slice(0, 8)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${approvalBadge(product.approvalStatus)}`}>
                          {approvalLabel(product.approvalStatus)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {product.approvalStatus !== 'APPROVED' && (
                            <button
                              onClick={() => handleApprove(product.id)}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs font-semibold flex items-center gap-1 border border-green-500/30 transition-all disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Aprobar
                            </button>
                          )}
                          {product.approvalStatus !== 'REJECTED' && (
                            <button
                              onClick={() => setRejectTarget(product.id)}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1 border border-red-500/30 transition-all disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Rechazar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
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
