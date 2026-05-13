import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Star, MapPin, Phone, Mail } from 'lucide-react';

const Proveedores: React.FC = () => {
  const providers = [
    {
      id: 1,
      name: 'TechSupply Corp',
      rating: 4.8,
      location: 'Miami, FL',
      phone: '+1 (555) 123-4567',
      email: 'contact@techsupply.com',
      products: 45,
      status: 'Activo',
    },
    {
      id: 2,
      name: 'Global Industries',
      rating: 4.5,
      location: 'Los Angeles, CA',
      phone: '+1 (555) 234-5678',
      email: 'info@globalindustries.com',
      products: 32,
      status: 'Activo',
    },
    {
      id: 3,
      name: 'Premium Parts Inc',
      rating: 4.9,
      location: 'New York, NY',
      phone: '+1 (555) 345-6789',
      email: 'support@premiumparts.com',
      products: 78,
      status: 'Activo',
    },
  ];

  return (
    <AdminLayout
      title="Gestión de Proveedores"
      subtitle="Administra relaciones con proveedores y catalogo de productos"
    >
      <div className="space-y-6">
        {/* Add Provider Button */}
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg">
            + Nuevo Proveedor
          </button>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="group bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{provider.name}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(provider.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-white/60 ml-2">{provider.rating}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    provider.status === 'Activo'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {provider.status}
                </span>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <MapPin className="w-4 h-4" />
                  {provider.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Phone className="w-4 h-4" />
                  {provider.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Mail className="w-4 h-4" />
                  {provider.email}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-white/50 mb-2">Productos en catálogo</p>
                <p className="text-2xl font-bold text-white">{provider.products}</p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-300">
                  Ver Perfil
                </button>
                <button className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-medium transition-all duration-300">
                  Productos
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Proveedores;
