import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

function Layout() {
  const { logout, user } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: '250px', background: '#2c3e50', color: 'white', padding: '20px' }}>
        <h2>OMC System</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/" style={{ color: 'white' }}>Dashboard</Link></li>
          <li><Link to="/clients" style={{ color: 'white' }}>Clients</Link></li>
          <li><Link to="/devis" style={{ color: 'white' }}>Devis</Link></li>
          <li><Link to="/factures" style={{ color: 'white' }}>Factures</Link></li>
          <li><Link to="/paiements" style={{ color: 'white' }}>Paiements</Link></li>
          <li><Link to="/prestations" style={{ color: 'white' }}>Prestations</Link></li>
          <li><Link to="/notifications" style={{ color: 'white' }}>Notifications</Link></li>
        </ul>
        <div style={{ marginTop: '50px' }}>
          <p>Utilisateur: {user?.nom}</p>
          <button onClick={logout}>Déconnexion</button>
        </div>
      </nav>
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
