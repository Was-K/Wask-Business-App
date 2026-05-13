import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, ChevronDown } from 'lucide-react';

export interface Request {
  id: string;
  provider: string;
  product: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  quantity: number;
}

interface RequestTableProps {
  requests?: Request[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    case 'rejected':
      return <XCircle className="w-5 h-5 text-red-400" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-400" />;
    default:
      return <AlertCircle className="w-5 h-5 text-white/40" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'rejected':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default:
      return 'bg-white/10 text-white/60 border-white/20';
  }
};

const mockRequests: Request[] = [
  {
    id: 'REQ-001',
    provider: 'TechSupply Corp',
    product: 'Server Components',
    date: '2024-05-10',
    status: 'pending',
    quantity: 15,
  },
  {
    id: 'REQ-002',
    provider: 'Global Industries',
    product: 'Network Equipment',
    date: '2024-05-09',
    status: 'approved',
    quantity: 8,
  },
  {
    id: 'REQ-003',
    provider: 'Premium Parts Inc',
    product: 'Storage Solutions',
    date: '2024-05-08',
    status: 'rejected',
    quantity: 12,
  },
  {
    id: 'REQ-004',
    provider: 'Digital Solutions Ltd',
    product: 'Software Licenses',
    date: '2024-05-07',
    status: 'approved',
    quantity: 50,
  },
  {
    id: 'REQ-005',
    provider: 'Enterprise Systems',
    product: 'Database Services',
    date: '2024-05-06',
    status: 'pending',
    quantity: 5,
  },
];

export const RequestTable: React.FC<RequestTableProps> = ({
  requests = mockRequests,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [localRequests, setLocalRequests] = useState<Request[]>(requests);

  const handleApprove = (id: string) => {
    setLocalRequests(
      localRequests.map((req) =>
        req.id === id ? { ...req, status: 'approved' as const } : req
      )
    );
  };

  const handleReject = (id: string) => {
    setLocalRequests(
      localRequests.map((req) =>
        req.id === id ? { ...req, status: 'rejected' as const } : req
      )
    );
  };

  return (
    <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/5">
        <h3 className="text-lg font-semibold text-white">Solicitudes Recientes</h3>
        <p className="text-sm text-white/50 mt-1">
          {localRequests.length} solicitudes registradas
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 hover:bg-white/10 transition-colors duration-300">
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white/70 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-white/70 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {localRequests.map((request) => (
              <React.Fragment key={request.id}>
                <tr className="hover:bg-white/5 transition-colors duration-300 group">
                  <td className="px-6 py-4 text-sm font-semibold text-white/80">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">{request.provider}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{request.product}</td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    {new Date(request.date).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-white/80">
                      {request.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${getStatusBadge(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      <span className="capitalize">
                        {request.status === 'pending'
                          ? 'Pendiente'
                          : request.status === 'approved'
                          ? 'Aprobado'
                          : 'Rechazado'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setExpandedRow(expandedRow === request.id ? null : request.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 text-white/60 hover:text-white"
                        title="Expandir"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            expandedRow === request.id ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Row */}
                {expandedRow === request.id && (
                  <tr className="bg-white/5 border-b border-white/10">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-white/50 uppercase">Proveedor</p>
                            <p className="text-sm font-medium text-white">{request.provider}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/50 uppercase">Producto</p>
                            <p className="text-sm font-medium text-white">{request.product}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/50 uppercase">Cantidad</p>
                            <p className="text-sm font-medium text-white">{request.quantity}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/50 uppercase">Fecha</p>
                            <p className="text-sm font-medium text-white">
                              {new Date(request.date).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex gap-3 pt-4 border-t border-white/10">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-green-500/30"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Aprobar
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/30"
                            >
                              <XCircle className="w-4 h-4" />
                              Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
