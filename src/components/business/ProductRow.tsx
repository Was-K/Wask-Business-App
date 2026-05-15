import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: string;
  status: 'En Stock' | 'Bajo Stock' | 'Agotado';
}

interface ProductRowProps {
  product: Product;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  product,
  onEdit,
  onDelete,
  onView,
}) => {
  const statusStyles = {
    'En Stock': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    'Bajo Stock': 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    'Agotado': 'bg-red-500/15 text-red-400 border-red-500/25',
  };

  const stockColor =
    product.stock > 20
      ? 'text-emerald-400'
      : product.stock > 5
      ? 'text-amber-400'
      : 'text-red-400';

  return (
    <tr className="group hover:bg-white/[0.03] transition-all duration-300 border-b border-white/[0.05] last:border-b-0">
      {/* Product Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-blue-400">
              {product.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors duration-300">
              {product.name}
            </p>
            <p className="text-xs text-white/35">{product.id}</p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4">
        <span className="px-2.5 py-1 bg-white/[0.06] border border-white/[0.08] rounded-lg text-xs font-medium text-white/60">
          {product.category}
        </span>
      </td>

      {/* Stock */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${stockColor}`}>{product.stock}</span>
          <span className="text-xs text-white/30">uds</span>
        </div>
      </td>

      {/* Price */}
      <td className="px-6 py-4">
        <span className="text-sm font-semibold text-white/85">{product.price}</span>
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            statusStyles[product.status]
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              product.status === 'En Stock'
                ? 'bg-emerald-400'
                : product.status === 'Bajo Stock'
                ? 'bg-amber-400'
                : 'bg-red-400'
            }`}
          />
          {product.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onView?.(product.id)}
            className="p-2 hover:bg-blue-500/10 rounded-lg transition-all duration-300 text-white/40 hover:text-blue-400"
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit?.(product.id)}
            className="p-2 hover:bg-white/[0.08] rounded-lg transition-all duration-300 text-white/40 hover:text-white"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete?.(product.id)}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-all duration-300 text-white/40 hover:text-red-400"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
