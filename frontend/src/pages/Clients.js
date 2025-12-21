import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get('http://10.150.5.69:5001/api/clients', config);
      setClients(res.data.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client.id_client);
    setFormData({
      nom: client.nom || '',
      prenom: client.prenom || '',
      email: client.email || '',
      telephone: client.telephone || '',
      adresse: client.adresse || '',
      ville: client.ville || '',
      code_postal: client.code_postal || '',
      numero_tva: client.numero_tva || ''
    });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://10.150.5.69:5001/api/clients/${id}`, formData, config);
      setEditingClient(null);
      fetchClients();
      alert('Client mis à jour !');
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce client ?')) {
      try {
        await axios.delete(`http://10.150.5.69:5001/api/clients/${id}`, config);
        fetchClients();
        alert('Client supprimé !');
      } catch (error) {
        alert('Erreur: Ce client a peut-être des devis/factures associés');
      }
    }
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>👥 Gestion des Clients</h1>
      <p style={styles.subtitle}>{clients.length} client(s) enregistré(s)</p>

      {clients.length === 0 ? (
        <div style={styles.empty}>Aucun client pour le moment</div>
      ) : (
        <div style={styles.grid}>
          {clients.map(client => (
            <div key={client.id_client} style={styles.card}>
              {editingClient === client.id_client ? (
                <div style={styles.editForm}>
                  <input
                    style={styles.input}
                    placeholder="Nom"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  />
                  <input
                    style={styles.input}
                    placeholder="Prénom"
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  />
                  <input
                    style={styles.input}
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input
                    style={styles.input}
                    placeholder="Téléphone"
                    value={formData.telephone}
                    onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  />
                  <input
                    style={styles.input}
                    placeholder="Adresse"
                    value={formData.adresse}
                    onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                  />
                  <input
                    style={styles.input}
                    placeholder="Ville"
                    value={formData.ville}
                    onChange={(e) => setFormData({...formData, ville: e.target.value})}
                  />
                  <input
                    style={styles.input}
                    placeholder="Code postal"
                    value={formData.code_postal}
                    onChange={(e) => setFormData({...formData, code_postal: e.target.value})}
                  />
                  <input
                    style={styles.input}
                    placeholder="N° TVA"
                    value={formData.numero_tva}
                    onChange={(e) => setFormData({...formData, numero_tva: e.target.value})}
                  />
                  <div style={styles.btnGroup}>
                    <button style={styles.btnSave} onClick={() => handleSave(client.id_client)}>💾 Sauvegarder</button>
                    <button style={styles.btnCancel} onClick={() => setEditingClient(null)}>Annuler</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={styles.cardHeader}>
                    <span style={styles.avatar}>{(client.nom || 'C')[0].toUpperCase()}</span>
                    <div>
                      <h3 style={styles.clientName}>{client.nom} {client.prenom}</h3>
                      <span style={styles.clientType}>{client.type_client || 'particulier'}</span>
                    </div>
                  </div>
                  <div style={styles.cardBody}>
                    <p>📧 {client.email}</p>
                    {client.telephone && <p>📞 {client.telephone}</p>}
                    {client.adresse && <p>📍 {client.adresse}</p>}
                    {(client.code_postal || client.ville) && (
                      <p>🏙️ {client.code_postal} {client.ville}</p>
                    )}
                    {client.numero_tva && <p>🏢 TVA: {client.numero_tva}</p>}
                  </div>
                  <div style={styles.cardFooter}>
                    <button style={styles.btnEdit} onClick={() => handleEdit(client)}>✏️ Modifier</button>
                    <button style={styles.btnDelete} onClick={() => handleDelete(client.id_client)}>🗑️ Supprimer</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  title: { color: '#667eea', marginBottom: '5px' },
  subtitle: { color: '#666', marginBottom: '30px' },
  loading: { textAlign: 'center', padding: '50px', fontSize: '18px' },
  empty: { textAlign: 'center', padding: '50px', color: '#999', fontSize: '18px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  avatar: { width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' },
  clientName: { margin: 0, fontSize: '18px', color: '#333' },
  clientType: { fontSize: '12px', color: '#667eea', textTransform: 'capitalize' },
  cardBody: { borderTop: '1px solid #eee', paddingTop: '15px', marginBottom: '15px' },
  cardFooter: { display: 'flex', gap: '10px' },
  btnEdit: { flex: 1, padding: '8px', border: 'none', borderRadius: '6px', background: '#667eea', color: '#fff', cursor: 'pointer' },
  btnDelete: { flex: 1, padding: '8px', border: 'none', borderRadius: '6px', background: '#e74c3c', color: '#fff', cursor: 'pointer' },
  editForm: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' },
  btnGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
  btnSave: { flex: 1, padding: '10px', border: 'none', borderRadius: '6px', background: '#27ae60', color: '#fff', cursor: 'pointer' },
  btnCancel: { flex: 1, padding: '10px', border: 'none', borderRadius: '6px', background: '#95a5a6', color: '#fff', cursor: 'pointer' }
};

export default Clients;
