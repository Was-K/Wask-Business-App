import React from 'react';
import { AlertCircle, Loader2, Inbox } from 'lucide-react';

interface AsyncSectionProps {
  loading: boolean;
  error: string | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export const AsyncSection: React.FC<AsyncSectionProps> = ({
  loading,
  error,
  isEmpty,
  emptyMessage = 'No hay datos para mostrar',
  loadingMessage = 'Cargando…',
  onRetry,
  children,
}) => {
  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-10 flex items-center justify-center gap-3 text-white/70">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">{loadingMessage}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/40 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-8">
        <div className="flex items-start gap-3 text-red-300">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-white mb-1">No se pudo cargar la información</p>
            <p className="text-sm text-red-200/80">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all"
              >
                Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 text-white/60">
        <Inbox className="w-8 h-8" />
        <p className="text-sm">{emptyMessage}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all"
          >
            Recargar
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
