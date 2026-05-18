import React, { useState } from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { User, Bell, Shield, Palette, Globe, Save } from 'lucide-react';

const BusinessConfiguracion: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    orders: true,
    stock: false,
    reports: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  type Field = {
    label: string;
    value: string;
    type: string;
    placeholder?: string;
  };

  type Section = {
    title: string;
    icon: any;
    description: string;
    fields: Field[];
  };

  const sections: Section[] = [
    {
      title: 'Perfil de Empresa',
      icon: User,
      description: 'Información básica de tu negocio',
      fields: [
        { label: 'Nombre de la Empresa', value: 'AutoParts Premium S.A.', type: 'text' },
        { label: 'RFC', value: 'APP210301XY9', type: 'text' },
        { label: 'Correo Electrónico', value: 'contacto@autopartspremium.com', type: 'email' },
        { label: 'Teléfono', value: '+52 55 1234 5678', type: 'tel' },
      ],
    },
    {
      title: 'Seguridad',
      icon: Shield,
      description: 'Contraseña y autenticación',
      fields: [
        { label: 'Contraseña Actual', value: '', type: 'password', placeholder: '••••••••' },
        { label: 'Nueva Contraseña', value: '', type: 'password', placeholder: 'Mínimo 8 caracteres' },
      ],
    },
  ];

  return (
    <BusinessLayout title="Configuración" subtitle="Personaliza tu experiencia y preferencias">
      <div className="space-y-6 max-w-3xl">
        {/* Profile & Security Sections */}
        {sections.map((section, idx) => (
          <div key={idx} className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/12 border border-blue-500/15 flex items-center justify-center">
                <section.icon className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                <p className="text-xs text-white/35">{section.description}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {section.fields.map((field, fIdx) => (
                <div key={fIdx}>
                  <label className="block text-xs font-medium text-white/50 mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Notifications */}
        <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/12 border border-blue-500/15 flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
              <p className="text-xs text-white/35">Configura tus preferencias de alertas</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              { key: 'email' as const, label: 'Notificaciones por Email', desc: 'Recibe actualizaciones en tu correo' },
              { key: 'push' as const, label: 'Notificaciones Push', desc: 'Alertas en tiempo real' },
              { key: 'orders' as const, label: 'Pedidos Nuevos', desc: 'Alerta cuando recibes un pedido' },
              { key: 'stock' as const, label: 'Alertas de Stock', desc: 'Cuando el inventario está bajo' },
              { key: 'reports' as const, label: 'Reportes Semanales', desc: 'Resumen semanal automático' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-white/80">{item.label}</p>
                  <p className="text-xs text-white/35">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`relative w-11 h-6 rounded-full transition-all duration-300 ${notifications[item.key] ? 'bg-blue-500' : 'bg-white/[0.12]'
                    }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${notifications[item.key] ? 'left-6' : 'left-1'
                      }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/12 border border-blue-500/15 flex items-center justify-center">
              <Palette className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Preferencias</h3>
              <p className="text-xs text-white/35">Idioma y apariencia</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Idioma</label>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-white/40" />
                <select className="flex-1 px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white/70 outline-none appearance-none cursor-pointer">
                  <option>Español (México)</option>
                  <option>English</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Zona Horaria</label>
              <select className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white/70 outline-none appearance-none cursor-pointer">
                <option>América/Ciudad de México (UTC-6)</option>
                <option>América/Bogotá (UTC-5)</option>
                <option>América/Buenos Aires (UTC-3)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </BusinessLayout>
  );
};

export default BusinessConfiguracion;
