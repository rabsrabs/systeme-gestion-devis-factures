import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
    nom: '',
    prenom: '',
    telephone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, mot_de_passe: formData.mot_de_passe }
        : { ...formData, role: 'client' };

      const response = await axios.post(endpoint, payload);

      if (response.data.success) {
        // Sauvegarder le token et les infos utilisateur
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        
        // Rediriger vers le dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">📋</span>
            <h1>OMC</h1>
          </div>
          <p>Gestion des Devis et Factures</p>
        </div>

        <div className="login-tabs">
          <button 
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            <FaSignInAlt /> Connexion
          </button>
          <button 
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            <FaUserPlus /> Inscription
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    required={!isLogin}
                  />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required={!isLogin}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+32 xxx xx xx xx"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label><FaEnvelope /> Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label><FaLock /> Mot de passe</label>
            <input
              type="password"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button 
              type="button"
              className="link-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
