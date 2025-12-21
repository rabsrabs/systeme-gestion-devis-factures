import React from 'react';

const Produits = () => {
  const produits = [
    { id: 1, nom: 'Victron Energy Panneau Solaire Monocristallin 305W', prix: 224.95, desc: 'Haute efficacité, idéal pour installations résidentielles' },
    { id: 2, nom: 'Aiko 445Wp Zwart-Wit Lichtgewicht', prix: 139.63, desc: 'Panneau léger, design moderne noir et blanc' },
    { id: 3, nom: 'Victron Energy 270W Panneau Solaire Polycristallin', prix: 164.95, desc: 'Excellent rapport qualité-prix' },
    { id: 4, nom: 'Onduleur Victron Phoenix 12V/500W', prix: 189.00, desc: 'Convertisseur pour systèmes solaires autonomes' },
    { id: 5, nom: 'Batterie Lithium Victron Smart 12.8V 200Ah', prix: 1299.00, desc: 'Stockage énergie haute capacité avec Bluetooth' }
  ];

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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: '0 0 10px 0' }}>☀️ Nos Produits Solaires</h1>
          <p style={{ color: '#666', margin: 0 }}>Découvrez notre gamme de panneaux solaires et accessoires</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {produits.map(p => (
            <div key={p.id} style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: '60px', marginBottom: '15px' }}>🔆</div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', minHeight: '50px', color: '#333' }}>{p.nom}</h3>
              <p style={{ color: '#666', fontSize: '14px', minHeight: '40px' }}>{p.desc}</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea', margin: '15px 0' }}>{p.prix.toFixed(2)} €</p>
              <p style={{ color: '#999', fontSize: '12px' }}>HTVA</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '30px', padding: '25px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', textAlign: 'center', color: 'white' }}>
          <h2 style={{ margin: '0 0 10px 0' }}>💡 Intéressé par nos produits ?</h2>
          <p style={{ margin: '0 0 20px 0', opacity: 0.9 }}>
            Créez une demande de devis et notre équipe vous contactera rapidement !
          </p>
          <a href="/devis" style={{ display: 'inline-block', padding: '12px 30px', background: 'white', color: '#667eea', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            ➕ Demander un devis
          </a>
        </div>
      </div>
    </div>
  );
};

export default Produits;
