import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationCount] = useState(3);

  return (
    <div className="sticky top-0 z-30 bg-black/40 backdrop-blur-2xl border-b border-white/10">
      <div className="px-8 py-4 flex items-center justify-between gap-4">
        {/* Left Section - Title */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-white/50 mt-1">{subtitle}</p>}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-300 focus-within:ring-2 focus-within:ring-white/50">
            <Search className="w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder-white/40 w-40"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-white/10 rounded-xl transition-all duration-300 text-white/60 hover:text-white group">
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg shadow-red-500/50 group-hover:scale-110 transition-transform">
                {notificationCount}
              </div>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 rounded-xl transition-all duration-300 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/30 to-white/10 border border-white/20 flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">{user?.email}</p>
                <p className="text-xs text-white/50 capitalize">{user?.role}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-white/50 transition-transform duration-300 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-xl shadow-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-xs text-white/50">Conectado como</p>
                  <p className="text-sm font-medium text-white">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-all duration-300 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
