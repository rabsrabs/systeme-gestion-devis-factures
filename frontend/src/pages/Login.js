import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', mot_de_passe: '' });
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
      const response = await axios.post('http://10.150.5.69:5001/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '50px', marginBottom: '10px' }}>☀️</div>
          <h1 style={{ margin: '0 0 5px 0', color: '#667eea' }}>Anneessens & Co</h1>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Solutions Panneaux Solaires</p>
        </div>
        
        <h2>Connexion</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="votre@email.com" />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" name="mot_de_passe" value={formData.mot_de_passe} onChange={handleChange} required placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        
        <p className="register-link">
          Pas encore de compte ? <a href="/register">S'inscrire</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
