import React, { useCallback } from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { useApiResource } from '../../hooks/useApiResource';
import { ordersService } from '../../services/ordersService';
import { ENABLE_MOCKS } from '../../services/env';
import { Clock, CheckCircle2, XCircle, Eye } from 'lucide-react';
import type { Order, OrderStatus } from '../../types/api';

const MOCK_ORDERS: Order[] = [
  { id: 'ord-1', orderNumber: 'PED-001', customerId: 'c1', businessId: 'b1', items: [], status: 'PENDING', grandTotal: 320, createdAt: new Date().toISOString() },
  { id: 'ord-2', orderNumber: 'PED-002', customerId: 'c2', businessId: 'b1', items: [], status: 'PROCESSING', grandTotal: 89, createdAt: new Date().toISOString() },
  { id: 'ord-3', orderNumber: 'PED-003', customerId: 'c3', businessId: 'b1', items: [], status: 'DELIVERED', grandTotal: 450, createdAt: new Date().toISOString() },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Pendiente', color: 'bg-amber-500/15 text-amber-400 border-amber-500/25', icon: <Clock className="w-3 h-3" /> },
  APPROVED: { label: 'Aprobado', color: 'bg-blue-500/15 text-blue-400 border-blue-500/25', icon: <CheckCircle2 className="w-3 h-3" /> },
  PROCESSING: { label: 'Procesando', color: 'bg-blue-500/15 text-blue-400 border-blue-500/25', icon: <Clock className="w-3 h-3" /> },
  SHIPPED: { label: 'Enviado', color: 'bg-violet-500/15 text-violet-400 border-violet-500/25', icon: <Clock className="w-3 h-3" /> },
  DELIVERED: { label: 'Entregado', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', icon: <CheckCircle2 className="w-3 h-3" /> },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-500/15 text-red-400 border-red-500/25', icon: <XCircle className="w-3 h-3" /> },
};

function formatCurrency(val: number | string | undefined): string {
  if (val === undefined || val === null) return '—';
  return `S/ ${Number(val).toLocaleString('es-PE', { maximumFractionDigits: 2 })}`;
}

const BusinessPedidos: React.FC = () => {
  const fetcher = useCallback(() => ordersService.getBusinessOrders(), []);
  const { data, loading, error, refetch } = useApiResource<Order[]>(fetcher);

  const orders: Order[] =
    data && data.length > 0 ? data : ENABLE_MOCKS ? MOCK_ORDERS : [];

  const isEmpty = !loading && !error && orders.length === 0;

  const pending = orders.filter((o) => o.status === 'PENDING').length;
  const processing = orders.filter((o) => o.status === 'PROCESSING').length;
  const delivered = orders.filter((o) => o.status === 'DELIVERED').length;

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    try {
      await ordersService.updateOrderStatus(id, { status });
      refetch();
    } catch {
      // Error handled by refetch state
    }
  };

  return (
    <BusinessLayout title="Pedidos" subtitle="Gestión de pedidos recibidos">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: orders.length, color: 'text-white' },
            { label: 'Pendientes', value: pending, color: 'text-amber-400' },
            { label: 'Procesando', value: processing, color: 'text-blue-400' },
            { label: 'Entregados', value: delivered, color: 'text-emerald-400' },
          ].map((s, i) => (
            <div key={i} className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-5">
              <p className="text-xs text-white/40 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={isEmpty}
          emptyMessage="No has recibido pedidos aún. Los clientes pueden pedirte desde la app móvil."
          loadingMessage="Cargando pedidos…"
        >
          <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Pedidos recientes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    {['Pedido', 'Cliente', 'Ítems', 'Total', 'Fecha', 'Estado', 'Acciones'].map((col) => (
                      <th key={col} className="px-5 py-3.5 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
                    const customerName =
                      order.customer
                        ? `${order.customer.firstName ?? ''} ${order.customer.lastName ?? ''}`.trim() || order.customer.email
                        : order.customerId.slice(0, 8);
                    return (
                      <tr key={order.id} className="group hover:bg-white/[0.03] transition-all border-b border-white/[0.05] last:border-b-0">
                        <td className="px-5 py-4 text-sm font-mono text-blue-400/80">
                          {order.orderNumber ?? order.id.slice(0, 8)}
                        </td>
                        <td className="px-5 py-4 text-sm text-white/80">{customerName}</td>
                        <td className="px-5 py-4 text-sm text-white/50">{order.items.length}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-white/85">
                          {formatCurrency(order.grandTotal)}
                        </td>
                        <td className="px-5 py-4 text-xs text-white/40">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-PE') : '—'}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {order.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold transition-all"
                              >
                                Procesar
                              </button>
                            )}
                            {order.status === 'PROCESSING' && (
                              <button
                                onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                                className="px-3 py-1.5 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/30 rounded-lg text-xs font-semibold transition-all"
                              >
                                Enviar
                              </button>
                            )}
                            <button className="p-2 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-all">
                              <Eye className="w-4 h-4" />
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
    </BusinessLayout>
  );
};

export default BusinessPedidos;
