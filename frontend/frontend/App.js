import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Devis from './pages/Devis';
import Factures from './pages/Factures';
import Prestations from './pages/Prestations';
import Layout from './components/Layout';
import './App.css';

// Composant pour protéger les routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route publique */}
          <Route path="/login" element={<Login />} />
          
          {/* Routes protégées */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="devis" element={<Devis />} />
            <Route path="factures" element={<Factures />} />
            <Route path="prestations" element={<Prestations />} />
          </Route>
          
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
