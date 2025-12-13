import React, { useState, useEffect } from 'react';
import { FaFileInvoice, FaFileAlt, FaUsers, FaEuroSign, FaChartLine, FaClock } from 'react-icons/fa';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Récupérer le profil utilisateur
      const userRes = await axios.get('/api/auth/me', config);
      setUser(userRes.data.data);

      // Récupérer les statistiques selon le rôle
      if (userRes.data.data.role === 'admin') {
        await fetchAdminStats(config);
      } else {
        await fetchClientStats(config);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const fetchAdminStats = async (config) => {
    try {
      const [devisRes, facturesRes, clientsRes] = await Promise.all([
        axios.get('/api/devis', config),
        axios.get('/api/factures', config),
        axios.get('/api/clients', config)
      ]);

      const devis = devisRes.data.data;
      const factures = facturesRes.data.data;

      setStats({
        totalDevis: devis.length,
        devisEnAttente: devis.filter(d => d.statut === 'envoye').length,
        devisAcceptes: devis.filter(d => d.statut === 'accepte').length,
        totalFactures: factures.length,
        facturesNonPayees: factures.filter(f => f.statut_paiement === 'non_payee').length,
        totalClients: clientsRes.data.data.length,
        chiffreAffaires: factures
          .filter(f => f.statut_paiement === 'payee')
          .reduce((sum, f) => sum + parseFloat(f.montant_ttc), 0),
        montantEnAttente: factures
          .filter(f => f.statut_paiement !== 'payee')
          .reduce((sum, f) => sum + parseFloat(f.montant_restant), 0)
      });
    } catch (error) {
      console.error('Erreur stats admin:', error);
    }
  };

  const fetchClientStats = async (config) => {
    try {
      const [devisRes, facturesRes] = await Promise.all([
        axios.get(`/api/devis?client_id=${user.id_client}`, config),
        axios.get(`/api/factures?client_id=${user.id_client}`, config)
      ]);

      const devis = devisRes.data.data;
      const factures = facturesRes.data.data;

      setStats({
        mesDevis: devis.length,
        devisEnAttente: devis.filter(d => d.statut === 'envoye').length,
        mesFactures: factures.length,
        montantDu: factures.reduce((sum, f) => sum + parseFloat(f.montant_restant), 0)
      });
    } catch (error) {
      console.error('Erreur stats client:', error);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {user?.prenom} {user?.nom} ({user?.role})</p>
      </div>

      {user?.role === 'admin' ? (
        <AdminDashboard stats={stats} />
      ) : (
        <ClientDashboard stats={stats} />
      )}
    </div>
  );
};

const AdminDashboard = ({ stats }) => {
  return (
    <>
      <div className="stats-grid">
        <StatCard
          icon={<FaFileAlt />}
          title="Total Devis"
          value={stats.totalDevis || 0}
          subtitle={`${stats.devisEnAttente || 0} en attente`}
          color="blue"
        />
        <StatCard
          icon={<FaFileInvoice />}
          title="Total Factures"
          value={stats.totalFactures || 0}
          subtitle={`${stats.facturesNonPayees || 0} non payées`}
          color="green"
        />
        <StatCard
          icon={<FaUsers />}
          title="Clients"
          value={stats.totalClients || 0}
          subtitle="Clients actifs"
          color="purple"
        />
        <StatCard
          icon={<FaEuroSign />}
          title="Chiffre d'affaires"
          value={`${(stats.chiffreAffaires || 0).toFixed(2)} €`}
          subtitle={`${(stats.montantEnAttente || 0).toFixed(2)} € en attente`}
          color="orange"
        />
      </div>

      <div className="dashboard-charts">
        <div className="chart-container">
          <h3><FaChartLine /> Activité récente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-badge new">Nouveau</span>
              <span>{stats.devisEnAttente || 0} devis en attente de réponse</span>
            </div>
            <div className="activity-item">
              <span className="activity-badge success">Accepté</span>
              <span>{stats.devisAcceptes || 0} devis acceptés ce mois</span>
            </div>
            <div className="activity-item">
              <span className="activity-badge warning">À payer</span>
              <span>{stats.facturesNonPayees || 0} factures en attente de paiement</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ClientDashboard = ({ stats }) => {
  return (
    <>
      <div className="stats-grid">
        <StatCard
          icon={<FaFileAlt />}
          title="Mes Devis"
          value={stats.mesDevis || 0}
          subtitle={`${stats.devisEnAttente || 0} en attente de ma réponse`}
          color="blue"
        />
        <StatCard
          icon={<FaFileInvoice />}
          title="Mes Factures"
          value={stats.mesFactures || 0}
          subtitle="Factures totales"
          color="green"
        />
        <StatCard
          icon={<FaEuroSign />}
          title="Montant dû"
          value={`${(stats.montantDu || 0).toFixed(2)} €`}
          subtitle="À payer"
          color="orange"
        />
        <StatCard
          icon={<FaClock />}
          title="Statut"
          value="À jour"
          subtitle="Aucun retard"
          color="purple"
        />
      </div>

      <div className="dashboard-info">
        <div className="info-card">
          <h3>📋 Actions rapides</h3>
          <ul>
            <li><a href="/devis">Voir mes devis</a></li>
            <li><a href="/factures">Consulter mes factures</a></li>
            <li><a href="/profil">Mon profil</a></li>
          </ul>
        </div>
      </div>
    </>
  );
};

const StatCard = ({ icon, title, value, subtitle, color }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
        <p className="stat-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default Dashboard;
