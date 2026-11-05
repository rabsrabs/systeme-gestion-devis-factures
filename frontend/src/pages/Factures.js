import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = '/api';

const Factures = () => {
  const [factures, setFactures] = useState([]);
  const [peppolLoading, setPeppolLoading] = useState({});
  const [peppolStatus, setPeppolStatus] = useState({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    try {
      const res = await axios.get(`${API_URL}/factures`, config);
      let data = res.data.data || [];
      if (!isAdmin) {
        data = data.filter(f => f.Client?.email === user.email);
      }
      setFactures(data);
      
      // Vérifier le statut PEPPOL pour chaque facture
      data.forEach(f => checkPeppolStatus(f.id_facture));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const checkPeppolStatus = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/peppol/facture/${id}/status`, config);
      setPeppolStatus(prev => ({ ...prev, [id]: res.data.data.sent }));
    } catch (err) {
      console.error('Erreur statut PEPPOL:', err);
    }
  };

  const downloadPDF = async (id, numero) => {
    try {
      const response = await axios.get(`${API_URL}/factures/${id}/pdf`, {
        ...config,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture-${numero}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erreur lors du téléchargement du PDF');
      console.error(err);
    }
  };

  const downloadPeppolXML = async (id, numero) => {
    try {
      const response = await axios.get(`${API_URL}/peppol/facture/${id}/xml`, {
        ...config,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/xml' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PEPPOL_${numero}.xml`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erreur lors du téléchargement du XML PEPPOL');
      console.error(err);
    }
  };

  const sendPeppol = async (id) => {
    if (!window.confirm('Envoyer cette facture via le réseau PEPPOL ?')) return;
    
    setPeppolLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      const res = await axios.post(`${API_URL}/peppol/facture/${id}/send`, {}, config);
      
      if (res.data.success) {
        alert(`✅ Facture envoyée via PEPPOL !\n\nTransaction ID: ${res.data.data.transactionId}\nStatut: ${res.data.data.status}\nRéseau: ${res.data.data.network}`);
        setPeppolStatus(prev => ({ ...prev, [id]: true }));
      }
    } catch (err) {
      alert('Erreur lors de l\'envoi PEPPOL');
      console.error(err);
    } finally {
      setPeppolLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const getStatutBadge = (statut) => {
    const styles = {
      non_payee: { bg: '#f44336', label: 'Non payée' },
      partielle: { bg: '#ff9800', label: 'Partielle' },
      payee: { bg: '#4caf50', label: 'Payée' },
      en_retard: { bg: '#9c27b0', label: 'En retard' }
    };
    const s = styles[statut] || styles.non_payee;
    return <span style={{ background: s.bg, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>{s.label}</span>;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fb' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '40px' }}>☀️</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px' }}>Anneessens & Co</h1>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Solutions Panneaux Solaires</p>
            </div>
          </div>
          <button onClick={() => window.location.href = '/dashboard'} style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer' }}>
            ← Retour
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ margin: 0 }}>{isAdmin ? '🧾 Toutes les Factures' : '🧾 Mes Factures'}</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>
              {isAdmin ? 'Gestion et envoi PEPPOL des factures' : 'Téléchargez vos factures en PDF'}
            </p>
          </div>
          {isAdmin && (
            <div style={{ background: '#e3f2fd', padding: '10px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🔗</span>
              <div>
                <div style={{ fontWeight: 'bold', color: '#1565c0' }}>PEPPOL Activé</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Réseau européen de facturation</div>
              </div>
            </div>
          )}
        </div>

        {/* Info PEPPOL pour admin */}
        {isAdmin && (
          <div style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)', padding: '20px', borderRadius: '12px', marginBottom: '20px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '40px' }}>🌐</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>PEPPOL - Pan-European Public Procurement Online</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                  Envoyez vos factures au format UBL 2.1 via le réseau européen standardisé. 
                  Compatible avec les administrations publiques et entreprises B2B.
                </p>
              </div>
              <div style={{ textAlign: 'center', padding: '10px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Format</div>
                <div style={{ fontWeight: 'bold' }}>UBL 2.1</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px 20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Norme</div>
                <div style={{ fontWeight: 'bold' }}>BIS 3.0</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: '#667eea', color: 'white' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>N° Facture</th>
                  {isAdmin && <th style={{ padding: '15px', textAlign: 'left' }}>Client</th>}
                  <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Échéance</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>Montant TVAC</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Statut</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                  {isAdmin && <th style={{ padding: '15px', textAlign: 'center' }}>PEPPOL</th>}
                </tr>
              </thead>
              <tbody>
                {factures.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                      {isAdmin ? 'Aucune facture.' : 'Vous n\'avez pas encore de factures.'}
                    </td>
                  </tr>
                ) : (
                  factures.map(f => (
                    <tr key={f.id_facture} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px', fontWeight: 'bold', color: '#667eea' }}>{f.numero_facture}</td>
                      {isAdmin && (
                        <td style={{ padding: '15px' }}>
                          <div>{f.Client?.nom} {f.Client?.prenom}</div>
                          <div style={{ fontSize: '12px', color: '#888' }}>{f.Client?.email}</div>
                        </td>
                      )}
                      <td style={{ padding: '15px' }}>{new Date(f.date_emission).toLocaleDateString('fr-FR')}</td>
                      <td style={{ padding: '15px' }}>{new Date(f.date_echeance).toLocaleDateString('fr-FR')}</td>
                      <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', fontSize: '16px' }}>{parseFloat(f.montant_ttc || 0).toFixed(2)} €</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>{getStatutBadge(f.statut_paiement)}</td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <button 
                          onClick={() => downloadPDF(f.id_facture, f.numero_facture)}
                          style={{ padding: '8px 15px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          📥 PDF
                        </button>
                      </td>
                      {isAdmin && (
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button 
                              onClick={() => downloadPeppolXML(f.id_facture, f.numero_facture)}
                              style={{ padding: '8px 12px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                              title="Télécharger le fichier XML UBL 2.1"
                            >
                              📄 XML
                            </button>
                            <button 
                              onClick={() => sendPeppol(f.id_facture)}
                              disabled={peppolLoading[f.id_facture]}
                              style={{ 
                                padding: '8px 12px', 
                                background: peppolStatus[f.id_facture] ? '#4caf50' : '#ff9800', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: peppolLoading[f.id_facture] ? 'wait' : 'pointer', 
                                fontSize: '12px',
                                opacity: peppolLoading[f.id_facture] ? 0.7 : 1
                              }}
                              title={peppolStatus[f.id_facture] ? 'Déjà envoyé via PEPPOL' : 'Envoyer via le réseau PEPPOL'}
                            >
                              {peppolLoading[f.id_facture] ? '⏳...' : peppolStatus[f.id_facture] ? '✅ Envoyé' : '📤 Envoyer'}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Légende PEPPOL pour admin */}
        {isAdmin && factures.length > 0 && (
          <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>📚 Guide PEPPOL</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ padding: '5px 10px', background: '#1a237e', color: 'white', borderRadius: '4px', fontSize: '12px' }}>📄 XML</span>
                <span style={{ fontSize: '14px', color: '#666' }}>Télécharger le fichier UBL 2.1</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ padding: '5px 10px', background: '#ff9800', color: 'white', borderRadius: '4px', fontSize: '12px' }}>📤 Envoyer</span>
                <span style={{ fontSize: '14px', color: '#666' }}>Transmettre via réseau PEPPOL</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ padding: '5px 10px', background: '#4caf50', color: 'white', borderRadius: '4px', fontSize: '12px' }}>✅ Envoyé</span>
                <span style={{ fontSize: '14px', color: '#666' }}>Facture transmise avec succès</span>
              </div>
            </div>
          </div>
        )}

        {!isAdmin && factures.length > 0 && (
          <div style={{ marginTop: '20px', padding: '20px', background: '#e8f5e9', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#2e7d32' }}>
              💡 Cliquez sur "📥 PDF" pour télécharger votre facture
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Factures;
