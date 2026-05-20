import React, { useCallback, useEffect, useState } from 'react';
import { BusinessLayout } from '../../components/business/BusinessLayout';
import { useApiResource } from '../../hooks/useApiResource';
import { businessService } from '../../services/businessService';
import { authService, type ChangePasswordPayload } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { AsyncSection } from '../../components/AsyncSection';
import { User, Bell, Shield, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

const BusinessConfiguracion: React.FC = () => {
  const { user } = useAuth();

  const fetcher = useCallback(() => businessService.getMyBusiness(), []);
  const { data: business, loading, error, refetch } = useApiResource(fetcher);

  // Business form
  const [bizForm, setBizForm] = useState({
    companyName: '',
    address: '',
    phone: '',
    industry: '',
  });

  // Password form
  const [pwForm, setPwForm] = useState<ChangePasswordPayload>({
    currentPassword: '',
    nextPassword: '',
  });
  const [pwConfirm, setPwConfirm] = useState('');

  const [bizSaving, setBizSaving] = useState(false);
  const [bizMsg, setBizMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Seed form when data arrives
  useEffect(() => {
    if (business) {
      setBizForm({
        companyName: business.companyName ?? '',
        address: business.address ?? '',
        phone: business.phone ?? '',
        industry: business.industry ?? '',
      });
    }
  }, [business]);

  const handleBizChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBizForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveBiz = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBizSaving(true);
    setBizMsg(null);
    try {
      await businessService.updateMyBusiness({
        companyName: bizForm.companyName,
        address: bizForm.address || undefined,
        phone: bizForm.phone || undefined,
        industry: bizForm.industry || undefined,
      });
      setBizMsg({ type: 'success', text: 'Perfil del negocio actualizado correctamente.' });
      refetch();
    } catch (err) {
      setBizMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar' });
    } finally {
      setBizSaving(false);
    }
  };

  const handleSavePw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.nextPassword !== pwConfirm) {
      setPwMsg({ type: 'error', text: 'Las contraseñas nuevas no coinciden.' });
      return;
    }
    if (pwForm.nextPassword.length < 10) {
      setPwMsg({ type: 'error', text: 'La contraseña debe tener al menos 10 caracteres.' });
      return;
    }
    setPwSaving(true);
    try {
      await authService.changePassword(pwForm);
      setPwMsg({ type: 'success', text: 'Contraseña actualizada correctamente.' });
      setPwForm({ currentPassword: '', nextPassword: '' });
      setPwConfirm('');
    } catch (err) {
      setPwMsg({ type: 'error', text: err instanceof Error ? err.message : 'Error al cambiar contraseña' });
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <BusinessLayout title="Configuración" subtitle="Administra tu perfil y preferencias">
      <div className="space-y-6 max-w-3xl">
        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          loadingMessage="Cargando configuración…"
        >
          {/* Business profile */}
          <form onSubmit={handleSaveBiz}>
            <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/12 border border-blue-500/15 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Perfil del negocio</h3>
                  <p className="text-xs text-white/35">Información visible en el marketplace</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {bizMsg && (
                  <div className={`flex items-start gap-2 p-3 rounded-xl text-xs border ${
                    bizMsg.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}>
                    {bizMsg.type === 'success'
                      ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    {bizMsg.text}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Nombre del negocio</label>
                  <input
                    name="companyName"
                    value={bizForm.companyName}
                    onChange={handleBizChange}
                    className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Identificador (RUC / DNI)</label>
                  <input
                    value={business?.businessIdentifier ?? ''}
                    readOnly
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white/40 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Dirección</label>
                  <input
                    name="address"
                    value={bizForm.address}
                    onChange={handleBizChange}
                    className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2">Teléfono</label>
                    <input
                      name="phone"
                      value={bizForm.phone}
                      onChange={handleBizChange}
                      className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2">Industria</label>
                    <input
                      name="industry"
                      value={bizForm.industry}
                      onChange={handleBizChange}
                      className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/30 transition-all"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={bizSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {bizSaving ? 'Guardando…' : 'Guardar negocio'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* User info (read-only email) */}
          <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/12 border border-blue-500/15 flex items-center justify-center">
                <Bell className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Cuenta de usuario</h3>
                <p className="text-xs text-white/35">Datos del responsable del negocio</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Nombre</label>
                  <input
                    readOnly
                    value={user?.firstName ?? '—'}
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white/60 outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Apellido</label>
                  <input
                    readOnly
                    value={user?.lastName ?? '—'}
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white/60 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2">Correo electrónico</label>
                <input
                  readOnly
                  value={user?.email ?? ''}
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white/40 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Change password */}
          <form onSubmit={handleSavePw}>
            <div className="bg-black/35 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/12 border border-blue-500/15 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Cambiar contraseña</h3>
                  <p className="text-xs text-white/35">Mínimo 10 caracteres</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {pwMsg && (
                  <div className={`flex items-start gap-2 p-3 rounded-xl text-xs border ${
                    pwMsg.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}>
                    {pwMsg.type === 'success'
                      ? <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    {pwMsg.text}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Contraseña actual</label>
                  <input
                    type="password"
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))}
                    required
                    className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Nueva contraseña</label>
                  <input
                    type="password"
                    value={pwForm.nextPassword}
                    onChange={(e) => setPwForm((p) => ({ ...p, nextPassword: e.target.value }))}
                    required
                    minLength={10}
                    className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    value={pwConfirm}
                    onChange={(e) => setPwConfirm(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/[0.1] rounded-xl text-sm text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
                  >
                    <Shield className="w-4 h-4" />
                    {pwSaving ? 'Cambiando…' : 'Cambiar contraseña'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </AsyncSection>
      </div>
    </BusinessLayout>
  );
};

export default BusinessConfiguracion;
