import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🏗️ Système OMC</h1>
        <h2>Inscription</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Prénom</label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" name="mot_de_passe" value={formData.mot_de_passe} onChange={handleChange} required />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>
        
        <p className="register-link">
          Déjà un compte ? <a href="/">Se connecter</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
