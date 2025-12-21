import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://10.150.5.69:5001/api';

const Devis = () => {
  const [devis, setDevis] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [lignes, setLignes] = useState([{ produit_id: '', quantite: 1 }]);
  const [formData, setFormData] = useState({ taux_tva: 21, notes: '' });
  const [totaux, setTotaux] = useState({ htva: 0, tva: 0, tvac: 0 });
  const [expandedDevis, setExpandedDevis] = useState(null);
  
  // État pour la remise
  const [showRemiseModal, setShowRemiseModal] = useState(null);
  const [remiseData, setRemiseData] = useState({ pourcentage: 0, raison: '' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const isAdmin = user.role === 'admin';

  const produits = [
    { id: 1, nom: 'Panneau Solaire Monocristallin 305W', prix: 224.95 },
    { id: 2, nom: 'Aiko 445Wp Lichtgewicht', prix: 139.63 },
    { id: 3, nom: 'Panneau Solaire Polycristallin 270W', prix: 164.95 },
    { id: 4, nom: 'Onduleur Phoenix 12V/500W', prix: 189.00 },
    { id: 5, nom: 'Batterie Lithium 12.8V 200Ah', prix: 1299.00 }
  ];

  useEffect(() => { fetchDevis(); }, []);
  useEffect(() => { calculerTotaux(); }, [lignes, formData.taux_tva]);

  const calculerTotaux = () => {
    const htva = lignes.reduce((sum, l) => {
      const p = produits.find(x => x.id === parseInt(l.produit_id));
      return sum + (parseFloat(l.quantite || 0) * (p?.prix || 0));
    }, 0);
    const tva = htva * (parseFloat(formData.taux_tva) / 100);
    setTotaux({ htva: htva.toFixed(2), tva: tva.toFixed(2), tvac: (htva + tva).toFixed(2) });
  };

  const fetchDevis = async () => {
    try {
      const res = await axios.get(`${API_URL}/devis`, config);
      let data = res.data.data || [];
      if (!isAdmin) data = data.filter(d => d.Client?.email === user.email);
      setDevis(data);
    } catch (err) { console.error(err); }
  };

  const updateLigne = (i, field, val) => {
    const newL = [...lignes];
    newL[i][field] = val;
    setLignes(newL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lignes.every(l => !l.produit_id)) return alert('Ajoutez au moins un produit');
    try {
      const response = await axios.post(`${API_URL}/devis`, {
        ...formData,
        lignes: lignes.filter(l => l.produit_id).map(l => {
          const p = produits.find(x => x.id === parseInt(l.produit_id));
          return { description_personnalisee: p?.nom, prix_unitaire: p?.prix, quantite: l.quantite };
        }),
        montant_ht: totaux.htva, montant_tva: totaux.tva, montant_ttc: totaux.tvac
      }, config);
      if (response.data.success) {
        alert('Demande envoyée !');
        setShowForm(false);
        setLignes([{ produit_id: '', quantite: 1 }]);
        fetchDevis();
      }
    } catch (err) { alert('Erreur: ' + (err.response?.data?.message || err.message)); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ?')) {
      await axios.delete(`${API_URL}/devis/${id}`, config);
      fetchDevis();
    }
  };

  const updateStatut = async (id, statut) => {
    await axios.patch(`${API_URL}/devis/${id}/statut`, { statut }, config);
    fetchDevis();
  };

  const convertir = async (id) => {
    if (window.confirm('Convertir en facture ?')) {
      await axios.post(`${API_URL}/devis/${id}/convertir-facture`, {}, config);
      alert('Facture créée !');
      fetchDevis();
    }
  };

  const toggleDetails = (id) => {
    setExpandedDevis(expandedDevis === id ? null : id);
  };

  // Fonction pour appliquer la remise
  const appliquerRemise = async (id) => {
    if (!remiseData.pourcentage || remiseData.pourcentage <= 0) {
      return alert('Veuillez entrer un pourcentage de remise valide');
    }
    if (!remiseData.raison.trim()) {
      return alert('Veuillez indiquer la raison de la remise');
    }

    try {
      await axios.patch(`${API_URL}/devis/${id}/remise`, {
        remise: remiseData.pourcentage,
        raison_remise: remiseData.raison
      }, config);
      
      alert(`Remise de ${remiseData.pourcentage}% appliquée avec succès !`);
      setShowRemiseModal(null);
      setRemiseData({ pourcentage: 0, raison: '' });
      fetchDevis();
    } catch (err) {
      alert('Erreur: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStatut = (s) => {
    const colors = { brouillon: '#ff9800', envoye: '#2196f3', accepte: '#4caf50', refuse: '#f44336' };
    const labels = { brouillon: 'En attente', envoye: 'Envoyé', accepte: 'Accepté', refuse: 'Refusé' };
    return <span style={{ background: colors[s] || '#999', color: '#fff', padding: '4px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>{labels[s] || s}</span>;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb' }}>
      {/* Modal Remise */}
      {showRemiseModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '450px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#667eea', display: 'flex', alignItems: 'center', gap: '10px' }}>
              🏷️ Appliquer une Remise
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Pourcentage de remise (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={remiseData.pourcentage}
                onChange={(e) => setRemiseData({ ...remiseData, pourcentage: parseFloat(e.target.value) || 0 })}
                style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '18px', textAlign: 'center' }}
                placeholder="Ex: 10"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Raison de la remise
              </label>
              <textarea
                value={remiseData.raison}
                onChange={(e) => setRemiseData({ ...remiseData, raison: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}
                placeholder="Ex: Fidélité client, Offre promotionnelle, Remise commerciale..."
              />
            </div>

            {remiseData.pourcentage > 0 && (
              <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <div style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                  Aperçu: -{remiseData.pourcentage}% de remise
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => appliquerRemise(showRemiseModal)}
                style={{ flex: 1, padding: '12px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
              >
                ✓ Appliquer
              </button>
              <button
                onClick={() => { setShowRemiseModal(null); setRemiseData({ pourcentage: 0, raison: '' }); }}
                style={{ flex: 1, padding: '12px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>{isAdmin ? '📄 Gestion des Devis' : '📄 Mes Demandes de Devis'}</h1>
            <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>{devis.length} devis au total</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => window.location.href = '/dashboard'} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer' }}>
              ← Retour
            </button>
            {!isAdmin && (
              <button onClick={() => setShowForm(true)} style={{ padding: '12px 25px', background: 'white', color: '#667eea', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                + Nouvelle Demande
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        
        {showForm && !isAdmin && (
          <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#667eea', margin: '0 0 20px 0' }}>📝 Nouvelle Demande de Devis</h2>
            <div style={{ background: '#f0f7ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <strong>Client:</strong> {user.prenom} {user.nom} - {user.email}
            </div>
            <form onSubmit={handleSubmit}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                  <tr>
                    <th style={{ background: '#667eea', color: '#fff', padding: '12px', textAlign: 'left' }}>Produit</th>
                    <th style={{ background: '#667eea', color: '#fff', padding: '12px', textAlign: 'right', width: '100px' }}>Prix unit.</th>
                    <th style={{ background: '#667eea', color: '#fff', padding: '12px', textAlign: 'center', width: '80px' }}>Qté</th>
                    <th style={{ background: '#667eea', color: '#fff', padding: '12px', textAlign: 'right', width: '100px' }}>Total</th>
                    <th style={{ background: '#667eea', color: '#fff', padding: '12px', width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((l, i) => {
                    const p = produits.find(x => x.id === parseInt(l.produit_id));
                    return (
                      <tr key={i}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                          <select value={l.produit_id} onChange={e => updateLigne(i, 'produit_id', e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}>
                            <option value="">-- Choisir un produit --</option>
                            {produits.map(pr => <option key={pr.id} value={pr.id}>{pr.nom}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{p ? `${p.prix.toFixed(2)} €` : '-'}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                          <input type="number" min="1" value={l.quantite} onChange={e => updateLigne(i, 'quantite', e.target.value)} style={{ width: '60px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', textAlign: 'center' }} />
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 'bold' }}>{p ? `${(p.prix * l.quantite).toFixed(2)} €` : '-'}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                          {lignes.length > 1 && <button type="button" onClick={() => setLignes(lignes.filter((_, j) => j !== i))} style={{ padding: '8px 12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>×</button>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button type="button" onClick={() => setLignes([...lignes, { produit_id: '', quantite: 1 }])} style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '20px' }}>+ Ajouter un produit</button>
              
              <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span>Total HTVA:</span><span>{totaux.htva} €</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span>TVA (21%):</span><span>{totaux.tva} €</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '1.2rem', fontWeight: 'bold', borderTop: '2px solid #667eea', marginTop: '10px' }}><span>Total TVAC:</span><span style={{ color: '#667eea' }}>{totaux.tvac} €</span></div>
              </div>
              
              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button type="submit" style={{ flex: 1, padding: '15px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>✓ Envoyer la demande</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '15px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Annuler</button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des devis */}
        {devis.map(d => (
          <div key={d.id_devis} style={{ background: 'white', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            {/* En-tête du devis */}
            <div 
              style={{ padding: '20px', cursor: 'pointer', borderBottom: expandedDevis === d.id_devis ? '1px solid #eee' : 'none' }}
              onClick={() => toggleDetails(d.id_devis)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 'bold', color: '#667eea', fontSize: '18px' }}>{d.numero_devis}</span>
                    {getStatut(d.statut)}
                    {parseFloat(d.remise || 0) > 0 && (
                      <span style={{ background: '#ff9800', color: 'white', padding: '4px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                        🏷️ -{d.remise}%
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#666', marginBottom: '5px' }}>
                    👤 <strong>{d.Client?.nom} {d.Client?.prenom}</strong> - {d.Client?.email}
                  </div>
                  <div style={{ display: 'flex', gap: '20px', color: '#888', fontSize: '14px' }}>
                    <span>📅 {new Date(d.date_creation).toLocaleDateString('fr-FR')}</span>
                    <span>📦 {d.LigneDevis?.length || 0} article(s)</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea' }}>{parseFloat(d.montant_ttc || 0).toFixed(2)} €</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>TTC</div>
                </div>
              </div>
              <div style={{ marginTop: '10px', color: '#667eea', fontSize: '14px' }}>
                {expandedDevis === d.id_devis ? '▲ Masquer les détails' : '▼ Voir les détails des articles'}
              </div>
            </div>

            {/* Détails des articles (expandable) */}
            {expandedDevis === d.id_devis && (
              <div style={{ padding: '20px', background: '#f8f9fa' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>📦 Détail des articles commandés</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
                  <thead>
                    <tr>
                      <th style={{ background: '#667eea', color: 'white', padding: '12px', textAlign: 'left' }}>Article</th>
                      <th style={{ background: '#667eea', color: 'white', padding: '12px', textAlign: 'right', width: '100px' }}>Prix unit.</th>
                      <th style={{ background: '#667eea', color: 'white', padding: '12px', textAlign: 'center', width: '80px' }}>Quantité</th>
                      <th style={{ background: '#667eea', color: 'white', padding: '12px', textAlign: 'right', width: '120px' }}>Total ligne</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.LigneDevis && d.LigneDevis.length > 0 ? (
                      d.LigneDevis.map((ligne, idx) => (
                        <tr key={idx}>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                            <strong>{ligne.description_personnalisee || ligne.Prestation?.nom || 'Article'}</strong>
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right' }}>
                            {parseFloat(ligne.prix_unitaire || 0).toFixed(2)} €
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                            <span style={{ background: '#667eea', color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' }}>
                              {ligne.quantite}
                            </span>
                          </td>
                          <td style={{ padding: '12px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 'bold' }}>
                            {(parseFloat(ligne.prix_unitaire || 0) * parseInt(ligne.quantite || 1)).toFixed(2)} €
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                          Aucun détail disponible pour ce devis
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f0f0f0' }}>
                      <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Sous-total HTVA:</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>{parseFloat(d.montant_ht || 0).toFixed(2)} €</td>
                    </tr>
                    {parseFloat(d.remise || 0) > 0 && (
                      <>
                        <tr style={{ background: '#fff3e0' }}>
                          <td colSpan="3" style={{ padding: '12px', textAlign: 'right', color: '#e65100' }}>
                            <strong>🏷️ Remise ({d.remise}%)</strong>
                            {d.raison_remise && <div style={{ fontSize: '12px', fontStyle: 'italic' }}>Raison: {d.raison_remise}</div>}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', color: '#e65100', fontWeight: 'bold' }}>
                            -{(parseFloat(d.montant_ht || 0) * parseFloat(d.remise) / 100).toFixed(2)} €
                          </td>
                        </tr>
                        <tr style={{ background: '#f0f0f0' }}>
                          <td colSpan="3" style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>Total HTVA après remise:</td>
                          <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                            {(parseFloat(d.montant_ht || 0) * (1 - parseFloat(d.remise) / 100)).toFixed(2)} €
                          </td>
                        </tr>
                      </>
                    )}
                    <tr style={{ background: '#f0f0f0' }}>
                      <td colSpan="3" style={{ padding: '12px', textAlign: 'right' }}>TVA ({d.taux_tva || 21}%):</td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>{parseFloat(d.montant_tva || 0).toFixed(2)} €</td>
                    </tr>
                    <tr style={{ background: '#667eea', color: 'white' }}>
                      <td colSpan="3" style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>Total TVAC:</td>
                      <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '18px' }}>{parseFloat(d.montant_ttc || 0).toFixed(2)} €</td>
                    </tr>
                  </tfoot>
                </table>

                {/* Actions admin */}
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowRemiseModal(d.id_devis); setRemiseData({ pourcentage: parseFloat(d.remise) || 0, raison: d.raison_remise || '' }); }} 
                      style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: '#ff9800', color: 'white', fontWeight: 'bold' }}
                    >
                      🏷️ {parseFloat(d.remise || 0) > 0 ? 'Modifier remise' : 'Appliquer remise'}
                    </button>
                    <select 
                      value={d.statut} 
                      onChange={e => updateStatut(d.id_devis, e.target.value)} 
                      style={{ padding: '10px 15px', border: '2px solid #667eea', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <option value="brouillon">⏳ En attente</option>
                      <option value="accepte">✓ Accepter</option>
                      <option value="refuse">✗ Refuser</option>
                    </select>
                    {d.statut === 'accepte' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); convertir(d.id_devis); }} 
                        style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: '#4caf50', color: 'white', fontWeight: 'bold' }}
                      >
                        📑 Convertir en facture
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(d.id_devis); }} 
                      style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: '#f44336', color: 'white' }}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {devis.length === 0 && (
          <div style={{ background: '#fff', padding: '50px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📄</div>
            <h3 style={{ color: '#666', margin: '0 0 10px 0' }}>Aucun devis</h3>
            <p style={{ color: '#999' }}>{isAdmin ? 'Aucune demande de devis pour le moment' : 'Vous n\'avez pas encore fait de demande de devis'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Devis;
