import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaFileAlt, 
  FaFileInvoice, 
  FaTools, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser
} from 'react-icons/fa';
import '../styles/Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const menuItems = [
    { path: '/dashboard', icon: <FaHome />, label: 'Tableau de bord' },
    { path: '/clients', icon: <FaUsers />, label: 'Clients', adminOnly: true },
    { path: '/devis', icon: <FaFileAlt />, label: 'Devis' },
    { path: '/factures', icon: <FaFileInvoice />, label: 'Factures' },
    { path: '/prestations', icon: <FaTools />, label: 'Prestations', adminOnly: true },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly && user?.role !== 'admin') {
      return false;
    }
    return true;
  });

  return (
    <div className="layout">
      {/* Overlay pour mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">📋</span>
          <h2>OMC</h2>
          <button className="close-sidebar" onClick={closeSidebar}>
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-nav">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <FaUser />
            </div>
            <div className="user-details">
              <span className="user-name">{user?.prenom} {user?.nom}</span>
              <span className="user-role">{user?.role === 'admin' ? 'Administrateur' : 'Client'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1 className="page-title">OMC - Gestion des Devis et Factures</h1>
        </header>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
