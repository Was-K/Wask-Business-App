import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: ClipboardList, label: 'Solicitudes', path: '/admin/solicitudes' },
    { icon: ShoppingCart, label: 'Proveedores', path: '/admin/proveedores' },
    { icon: Package, label: 'Productos', path: '/admin/productos' },
    { icon: BarChart3, label: 'Reportes', path: '/admin/reportes' },
    { icon: Settings, label: 'Configuración', path: '/admin/configuracion' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-black/40 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 flex flex-col z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Section */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-xs font-bold text-white/70 uppercase">Wask</p>
              <p className="text-xs text-white/50">Business</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-white/60 hover:text-white"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                active
                  ? 'bg-white/20 text-white shadow-lg shadow-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  active ? 'opacity-100' : ''
                }`}
              />
              <Icon className="w-5 h-5 flex-shrink-0 relative z-10" />
              {!isCollapsed && (
                <span className="text-sm font-medium relative z-10">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10 flex flex-col gap-3">
        <button
          onClick={logout}
          className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 relative overflow-hidden w-full"
          title={isCollapsed ? 'Logout' : ''}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <LogOut className="w-5 h-5 flex-shrink-0 relative z-10" />
          {!isCollapsed && (
            <span className="text-sm font-medium relative z-10">Logout</span>
          )}
        </button>
        {isCollapsed && (
          <div className="h-px bg-white/10" />
        )}
      </div>
    </div>
  );
};
