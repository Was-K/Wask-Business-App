import React from 'react';
import { ProductRow } from './ProductRow';
import type { Product } from './ProductRow';
import { Package, Search } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onView,
}) => {
  const columns = [
    { key: 'name', label: 'Producto', align: 'left' as const },
    { key: 'category', label: 'Categoría', align: 'left' as const },
    { key: 'stock', label: 'Stock', align: 'left' as const },
    { key: 'price', label: 'Precio', align: 'left' as const },
    { key: 'status', label: 'Estado', align: 'left' as const },
    { key: 'actions', label: 'Acciones', align: 'center' as const },
  ];

  const [activeFilter, setActiveFilter] = React.useState('Todos');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'Todos') return true;
    return product.status === activeFilter;
  });

  return (
    <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
      {/* Table Header Bar */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/12 border border-blue-500/15 flex items-center justify-center">
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Inventario de Productos</h3>
            <p className="text-xs text-white/35">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} registrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Table filter pills */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.06] border border-white/[0.1] rounded-lg focus-within:ring-2 focus-within:ring-white/20 transition-all mr-2">
            <Search className="w-3.5 h-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white placeholder-white/40 w-32"
            />
          </div>
          {['Todos', 'En Stock', 'Bajo Stock', 'Agotado'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.06]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-3.5 text-${col.align} text-[11px] font-semibold text-white/40 uppercase tracking-wider`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 border-t border-white/[0.06] flex items-center justify-between">
        <p className="text-xs text-white/30">
          Mostrando {filteredProducts.length} de {products.length} productos
        </p>
        <div className="flex items-center gap-1.5">
          <button className="px-3 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.1] transition-all duration-300">
            ← Anterior
          </button>
          <button className="px-3 py-1.5 bg-blue-500/15 border border-blue-500/20 rounded-lg text-xs text-blue-400 font-medium">
            1
          </button>
          <button className="px-3 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.1] transition-all duration-300">
            Siguiente →
          </button>
        </div>
      </div>
    </div>
  );
};
