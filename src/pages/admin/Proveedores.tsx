import React, { useCallback, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AsyncSection } from '../../components/AsyncSection';
import {
  CheckCircle2,
  Clock,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Eye,
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  Hash,
  Globe,
  Briefcase,
} from 'lucide-react';
import { useApiResource } from '../../hooks/useApiResource';
import { businessService } from '../../services/businessService';
import { ENABLE_MOCKS } from '../../services/env';
import type { Business, VerificationStatus, OperationalStatus } from '../../types/api';

const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    companyName: 'Licorería El Pisco Sour',
    businessIdentifier: 'RUC-20100001',
    industry: 'Licorería',
    address: 'Miraflores, Lima',
    phone: '+51 987 000 001',
    verificationStatus: 'VERIFIED',
    operationalStatus: 'ACTIVE',
    createdAt: new Date().toISOString(),
    users: [{ id: 'u1', email: 'dueno@pisco.com', firstName: 'Carlos', lastName: 'Ríos', role: 'BUSINESS_OWNER' }],
  },
  {
    id: '2',
    companyName: 'Bodega Las Viñas',
    businessIdentifier: 'RUC-20100002',
    industry: 'Bodega',
    address: 'San Isidro, Lima',
    verificationStatus: 'PENDING',
    createdAt: new Date().toISOString(),
  },
];

type ConfirmAction = { type: 'delete' | 'restore'; business: Business } | null;

