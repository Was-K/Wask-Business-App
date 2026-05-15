import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Solicitudes from './pages/admin/Solicitudes';
import Proveedores from './pages/admin/Proveedores';
import Productos from './pages/admin/Productos';
import Reportes from './pages/admin/Reportes';
import Configuracion from './pages/admin/Configuracion';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import BusinessInventario from './pages/business/BusinessInventario';
import BusinessProductos from './pages/business/BusinessProductos';
import BusinessPedidos from './pages/business/BusinessPedidos';
import BusinessEntregas from './pages/business/BusinessEntregas';
import BusinessVentas from './pages/business/BusinessVentas';
import BusinessReportes from './pages/business/BusinessReportes';
import BusinessConfiguracion from './pages/business/BusinessConfiguracion';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />

          {/* Admin Routes - Protected */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/solicitudes"
            element={
              <ProtectedRoute requiredRole="admin">
                <Solicitudes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/proveedores"
            element={
              <ProtectedRoute requiredRole="admin">
                <Proveedores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute requiredRole="admin">
                <Productos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reportes"
            element={
              <ProtectedRoute requiredRole="admin">
                <Reportes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/configuracion"
            element={
              <ProtectedRoute requiredRole="admin">
                <Configuracion />
              </ProtectedRoute>
            }
          />

          {/* Business Routes - Protected */}
          <Route
            path="/business/dashboard"
            element={
              <ProtectedRoute requiredRole="business">
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/inventario"
            element={
              <ProtectedRoute requiredRole="business">
                <BusinessInventario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/productos"
            element={
              <ProtectedRoute requiredRole="business">
                <BusinessProductos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/pedidos"
            element={
              <ProtectedRoute requiredRole="business">
                <BusinessPedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/entregas"
            element={
              <ProtectedRoute requiredRole="business">
                <BusinessEntregas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/ventas"
            element={
              <ProtectedRoute requiredRole="business">
                <BusinessVentas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/reportes"
            element={
              <ProtectedRoute requiredRole="business">
                <BusinessReportes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business/configuracion"
            element={
              <ProtectedRoute requiredRole="business">
                <BusinessConfiguracion />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
