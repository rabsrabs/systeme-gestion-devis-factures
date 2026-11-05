import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({ devis: 0, factures: 0, montant: 0, clients: 0, collaborateurs: 0 });
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    if (token) fetchStats();
    setProfileData({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      adresse: user.adresse || '',
      ville: user.ville || '',
      code_postal: user.code_postal || ''
    });
  }, []);

  const fetchStats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const devisRes = await axios.get('/api/devis', config);
      let devisData = devisRes.data.data || [];
      const facturesRes = await axios.get('/api/factures', config);
      let facturesData = facturesRes.data.data || [];
      
      if (!isAdmin) {
        devisData = devisData.filter(d => d.Client?.email === user.email);
        facturesData = facturesData.filter(f => f.Client?.email === user.email);
      }
      
      let clientsCount = 0;
      let collaborateursCount = 0;
      if (isAdmin) {
        try {
          const clientsRes = await axios.get('/api/clients', config);
          clientsCount = clientsRes.data.data?.length || 0;
        } catch (e) { }
        try {
          const usersRes = await axios.get('/api/utilisateurs', config);
          collaborateursCount = (usersRes.data.data || []).filter(u => u.role === 'admin').length;
        } catch (e) { }
      }
      
      setStats({
        devis: devisData.length,
        factures: facturesData.length,
        montant: facturesData.reduce((sum, f) => sum + parseFloat(f.montant_restant || 0), 0),
        clients: clientsCount,
        collaborateurs: collaborateursCount
      });
    } catch (err) { console.error('Erreur:', err); }
  };

  const handleSaveProfile = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`/api/clients/${user.id_client}`, profileData, config);
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setShowEditProfile(false);
      alert('Profil mis à jour avec succès !');
      window.location.reload();
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer votre compte ?\n\nCette action est irréversible et supprimera toutes vos données.');
    if (confirmDelete) {
      const doubleConfirm = window.confirm('Dernière confirmation : Voulez-vous vraiment supprimer définitivement votre compte ?');
      if (doubleConfirm) {
        try {
          const config = { headers: { Authorization: `Bearer ${token}` } };
          await axios.delete(`/api/clients/${user.id_client}`, config);
          alert('Votre compte a été supprimé avec succès.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } catch (error) {
          alert('Erreur lors de la suppression du compte. Vous avez peut-être des factures en cours.');
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb' }}>
      {/* Header avec logo */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '40px' }}>☀️</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px' }}>Anneessens & Co</h1>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Solutions Panneaux Solaires</p>
            </div>
          </div>
          <button onClick={handleLogout} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {/* Bienvenue */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: 0 }}>
            {isAdmin ? '🔧 Tableau de bord Admin' : '👤 Mon Espace Client'}
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Bienvenue, {user.prenom} {user.nom} 
            <span style={{ 
              marginLeft: '10px', 
              padding: '3px 10px', 
              background: isAdmin ? '#667eea' : '#4caf50', 
              color: 'white', 
              borderRadius: '20px', 
              fontSize: '12px' 
            }}>
              {isAdmin ? 'Admin' : 'Client'}
            </span>
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          {isAdmin && (
            <>
              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '50px', height: '50px', background: '#fce4ec', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👥</div>
                  <div>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>CLIENTS</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>{stats.clients}</p>
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '50px', height: '50px', background: '#e8eaf6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👔</div>
                  <div>
                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>COLLABORATEURS</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>{stats.collaborateurs}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', background: '#e3f2fd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📄</div>
              <div>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{isAdmin ? 'DEMANDES DE DEVIS' : 'MES DEMANDES'}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>{stats.devis}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', background: '#e8f5e9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🧾</div>
              <div>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{isAdmin ? 'FACTURES' : 'MES FACTURES'}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>{stats.factures}</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', background: '#fff3e0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>💶</div>
              <div>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{isAdmin ? 'MONTANT TOTAL DÛ' : 'MON MONTANT DÛ'}</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '28px', fontWeight: 'bold' }}>{stats.montant.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: '0 0 20px 0' }}>📁 Actions rapides</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            
            {isAdmin ? (
              <>
                <a href="/clients" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#fce4ec', borderRadius: '10px', textDecoration: 'none', color: '#333', border: '2px solid #e91e63' }}>
                  <span style={{ fontSize: '24px' }}>👥</span>
                  <span style={{ fontWeight: '500' }}>Mes Clients</span>
                </a>
                <a href="/collaborateurs" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#e8eaf6', borderRadius: '10px', textDecoration: 'none', color: '#333', border: '2px solid #3f51b5' }}>
                  <span style={{ fontSize: '24px' }}>👔</span>
                  <span style={{ fontWeight: '500' }}>Mes Collaborateurs</span>
                </a>
                <a href="/devis" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#e3f2fd', borderRadius: '10px', textDecoration: 'none', color: '#333', border: '2px solid #2196f3' }}>
                  <span style={{ fontSize: '24px' }}>📄</span>
                  <span style={{ fontWeight: '500' }}>Traiter les demandes</span>
                </a>
              </>
            ) : (
              <>
                <a href="/devis" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#e3f2fd', borderRadius: '10px', textDecoration: 'none', color: '#333', border: '2px solid #2196f3' }}>
                  <span style={{ fontSize: '24px' }}>➕</span>
                  <span style={{ fontWeight: '500' }}>Nouvelle demande de devis</span>
                </a>
                <button onClick={() => setShowEditProfile(true)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#fff3e0', borderRadius: '10px', textDecoration: 'none', color: '#333', border: '2px solid #ff9800', cursor: 'pointer', width: '100%' }}>
                  <span style={{ fontSize: '24px' }}>✏️</span>
                  <span style={{ fontWeight: '500' }}>Modifier mes informations</span>
                </button>
              </>
            )}

            <a href="/devis" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#f5f7fb', borderRadius: '10px', textDecoration: 'none', color: '#333' }}>
              <span style={{ fontSize: '24px' }}>📋</span>
              <span style={{ fontWeight: '500' }}>{isAdmin ? 'Tous les devis' : 'Mes demandes'}</span>
            </a>

            <a href="/factures" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#f5f7fb', borderRadius: '10px', textDecoration: 'none', color: '#333' }}>
              <span style={{ fontSize: '24px' }}>🧾</span>
              <span style={{ fontWeight: '500' }}>{isAdmin ? 'Toutes les factures' : 'Mes factures'}</span>
            </a>

            <a href="/produits" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#e8f5e9', borderRadius: '10px', textDecoration: 'none', color: '#333', border: '2px solid #4caf50' }}>
              <span style={{ fontSize: '24px' }}>☀️</span>
              <span style={{ fontWeight: '500' }}>Nos Produits Solaires</span>
            </a>

            {!isAdmin && (
              <button onClick={handleDeleteAccount} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', background: '#ffebee', borderRadius: '10px', textDecoration: 'none', color: '#c62828', border: '2px solid #e53935', cursor: 'pointer', width: '100%' }}>
                <span style={{ fontSize: '24px' }}>🗑️</span>
                <span style={{ fontWeight: '500' }}>Supprimer mon compte</span>
              </button>
            )}

          </div>
        </div>

      </div>

      {/* Modal Modifier Profil */}
      {showEditProfile && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#667eea' }}>✏️ Modifier mes informations</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Nom</label>
                <input
                  type="text"
                  value={profileData.nom}
                  onChange={(e) => setProfileData({...profileData, nom: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Prénom</label>
                <input
                  type="text"
                  value={profileData.prenom}
                  onChange={(e) => setProfileData({...profileData, prenom: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Téléphone</label>
                <input
                  type="text"
                  value={profileData.telephone}
                  onChange={(e) => setProfileData({...profileData, telephone: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Adresse</label>
                <input
                  type="text"
                  value={profileData.adresse}
                  onChange={(e) => setProfileData({...profileData, adresse: e.target.value})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Ville</label>
                  <input
                    type="text"
                    value={profileData.ville}
                    onChange={(e) => setProfileData({...profileData, ville: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Code postal</label>
                  <input
                    type="text"
                    value={profileData.code_postal}
                    onChange={(e) => setProfileData({...profileData, code_postal: e.target.value})}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
              <button
                onClick={handleSaveProfile}
                style={{ flex: 1, padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '16px' }}
              >
                💾 Sauvegarder
              </button>
              <button
                onClick={() => setShowEditProfile(false)}
                style={{ flex: 1, padding: '12px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '16px' }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