function verificationBadge(vs?: VerificationStatus) {
  switch (vs) {
    case 'VERIFIED':
      return { cls: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Verificado', icon: <CheckCircle2 className="w-3 h-3" /> };
    case 'REJECTED':
      return { cls: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Rechazado', icon: <X className="w-3 h-3" /> };
    default:
      return { cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Pendiente', icon: <Clock className="w-3 h-3" /> };
  }
}

function operationalBadge(os?: OperationalStatus) {
  switch (os) {
    case 'ACTIVE':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'PAUSED':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'SUSPENDED':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return null;
  }
}

function operationalLabel(os?: OperationalStatus) {
  switch (os) {
    case 'ACTIVE': return 'Activo';
    case 'PAUSED': return 'Pausado';
    case 'SUSPENDED': return 'Suspendido';
    default: return null;
  }
}

function roleLabel(role: string) {
  switch (role) {
    case 'BUSINESS_OWNER': return 'Propietario';
    case 'ADMIN': return 'Admin';
    case 'CUSTOMER': return 'Cliente';
    case 'DELIVERY': return 'Repartidor';
    default: return role;
  }
}

// ─── Detail Modal ────────────────────────────────────────────────────────────

interface DetailModalProps {
  businessId: string;
  snapshot: Business;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ businessId, snapshot, onClose }) => {
  const fetcher = useCallback(() => businessService.getBusinessById(businessId), [businessId]);
  const { data, loading, error } = useApiResource<Business>(fetcher);

  const b: Business = data ?? snapshot;
  const vBadge = verificationBadge(b.verificationStatus);
  const opLabel = operationalLabel(b.operationalStatus);
  const opCls = operationalBadge(b.operationalStatus);

  const initials = b.companyName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0d0d0d] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            {b.logo ? (
              <img src={b.logo} alt={b.companyName} className="w-14 h-14 rounded-xl object-cover border border-white/10" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-lg">
                {initials}
              </div>
            )}
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{b.companyName}</h2>
              <p className="text-white/40 text-xs font-mono mt-0.5">{b.businessIdentifier}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${vBadge.cls}`}>
                  {vBadge.icon} {vBadge.label}
                </span>
                {opLabel && opCls && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${opCls}`}>
                    {opLabel}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/50 hover:text-white flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="px-6 pt-4 text-sm text-white/40 flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            Cargando detalles completos…
          </div>
        )}
        {error && (
          <div className="mx-6 mt-4 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
            No se pudieron cargar todos los detalles. Mostrando datos parciales.
          </div>
        )}

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Información general */}
          <section>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Información del negocio</h3>
            <div className="space-y-2.5">
              {b.industry && (
                <Row icon={<Briefcase className="w-4 h-4" />} label="Industria" value={b.industry} />
              )}
              {b.address && (
                <Row icon={<MapPin className="w-4 h-4" />} label="Dirección" value={b.address} />
              )}
              {b.phone && (
                <Row icon={<Phone className="w-4 h-4" />} label="Teléfono" value={b.phone} />
              )}
              {(b.latitude != null && b.longitude != null) && (
                <Row icon={<Globe className="w-4 h-4" />} label="Coordenadas" value={`${b.latitude}, ${b.longitude}`} mono />
              )}
              {b.rejectionReason && (
                <div className="flex gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-red-400 font-semibold mb-0.5">Motivo de rechazo</p>
                    <p className="text-sm text-red-300/80">{b.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Usuarios */}
          {b.users && b.users.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                Usuarios ({b.users.length})
              </h3>
              <div className="space-y-2">
                {b.users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-start gap-3 p-3 bg-white/[0.04] border border-white/[0.07] rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white/60 flex-shrink-0 text-xs font-bold">
                      {u.firstName?.[0]?.toUpperCase() ?? u.email[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      {(u.firstName || u.lastName) && (
                        <p className="text-sm text-white font-medium truncate">
                          {[u.firstName, u.lastName].filter(Boolean).join(' ')}
                        </p>
                      )}
                      <p className="text-xs text-white/50 truncate flex items-center gap-1">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {u.email}
                      </p>
                      {u.phone && (
                        <p className="text-xs text-white/40 truncate flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          {u.phone}
                        </p>
                      )}
                    </div>
                    <span className="ml-auto flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50 border border-white/10">
                      {roleLabel(u.role)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Datos fiscales */}
          {b.fiscalData && Object.keys(b.fiscalData).length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Datos fiscales</h3>
              <div className="space-y-2">
                {Object.entries(b.fiscalData).map(([key, val]) => (
                  <Row
                    key={key}
                    icon={<Hash className="w-4 h-4" />}
                    label={key}
                    value={typeof val === 'object' ? JSON.stringify(val) : String(val ?? '—')}
                    mono
                  />
                ))}
              </div>
            </section>
          )}

          {/* Fechas */}
          <section>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Registro</h3>
            <div className="space-y-2.5">
              {b.createdAt && (
                <Row
                  icon={<Calendar className="w-4 h-4" />}
                  label="Registrado"
                  value={new Date(b.createdAt).toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' })}
                />
              )}
              {b.updatedAt && (
                <Row
                  icon={<Calendar className="w-4 h-4" />}
                  label="Última actualización"
                  value={new Date(b.updatedAt).toLocaleString('es-PE', { dateStyle: 'long', timeStyle: 'short' })}
                />
              )}
              <Row icon={<User className="w-4 h-4" />} label="ID" value={b.id} mono />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

interface RowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}

const Row: React.FC<RowProps> = ({ icon, label, value, mono }) => (
  <div className="flex items-start gap-2.5">
    <span className="text-white/30 mt-0.5 flex-shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-xs text-white/40">{label}</p>
      <p className={`text-sm text-white/80 break-all ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  </div>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

const Proveedores: React.FC = () => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [detailBusiness, setDetailBusiness] = useState<Business | null>(null);

  const fetcher = useCallback(
    () => businessService.getBusinesses(showDeleted ? { deleted: 'true' } : undefined),
    [showDeleted],
  );
  const { data, loading, error, refetch } = useApiResource<Business[]>(fetcher);

  const businesses: Business[] =
    data && data.length > 0 ? data : ENABLE_MOCKS && !showDeleted ? MOCK_BUSINESSES : [];

  const isEmpty = !loading && !error && businesses.length === 0;

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    setActionError(null);
    try {
      if (confirmAction.type === 'delete') {
        await businessService.deleteBusinessAsAdmin(confirmAction.business.id);
      } else {
        await businessService.restoreBusiness(confirmAction.business.id);
      }
      setConfirmAction(null);
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ocurrió un error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Negocios registrados"
      subtitle="Licorerías, bodegas y tiendas activas en la plataforma"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDeleted(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !showDeleted
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => setShowDeleted(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showDeleted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              Eliminados
            </button>
          </div>
          <span className="text-sm text-white/40">
            {businesses.length} negocio{businesses.length !== 1 ? 's' : ''}
          </span>
        </div>

        <AsyncSection
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={isEmpty}
          emptyMessage={showDeleted ? 'No hay negocios eliminados.' : 'No hay negocios registrados todavía.'}
          loadingMessage="Cargando negocios…"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((b) => {
              const vBadge = verificationBadge(b.verificationStatus);
              return (
                <div
                  key={b.id}
                  className={`group bg-black/40 backdrop-blur-2xl border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg flex flex-col ${
                    showDeleted
                      ? 'border-red-500/20 hover:border-red-500/40 opacity-75'
                      : 'border-white/10 hover:border-white/20 hover:shadow-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 mr-2">
                      <h3 className="text-lg font-bold text-white truncate">{b.companyName}</h3>
                      <p className="text-xs text-white/50 mt-1 font-mono">{b.businessIdentifier}</p>
                    </div>
                    {!showDeleted && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border flex-shrink-0 ${vBadge.cls}`}
                      >
                        {vBadge.icon}
                        {vBadge.label}
                      </span>
                    )}
                    {showDeleted && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border bg-red-500/20 text-red-400 border-red-500/30 flex-shrink-0">
                        Eliminado
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 mb-4 pb-4 border-b border-white/10 text-sm text-white/60 flex-1">
                    {b.industry && (
                      <p className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                        {b.industry}
                      </p>
                    )}
                    {b.address && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                        <span className="truncate">{b.address}</span>
                      </p>
                    )}
                    {b.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                        {b.phone}
                      </p>
                    )}
                    {b.users?.[0]?.email && (
                      <p className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                        <span className="truncate">{b.users[0].email}</span>
                      </p>
                    )}
                    {!b.industry && !b.address && !b.phone && !b.users?.[0]?.email && (
                      <p className="text-white/40 italic text-xs">Sin datos adicionales</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setDetailBusiness(b)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 hover:border-white/20 rounded-lg font-medium text-sm transition-all duration-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver detalles
                    </button>
                    {!showDeleted && (
                      <button
                        onClick={() => setConfirmAction({ type: 'delete', business: b })}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-lg font-medium text-sm transition-all duration-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {showDeleted && (
                      <button
                        onClick={() => setConfirmAction({ type: 'restore', business: b })}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 hover:border-green-500/40 rounded-lg font-medium text-sm transition-all duration-300"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </AsyncSection>
      </div>

      {/* Modal de detalles */}
      {detailBusiness && (
        <DetailModal
          businessId={detailBusiness.id}
          snapshot={detailBusiness}
          onClose={() => setDetailBusiness(null)}
        />
      )}

      {/* Modal de confirmación */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  confirmAction.type === 'delete' ? 'bg-red-500/20' : 'bg-green-500/20'
                }`}
              >
                {confirmAction.type === 'delete' ? (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                ) : (
                  <RotateCcw className="w-5 h-5 text-green-400" />
                )}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  {confirmAction.type === 'delete' ? 'Eliminar negocio' : 'Restaurar negocio'}
                </h3>
                <p className="text-white/50 text-sm">{confirmAction.business.companyName}</p>
              </div>
            </div>

            <p className="text-white/70 text-sm mb-6">
              {confirmAction.type === 'delete'
                ? 'Esto desactivará el negocio y todos sus usuarios. Sus productos también serán eliminados. Podrás restaurarlo después desde la pestaña "Eliminados".'
                : 'El negocio y sus usuarios volverán al estado PENDIENTE y deberán ser re-aprobados por un administrador.'}
            </p>

            {actionError && (
              <p className="text-red-400 text-sm mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {actionError}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmAction(null); setActionError(null); }}
                disabled={actionLoading}
                className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={actionLoading}
                className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50 ${
                  confirmAction.type === 'delete'
                    ? 'bg-red-500/80 hover:bg-red-500 text-white'
                    : 'bg-green-500/80 hover:bg-green-500 text-white'
                }`}
              >
                {actionLoading
                  ? 'Procesando…'
                  : confirmAction.type === 'delete'
                  ? 'Sí, eliminar'
                  : 'Sí, restaurar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Proveedores;
