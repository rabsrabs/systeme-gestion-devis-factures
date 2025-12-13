import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileInvoice, FaSearch, FaEye, FaEuroSign } from 'react-icons/fa';
import '../styles/Pages.css';

const Factures = () => {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/factures', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFactures(response.data.data || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      non_payee: 'badge-orange',
      partielle: 'badge-blue',
      payee: 'badge-green',
      en_retard: 'badge-red'
    };
    return badges[statut] || 'badge-gray';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      non_payee: 'Non payée',
      partielle: 'Partiellement payée',
      payee: 'Payée',
      en_retard: 'En retard'
    };
    return labels[statut] || statut;
  };

  const filteredFactures = factures.filter(facture => {
    const matchSearch = facture.numero_facture?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = !filterStatut || facture.statut_paiement === filterStatut;
    return matchSearch && matchStatut;
  });

  // Calcul des statistiques
  const stats = {
    total: factures.length,
    nonPayees: factures.filter(f => f.statut_paiement === 'non_payee').length,
    montantTotal: factures.reduce((sum, f) => sum + parseFloat(f.montant_ttc || 0), 0),
    montantPaye: factures.reduce((sum, f) => sum + parseFloat(f.montant_paye || 0), 0)
  };

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><FaFileInvoice /> Gestion des Factures</h1>
      </div>

      {/* Statistiques */}
      <div className="stats-row">
        <div className="stat-mini blue">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total factures</span>
        </div>
        <div className="stat-mini orange">
          <span className="stat-value">{stats.nonPayees}</span>
          <span className="stat-label">Non payées</span>
        </div>
        <div className="stat-mini green">
          <span className="stat-value">{stats.montantTotal.toFixed(2)} €</span>
          <span className="stat-label">Montant total</span>
        </div>
        <div className="stat-mini purple">
          <span className="stat-value">{stats.montantPaye.toFixed(2)} €</span>
          <span className="stat-label">Montant encaissé</span>
        </div>
      </div>

      <div className="filters">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Rechercher une facture..."
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
          <option value="non_payee">Non payée</option>
          <option value="partielle">Partiellement payée</option>
          <option value="payee">Payée</option>
          <option value="en_retard">En retard</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>N° Facture</th>
              <th>Client</th>
              <th>Date émission</th>
              <th>Échéance</th>
              <th>Montant TTC</th>
              <th>Payé</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFactures.map(facture => (
              <tr key={facture.id_facture}>
                <td><strong>{facture.numero_facture}</strong></td>
                <td>{facture.Client?.nom} {facture.Client?.prenom}</td>
                <td>{new Date(facture.date_emission).toLocaleDateString('fr-FR')}</td>
                <td>{new Date(facture.date_echeance).toLocaleDateString('fr-FR')}</td>
                <td><strong>{parseFloat(facture.montant_ttc || 0).toFixed(2)} €</strong></td>
                <td>
                  <FaEuroSign /> {parseFloat(facture.montant_paye || 0).toFixed(2)} €
                </td>
                <td>
                  <span className={`badge ${getStatutBadge(facture.statut_paiement)}`}>
                    {getStatutLabel(facture.statut_paiement)}
                  </span>
                </td>
                <td className="actions">
                  <button className="btn-icon view" title="Voir détails">
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFactures.length === 0 && (
          <div className="no-data">Aucune facture trouvée</div>
        )}
      </div>
    </div>
  );
};

export default Factures;
