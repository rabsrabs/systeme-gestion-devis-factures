import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Devis from './pages/Devis';
import Factures from './pages/Factures';
import Produits from './pages/Produits';
import Clients from './pages/Clients';
import Collaborateurs from './pages/Collaborateurs';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devis" element={<Devis />} />
        <Route path="/factures" element={<Factures />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/collaborateurs" element={<Collaborateurs />} />
      </Routes>
    </Router>
  );
}

export default App;
