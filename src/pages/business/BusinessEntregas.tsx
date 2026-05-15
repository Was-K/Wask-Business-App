import React from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { Truck, MapPin, Clock, CheckCircle2, Package } from 'lucide-react';

const BusinessEntregas: React.FC = () => {
  const deliveries = [
    { id: 'ENT-101', order: 'PED-2401', destination: 'AutoParts MX — CDMX', carrier: 'FedEx Express', date: '14 May 2026', status: 'En Tránsito', progress: 65 },
    { id: 'ENT-102', order: 'PED-2403', destination: 'MotoCenter SA — GDL', carrier: 'DHL', date: '13 May 2026', status: 'Entregado', progress: 100 },
    { id: 'ENT-103', order: 'PED-2405', destination: 'Distribuidora Norte — MTY', carrier: 'Estafeta', date: '15 May 2026', status: 'Preparando', progress: 20 },
    { id: 'ENT-104', order: 'PED-2406', destination: 'CarService Plus — PUE', carrier: 'FedEx Express', date: '12 May 2026', status: 'Entregado', progress: 100 },
    { id: 'ENT-105', order: 'PED-2402', destination: 'Refacciones Pro — QRO', carrier: 'DHL', date: '14 May 2026', status: 'En Tránsito', progress: 45 },
  ];

  const statusConfig: Record<string, string> = {
    'Preparando': 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    'En Tránsito': 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    'Entregado': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  };

  const progressBarColor = (status: string) => {
    if (status === 'Entregado') return 'bg-emerald-500';
    if (status === 'En Tránsito') return 'bg-blue-500';
    return 'bg-amber-500';
  };

  return (
    <BusinessLayout title="Entregas" subtitle="Seguimiento de envíos y entregas en tiempo real">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Pendientes', value: '24', icon: Clock, color: 'text-amber-400' },
            { label: 'En Tránsito', value: '15', icon: Truck, color: 'text-blue-400' },
            { label: 'Entregadas (Mes)', value: '89', icon: CheckCircle2, color: 'text-emerald-400' },
          ].map((s, i) => (
            <div key={i} className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl bg-white/[0.06] flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/40">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Cards */}
        <div className="space-y-4">
          {deliveries.map(delivery => (
            <div key={delivery.id} className="group bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/12 border border-blue-500/15 flex items-center justify-center flex-shrink-0 mt-1">
                    <Package className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{delivery.id}</span>
                      <span className="text-xs text-white/30">•</span>
                      <span className="text-xs text-blue-400/70 font-mono">{delivery.order}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <MapPin className="w-3.5 h-3.5" />
                      {delivery.destination}
                    </div>
                    <p className="text-xs text-white/30 mt-1">{delivery.carrier} — {delivery.date}</p>
                  </div>
                </div>

                <span className={`inline-flex items-center self-start gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig[delivery.status]}`}>
                  {delivery.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full ${progressBarColor(delivery.status)} rounded-full transition-all duration-700`}
                  style={{ width: `${delivery.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessEntregas;
