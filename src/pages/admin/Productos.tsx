import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Edit, Trash2, Eye } from 'lucide-react';

const Productos: React.FC = () => {
  const products = [
    {
      id: 'PROD-001',
      name: 'Server Component Kit',
      provider: 'TechSupply Corp',
      price: '$1,299',
      stock: 45,
      category: 'Hardware',
      status: 'En Stock',
    },
    {
      id: 'PROD-002',
      name: 'Network Switch 48P',
      provider: 'Global Industries',
      price: '$2,450',
      stock: 12,
      category: 'Networking',
      status: 'Bajo Stock',
    },
    {
      id: 'PROD-003',
      name: 'Enterprise SSD 2TB',
      provider: 'Premium Parts Inc',
      price: '$899',
      stock: 0,
      category: 'Storage',
      status: 'Agotado',
    },
    {
      id: 'PROD-004',
      name: 'Database License Annual',
      provider: 'Digital Solutions',
      price: '$3,999',
      stock: 999,
      category: 'Software',
      status: 'En Stock',
    },
  ];

  return (
    <AdminLayout
      title="Catálogo de Productos"
      subtitle="Gestiona el inventario y especificaciones de productos"
    >
      <div className="space-y-6">
        {/* Add Product Button */}
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
            + Nuevo Producto
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">
                    Nombre del Producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">
                    Proveedor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-white/70 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-white/80">{product.id}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-white/70">{product.provider}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white/80">{product.price}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 20
                            ? 'bg-green-500/20 text-green-400'
                            : product.stock > 5
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {product.stock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          product.status === 'En Stock'
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : product.status === 'Bajo Stock'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                      >
                        {product.status}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Productos;
