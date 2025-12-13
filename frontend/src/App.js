import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';

// Pages (à créer)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Devis from './pages/Devis';
import Factures from './pages/Factures';
import Paiements from './pages/Paiements';
import Prestations from './pages/Prestations';
import Notifications from './pages/Notifications';

// Layout
import Layout from './components/Layout';

// Context d'authentification
import { AuthProvider, useAuth } from './utils/AuthContext';

// Route protégée
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="devis" element={<Devis />} />
            <Route path="factures" element={<Factures />} />
            <Route path="paiements" element={<Paiements />} />
            <Route path="prestations" element={<Prestations />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
