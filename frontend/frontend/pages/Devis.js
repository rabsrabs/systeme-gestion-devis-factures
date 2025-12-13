import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaFileAlt, 
  FaExchangeAlt, FaEye, FaCheck, FaTimes 
} from 'react-icons/fa';
import '../styles/Pages.css';

const Devis = () => {
  const [devisList, setDevisList] = useState([]);
  const [clients, setClients] = useState([]);
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDevis, setCurrentDevis] = useState(null);
  const [user, setUser] = useState(null);
  
  const [formData, setFormData] = useState({
    id_client: '',
    date_validite: '',
    notes: '',
    lignes: []
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [devisRes, clientsRes, prestationsRes] = await Promise.all([
        axios.get('/api/devis', config),
        axios.get('/api/clients', config),
        axios.get('/api/prestations', config)
      ]);
      
      setDevisList(devisRes.data.data || []);
      setClients(clientsRes.data.data || []);
      setPrestations(prestationsRes.data.data || []);
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

      if (currentDevis) {
        await axios.put(`/api/devis/${currentDevis.id_devis}`, formData, config);
      } else {
        await axios.post('/api/devis', formData, config);
      }
      
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/devis/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const handleChangeStatut = async (id, nouveauStatut) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/devis/${id}/statut`, 
        { statut: nouveauStatut },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleConvertirFacture = async (id) => {
    if (window.confirm('Convertir ce devis en facture ?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`/api/devis/${id}/convertir-facture`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`Facture ${response.data.data.numero_facture} créée avec succès !`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Erreur lors de la conversion');
      }
    }
  };

  const addLigne = () => {
    setFormData({
      ...formData,
      lignes: [...formData.lignes, { id_prestation: '', quantite: 1, prix_unitaire: 0 }]
    });
  };

  const updateLigne = (index, field, value) => {
    const newLignes = [...formData.lignes];
    newLignes[index][field] = value;
    
    if (field === 'id_prestation') {
      const prestation = prestations.find(p => p.id_prestation === parseInt(value));
      if (prestation) {
        newLignes[index].prix_unitaire = prestation.prix_unitaire;
      }
    }
    
    setFormData({ ...formData, lignes: newLignes });
  };

  const removeLigne = (index) => {
    const newLignes = formData.lignes.filter((_, i) => i !== index);
    setFormData({ ...formData, lignes: newLignes });
  };

  const resetForm = () => {
    setCurrentDevis(null);
    setFormData({
      id_client: '',
      date_validite: '',
      notes: '',
      lignes: []
    });
  };

  const getStatutBadge = (statut) => {
    const badges = {
      brouillon: 'badge-gray',
      envoye: 'badge-blue',
      accepte: 'badge-green',
      refuse: 'badge-red',
      expire: 'badge-orange'
    };
    return badges[statut] || 'badge-gray';
  };

  const filteredDevis = devisList.filter(devis => {
    const matchSearch = devis.numero_devis?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = !filterStatut || devis.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><FaFileAlt /> Gestion des Devis</h1>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <FaPlus /> Nouveau Devis
          </button>
        )}
      </div>

      <div className="filters">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher un devis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={filterStatut} 
          onChange={(e) => setFilterStatut(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les statuts</option>
          <option value="brouillon">Brouillon</option>
          <option value="envoye">Envoyé</option>
          <option value="accepte">Accepté</option>
          <option value="refuse">Refusé</option>
          <option value="expire">Expiré</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>N° Devis</th>
              <th>Client</th>
              <th>Date</th>
              <th>Montant TTC</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevis.map(devis => (
              <tr key={devis.id_devis}>
                <td><strong>{devis.numero_devis}</strong></td>
                <td>{devis.Client?.nom} {devis.Client?.prenom}</td>
                <td>{new Date(devis.date_creation).toLocaleDateString('fr-FR')}</td>
                <td><strong>{parseFloat(devis.montant_ttc || 0).toFixed(2)} €</strong></td>
                <td>
                  <span className={`badge ${getStatutBadge(devis.statut)}`}>
                    {devis.statut}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn-icon view" title="Voir">
                    <FaEye />
                  </button>
                  
                  {user?.role === 'admin' && devis.statut === 'brouillon' && (
                    <button 
                      className="btn-icon edit" 
                      onClick={() => handleChangeStatut(devis.id_devis, 'envoye')}
                      title="Envoyer"
                    >
                      <FaCheck />
                    </button>
                  )}
                  
                  {devis.statut === 'envoye' && (
                    <>
                      <button 
                        className="btn-icon success" 
                        onClick={() => handleChangeStatut(devis.id_devis, 'accepte')}
                        title="Accepter"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        className="btn-icon danger" 
                        onClick={() => handleChangeStatut(devis.id_devis, 'refuse')}
                        title="Refuser"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  
                  {user?.role === 'admin' && devis.statut === 'accepte' && (
                    <button 
                      className="btn-icon convert" 
                      onClick={() => handleConvertirFacture(devis.id_devis)}
                      title="Convertir en facture"
                    >
                      <FaExchangeAlt />
                    </button>
                  )}
                  
                  {user?.role === 'admin' && !['accepte', 'refuse'].includes(devis.statut) && (
                    <>
                      <button 
                        className="btn-icon edit" 
                        onClick={() => { setCurrentDevis(devis); setFormData(devis); setShowModal(true); }}
                        title="Modifier"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn-icon delete" 
                        onClick={() => handleDelete(devis.id_devis)}
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDevis.length === 0 && (
          <div className="no-data">Aucun devis trouvé</div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>{currentDevis ? 'Modifier le devis' : 'Nouveau devis'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Client</label>
                  <select
                    value={formData.id_client}
                    onChange={(e) => setFormData({...formData, id_client: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map(client => (
                      <option key={client.id_client} value={client.id_client}>
                        {client.prenom} {client.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date de validité</label>
                  <input
                    type="date"
                    value={formData.date_validite}
                    onChange={(e) => setFormData({...formData, date_validite: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="lignes-section">
                <div className="lignes-header">
                  <h3>Lignes du devis</h3>
                  <button type="button" className="btn-secondary" onClick={addLigne}>
                    <FaPlus /> Ajouter une ligne
                  </button>
                </div>
                
                {formData.lignes.map((ligne, index) => (
                  <div key={index} className="ligne-row">
                    <select
                      value={ligne.id_prestation}
                      onChange={(e) => updateLigne(index, 'id_prestation', e.target.value)}
                      required
                    >
                      <option value="">Prestation</option>
                      {prestations.map(p => (
                        <option key={p.id_prestation} value={p.id_prestation}>
                          {p.nom} - {p.prix_unitaire}€/{p.unite}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={ligne.quantite}
                      onChange={(e) => updateLigne(index, 'quantite', e.target.value)}
                      min="1"
                      placeholder="Qté"
                    />
                    <input
                      type="number"
                      value={ligne.prix_unitaire}
                      onChange={(e) => updateLigne(index, 'prix_unitaire', e.target.value)}
                      step="0.01"
                      placeholder="Prix"
                    />
                    <span className="ligne-total">
                      {(ligne.quantite * ligne.prix_unitaire).toFixed(2)} €
                    </span>
                    <button type="button" className="btn-icon delete" onClick={() => removeLigne(index)}>
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {currentDevis ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devis;
