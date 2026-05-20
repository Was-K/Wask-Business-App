import React, { useCallback, useState } from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { useApiResource } from '../../hooks/useApiResource';
import { productsService } from '../../services/productsService';
import { ENABLE_MOCKS } from '../../services/env';
import { Plus, X, AlertCircle } from 'lucide-react';
import type { CreateProductDto, Product } from '../../types/api';

const CATEGORIES = [
  'Cerveza', 'Vino', 'Pisco', 'Ron', 'Whisky',
  'Vodka', 'Tequila', 'Champagne / Espumante', 'Otros',
];

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', sku: 'SKU-001', name: 'Pisco Quebranta 500ml', category: 'Pisco', businessId: 'mock', price: 45, status: 'DRAFT', approvalStatus: 'PENDING' },
  { id: 'p2', sku: 'SKU-002', name: 'Vino Tinto Reserva', category: 'Vino', businessId: 'mock', price: 32, status: 'ACTIVE', approvalStatus: 'APPROVED' },
];

function approvalBadge(status?: string) {
  switch (status) {
    case 'APPROVED': return 'bg-green-500/15 text-green-400 border-green-500/25';
    case 'REJECTED': return 'bg-red-500/15 text-red-400 border-red-500/25';
    default: return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25';
  }
}
function approvalLabel(status?: string) {
  switch (status) {
    case 'APPROVED': return 'Aprobado';
    case 'REJECTED': return 'Rechazado';
    default: return 'Pendiente';
  }
}

const EMPTY_FORM: CreateProductDto = {
  sku: '',
  name: '',
  category: '',
  price: 0,
  description: '',
  barcode: '',
  subcategory: '',
  minimumStock: undefined,
  maximumStock: undefined,
};

const BusinessProductos: React.FC = () => {
  const fetcher = useCallback(() => productsService.getProducts(), []);
  const { data, loading, error, refetch } = useApiResource<Product[]>(fetcher);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateProductDto>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const products: Product[] =
    data && data.length > 0 ? data : ENABLE_MOCKS ? MOCK_PRODUCTS : [];
  const isEmpty = !loading && !error && products.length === 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'minimumStock' || name === 'maximumStock'
          ? value === '' ? undefined : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    try {
      await productsService.createProduct({
        ...form,
        price: Number(form.price),
      });
      setSaveSuccess(true);
      setForm(EMPTY_FORM);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowModal(false);
        refetch();
      }, 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setSaving(false);
    }
  };

  return (
    <BusinessLayout title="Productos" subtitle="Gestión del catálogo de tu negocio">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex justify-end">
          <button
            onClick={() => { setShowModal(true); setSaveError(null); setSaveSuccess(false); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Nuevo producto
          </button>
        </div>

        {/* Products table */}
        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={isEmpty}
          emptyMessage="Aún no tienes productos. Agrega tu primer producto."
          loadingMessage="Cargando productos…"
        >
          <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                    {['SKU', 'Nombre', 'Categoría', 'Precio', 'Estado', 'Aprobación', 'Acciones'].map((col) => (
                      <th key={col} className="px-5 py-3.5 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="group hover:bg-white/[0.03] transition-all border-b border-white/[0.05] last:border-b-0">
                      <td className="px-5 py-4 text-sm font-mono text-blue-400/80">{p.sku}</td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-white/80">{p.name}</p>
                        {p.approvalStatus === 'REJECTED' && p.rejectionReason && (
                          <p className="text-xs text-red-400/70 mt-0.5">{p.rejectionReason}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-white/50">{p.category}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-white/85">
                        S/ {Number(p.price).toLocaleString('es-PE', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4 text-xs text-white/50">{p.status}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${approvalBadge(p.approvalStatus)}`}>
                          {approvalLabel(p.approvalStatus)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white rounded-lg text-xs transition-all">
                            Editar
                          </button>
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

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="text-base font-semibold text-white">Nuevo producto</h3>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {saveError && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs">{saveError}</p>
                </div>
              )}
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  Producto enviado a revisión. El administrador debe aprobarlo antes de que sea visible para los clientes.
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">SKU *</label>
                  <input name="sku" value={form.sku} onChange={handleChange} required
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Código de barras</label>
                  <input name="barcode" value={form.barcode ?? ''} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Nombre del producto *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Categoría *</label>
                  <select name="category" value={form.category} onChange={handleChange} required
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none">
                    <option value="" className="bg-gray-900">Seleccionar…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Subcategoría</label>
                  <input name="subcategory" value={form.subcategory ?? ''} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1">Descripción</label>
                <textarea name="description" value={form.description ?? ''} onChange={handleChange} rows={2}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Precio (S/) *</label>
                  <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Stock mínimo</label>
                  <input name="minimumStock" type="number" min="0" value={form.minimumStock ?? ''} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Stock máximo</label>
                  <input name="maximumStock" type="number" min="0" value={form.maximumStock ?? ''} onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/[0.06] border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white transition-all text-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition-all disabled:opacity-50">
                  {saving ? 'Guardando…' : 'Enviar a revisión'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BusinessLayout>
  );
};

export default BusinessProductos;
