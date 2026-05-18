import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface BusinessHeaderProps {
  title: string;
  subtitle?: string;
}

export const BusinessHeader: React.FC<BusinessHeaderProps> = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const mockNotifications = [
    { id: 1, title: 'Bajo stock', message: 'El producto "Pastillas de Freno Cerámicas" se ha agotado.', time: 'Hace 5 min', unread: true },
    { id: 2, title: 'Nuevo pedido', message: 'Has recibido el pedido #ORD-8452.', time: 'Hace 1 hora', unread: true },
    { id: 3, title: 'Reporte generado', message: 'El reporte de ventas de Mayo está listo.', time: 'Hace 2 días', unread: false },
  ];
  const [notificationCount] = useState(mockNotifications.filter(n => n.unread).length);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className="sticky top-0 z-30 bg-black/50 backdrop-blur-2xl border-b border-white/[0.08]">
      <div className="px-8 py-4 flex items-center justify-between gap-4">
        {/* Left Section - Title & Subtitle */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-white/45 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4">
          {/* Global Search */}
          <div className="hidden md:flex items-center gap-2.5 px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500/30">
            <Search className="w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Buscar productos, pedidos..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder-white/35 w-52"
            />
            <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 bg-white/[0.08] border border-white/[0.12] rounded-md text-[10px] text-white/40 font-mono">
              ⌘K
            </kbd>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2.5 hover:bg-white/[0.08] rounded-xl transition-all duration-300 text-white/50 hover:text-white group"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <div className="absolute top-1.5 right-1.5 min-w-[18px] min-h-[18px] bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
                  {notificationCount}
                </div>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-black/80 backdrop-blur-3xl border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
                  <button className="text-xs text-blue-400 hover:text-blue-300">Marcar leídas</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <div key={notif.id} className={`p-4 border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors cursor-pointer ${notif.unread ? 'bg-blue-500/[0.05]' : ''}`}>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm font-medium ${notif.unread ? 'text-white' : 'text-white/70'}`}>{notif.title}</h4>
                        <span className="text-[10px] text-white/40">{notif.time}</span>
                      </div>
                      <p className="text-xs text-white/50">{notif.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/[0.08] text-center">
                  <button className="text-xs text-white/60 hover:text-white transition-colors">Ver todas</button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-white/[0.08]" />

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-white/[0.06] rounded-xl transition-all duration-300 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-500/25 flex items-center justify-center">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white/90">{user?.email || 'Usuario'}</p>
                <p className="text-xs text-blue-400/70 capitalize">Proveedor</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-white/40 transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-black/70 backdrop-blur-2xl border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-white/[0.08]">
                  <p className="text-xs text-white/40 mb-1">Conectado como</p>
                  <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                  <span className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 bg-blue-500/15 border border-blue-500/20 rounded-md text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                    Proveedor
                  </span>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/business/configuracion');
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-white/[0.06] hover:text-white transition-all duration-300 flex items-center gap-2.5"
                  >
                    <Settings className="w-4 h-4" />
                    Configuración
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-white/[0.08]">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 flex items-center gap-2.5"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
