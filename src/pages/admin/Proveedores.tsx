import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Star, MapPin, Phone, Mail, Search, X, Plus } from 'lucide-react';

const Proveedores: React.FC = () => {
  const [providers, setProviders] = useState([
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
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProviderForProfile, setSelectedProviderForProfile] = useState<any>(null);
  const [selectedProviderForProducts, setSelectedProviderForProducts] = useState<any>(null);
  const [newProvider, setNewProvider] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
  });

  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProvider = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = providers.length > 0 ? Math.max(...providers.map(p => p.id)) + 1 : 1;
    setProviders([
      ...providers,
      {
        id: newId,
        ...newProvider,
        rating: 0,
        products: 0,
        status: 'Activo',
      }
    ]);
    setIsAddModalOpen(false);
    setNewProvider({ name: '', location: '', phone: '', email: '' });
  };

  return (
    <AdminLayout
      title="Gestión de Proveedores"
      subtitle="Administra relaciones con proveedores y catálogo de productos"
    >
      <div className="space-y-6 relative">
        {/* Toolbar: Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl focus-within:ring-2 focus-within:ring-white/20 transition-all duration-300 w-full sm:w-80">
            <Search className="w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Buscar proveedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-white/40 w-full"
            />
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Nuevo Proveedor
          </button>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
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
                <button 
                  onClick={() => setSelectedProviderForProfile(provider)}
                  className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Ver Perfil
                </button>
                <button 
                  onClick={() => setSelectedProviderForProducts(provider)}
                  className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-medium transition-all duration-300"
                >
                  Productos
                </button>
              </div>
            </div>
          ))}
          
          {filteredProviders.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-white/50">No se encontraron proveedores que coincidan con la búsqueda.</p>
            </div>
          )}
        </div>

        {/* Add Provider Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Añadir Nuevo Proveedor</h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddProvider} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Nombre de la Empresa</label>
                  <input
                    required
                    type="text"
                    value={newProvider.name}
                    onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Ubicación</label>
                  <input
                    required
                    type="text"
                    value={newProvider.location}
                    onChange={(e) => setNewProvider({ ...newProvider, location: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Teléfono</label>
                  <input
                    required
                    type="tel"
                    value={newProvider.phone}
                    onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1">Correo Electrónico</label>
                  <input
                    required
                    type="email"
                    value={newProvider.email}
                    onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl font-medium text-sm bg-white text-black hover:bg-gray-200 transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {selectedProviderForProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Perfil del Proveedor</h3>
                <button 
                  onClick={() => setSelectedProviderForProfile(null)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <span className="text-2xl font-bold text-blue-400">{selectedProviderForProfile.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedProviderForProfile.name}</h2>
                    <p className="text-sm text-white/60">ID: PRV-{selectedProviderForProfile.id.toString().padStart(4, '0')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Calificación</p>
                    <p className="text-lg font-semibold text-white flex items-center gap-1">
                      {selectedProviderForProfile.rating} <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Estado</p>
                    <p className="text-lg font-semibold text-green-400">{selectedProviderForProfile.status}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-white/40" />
                    <span className="text-white/80">{selectedProviderForProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-5 h-5 text-white/40" />
                    <span className="text-white/80">{selectedProviderForProfile.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-5 h-5 text-white/40" />
                    <span className="text-white/80">{selectedProviderForProfile.email}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={() => setSelectedProviderForProfile(null)}
                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors"
                  >
                    Cerrar Perfil
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Modal */}
        {selectedProviderForProducts && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-white">Catálogo de Productos</h3>
                  <p className="text-sm text-white/50">{selectedProviderForProducts.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedProviderForProducts(null)}
                  className="p-1 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center border border-white/10">
                        <span className="text-xl">📦</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Producto de Ejemplo {item}</h4>
                        <p className="text-xs text-white/50">Categoría: Autopartes</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">${(Math.random() * 500 + 50).toFixed(2)}</p>
                      <p className="text-xs text-green-400">En stock: {Math.floor(Math.random() * 100) + 10}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-white/10 flex justify-end shrink-0">
                <button 
                  onClick={() => setSelectedProviderForProducts(null)}
                  className="px-6 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium transition-colors"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Proveedores;
