import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Warehouse,
  Package,
  ClipboardList,
  Truck,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BusinessSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: Home, label: 'Inicio', path: '/business/dashboard' },
    { icon: Warehouse, label: 'Inventario', path: '/business/inventario' },
    { icon: Package, label: 'Productos', path: '/business/productos' },
    { icon: ClipboardList, label: 'Pedidos', path: '/business/pedidos' },
    { icon: Truck, label: 'Entregas', path: '/business/entregas' },
    { icon: TrendingUp, label: 'Ventas', path: '/business/ventas' },
    { icon: BarChart3, label: 'Reportes', path: '/business/reportes' },
    { icon: Settings, label: 'Configuración', path: '/business/configuracion' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-black/40 backdrop-blur-2xl border-r border-white/[0.08] transition-all duration-300 flex flex-col z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Section */}
      <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">Wask</p>
              <p className="text-xs text-blue-400/80">Proveedor</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25 mx-auto">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-white/60 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Collapse toggle when collapsed */}
      {isCollapsed && (
        <div className="flex justify-center py-3 border-b border-white/[0.08]">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-white/60 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                active
                  ? 'bg-blue-500/15 text-blue-400 shadow-lg shadow-blue-500/[0.05]'
                  : 'text-white/55 hover:text-white hover:bg-white/[0.06]'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              {/* Active indicator glow */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-blue-400 rounded-r-full shadow-lg shadow-blue-400/50" />
              )}

              {/* Hover gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  active ? 'opacity-100' : ''
                }`}
              />

              <Icon
                className={`w-5 h-5 flex-shrink-0 relative z-10 transition-all duration-300 ${
                  active ? 'text-blue-400' : 'group-hover:text-white'
                }`}
              />
              {!isCollapsed && (
                <span
                  className={`text-sm font-medium relative z-10 transition-all duration-300 ${
                    active ? 'text-blue-400 font-semibold' : ''
                  }`}
                >
                  {item.label}
                </span>
              )}

              {/* Active glow dot */}
              {active && !isCollapsed && (
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50 relative z-10" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/[0.08]">
        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/[0.08] hover:bg-red-500/15 text-red-400/80 hover:text-red-400 transition-all duration-300 relative overflow-hidden w-full"
          title={isCollapsed ? 'Logout' : ''}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <LogOut className="w-5 h-5 flex-shrink-0 relative z-10" />
          {!isCollapsed && (
            <span className="text-sm font-medium relative z-10">Cerrar Sesión</span>
          )}
        </button>
      </div>
    </div>
  );
};
