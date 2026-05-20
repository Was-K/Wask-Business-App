import React, { useCallback, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AsyncSection } from '../../components/AsyncSection';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useApiResource } from '../../hooks/useApiResource';
import { businessService } from '../../services/businessService';
import { ENABLE_MOCKS } from '../../services/env';
import type { Business, VerificationStatus } from '../../types/api';

const MOCK_BUSINESSES: Business[] = [
  {
    id: 'mock-1',
    companyName: 'Licorería Los Andes',
    businessIdentifier: 'RUC-20100001',
    industry: 'Licorería',
    address: 'Av. Arequipa 123',
    phone: '+51 987 654 321',
    verificationStatus: 'PENDING',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mock-2',
    companyName: 'Bodega El Pisco',
    businessIdentifier: 'RUC-20100002',
    industry: 'Bodega',
    verificationStatus: 'VERIFIED',
    createdAt: new Date().toISOString(),
  },
];

function statusBadge(vs?: VerificationStatus) {
  switch (vs) {
    case 'VERIFIED':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'REJECTED':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  }
}

function statusLabel(vs?: VerificationStatus) {
  switch (vs) {
    case 'VERIFIED':
      return 'Aprobado';
    case 'REJECTED':
      return 'Rechazado';
    default:
      return 'Pendiente';
  }
}

const Solicitudes: React.FC = () => {
  const fetcher = useCallback(() => businessService.getBusinesses(), []);
  const { data, loading, error, refetch } = useApiResource<Business[]>(fetcher);

  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const businesses: Business[] =
    data && data.length > 0 ? data : ENABLE_MOCKS ? MOCK_BUSINESSES : [];

  const isEmpty = !loading && !error && businesses.length === 0;

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    try {
      await businessService.approveBusiness(id);
      refetch();
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await businessService.rejectBusiness(rejectTarget, rejectReason || 'Rechazado por el administrador');
      setRejectTarget(null);
      setRejectReason('');
      refetch();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Solicitudes de Negocios"
      subtitle="Aprueba o rechaza solicitudes de registro de negocios"
    >
      <div className="space-y-6">
        {/* Reject modal */}
        {rejectTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 w-full max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-lg font-semibold text-white">Rechazar solicitud</h3>
              </div>
              <p className="text-sm text-white/60 mb-4">
                Indica el motivo del rechazo. El negocio recibirá esta información.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Motivo del rechazo (opcional)"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm resize-none"
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setRejectTarget(null); setRejectReason(''); }}
                  className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 hover:text-white transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all text-sm font-semibold disabled:opacity-50"
                >
                  {actionLoading ? 'Rechazando…' : 'Confirmar rechazo'}
                </button>
              </div>
            </div>
          </div>
        )}

        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={isEmpty}
          emptyMessage="No hay solicitudes registradas."
          loadingMessage="Cargando solicitudes…"
        >
          <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <h3 className="text-lg font-semibold text-white">Solicitudes de negocios</h3>
              <p className="text-sm text-white/50 mt-1">{businesses.length} registradas</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    {['Negocio', 'Identificador', 'Industria', 'Dirección', 'Estado', 'Registrado', 'Acciones'].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-5 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {businesses.map((b) => (
                    <tr key={b.id} className="hover:bg-white/5 transition-colors duration-300">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-white">{b.companyName}</p>
                        {b.users?.[0]?.email && (
                          <p className="text-xs text-white/40 mt-0.5">{b.users[0].email}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-white/70 font-mono">{b.businessIdentifier}</td>
                      <td className="px-5 py-4 text-sm text-white/60">{b.industry ?? '—'}</td>
                      <td className="px-5 py-4 text-sm text-white/60 max-w-[180px] truncate">
                        {b.address ?? '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge(b.verificationStatus)}`}
                        >
                          {statusLabel(b.verificationStatus)}
                        </span>
                        {b.verificationStatus === 'REJECTED' && b.rejectionReason && (
                          <p className="text-xs text-red-400/70 mt-1 max-w-[140px] truncate">
                            {b.rejectionReason}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-white/40">
                        {b.createdAt ? new Date(b.createdAt).toLocaleDateString('es-PE') : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {b.verificationStatus !== 'VERIFIED' && (
                            <button
                              onClick={() => handleApprove(b.id)}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs font-semibold flex items-center gap-1 border border-green-500/30 transition-all disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Aprobar
                            </button>
                          )}
                          {b.verificationStatus !== 'REJECTED' && (
                            <button
                              onClick={() => setRejectTarget(b.id)}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1 border border-red-500/30 transition-all disabled:opacity-50"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Rechazar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AsyncSection>
      </div>
    </AdminLayout>
  );
};

export default Solicitudes;
