import React from 'react';
import { TrendingUp, Users, Package, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { RequestTable } from '../../components/admin/RequestTable';

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
}

const Dashboard: React.FC = () => {
  const stats: StatCard[] = [
    {
      icon: <Package className="w-6 h-6" />,
      label: 'Solicitudes Totales',
      value: '1,247',
      change: '+12.5%',
      changeType: 'up',
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      label: 'Pendientes',
      value: '48',
      change: '-3.2%',
      changeType: 'down',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Proveedores',
      value: '89',
      change: '+5.1%',
      changeType: 'up',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Ingresos (Este Mes)',
      value: '$45.2K',
      change: '+8.9%',
      changeType: 'up',
    },
  ];

  const getChangeColor = (changeType: 'up' | 'down' | 'neutral') => {
    switch (changeType) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-white/50';
    }
  };

  return (
    <AdminLayout title="Panel de Control Admin" subtitle="Bienvenido a tu dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 overflow-hidden relative"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4 text-white/70 group-hover:text-white group-hover:bg-white/20 transition-all duration-300">
                {stat.icon}
              </div>

              {/* Content */}
              <p className="text-sm text-white/60 mb-2">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
              <p className={`text-sm font-semibold ${getChangeColor(stat.changeType)}`}>
                {stat.change} vs mes anterior
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Requests Section */}
      <div className="mb-8">
        <RequestTable />
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {[
              { time: 'Hace 2 horas', action: 'Solicitud REQ-001 creada', type: 'new' },
              { time: 'Hace 5 horas', action: 'Solicitud REQ-002 aprobada', type: 'approved' },
              { time: 'Hace 1 día', action: 'Nuevo proveedor registrado', type: 'new' },
              { time: 'Hace 2 días', action: 'Reporte mensual generado', type: 'report' },
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="pt-1">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'approved'
                      ? 'bg-green-400'
                      : activity.type === 'report'
                      ? 'bg-blue-400'
                      : 'bg-white/50'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-white transition-colors">
                    {activity.action}
                  </p>
                  <p className="text-xs text-white/50 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Métricas de Desempeño</h3>
          <div className="space-y-4">
            {[
              { label: 'Tasa de Aprobación', value: '94%', color: 'bg-green-500' },
              { label: 'Tiempo Promedio de Respuesta', value: '2.3h', color: 'bg-blue-500' },
              { label: 'Satisfacción del Cliente', value: '4.8/5', color: 'bg-yellow-500' },
              { label: 'Disponibilidad del Sistema', value: '99.9%', color: 'bg-purple-500' },
            ].map((metric, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white/70">{metric.label}</p>
                  <p className="text-sm font-bold text-white">{metric.value}</p>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${metric.color} rounded-full`}
                    style={{ width: `${parseFloat(metric.value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
