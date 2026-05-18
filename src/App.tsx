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
              <ProtectedRoute requiredRole="ADMIN">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/solicitudes"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Solicitudes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/proveedores"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Proveedores />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/productos"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Productos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reportes"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Reportes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/configuracion"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Configuracion />
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
