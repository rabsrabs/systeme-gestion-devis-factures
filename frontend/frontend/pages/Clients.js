import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../styles/Pages.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    ville: '',
    code_postal: '',
    type_client: 'particulier'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(response.data.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (currentClient) {
        await axios.put(`/api/clients/${currentClient.id_client}`, formData, config);
      } else {
        await axios.post('/api/clients', formData, config);
      }
      
      setShowModal(false);
      resetForm();
      fetchClients();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/clients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchClients();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const openEditModal = (client) => {
    setCurrentClient(client);
    setFormData(client);
    setShowModal(true);
  };

  const resetForm = () => {
    setCurrentClient(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      ville: '',
      code_postal: '',
      type_client: 'particulier'
    });
  };

  const filteredClients = clients.filter(client =>
    `${client.nom} ${client.prenom} ${client.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><FaUser /> Gestion des Clients</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <FaPlus /> Nouveau Client
        </button>
      </div>

      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Ville</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr key={client.id_client}>
                <td>{client.prenom} {client.nom}</td>
                <td><FaEnvelope /> {client.email}</td>
                <td><FaPhone /> {client.telephone || '-'}</td>
                <td>{client.ville || '-'}</td>
                <td>
                  <span className={`badge ${client.type_client}`}>
                    {client.type_client}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn-icon edit" onClick={() => openEditModal(client)}>
                    <FaEdit />
                  </button>
                  <button className="btn-icon delete" onClick={() => handleDelete(client.id_client)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClients.length === 0 && (
          <div className="no-data">Aucun client trouvé</div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{currentClient ? 'Modifier le client' : 'Nouveau client'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={formData.nom}
                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Type de client</label>
                <select
                  value={formData.type_client}
                  onChange={(e) => setFormData({...formData, type_client: e.target.value})}
                >
                  <option value="particulier">Particulier</option>
                  <option value="professionnel">Professionnel</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ville</label>
                  <input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData({...formData, ville: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Code postal</label>
                  <input
                    type="text"
                    value={formData.code_postal}
                    onChange={(e) => setFormData({...formData, code_postal: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {currentClient ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
