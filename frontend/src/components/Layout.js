import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

function Layout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { path: '/', label: '📊 Dashboard', showFor: 'all' },
    { path: '/clients', label: '👥 Mes Clients', showFor: 'admin' },
    { path: '/devis', label: '📄 Devis', showFor: 'all' },
    { path: '/factures', label: '📑 Factures', showFor: 'all' },
    { path: '/paiements', label: '💳 Paiements', showFor: 'all' },
    { path: '/produits', label: '📦 Produits', showFor: 'all' },
    { path: '/notifications', label: '🔔 Notifications', showFor: 'all' },
  ];

  const filteredMenu = menuItems.filter(item => 
    item.showFor === 'all' || (item.showFor === 'admin' && isAdmin)
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <span style={{ fontSize: '32px' }}>☀️</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Anneessens & Co</h2>
            <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>Solutions Solaires</p>
          </div>
        </div>
        
        <ul style={styles.menu}>
          {filteredMenu.map(item => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                style={{
                  ...styles.menuLink,
                  background: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent'
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <span style={styles.avatar}>{(user?.nom || 'U')[0].toUpperCase()}</span>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{user?.prenom} {user?.nom}</p>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
                {isAdmin ? '👑 Administrateur' : '👤 Client'}
              </p>
            </div>
          </div>
          <button onClick={logout} style={styles.logoutBtn}>🚪 Déconnexion</button>
        </div>
      </nav>
      <main style={{ flex: 1, background: '#f5f7fb', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  nav: {
    width: '260px',
    background: 'linear-gradient(180deg, #2c3e50 0%, #1a252f 100%)',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  menu: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    flex: 1
  },
  menuLink: {
    color: 'white',
    textDecoration: 'none',
    display: 'block',
    padding: '12px 15px',
    borderRadius: '8px',
    marginBottom: '5px',
    transition: 'background 0.2s'
  },
  userSection: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '20px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    background: 'rgba(231, 76, 60, 0.8)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Layout;
