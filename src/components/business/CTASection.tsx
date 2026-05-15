import React from 'react';
import { Plus } from 'lucide-react';

interface CTASectionProps {
  onAddProduct?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onAddProduct }) => {
  return (
    <div className="relative group">
      {/* Glow backdrop */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-blue-600/10 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />

      <div className="relative bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-8 overflow-hidden group-hover:border-blue-500/20 transition-all duration-500">
        {/* Background gradient decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.06] via-transparent to-cyan-500/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/[0.04] rounded-full blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-cyan-500/[0.04] rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Text Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">
              ¿Listo para añadir un nuevo producto?
            </h3>
            <p className="text-sm text-white/45 max-w-md">
              Expande tu catálogo y gestiona tu inventario de manera eficiente. 
              Añade productos con toda la información necesaria.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={onAddProduct}
            className="group/btn relative flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
          >
            {/* Button glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />

            <Plus className="w-5 h-5 relative z-10 group-hover/btn:rotate-90 transition-transform duration-300" />
            <span className="relative z-10">Añadir Producto</span>
          </button>
        </div>
      </div>
    </div>
  );
};
