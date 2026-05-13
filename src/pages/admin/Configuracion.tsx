import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Save, Lock, Bell, Palette } from 'lucide-react';

const Configuracion: React.FC = () => {
  const [settings, setSettings] = useState({
    companyName: 'Wask Business',
    email: 'admin@waskbusiness.com',
    phone: '+1 (555) 123-4567',
    language: 'es',
    notifications: true,
    twoFactor: false,
    theme: 'dark',
  });

  const handleSave = () => {
    alert('Configuración guardada exitosamente');
  };

  return (
    <AdminLayout title="Configuración" subtitle="Administra la configuración del sistema">
      <div className="max-w-4xl space-y-6">
        {/* Company Settings */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Configuración de Empresa</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Nombre de la Empresa
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) =>
                  setSettings({ ...settings, companyName: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Email Administrativo
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Teléfono de Contacto
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Idioma
              </label>
              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings({ ...settings, language: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Seguridad</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <p className="font-medium text-white">Autenticación de Dos Factores</p>
                <p className="text-sm text-white/60 mt-1">
                  Requiere verificación adicional al iniciar sesión
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.twoFactor}
                  onChange={(e) =>
                    setSettings({ ...settings, twoFactor: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
              </label>
            </div>

            <button className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300">
              Cambiar Contraseña
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Notificaciones</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                label: 'Notificaciones por Email',
                desc: 'Recibe alertas importantes por correo electrónico',
              },
              {
                label: 'Notificaciones del Sistema',
                desc: 'Recibe notificaciones en tiempo real en el dashboard',
              },
              {
                label: 'Reportes Semanales',
                desc: 'Recibe un resumen semanal de actividades',
              },
            ].map((notif, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                <div>
                  <p className="font-medium text-white">{notif.label}</p>
                  <p className="text-sm text-white/60 mt-1">{notif.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={idx === 0 || idx === 1}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            <Save className="w-5 h-5" />
            Guardar Cambios
          </button>
          <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300">
            Cancelar
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Configuracion;
