import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

const Register = () => {
  const [role, setRole] = useState('');
  const [isEntreprise, setIsEntreprise] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', mot_de_passe: '', telephone: '',
    numero_tva: '', adresse: '', ville: '', code_postal: '', type_client: 'particulier'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const CODE_ADMIN_SECRET = '0000'; // Code secret pour admin

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdminClick = () => {
    setShowAdminCode(true);
    setCodeError('');
    setAdminCode('');
  };

  const verifyAdminCode = () => {
    if (adminCode === CODE_ADMIN_SECRET) {
      setRole('admin');
      setShowAdminCode(false);
      setCodeError('');
    } else {
      setCodeError('Code incorrect. Accès refusé.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.adresse || !formData.ville || !formData.code_postal) {
      setError('L\'adresse complète est obligatoire');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://10.150.5.69:5001/api/auth/register', { ...formData, role });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  // Modal pour le code admin
  if (showAdminCode) {
    return (
      <div className="login-container">
        <div className="login-box" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🔐</div>
          <h2 style={{ color: '#667eea', marginBottom: '10px' }}>Accès Administrateur</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Entrez le code secret pour créer un compte administrateur</p>
          
          {codeError && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              {codeError}
            </div>
          )}

          <input
            type="password"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="Code secret"
            maxLength="4"
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '24px',
              textAlign: 'center',
              letterSpacing: '10px',
              border: '2px solid #ddd',
              borderRadius: '10px',
              marginBottom: '20px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && verifyAdminCode()}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowAdminCode(false)}
              style={{
                flex: 1,
                padding: '12px',
                background: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Annuler
            </button>
            <button
              onClick={verifyAdminCode}
              style={{
                flex: 1,
                padding: '12px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="login-container">
        <div className="login-box" style={{ maxWidth: '500px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>☀️</div>
            <h1 style={{ margin: '0 0 5px 0', color: '#667eea' }}>Anneessens & Co</h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Solutions Panneaux Solaires</p>
          </div>
          
          <h2>Créer un compte</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Choisissez votre type de compte :</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button onClick={() => setRole('client')} style={{ padding: '25px', border: '2px solid #4caf50', borderRadius: '12px', background: '#e8f5e9', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '40px' }}>👤</span>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#2e7d32' }}>Je suis un Client</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Je veux demander des devis pour des panneaux solaires</p>
                </div>
              </div>
            </button>

            <button onClick={handleAdminClick} style={{ padding: '25px', border: '2px solid #667eea', borderRadius: '12px', background: '#e3f2fd', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '40px' }}>🔧</span>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#1565c0' }}>Je suis Administrateur</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Je gère les devis et factures des clients</p>
                </div>
              </div>
            </button>
          </div>

          <p className="register-link" style={{ marginTop: '30px' }}>
            Déjà un compte ? <a href="/login">Se connecter</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box" style={{ maxWidth: '550px' }}>
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <div style={{ fontSize: '40px', marginBottom: '5px' }}>☀️</div>
          <h1 style={{ margin: '0', color: '#667eea', fontSize: '20px' }}>Anneessens & Co</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Inscription {role === 'admin' ? 'Admin' : 'Client'}</h2>
          <span style={{ padding: '5px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', background: role === 'admin' ? '#667eea' : '#4caf50', color: 'white' }}>
            {role === 'admin' ? '🔧 Admin' : '👤 Client'}
          </span>
        </div>

        <button onClick={() => setRole('')} style={{ marginBottom: '20px', padding: '8px 15px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}>
          ← Changer de type
        </button>
        
        {error && <div className="error-message">{error}</div>}

        {role === 'client' && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button type="button" onClick={() => { setIsEntreprise(false); setFormData({ ...formData, type_client: 'particulier', numero_tva: '' }); }}
              style={{ flex: 1, padding: '12px', border: '2px solid', borderColor: !isEntreprise ? '#667eea' : '#ddd', background: !isEntreprise ? '#667eea' : 'white', color: !isEntreprise ? 'white' : '#333', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              👤 Particulier
            </button>
            <button type="button" onClick={() => { setIsEntreprise(true); setFormData({ ...formData, type_client: 'professionnel' }); }}
              style={{ flex: 1, padding: '12px', border: '2px solid', borderColor: isEntreprise ? '#667eea' : '#ddd', background: isEntreprise ? '#667eea' : 'white', color: isEntreprise ? 'white' : '#333', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              🏢 Entreprise
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>{isEntreprise ? 'Nom société *' : 'Nom *'}</label>
              <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{isEntreprise ? 'Contact' : 'Prénom *'}</label>
              <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required={!isEntreprise} />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Mot de passe *</label>
            <input type="password" name="mot_de_passe" value={formData.mot_de_passe} onChange={handleChange} required minLength="6" />
          </div>

          <div className="form-group">
            <label>Téléphone *</label>
            <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} required placeholder="+32 xxx xx xx xx" />
          </div>

          {isEntreprise && (
            <div className="form-group">
              <label>Numéro de TVA (facultatif)</label>
              <input type="text" name="numero_tva" value={formData.numero_tva} onChange={handleChange} placeholder="BE0123456789" />
            </div>
          )}

          <div className="form-group">
            <label>Adresse *</label>
            <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} required placeholder="Rue et numéro" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
            <div className="form-group">
              <label>Code postal *</label>
              <input type="text" name="code_postal" value={formData.code_postal} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Ville *</label>
              <input type="text" name="ville" value={formData.ville} onChange={handleChange} required />
            </div>
          </div>
          
          <button type="submit" disabled={loading} style={{ marginTop: '15px', width: '100%' }}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
        
        <p className="register-link">
          Déjà un compte ? <a href="/login">Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
