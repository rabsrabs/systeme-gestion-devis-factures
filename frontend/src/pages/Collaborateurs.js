import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Collaborateurs() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchCollaborateurs();
  }, []);

  const fetchCollaborateurs = async () => {
    try {
      const res = await axios.get('http://10.150.5.69:5001/api/utilisateurs', config);
      const admins = (res.data.data || []).filter(u => u.role === 'admin');
      setCollaborateurs(admins);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb' }}>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '40px' }}>☀️</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px' }}>Anneessens & Co</h1>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Solutions Panneaux Solaires</p>
            </div>
          </div>
          <button onClick={() => window.location.href = '/dashboard'} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer' }}>
            ← Retour au Dashboard
          </button>
        </div>
      </div>

      <div style={styles.container}>
        <h1 style={styles.title}>👔 Mes Collaborateurs (Administrateurs)</h1>
        <p style={styles.subtitle}>{collaborateurs.length} collaborateur(s) enregistré(s)</p>

        {collaborateurs.length === 0 ? (
          <div style={styles.empty}>Aucun collaborateur pour le moment</div>
        ) : (
          <div style={styles.grid}>
            {collaborateurs.map(collab => (
              <div key={collab.id_utilisateur} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.avatar}>{(collab.prenom || 'A')[0].toUpperCase()}</span>
                  <div>
                    <h3 style={styles.collabName}>{collab.prenom} {collab.nom}</h3>
                    <span style={styles.badge}>👑 Administrateur</span>
                  </div>
                </div>
                <div style={styles.cardBody}>
                  <p>📧 {collab.email}</p>
                  {collab.telephone && <p>📞 {collab.telephone}</p>}
                  <p>📅 Inscrit le {new Date(collab.date_creation).toLocaleDateString('fr-FR')}</p>
                  <p style={{ color: collab.actif ? '#4caf50' : '#f44336' }}>
                    {collab.actif ? '✅ Actif' : '❌ Inactif'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  title: { color: '#667eea', marginBottom: '5px' },
  subtitle: { color: '#666', marginBottom: '30px' },
  loading: { textAlign: 'center', padding: '50px', fontSize: '18px' },
  empty: { textAlign: 'center', padding: '50px', color: '#999', fontSize: '18px', background: 'white', borderRadius: '12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' },
  collabName: { margin: 0, fontSize: '18px', color: '#333' },
  badge: { fontSize: '12px', color: '#fff', background: '#667eea', padding: '4px 10px', borderRadius: '20px', display: 'inline-block', marginTop: '5px' },
  cardBody: { borderTop: '1px solid #eee', paddingTop: '15px' }
};

export default Collaborateurs;
