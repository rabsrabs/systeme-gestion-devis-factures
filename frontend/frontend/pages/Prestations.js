import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTools, FaTag } from 'react-icons/fa';
import '../styles/Pages.css';

const Prestations = () => {
  const [prestations, setPrestations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategorie, setFilterCategorie] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPrestation, setCurrentPrestation] = useState(null);
  
  const [formData, setFormData] = useState({
    code_prestation: '',
    nom: '',
    description: '',
    categorie: '',
    sous_categorie: '',
    unite: 'unité',
    prix_unitaire: '',
    tva_applicable: 21
  });

  // Catégories prédéfinies
  const categories = {
    'Électricité': ['Installation', 'Réparation', 'Maintenance', 'Dépannage'],
    'Plomberie': ['Installation', 'Réparation', 'Débouchage', 'Maintenance'],
    'Chauffage': ['Installation', 'Entretien', 'Réparation', 'Dépannage'],
    'Isolation': ['Toiture', 'Murs', 'Sol', 'Fenêtres'],
    'Rénovation': ['Énergétique', 'Intérieure', 'Extérieure', 'Complète'],
    'Autre': ['Divers']
  };

  useEffect(() => {
    fetchPrestations();
  }, []);

  const fetchPrestations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/prestations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrestations(response.data.data || []);
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

      if (currentPrestation) {
        await axios.put(`/api/prestations/${currentPrestation.id_prestation}`, formData, config);
      } else {
        await axios.post('/api/prestations', formData, config);
      }
      
      setShowModal(false);
      resetForm();
      fetchPrestations();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/prestations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPrestations();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const openEditModal = (prestation) => {
    setCurrentPrestation(prestation);
    setFormData(prestation);
    setShowModal(true);
  };

  const resetForm = () => {
    setCurrentPrestation(null);
    setFormData({
      code_prestation: '',
      nom: '',
      description: '',
      categorie: '',
      sous_categorie: '',
      unite: 'unité',
      prix_unitaire: '',
      tva_applicable: 21
    });
  };

  const handleCategorieChange = (categorie) => {
    setFormData({
      ...formData,
      categorie,
      sous_categorie: ''
    });
  };

  // Obtenir les catégories uniques des prestations existantes
  const uniqueCategories = [...new Set(prestations.map(p => p.categorie))];

  const filteredPrestations = prestations.filter(prestation => {
    const matchSearch = prestation.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        prestation.code_prestation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategorie = !filterCategorie || prestation.categorie === filterCategorie;
    return matchSearch && matchCategorie;
  });

  // Grouper par catégorie
  const groupedPrestations = filteredPrestations.reduce((acc, p) => {
    const cat = p.categorie || 'Autre';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><FaTools /> Gestion des Prestations</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <FaPlus /> Nouvelle Prestation
        </button>
      </div>

      <div className="filters">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher une prestation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={filterCategorie} 
          onChange={(e) => setFilterCategorie(e.target.value)}
          className="filter-select"
        >
          <option value="">Toutes les catégories</option>
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Affichage par catégorie */}
      <div className="prestations-grid">
        {Object.entries(groupedPrestations).map(([categorie, items]) => (
          <div key={categorie} className="categorie-section">
            <h2 className="categorie-title">
              <FaTag /> {categorie}
              <span className="count">({items.length})</span>
            </h2>
            <div className="prestations-list">
              {items.map(prestation => (
                <div key={prestation.id_prestation} className="prestation-card">
                  <div className="prestation-header">
                    <span className="code">{prestation.code_prestation}</span>
                    {prestation.sous_categorie && (
                      <span className="sous-categorie">{prestation.sous_categorie}</span>
                    )}
                  </div>
                  <h3>{prestation.nom}</h3>
                  <p className="description">{prestation.description}</p>
                  <div className="prestation-footer">
                    <div className="prix">
                      <strong>{parseFloat(prestation.prix_unitaire).toFixed(2)} €</strong>
                      <span>/ {prestation.unite}</span>
                    </div>
                    <div className="tva">TVA: {prestation.tva_applicable}%</div>
                  </div>
                  <div className="prestation-actions">
                    <button className="btn-icon edit" onClick={() => openEditModal(prestation)}>
                      <FaEdit />
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDelete(prestation.id_prestation)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredPrestations.length === 0 && (
        <div className="no-data">Aucune prestation trouvée</div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{currentPrestation ? 'Modifier la prestation' : 'Nouvelle prestation'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Code</label>
                  <input
                    type="text"
                    value={formData.code_prestation}
                    onChange={(e) => setFormData({...formData, code_prestation: e.target.value})}
                    placeholder="Ex: ELEC-001"
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
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => handleCategorieChange(e.target.value)}
                    required
                  >
                    <option value="">Sélectionner</option>
                    {Object.keys(categories).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sous-catégorie</label>
                  <select
                    value={formData.sous_categorie}
                    onChange={(e) => setFormData({...formData, sous_categorie: e.target.value})}
                    disabled={!formData.categorie}
                  >
                    <option value="">Sélectionner</option>
                    {formData.categorie && categories[formData.categorie]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prix unitaire (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.prix_unitaire}
                    onChange={(e) => setFormData({...formData, prix_unitaire: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unité</label>
                  <select
                    value={formData.unite}
                    onChange={(e) => setFormData({...formData, unite: e.target.value})}
                  >
                    <option value="unité">Unité</option>
                    <option value="heure">Heure</option>
                    <option value="jour">Jour</option>
                    <option value="m²">m²</option>
                    <option value="ml">mètre linéaire</option>
                    <option value="forfait">Forfait</option>
                    <option value="intervention">Intervention</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>TVA (%)</label>
                  <select
                    value={formData.tva_applicable}
                    onChange={(e) => setFormData({...formData, tva_applicable: e.target.value})}
                  >
                    <option value="21">21% (Standard)</option>
                    <option value="6">6% (Réduit)</option>
                    <option value="0">0% (Exonéré)</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  {currentPrestation ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prestations;
